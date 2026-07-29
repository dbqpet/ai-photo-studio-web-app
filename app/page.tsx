"use client";

/* eslint-disable @next/next/no-img-element -- previews are dynamic data URLs */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ExitWarningModal from "@/components/ExitWarningModal";
import LoginModal from "@/components/LoginModal";
import PaywallModal from "@/components/PaywallModal";
import PhotoInput from "@/components/PhotoInput";
import SpecSelector from "@/components/SpecSelector";
import PreviewPanel from "@/components/PreviewPanel";
import {
  BACKGROUND_COLORS,
  CUSTOM_MM_MAX,
  CUSTOM_MM_MIN,
  PHOTO_SIZE_PRESETS,
  formatDimensionLabel,
  getBackgroundById,
  resolvePhotoPreset,
} from "@/constants/photoSizes";
import { useAuth } from "@/hooks/useAuth";
import { cropToAspect } from "@/lib/imageUtils";
import { PRICING, formatUsd } from "@/lib/pricing";
import {
  clearActivePhotoSession,
  createGenerationId,
  createUploadSessionId,
  markPhotoSessionDownloaded,
  markPhotoSessionUnlocked,
  readPhotoSession,
  savePhotoSession,
  type PhotoSession,
} from "@/lib/photoSessionStore";
import { renderPrintSheet, type SheetLayout } from "@/lib/printLayout";
import { applyWatermarkToCanvas, watermarkDataUrl } from "@/lib/watermark";
import {
  clearPendingPhotoUpload,
  readPendingPhotoUpload,
  savePendingPhotoUpload,
  type PendingPhotoUpload,
} from "@/lib/pendingPhotoUpload";
import {
  storePendingPurchase,
  clearPendingPurchase,
  type PurchaseSummary,
} from "@/lib/purchaseStore";
import { downloadHdPhotosZip } from "@/lib/zipDownload";
import {
  HIGH_DEMAND_MESSAGE,
  PROCESSING_MODES,
  type AiProvider,
  type BackgroundMode,
  type CheckoutRequest,
  type CheckoutResponse,
  type ProcessPhotoRequest,
  type ProcessPhotoResponse,
  type ProcessingMode,
} from "@/lib/types";

type Step = 1 | 2 | 3;

interface GeneratedResult {
  /** Unique per AI output — unlock / payment is bound to this id only. */
  generationId: string;
  /** Stable for the current source-photo upload (not used for unlock). */
  uploadSessionId: string;
  provider: AiProvider;
  cleanSingle: string;
  cleanSheet: string;
  previewSingle: string;
  previewSheet: string;
  layout: SheetLayout;
  backgroundMode: BackgroundMode;
  backgroundColor: string;
  unlocked: boolean;
  downloaded: boolean;
}

const STEPS: Array<{ id: Step; label: string }> = [
  { id: 1, label: "Photo" },
  { id: 2, label: "Specs" },
  { id: 3, label: "Preview" },
];

function clampMm(value: number): number {
  if (!Number.isFinite(value)) return 35;
  return Math.min(CUSTOM_MM_MAX, Math.max(CUSTOM_MM_MIN, value));
}

/**
 * Verify + zip-download an unlocked generation. Pure helper (no component
 * state) so it can run safely from both the manual button and the
 * mount-only payment-restore effect without stale-closure risk.
 */
async function downloadHdZipForSession(session: {
  generationId: string;
  cleanSingle: string;
  cleanSheet: string;
  mode: ProcessingMode;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/download-hd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ generationId: session.generationId }),
    });
    if (!res.ok) return false;

    await downloadHdPhotosZip({
      singleDataUrl: session.cleanSingle,
      sheetDataUrl: session.cleanSheet,
      style: session.mode,
    });
    return true;
  } catch (err) {
    console.error("[studio] HD zip download failed:", err);
    return false;
  }
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center bg-slate-50 text-sm text-slate-500">
          Loading studio…
        </div>
      }
    >
      <StudioPageContent />
    </Suspense>
  );
}

function StudioPageContent() {
  const searchParams = useSearchParams();
  const {
    user,
    previewCredits,
    hdUnlocks,
    profileError,
    needsDbSetup,
    loading: authLoading,
    refreshProfile,
    signInWithGoogle,
    signOut,
  } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [sourcePhoto, setSourcePhoto] = useState<string | null>(null);
  const [uploadSessionId, setUploadSessionId] = useState<string | null>(null);
  const [resolutionWarning, setResolutionWarning] = useState<string | undefined>();

  const [presetId, setPresetId] = useState(PHOTO_SIZE_PRESETS[0].id);
  const [customWidthMm, setCustomWidthMm] = useState(35);
  const [customHeightMm, setCustomHeightMm] = useState(45);
  const [backgroundId, setBackgroundId] = useState(BACKGROUND_COLORS[0].id);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>("solid");
  const [mode, setMode] = useState<ProcessingMode>("classic");

  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [highDemand, setHighDemand] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [restoringSession, setRestoringSession] = useState(false);
  const [hasDownloadedHD, setHasDownloadedHD] = useState(false);
  const [exitWarningOpen, setExitWarningOpen] = useState(false);
  const pendingExitRef = useRef<(() => void) | null>(null);

  const preset = useMemo(
    () =>
      resolvePhotoPreset(
        presetId,
        clampMm(customWidthMm),
        clampMm(customHeightMm),
      ),
    [presetId, customWidthMm, customHeightMm],
  );
  const background = useMemo(
    () => getBackgroundById(backgroundId)!,
    [backgroundId],
  );

  const orderSummary: PurchaseSummary = useMemo(() => {
    const styleLabel =
      PROCESSING_MODES.find((m) => m.id === mode)?.label ?? mode;
    const backgroundLabel =
      backgroundMode === "solid"
        ? `Solid Color — ${background.label}`
        : "AI Studio Background";
    return {
      styleLabel,
      backgroundLabel,
      dimensionLabel: formatDimensionLabel(preset),
    };
  }, [mode, backgroundMode, background.label, preset]);

  /** Client-side checks only — no Gemini / backend calls on upload. */
  const handlePhotoSelected = useCallback(
    (dataUrl: string, warning?: string) => {
      setSourcePhoto(dataUrl);
      setUploadSessionId(createUploadSessionId());
      setResolutionWarning(warning);
      setResult(null);
      setHasDownloadedHD(false);
      setProcessError(null);
      setStep(2);
    },
    [],
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 4000);
  }, []);

  /**
   * Snapshot photo + specs so an external redirect (Google OAuth sign-in or
   * a Stripe top-up checkout) does not lose the in-progress upload.
   */
  const persistPendingUploadForLogin = useCallback(() => {
    if (!sourcePhoto) return;
    savePendingPhotoUpload({
      sourcePhoto,
      uploadSessionId,
      resolutionWarning,
      presetId,
      customWidthMm: clampMm(customWidthMm),
      customHeightMm: clampMm(customHeightMm),
      backgroundId,
      backgroundMode,
      mode,
      step: step === 1 ? 2 : step,
    });
  }, [
    sourcePhoto,
    uploadSessionId,
    resolutionWarning,
    presetId,
    customWidthMm,
    customHeightMm,
    backgroundId,
    backgroundMode,
    mode,
    step,
  ]);

  /** Apply a localStorage-saved upload (Google sign-in or top-up redirect). */
  const applyPendingPhotoUpload = useCallback((pending: PendingPhotoUpload) => {
    setSourcePhoto(pending.sourcePhoto);
    setUploadSessionId(pending.uploadSessionId ?? createUploadSessionId());
    setResolutionWarning(pending.resolutionWarning);
    setPresetId(pending.presetId || PHOTO_SIZE_PRESETS[0].id);
    setCustomWidthMm(clampMm(pending.customWidthMm ?? 35));
    setCustomHeightMm(clampMm(pending.customHeightMm ?? 45));
    setBackgroundId(pending.backgroundId || BACKGROUND_COLORS[0].id);
    setBackgroundMode(pending.backgroundMode === "studio" ? "studio" : "solid");
    setMode(
      pending.mode === "korean" || pending.mode === "corporate"
        ? pending.mode
        : "classic",
    );
    setResult(null);
    setHasDownloadedHD(false);
    setProcessError(null);
    setStep(pending.step === 3 ? 2 : pending.step === 1 ? 2 : pending.step || 2);
    clearPendingPhotoUpload();
  }, []);

  /** Restore uploaded photo after Google OAuth returns to `/`. */
  useEffect(() => {
    // Payment / top-up restore effects own the page in those cases.
    if (searchParams.get("payment") === "success") return;
    if (searchParams.get("topup") === "success") return;

    const pending = readPendingPhotoUpload();
    if (!pending?.sourcePhoto) return;

    applyPendingPhotoUpload(pending);
    showToast("Welcome back — your photo was restored.");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore once on mount
  }, []);

  /** Restore top-up purchase: grant credits + resume the in-progress photo. */
  useEffect(() => {
    const topup = searchParams.get("topup");
    const sessionId = searchParams.get("session_id");
    if (topup !== "success") return;

    // Strip the query params from the address bar immediately (pure history
    // API call, no Next.js re-render/refetch) so refreshing the page never
    // re-runs this grant-credits-and-restore flow a second time.
    window.history.replaceState({}, "", window.location.pathname);

    let cancelled = false;
    setRestoringSession(true);

    (async () => {
      try {
        if (sessionId) {
          // Confirms payment AND grants credits (deduped per session id) —
          // this is the fallback path that fixes credits not being added
          // when the Stripe webhook hasn't fired (e.g. `stripe listen` not
          // running locally).
          await fetch(
            `/api/verify-payment?${new URLSearchParams({ session_id: sessionId }).toString()}`,
          );
        }
        if (cancelled) return;
        await refreshProfile();

        const pending = readPendingPhotoUpload();
        if (!cancelled && pending?.sourcePhoto) {
          applyPendingPhotoUpload(pending);
        }
        if (!cancelled) {
          showToast(
            `🎉 Top-up successful! +${PRICING.hdUnlocksPerPurchase} HD Unlock and +${PRICING.previewCreditsBonus} Preview Tokens added.`,
          );
        }
      } catch (err) {
        console.error("[studio] topup restore failed:", err);
        if (!cancelled) {
          showToast(
            "Payment succeeded, but we couldn't refresh your account. Please refresh the page.",
          );
        }
      } finally {
        if (!cancelled) {
          setRestoringSession(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on topup return
  }, []);

  const applyPhotoSession = useCallback((session: PhotoSession) => {
    setSourcePhoto(session.sourcePhoto);
    setUploadSessionId(session.uploadSessionId);
    setResolutionWarning(session.resolutionWarning);
    setPresetId(session.presetId);
    setCustomWidthMm(session.customWidthMm);
    setCustomHeightMm(session.customHeightMm);
    setBackgroundId(session.backgroundId);
    setBackgroundMode(session.backgroundMode);
    setMode(session.mode);
    setResult({
      generationId: session.generationId,
      uploadSessionId: session.uploadSessionId,
      ...session.result,
      unlocked: session.unlocked,
      downloaded: session.downloaded,
    });
    setHasDownloadedHD(session.downloaded);
    setStep(3);
  }, []);

  const persistCurrentSession = useCallback(
    async (
      nextResult: GeneratedResult,
      flags?: Partial<Pick<GeneratedResult, "unlocked" | "downloaded">>,
    ) => {
      if (!sourcePhoto) return;
      const unlocked = flags?.unlocked ?? nextResult.unlocked;
      const downloaded = flags?.downloaded ?? nextResult.downloaded;
      await savePhotoSession({
        generationId: nextResult.generationId,
        uploadSessionId: nextResult.uploadSessionId,
        sourcePhoto,
        resolutionWarning,
        presetId,
        customWidthMm: clampMm(customWidthMm),
        customHeightMm: clampMm(customHeightMm),
        backgroundId,
        backgroundMode,
        mode,
        result: {
          provider: nextResult.provider,
          cleanSingle: nextResult.cleanSingle,
          cleanSheet: nextResult.cleanSheet,
          previewSingle: nextResult.previewSingle,
          previewSheet: nextResult.previewSheet,
          layout: nextResult.layout,
          backgroundMode: nextResult.backgroundMode,
          backgroundColor: nextResult.backgroundColor,
        },
        summary: orderSummary,
        presetLabel: preset.label,
        unlocked,
        downloaded,
        updatedAt: Date.now(),
      });
    },
    [
      sourcePhoto,
      resolutionWarning,
      presetId,
      customWidthMm,
      customHeightMm,
      backgroundId,
      backgroundMode,
      mode,
      orderSummary,
      preset.label,
    ],
  );

  /** Restore studio state after Stripe redirect (?payment=success&generation_id=...). */
  useEffect(() => {
    const payment = searchParams.get("payment");
    const generationId =
      searchParams.get("generation_id") || searchParams.get("photo_id");
    const sessionId = searchParams.get("session_id");
    const intent = searchParams.get("intent");
    if (payment !== "success" || !generationId) return;

    // Strip the query params from the address bar immediately (pure history
    // API call, no Next.js re-render/refetch) so refreshing the page never
    // re-triggers the unlock + auto-download flow a second time.
    window.history.replaceState({}, "", window.location.pathname);

    let cancelled = false;
    setRestoringSession(true);

    (async () => {
      try {
        if (sessionId) {
          const qs = new URLSearchParams({ session_id: sessionId });
          if (intent) qs.set("intent", intent);
          await fetch(`/api/verify-payment?${qs.toString()}`);
        }
        await fetch("/api/mark-photo-unlocked", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ generationId, sessionId }),
        });

        const session = await markPhotoSessionUnlocked(generationId);
        const restored = session ?? (await readPhotoSession(generationId));
        if (!cancelled && restored) {
          applyPhotoSession({ ...restored, unlocked: true });
          await refreshProfile();

          // Auto-Trigger Download: fire the HD ZIP the moment we land back
          // from Stripe so the user never has to click again. Browsers give
          // no reliable signal that a script-triggered (non user-gesture)
          // download actually saved a file — some silently no-op it — so we
          // do NOT trust this alone to clear the exit-protection flag. Only
          // an explicit click (main button or the exit-warning modal) does
          // that; this keeps the "not downloaded" safety net active if the
          // automatic attempt was silently blocked.
          const attempted = await downloadHdZipForSession({
            generationId: restored.generationId,
            cleanSingle: restored.result.cleanSingle,
            cleanSheet: restored.result.cleanSheet,
            mode: restored.mode,
          });
          if (cancelled) return;
          if (attempted) {
            showToast(
              "🎉 Payment successful! Your 300 DPI HD photo ZIP is downloading now. If you don't see it, use the \"Download HD Photos\" button below.",
            );
          } else {
            showToast(
              "Payment successful — your photo is unlocked! Tap \"Download HD Photos\" to save your files.",
            );
          }
        } else if (!cancelled) {
          showToast(
            "Payment succeeded, but the photo session was not found in this browser.",
          );
        }
      } catch (err) {
        console.error("[studio] payment restore failed:", err);
        if (!cancelled) {
          showToast("Payment succeeded, but restoring your photo failed.");
        }
      } finally {
        if (!cancelled) {
          setRestoringSession(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on payment return
  }, []);

  const checkout = useCallback(
    async (intent: "topup" | "unlock_photo" = "unlock_photo") => {
      setCheckoutLoading(true);
      try {
        if (intent === "unlock_photo" && result) {
          await persistCurrentSession(result);
          await storePendingPurchase({
            singleDataUrl: result.cleanSingle,
            sheetDataUrl: result.cleanSheet,
            presetLabel: preset.label,
            style: mode,
            summary: orderSummary,
          });
        } else if (intent === "topup") {
          await clearPendingPurchase();
          // Save the in-progress photo/specs so returning from Stripe
          // resumes exactly where the user left off (no-ops if no photo
          // has been uploaded yet).
          persistPendingUploadForLogin();
        }

        const body: CheckoutRequest = {
          presetId: preset.id,
          mode,
          dimensionLabel: orderSummary.dimensionLabel,
          intent,
          ...(intent === "unlock_photo" && result
            ? { generationId: result.generationId }
            : {}),
        };
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = (await res.json()) as CheckoutResponse & { error?: string };
        if (!res.ok) throw new Error(json.error ?? "Checkout failed.");

        window.location.href = json.url;
      } catch (err) {
        console.error("Checkout failed:", err);
        setProcessError(
          err instanceof Error
            ? err.message
            : "Checkout failed. Please try again.",
        );
        setCheckoutLoading(false);
      }
    },
    [
      result,
      preset,
      mode,
      orderSummary,
      persistCurrentSession,
      persistPendingUploadForLogin,
    ],
  );

  const downloadHd = useCallback(async () => {
    if (!result) return;

    setDownloadLoading(true);
    setProcessError(null);
    try {
      // Always verify THIS generation_id server-side. Never trust client unlock
      // state, and never inherit unlock from a prior generation / upload.
      if (!result.unlocked && (hdUnlocks ?? 0) <= 0) {
        setPaywallOpen(true);
        throw new Error("No HD unlock tokens left.");
      }

      const res = await fetch("/api/download-hd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId: result.generationId }),
      });
      const json = (await res.json()) as {
        error?: string;
        code?: string;
        alreadyUnlocked?: boolean;
        hdUnlocksRemaining?: number;
      };
      if (!res.ok) {
        if (res.status === 401 || json.code === "NOT_AUTHENTICATED") {
          setLoginOpen(true);
          throw new Error(json.error ?? "Please sign in to download.");
        }
        if (json.code === "NO_HD_UNLOCKS" || res.status === 400) {
          setPaywallOpen(true);
          throw new Error(json.error ?? "No HD unlock tokens left.");
        }
        throw new Error(json.error ?? "Could not prepare HD download.");
      }

      await downloadHdPhotosZip({
        singleDataUrl: result.cleanSingle,
        sheetDataUrl: result.cleanSheet,
        style: mode,
      });

      const next: GeneratedResult = {
        ...result,
        unlocked: true,
        downloaded: true,
      };
      setResult(next);
      setHasDownloadedHD(true);
      await markPhotoSessionDownloaded(result.generationId);
      await persistCurrentSession(next, { unlocked: true, downloaded: true });
      await refreshProfile();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "HD download failed. Please try again.";
      showToast(message);
      setProcessError(message);
    } finally {
      setDownloadLoading(false);
    }
  }, [
    result,
    hdUnlocks,
    mode,
    refreshProfile,
    showToast,
    persistCurrentSession,
  ]);

  const generate = useCallback(async () => {
    if (!sourcePhoto) return;

    if (!user) {
      setLoginOpen(true);
      return;
    }

    if (previewCredits !== null && previewCredits <= 0) {
      setPaywallOpen(true);
      return;
    }

    if (user && profileError) {
      setProcessError(profileError);
      return;
    }

    setProcessing(true);
    setProcessError(null);
    setHighDemand(false);

    // Guarantee the button can never get stuck: abort the request if the
    // server hangs instead of responding (network issue, platform timeout,
    // or a stuck upstream AI call). Kept just under the API route's
    // `maxDuration` (180s) so we never abort a request the server would
    // have completed anyway.
    const CLIENT_TIMEOUT_MS = 175_000;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      CLIENT_TIMEOUT_MS,
    );

    try {
      const cropped = await cropToAspect(
        sourcePhoto,
        preset.pixels.width,
        preset.pixels.height,
      );

      const requestBody: ProcessPhotoRequest = {
        imageDataUrl: cropped,
        mode,
        backgroundMode,
        backgroundColor: background.hex,
        targetWidth: preset.pixels.width,
        targetHeight: preset.pixels.height,
      };
      let res: Response;
      try {
        res = await fetch("/api/process-photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });
      } catch (fetchErr) {
        if (
          fetchErr instanceof DOMException &&
          fetchErr.name === "AbortError"
        ) {
          setHighDemand(true);
          throw new Error(
            "Generation timed out. Our AI servers may be busy — please try again.",
          );
        }
        throw new Error(
          "Could not reach the server. Please check your connection and try again.",
        );
      }
      const json = (await res.json()) as ProcessPhotoResponse & {
        error?: string;
        highDemand?: boolean;
        code?: string;
      };

      if (!res.ok) {
        if (res.status === 401 || json.code === "NOT_AUTHENTICATED") {
          setLoginOpen(true);
          throw new Error(json.error ?? "Please sign in to generate.");
        }
        if (
          json.code === "NO_PREVIEW_CREDITS" ||
          json.code === "NO_CREDITS" ||
          (res.status === 400 &&
            typeof json.error === "string" &&
            json.error.toLowerCase().includes("preview credit"))
        ) {
          setPaywallOpen(true);
          throw new Error(
            json.error ?? "No preview credits left. Please purchase a pack.",
          );
        }
        if (json.highDemand || res.status === 503) {
          setHighDemand(true);
          throw new Error(json.error ?? HIGH_DEMAND_MESSAGE);
        }
        throw new Error(json.error ?? "Processing failed.");
      }

      // API always returns an opaque JPEG with background already applied.
      const cleanSingle = json.imageDataUrl;
      if (!cleanSingle?.startsWith("data:image/")) {
        throw new Error("Generation returned an invalid image. Please try again.");
      }

      const { canvas: sheetCanvas, layout } = await renderPrintSheet(
        cleanSingle,
        preset.pixels.width,
        preset.pixels.height,
      );
      const cleanSheet = sheetCanvas.toDataURL("image/jpeg", 0.92);

      // Watermark / downsample for on-screen preview only.
      const previewSingle = await watermarkDataUrl(cleanSingle);
      applyWatermarkToCanvas(sheetCanvas);
      const previewSheet = sheetCanvas.toDataURL("image/jpeg", 0.85);

      const sessionUploadId = uploadSessionId ?? createUploadSessionId();
      if (!uploadSessionId) setUploadSessionId(sessionUploadId);

      // New AI output → new generation_id. Prior unlocks never carry over.
      const nextResult: GeneratedResult = {
        generationId: createGenerationId(),
        uploadSessionId: sessionUploadId,
        provider: json.provider,
        cleanSingle,
        cleanSheet,
        previewSingle,
        previewSheet,
        layout,
        backgroundMode,
        backgroundColor: background.hex,
        unlocked: false,
        downloaded: false,
      };
      setResult(nextResult);
      setHasDownloadedHD(false);
      setStep(3);
      await savePhotoSession({
        generationId: nextResult.generationId,
        uploadSessionId: sessionUploadId,
        sourcePhoto,
        resolutionWarning,
        presetId,
        customWidthMm: clampMm(customWidthMm),
        customHeightMm: clampMm(customHeightMm),
        backgroundId,
        backgroundMode,
        mode,
        result: {
          provider: nextResult.provider,
          cleanSingle,
          cleanSheet,
          previewSingle,
          previewSheet,
          layout,
          backgroundMode,
          backgroundColor: background.hex,
        },
        summary: orderSummary,
        presetLabel: preset.label,
        unlocked: false,
        downloaded: false,
        updatedAt: Date.now(),
      });
      await refreshProfile();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Processing failed. Please try again.";
      if (
        message.includes("high demand") ||
        message.includes("AI_HIGH_DEMAND") ||
        message.includes("patient")
      ) {
        setHighDemand(true);
      }
      setProcessError(message);
      // The inline banner sits below the button and is easy to miss if the
      // user isn't looking there — a toast makes a failed generation
      // impossible to mistake for a silent hang.
      showToast(message);
    } finally {
      window.clearTimeout(timeoutId);
      setProcessing(false);
    }
  }, [
    sourcePhoto,
    uploadSessionId,
    user,
    previewCredits,
    profileError,
    preset,
    background,
    mode,
    backgroundMode,
    refreshProfile,
    resolutionWarning,
    presetId,
    customWidthMm,
    customHeightMm,
    backgroundId,
    orderSummary,
    showToast,
  ]);

  const backToSpecs = useCallback(() => {
    setProcessError(null);
    // Leaving preview invalidates unlock UI for the next generate.
    // Same generation stays unlocked if they return without regenerating.
    setStep(2);
  }, []);

  /**
   * "Create New Photo": fully reset in-memory state AND every localStorage /
   * IndexedDB trace of the previous session (unlock status, pending
   * upload/purchase snapshots) so nothing stale can leak into the next
   * photo — e.g. a page refresh right after this should never resurrect the
   * old generationId, unlock flag, or downloaded flag.
   */
  const startOver = useCallback(() => {
    setStep(1);
    setSourcePhoto(null);
    setUploadSessionId(null);
    setResolutionWarning(undefined);
    setResult(null);
    setHasDownloadedHD(false);
    setProcessError(null);

    clearPendingPhotoUpload();
    void clearPendingPurchase();
    void clearActivePhotoSession();
  }, []);

  /** Un-downloaded paid photo: exiting would strand it, so intercept first. */
  const needsExitProtection = Boolean(result?.unlocked) && !hasDownloadedHD;

  const guardExit = useCallback(
    (action: () => void) => {
      if (needsExitProtection) {
        pendingExitRef.current = action;
        setExitWarningOpen(true);
        return;
      }
      action();
    },
    [needsExitProtection],
  );

  /** Best-effort warning for real tab/window close or leaving the site. */
  useEffect(() => {
    if (!needsExitProtection) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [needsExitProtection]);

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-5 py-4">
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            📸 AI Studio ID
          </h1>
          <div className="flex items-center gap-2">
            {!authLoading && user && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                {previewCredits ?? 0} Preview Tokens
              </span>
            )}
            {!authLoading && user ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Sign out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  persistPendingUploadForLogin();
                  setLoginOpen(true);
                }}
                disabled={authLoading}
                className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-200 disabled:opacity-60"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-5 py-6">
        <nav aria-label="Progress" className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <div
                className={`flex items-center gap-2 ${
                  step === s.id ? "" : "opacity-50"
                }`}
                aria-current={step === s.id ? "step" : undefined}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    step >= s.id
                      ? "bg-sky-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step > s.id ? "✓" : s.id}
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span className="h-px flex-1 bg-slate-300" aria-hidden />
              )}
            </div>
          ))}
        </nav>

        {user && profileError && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              needsDbSetup
                ? "border border-amber-200 bg-amber-50 text-amber-900"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {needsDbSetup ? "⚠️ " : ""}
            {profileError}
            {needsDbSetup && (
              <p className="mt-2 text-xs">
                Supabase → SQL Editor → paste the contents of{" "}
                <code className="rounded bg-amber-100 px-1">
                  supabase/migrations/001_profiles_and_credits.sql
                </code>{" "}
                → Run. Then refresh this page.
              </p>
            )}
          </div>
        )}

        {step === 1 && (
          <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-1 text-xl font-bold text-slate-900">
              Add your photo
            </h2>
            <p className="mb-5 text-sm text-slate-500">
              Choose your photo dimensions first, then upload or capture. You
              can zoom and reposition before we process it. AI runs only when
              you click Generate.
            </p>

            <div className="mb-5">
              <h3 className="mb-2.5 text-sm font-semibold text-slate-700">
                Photo Dimensions
              </h3>
              <select
                value={presetId}
                onChange={(e) => setPresetId(e.target.value)}
                className="mb-3 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-sky-500"
              >
                {PHOTO_SIZE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.label}
                  </option>
                ))}
              </select>
              {presetId === "custom" && (
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-600">
                      Width (mm)
                    </span>
                    <input
                      type="number"
                      min={CUSTOM_MM_MIN}
                      max={CUSTOM_MM_MAX}
                      step={0.5}
                      value={customWidthMm}
                      onChange={(e) =>
                        setCustomWidthMm(Number(e.target.value))
                      }
                      className="rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-sky-500"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-600">
                      Height (mm)
                    </span>
                    <input
                      type="number"
                      min={CUSTOM_MM_MIN}
                      max={CUSTOM_MM_MAX}
                      step={0.5}
                      value={customHeightMm}
                      onChange={(e) =>
                        setCustomHeightMm(Number(e.target.value))
                      }
                      className="rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-sky-500"
                    />
                  </label>
                </div>
              )}
              <p className="text-xs text-slate-500">
                Crop frame: {formatDimensionLabel(preset)} (
                {preset.pixels.width}×{preset.pixels.height}px @ 300 DPI)
              </p>
            </div>

            <PhotoInput
              onPhotoSelected={handlePhotoSelected}
              aspectRatio={preset.aspectRatio}
            />
          </section>
        )}

        {step === 2 && sourcePhoto && (
          <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start gap-4">
              <img
                src={sourcePhoto}
                alt="Your selected source"
                className="h-24 w-20 rounded-xl border border-slate-200 object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900">
                  Choose your specs
                </h2>
                <p className="text-sm text-slate-500">
                  Pick the background and studio style. Dimension:{" "}
                  {formatDimensionLabel(preset)}.
                </p>
                <button
                  type="button"
                  onClick={startOver}
                  className="mt-1.5 text-xs font-semibold text-sky-600 hover:underline"
                >
                  Change photo
                </button>
              </div>
            </div>

            {resolutionWarning && (
              <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                ⚠️ {resolutionWarning}
              </p>
            )}

            <SpecSelector
              presetId={presetId}
              customWidthMm={customWidthMm}
              customHeightMm={customHeightMm}
              backgroundId={backgroundId}
              mode={mode}
              onPresetChange={setPresetId}
              onCustomWidthChange={setCustomWidthMm}
              onCustomHeightChange={setCustomHeightMm}
              onBackgroundChange={setBackgroundId}
              onModeChange={setMode}
            />

            {processing && (
              <p
                data-testid="high-demand-status"
                className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900"
              >
                ⏳ Our AI servers can get busy during peak times. Please be
                patient while we create your photo — automatic retries are in
                progress if the network is congested.
              </p>
            )}

            {processError && (
              <p
                className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                  highDemand
                    ? "bg-amber-50 text-amber-900"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {highDemand ? "⏳ " : ""}
                {processError}
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                if (user && previewCredits !== null && previewCredits <= 0) {
                  setPaywallOpen(true);
                  return;
                }
                void generate();
              }}
              disabled={processing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:from-sky-500 hover:to-indigo-500 disabled:opacity-60"
            >
              {processing ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  AI Generating (takes ~10s)...
                </>
              ) : user ? (
                <>
                  ✨ Generate Free Preview (
                  {previewCredits ?? PRICING.signupPreviewCredits} left)
                </>
              ) : (
                <>✨ Generate Free Preview</>
              )}
            </button>
            <p className="mt-2 text-center text-xs text-slate-500">
              🔒 Free preview • Watermarked preview • Unlock 300 DPI HD download
              for {formatUsd(PRICING.saleUsd)}
            </p>
          </section>
        )}

        {step === 3 && result && (
          <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-1 text-xl font-bold text-slate-900">
              Your ID photo is ready
            </h2>
            <p className="mb-5 text-sm text-slate-500">
              {result.unlocked
                ? "Your photo is unlocked — download the clean HD ZIP anytime with no extra charge."
                : (hdUnlocks ?? 0) > 0
                  ? "Your watermarked preview is ready — use an HD token to unlock and download this photo forever."
                  : "Previews are watermarked — purchase once to unlock instant HD download for this photo."}
            </p>
            {processError && (
              <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {processError}
              </p>
            )}
            <PreviewPanel
              preset={preset}
              singlePreviewUrl={result.previewSingle}
              sheetPreviewUrl={result.previewSheet}
              layout={result.layout}
              summary={orderSummary}
              hdUnlocks={hdUnlocks ?? 0}
              unlocked={result.unlocked}
              downloaded={result.downloaded}
              checkoutLoading={checkoutLoading}
              downloadLoading={downloadLoading}
              onCheckout={() => void checkout("unlock_photo")}
              onDownloadHd={() => void downloadHd()}
              onBack={() => guardExit(backToSpecs)}
              onStartOver={() => guardExit(startOver)}
            />
          </section>
        )}

        {restoringSession && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <p className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-lg">
              Completing your purchase…
            </p>
          </div>
        )}
      </main>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}

      <footer className="border-t border-slate-200 bg-white py-4">
        <p className="text-center text-xs text-slate-400">
          AI Studio ID · Photos are processed securely and never stored on our
          servers.
        </p>
      </footer>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSignIn={async () => {
          try {
            persistPendingUploadForLogin();
            await signInWithGoogle();
          } catch (err) {
            clearPendingPhotoUpload();
            setProcessError(
              err instanceof Error
                ? err.message
                : "Google sign-in failed. Please try again.",
            );
            setLoginOpen(false);
          }
        }}
      />

      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onCheckout={() => void checkout("topup")}
        checkoutLoading={checkoutLoading}
      />

      <ExitWarningModal
        open={exitWarningOpen}
        downloadLoading={downloadLoading}
        onDownloadNow={async () => {
          await downloadHd();
          setExitWarningOpen(false);
          pendingExitRef.current = null;
        }}
        onLeaveAnyway={() => {
          setExitWarningOpen(false);
          const action = pendingExitRef.current;
          pendingExitRef.current = null;
          action?.();
        }}
      />
    </div>
  );
}

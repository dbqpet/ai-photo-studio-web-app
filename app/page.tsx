"use client";

/* eslint-disable @next/next/no-img-element -- previews are dynamic data URLs */

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
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
      setProcessError(null);
      setStep(2);
    },
    [],
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 4000);
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
          showToast("Payment successful — your photo is unlocked!");
          await refreshProfile();
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
          router.replace("/", { scroll: false });
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
    [result, preset, mode, orderSummary, persistCurrentSession],
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
      const res = await fetch("/api/process-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
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
    } finally {
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
  ]);

  const backToSpecs = useCallback(() => {
    setProcessError(null);
    // Leaving preview invalidates unlock UI for the next generate.
    // Same generation stays unlocked if they return without regenerating.
    setStep(2);
  }, []);

  const startOver = useCallback(() => {
    setStep(1);
    setSourcePhoto(null);
    setUploadSessionId(null);
    setResolutionWarning(undefined);
    setResult(null);
    setProcessError(null);
  }, []);

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
                onClick={() => setLoginOpen(true)}
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
              backgroundMode={backgroundMode}
              mode={mode}
              onPresetChange={setPresetId}
              onCustomWidthChange={setCustomWidthMm}
              onCustomHeightChange={setCustomHeightMm}
              onBackgroundChange={setBackgroundId}
              onBackgroundModeChange={setBackgroundMode}
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
              ) : (
                <>✨ Preview Your Photo</>
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
              provider={result.provider}
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
              onBack={backToSpecs}
              onStartOver={startOver}
            />
          </section>
        )}

        {restoringSession && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <p className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-lg">
              Restoring your unlocked photo…
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
            await signInWithGoogle();
          } catch (err) {
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
    </div>
  );
}

"use client";

/* eslint-disable @next/next/no-img-element -- previews are dynamic data URLs */

import { useCallback, useMemo, useState } from "react";
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
import { renderPrintSheet, type SheetLayout } from "@/lib/printLayout";
import { applyWatermarkToCanvas, watermarkDataUrl } from "@/lib/watermark";
import { storePendingPurchase, type PurchaseSummary } from "@/lib/purchaseStore";
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
  provider: AiProvider;
  cleanSingle: string;
  cleanSheet: string;
  previewSingle: string;
  previewSheet: string;
  layout: SheetLayout;
  backgroundMode: BackgroundMode;
  backgroundColor: string;
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
  const {
    user,
    credits,
    profileError,
    needsDbSetup,
    loading: authLoading,
    refreshProfile,
    signInWithGoogle,
    signOut,
  } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [sourcePhoto, setSourcePhoto] = useState<string | null>(null);
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
  const [loginOpen, setLoginOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

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
      setResolutionWarning(warning);
      setResult(null);
      setProcessError(null);
      setStep(2);
    },
    [],
  );

  const checkout = useCallback(async () => {
    setCheckoutLoading(true);
    try {
      const body: CheckoutRequest = {
        presetId: preset.id,
        mode,
        dimensionLabel: orderSummary.dimensionLabel,
      };
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as CheckoutResponse & { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Checkout failed.");

      if (result) {
        await storePendingPurchase({
          singleDataUrl: result.cleanSingle,
          sheetDataUrl: result.cleanSheet,
          presetLabel: preset.label,
          style: mode,
          summary: orderSummary,
        });
      }
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
  }, [result, preset, mode, orderSummary]);

  const generate = useCallback(async () => {
    if (!sourcePhoto) return;

    if (!user) {
      setLoginOpen(true);
      return;
    }

    if (credits !== null && credits <= 0) {
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
        if (res.status === 402 || json.code === "NO_CREDITS") {
          setPaywallOpen(true);
          throw new Error(json.error ?? "You're out of free credits.");
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

      const previewSingle = await watermarkDataUrl(cleanSingle);
      applyWatermarkToCanvas(sheetCanvas);
      const previewSheet = sheetCanvas.toDataURL("image/jpeg", 0.85);

      setResult({
        provider: json.provider,
        cleanSingle,
        cleanSheet,
        previewSingle,
        previewSheet,
        layout,
        backgroundMode,
        backgroundColor: background.hex,
      });
      setStep(3);
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
    user,
    credits,
    profileError,
    preset,
    background,
    mode,
    backgroundMode,
    refreshProfile,
  ]);

  const backToSpecs = useCallback(() => {
    setProcessError(null);
    setStep(2);
  }, []);

  const startOver = useCallback(() => {
    setStep(1);
    setSourcePhoto(null);
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
                {credits ?? 0} credit{(credits ?? 0) === 1 ? "" : "s"}
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
              onClick={() => void generate()}
              disabled={processing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:from-sky-500 hover:to-indigo-500 disabled:opacity-60"
            >
              {processing ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating your photo with AI…
                </>
              ) : (
                <>✨ Generate ID Photo</>
              )}
            </button>
            {!user && !authLoading && (
              <p className="mt-2 text-center text-xs text-slate-500">
                Free account required · 2 free credits on sign-up
              </p>
            )}
          </section>
        )}

        {step === 3 && result && (
          <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-1 text-xl font-bold text-slate-900">
              Your ID photo is ready
            </h2>
            <p className="mb-5 text-sm text-slate-500">
              Previews are watermarked — purchase to unlock the clean high-res
              files.
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
              checkoutLoading={checkoutLoading}
              onCheckout={() => void checkout()}
              onBack={backToSpecs}
              onStartOver={startOver}
            />
          </section>
        )}
      </main>

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
        onCheckout={() => void checkout()}
        checkoutLoading={checkoutLoading}
        outOfCredits
      />
    </div>
  );
}

"use client";

/* eslint-disable @next/next/no-img-element -- previews are dynamic data URLs */

import { useCallback, useMemo, useState } from "react";
import PhotoInput from "@/components/PhotoInput";
import SpecSelector from "@/components/SpecSelector";
import PreviewPanel from "@/components/PreviewPanel";
import {
  BACKGROUND_COLORS,
  PHOTO_SIZE_PRESETS,
  getBackgroundById,
  getPresetById,
} from "@/constants/photoSizes";
import { cropToAspect } from "@/lib/imageUtils";
import { renderPrintSheet, type SheetLayout } from "@/lib/printLayout";
import { applyWatermarkToCanvas, watermarkDataUrl } from "@/lib/watermark";
import { storePendingPurchase } from "@/lib/purchaseStore";
import type {
  AiProvider,
  CheckoutRequest,
  CheckoutResponse,
  ProcessPhotoRequest,
  ProcessPhotoResponse,
  ProcessingMode,
} from "@/lib/types";

type Step = 1 | 2 | 3;

interface GeneratedResult {
  provider: AiProvider;
  cleanSingle: string;
  cleanSheet: string;
  previewSingle: string;
  previewSheet: string;
  layout: SheetLayout;
}

const STEPS: Array<{ id: Step; label: string }> = [
  { id: 1, label: "Photo" },
  { id: 2, label: "Specs" },
  { id: 3, label: "Preview" },
];

export default function StudioPage() {
  const [step, setStep] = useState<Step>(1);
  const [sourcePhoto, setSourcePhoto] = useState<string | null>(null);
  const [resolutionWarning, setResolutionWarning] = useState<string | undefined>();

  const [presetId, setPresetId] = useState(PHOTO_SIZE_PRESETS[0].id);
  const [backgroundId, setBackgroundId] = useState(BACKGROUND_COLORS[0].id);
  const [mode, setMode] = useState<ProcessingMode>("classic");

  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const preset = useMemo(() => getPresetById(presetId)!, [presetId]);
  const background = useMemo(() => getBackgroundById(backgroundId)!, [backgroundId]);

  const handlePhotoSelected = useCallback((dataUrl: string, warning?: string) => {
    setSourcePhoto(dataUrl);
    setResolutionWarning(warning);
    setResult(null);
    setProcessError(null);
    setStep(2);
  }, []);

  const generate = useCallback(async () => {
    if (!sourcePhoto) return;
    setProcessing(true);
    setProcessError(null);
    try {
      // 1. Crop to the exact document aspect ratio at 300 DPI dimensions.
      const cropped = await cropToAspect(
        sourcePhoto,
        preset.pixels.width,
        preset.pixels.height,
      );

      // 2. AI processing: background removal + style + background colour.
      const requestBody: ProcessPhotoRequest = {
        imageDataUrl: cropped,
        mode,
        backgroundColor: background.hex,
        targetWidth: preset.pixels.width,
        targetHeight: preset.pixels.height,
      };
      const res = await fetch("/api/process-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const json = (await res.json()) as ProcessPhotoResponse & { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Processing failed.");

      // 3. 4R print sheet via the client-side Canvas engine.
      const { canvas: sheetCanvas, layout } = await renderPrintSheet(
        json.imageDataUrl,
        preset.pixels.width,
        preset.pixels.height,
      );
      const cleanSheet = sheetCanvas.toDataURL("image/jpeg", 0.92);

      // 4. Watermarked previews (clean copies stay in memory until payment).
      const previewSingle = await watermarkDataUrl(json.imageDataUrl);
      applyWatermarkToCanvas(sheetCanvas);
      const previewSheet = sheetCanvas.toDataURL("image/jpeg", 0.85);

      setResult({
        provider: json.provider,
        cleanSingle: json.imageDataUrl,
        cleanSheet,
        previewSingle,
        previewSheet,
        layout,
      });
      setStep(3);
    } catch (err) {
      setProcessError(
        err instanceof Error ? err.message : "Processing failed. Please try again.",
      );
    } finally {
      setProcessing(false);
    }
  }, [sourcePhoto, preset, background, mode]);

  const checkout = useCallback(async () => {
    if (!result) return;
    setCheckoutLoading(true);
    try {
      storePendingPurchase({
        singleDataUrl: result.cleanSingle,
        sheetDataUrl: result.cleanSheet,
        presetLabel: preset.label,
      });
      const body: CheckoutRequest = { presetId: preset.id, mode };
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as CheckoutResponse & { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Checkout failed.");
      window.location.href = json.url;
    } catch (err) {
      setProcessError(
        err instanceof Error ? err.message : "Checkout failed. Please try again.",
      );
      setCheckoutLoading(false);
    }
  }, [result, preset, mode]);

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
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-4">
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            📸 AI Studio ID
          </h1>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
            ID photos in seconds
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-5 py-6">
        {/* Step indicator */}
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

        {step === 1 && (
          <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-1 text-xl font-bold text-slate-900">
              Add your photo
            </h2>
            <p className="mb-5 text-sm text-slate-500">
              Face the camera straight on, in even lighting, ideally against a
              plain background.
            </p>
            <PhotoInput onPhotoSelected={handlePhotoSelected} />
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
                  Pick the document, background and studio style.
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
              backgroundId={backgroundId}
              mode={mode}
              onPresetChange={setPresetId}
              onBackgroundChange={setBackgroundId}
              onModeChange={setMode}
            />

            {processError && (
              <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {processError}
              </p>
            )}

            <button
              type="button"
              onClick={generate}
              disabled={processing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:from-sky-500 hover:to-indigo-500 disabled:opacity-60"
            >
              {processing ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Generating your ID photo…
                </>
              ) : (
                <>✨ Generate ID Photo</>
              )}
            </button>
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
              checkoutLoading={checkoutLoading}
              onCheckout={checkout}
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
    </div>
  );
}

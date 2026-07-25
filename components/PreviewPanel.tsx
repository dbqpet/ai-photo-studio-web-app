"use client";

/* eslint-disable @next/next/no-img-element -- previews are dynamic data URLs */

import type { PhotoSizePreset } from "@/constants/photoSizes";
import type { SheetLayout } from "@/lib/printLayout";
import type { AiProvider } from "@/lib/types";

interface PreviewPanelProps {
  preset: PhotoSizePreset;
  provider: AiProvider;
  singlePreviewUrl: string;
  sheetPreviewUrl: string;
  layout: SheetLayout;
  checkoutLoading: boolean;
  onCheckout: () => void;
  /** Return to the specs step, keeping the uploaded photo. */
  onBack: () => void;
  onStartOver: () => void;
}

const PROVIDER_LABEL: Record<AiProvider, string> = {
  fal: "fal.ai",
  replicate: "Replicate",
  removebg: "remove.bg",
  mock: "Built-in engine (demo mode — add an API key for studio-grade cutouts)",
};

/** Watermarked previews of the single ID photo and the 4R print sheet. */
export default function PreviewPanel({
  preset,
  provider,
  singlePreviewUrl,
  sheetPreviewUrl,
  layout,
  checkoutLoading,
  onCheckout,
  onBack,
  onStartOver,
}: PreviewPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <figure className="flex flex-col items-center gap-2">
          <img
            src={singlePreviewUrl}
            alt={`Watermarked preview of the processed ${preset.label} photo`}
            className="w-full max-w-56 rounded-lg border border-slate-200 shadow-md"
          />
          <figcaption className="text-xs text-slate-500">
            Single photo · {preset.description} @ 300 DPI
          </figcaption>
        </figure>
        <figure className="flex flex-col items-center gap-2">
          <img
            src={sheetPreviewUrl}
            alt="Watermarked preview of the 4R print sheet"
            className="w-full rounded-lg border border-slate-200 shadow-md"
          />
          <figcaption className="text-xs text-slate-500">
            4R print sheet (4×6in, 300 DPI) · {layout.count} photos (
            {layout.columns}×{layout.rows}) with cut guides
          </figcaption>
        </figure>
      </div>

      <p className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
        Processed by: {PROVIDER_LABEL[provider]}
      </p>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onCheckout}
          disabled={checkoutLoading}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:from-sky-500 hover:to-indigo-500 disabled:opacity-60"
        >
          {checkoutLoading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Redirecting to secure checkout…
            </>
          ) : (
            <>💳 Download High-Res (No Watermark) — $18 HKD</>
          )}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-sky-300 bg-sky-50 px-6 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
        >
          ← Back — change size, color or style
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          ↺ Start over with a new photo
        </button>
      </div>
    </div>
  );
}

"use client";

/* eslint-disable @next/next/no-img-element -- previews are dynamic data URLs */

import OrderSummaryCard from "@/components/OrderSummaryCard";
import PriceAnchor from "@/components/PriceAnchor";
import type { PhotoSizePreset } from "@/constants/photoSizes";
import { PRICING, formatUsd } from "@/lib/pricing";
import type { PurchaseSummary } from "@/lib/purchaseStore";
import type { SheetLayout } from "@/lib/printLayout";
import type { AiProvider } from "@/lib/types";

interface PreviewPanelProps {
  preset: PhotoSizePreset;
  provider: AiProvider;
  singlePreviewUrl: string;
  sheetPreviewUrl: string;
  layout: SheetLayout;
  summary: PurchaseSummary;
  checkoutLoading: boolean;
  onCheckout: () => void;
  onBack: () => void;
  onStartOver: () => void;
}

const PROVIDER_LABEL: Record<AiProvider, string> = {
  gemini: "Gemini Nano Banana Pro",
};

/** Watermarked previews of the single ID photo and the 4R print sheet. */
export default function PreviewPanel({
  preset,
  provider,
  singlePreviewUrl,
  sheetPreviewUrl,
  layout,
  summary,
  checkoutLoading,
  onCheckout,
  onBack,
  onStartOver,
}: PreviewPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <figure className="flex flex-col items-center gap-2">
          <div className="relative w-full max-w-56">
            <img
              src={singlePreviewUrl}
              alt={`Watermarked preview of the processed ${preset.label} photo`}
              className="w-full rounded-lg border border-slate-200 shadow-md"
            />
            <span
              data-testid="ai-mode-badge"
              className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow"
            >
              ⚡ Real AI Mode
            </span>
          </div>
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

      <OrderSummaryCard summary={summary} />

      <p className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
        Processed by: {PROVIDER_LABEL[provider]}
      </p>

      <div className="rounded-2xl border border-rose-100 bg-rose-50/50 px-5 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Unlock this photo
        </p>
        <PriceAnchor />
        <p className="mt-2 text-xs text-slate-500">
          Instant HD download for this photo · +{PRICING.previewCreditsBonus}{" "}
          preview tokens
        </p>
      </div>

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
            <>💳 Unlock 300 DPI HD — {formatUsd(PRICING.saleUsd)}</>
          )}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-slate-300 bg-transparent px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          ← Back to Edit (Size, Color, Style)
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="self-center px-4 py-2 text-sm font-medium text-slate-400 underline-offset-4 transition hover:text-slate-600 hover:underline"
        >
          ↺ Start over with a new photo
        </button>
      </div>
    </div>
  );
}

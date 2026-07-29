"use client";

/* eslint-disable @next/next/no-img-element -- previews are dynamic data URLs */

import OrderSummaryCard from "@/components/OrderSummaryCard";
import type { PhotoSizePreset } from "@/constants/photoSizes";
import { PRICING, formatUsd } from "@/lib/pricing";
import { SUPPORT_EMAIL } from "@/lib/site";
import type { PurchaseSummary } from "@/lib/purchaseStore";
import type { SheetLayout } from "@/lib/printLayout";

interface PreviewPanelProps {
  preset: PhotoSizePreset;
  singlePreviewUrl: string;
  sheetPreviewUrl: string;
  layout: SheetLayout;
  summary: PurchaseSummary;
  hdUnlocks: number;
  unlocked: boolean;
  downloaded: boolean;
  checkoutLoading: boolean;
  downloadLoading: boolean;
  onCheckout: () => void;
  onDownloadHd: () => void;
  onBack: () => void;
  onStartOver: () => void;
}

const UNLOCK_BTN =
  "flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-rose-500/30 transition-all duration-200 hover:scale-[1.02] hover:from-orange-400 hover:via-rose-400 hover:to-fuchsia-500 hover:shadow-xl hover:shadow-rose-500/40 active:scale-[0.98] disabled:scale-100 disabled:opacity-60 disabled:shadow-lg";

const DOWNLOAD_BTN =
  "flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.02] hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 hover:shadow-xl hover:shadow-emerald-500/35 active:scale-[0.98] disabled:scale-100 disabled:opacity-60 disabled:shadow-lg";

/** Watermarked previews of the single ID photo and the 4R print sheet. */
export default function PreviewPanel({
  preset,
  singlePreviewUrl,
  sheetPreviewUrl,
  layout,
  summary,
  hdUnlocks,
  unlocked,
  downloaded,
  checkoutLoading,
  downloadLoading,
  onCheckout,
  onDownloadHd,
  onBack,
  onStartOver,
}: PreviewPanelProps) {
  const showUnlock = !unlocked && hdUnlocks <= 0;
  const showDownload = unlocked || hdUnlocks > 0;

  const downloadLabel = downloaded
    ? "✅ Downloaded — Download Again"
    : "📦 Download HD Photos (.zip)";

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
            {unlocked && (
              <span className="absolute right-2 top-2 rounded-full bg-sky-600 px-2.5 py-1 text-[11px] font-bold text-white shadow">
                Unlocked
              </span>
            )}
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

      <div className="flex flex-col gap-3">
        {showUnlock && (
          <>
            <button
              type="button"
              onClick={onCheckout}
              disabled={checkoutLoading}
              className={UNLOCK_BTN}
            >
              {checkoutLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Redirecting to secure checkout…
                </>
              ) : (
                <>
                  🔓 Unlock HD &amp; 4R Print Sheet ({formatUsd(PRICING.saleUsd)})
                </>
              )}
            </button>
            <p className="text-center text-xs leading-relaxed text-slate-600">
              ⚡ Instant Download • 300 DPI Official Spec • Includes 4R Print
              Sheet
            </p>
            <p className="text-center text-[11px] text-slate-500">
              Questions about your order? Contact support at{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-slate-600 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
          </>
        )}

        {showDownload && (
          <>
            <button
              type="button"
              onClick={onDownloadHd}
              disabled={downloadLoading}
              className={DOWNLOAD_BTN}
            >
              {downloadLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Preparing HD Photo...
                </>
              ) : (
                <>{downloadLabel}</>
              )}
            </button>
            <p className="text-center text-xs leading-relaxed text-slate-600">
              Includes Single HD Photo (300 DPI) + 4R Print Layout (ZIP format)
            </p>
            {!unlocked && hdUnlocks > 0 && (
              <p className="text-center text-[11px] text-slate-500">
                You have {hdUnlocks} HD token{hdUnlocks === 1 ? "" : "s"}{" "}
                remaining. First download unlocks this photo forever.
              </p>
            )}
          </>
        )}

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

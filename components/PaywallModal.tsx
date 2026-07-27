"use client";

import { PRICING, formatUsd } from "@/lib/pricing";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
  checkoutLoading?: boolean;
  /** When true, explain that preview credits are exhausted. */
  outOfCredits?: boolean;
}

/** Price-anchored paywall for the Single Photo Unlock Package. */
export default function PaywallModal({
  open,
  onClose,
  onCheckout,
  checkoutLoading = false,
  outOfCredits = false,
}: PaywallModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="paywall-modal-title"
          className="text-xl font-bold text-slate-900"
        >
          {outOfCredits
            ? "No preview credits left"
            : "Unlock your photos"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {outOfCredits
            ? "Purchase a pack to unlock HD downloads and get more preview generations."
            : "Remove the watermark and download your clean high-res single photo + 4R print sheet."}
        </p>

        <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/60 px-5 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <del className="text-lg text-gray-400">
              {formatUsd(PRICING.originalUsd)}
            </del>
            <span className="text-3xl font-bold text-red-600">
              {formatUsd(PRICING.saleUsd)}
            </span>
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
              {PRICING.badge}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Instant HD download for this photo · +{PRICING.previewCreditsBonus}{" "}
            preview tokens
          </p>
        </div>

        <button
          type="button"
          onClick={onCheckout}
          disabled={checkoutLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:from-sky-500 hover:to-indigo-500 disabled:opacity-60"
        >
          {checkoutLoading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Redirecting to secure checkout…
            </>
          ) : (
            <>💳 {PRICING.checkoutCta}</>
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

"use client";

import { PRICING, formatUsd } from "@/lib/pricing";
import { SUPPORT_EMAIL } from "@/lib/site";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
  checkoutLoading?: boolean;
}

/** Top-up modal when the user is out of preview tokens. */
export default function PaywallModal({
  open,
  onClose,
  onCheckout,
  checkoutLoading = false,
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
          Unlock More Previews ✨
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          You&apos;ve run out of free preview tokens. Grab a new pack to
          continue creating your perfect ID photo!
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
          <p className="mt-3 text-sm font-semibold text-slate-800">
            💎 Includes 1 HD Photo Download + {PRICING.previewCreditsBonus}{" "}
            Bonus Preview Tokens
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
            <>Unlock for {formatUsd(PRICING.saleUsd)}</>
          )}
        </button>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          Questions about your order? Contact support at{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-slate-600 hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>

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

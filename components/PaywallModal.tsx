"use client";

import { Trans, useTranslation } from "react-i18next";
import { PRICING, formatUsd } from "@/lib/pricing";
import { SUPPORT_EMAIL } from "@/lib/site";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
  checkoutLoading?: boolean;
}

/** Out-of-tokens modal: communicates clearly what $4.99 unlocks. */
export default function PaywallModal({
  open,
  onClose,
  onCheckout,
  checkoutLoading = false,
}: PaywallModalProps) {
  const { t } = useTranslation();
  if (!open) return null;

  const salePrice = formatUsd(PRICING.saleUsd);
  const ctaLabel = t("paywallModal.unlockForPrice", { price: salePrice });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="paywall-modal-title"
          className="text-lg font-bold text-slate-900"
        >
          {t("paywallModal.title")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {t("paywallModal.description", {
            price: salePrice,
            previewCredits: PRICING.previewCreditsBonus,
          })}
        </p>

        {/* Pricing + benefits */}
        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <del className="text-sm text-slate-400">
              {formatUsd(PRICING.originalUsd)}
            </del>
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">
              {salePrice}
            </span>
          </div>
          <span className="mt-1.5 inline-block rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
            {t("pricing.badge")}
          </span>

          <ul className="mt-4 space-y-2.5">
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-0.5 text-sky-500" aria-hidden>
                ✓
              </span>
              {t("paywallModal.benefit1")}
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-0.5 text-sky-500" aria-hidden>
                ✓
              </span>
              <Trans
                i18nKey="paywallModal.benefit2"
                components={[
                  <span key="main" className="font-semibold text-slate-900" />,
                  <span key="highlight" className="font-semibold text-sky-700" />,
                ]}
              />
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-0.5 text-sky-500" aria-hidden>
                ✓
              </span>
              {t("paywallModal.benefit3", {
                previewCredits: PRICING.previewCreditsBonus,
              })}
            </li>
          </ul>
        </div>

        {/* Primary CTA — strongest visual element */}
        <button
          type="button"
          onClick={onCheckout}
          disabled={checkoutLoading}
          aria-label={ctaLabel}
          className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-sky-500/30 transition hover:from-sky-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-sky-500/40 disabled:opacity-60"
        >
          {checkoutLoading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              {t("paywallModal.redirectingCheckout")}
            </>
          ) : (
            <>{ctaLabel}</>
          )}
        </button>

        {/* Secondary — clearly clickable but de-emphasised */}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2 text-sm text-slate-400 transition hover:text-slate-600"
        >
          {t("paywallModal.maybeLater")}
        </button>

        <p className="mt-3 text-center text-[11px] text-slate-400">
          {t("paywallModal.supportQuestion", { email: "" })}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-slate-500 hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}

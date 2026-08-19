"use client";

import { useTranslation } from "react-i18next";
import type { PurchaseSummary } from "@/lib/purchaseStore";

interface OrderSummaryCardProps {
  summary: PurchaseSummary;
  className?: string;
}

/** Compact summary of the user's selected style / background / dimension. */
export default function OrderSummaryCard({
  summary,
  className = "",
}: OrderSummaryCardProps) {
  const { t } = useTranslation();
  return (
    <div
      className={`rounded-xl border border-slate-100 bg-white px-4 py-3 text-left ${className}`}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t("orderSummary.heading")}
      </p>
      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">{t("orderSummary.style")}</dt>
          <dd className="font-medium text-slate-900">{summary.styleLabel}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">{t("orderSummary.background")}</dt>
          <dd className="font-medium text-slate-900">
            {summary.backgroundLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">{t("orderSummary.dimension")}</dt>
          <dd className="font-medium text-slate-900">
            {summary.dimensionLabel}
          </dd>
        </div>
      </dl>
    </div>
  );
}

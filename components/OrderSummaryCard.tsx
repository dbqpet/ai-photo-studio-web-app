"use client";

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
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left ${className}`}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Your selection
      </p>
      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Style</dt>
          <dd className="font-medium text-slate-900">{summary.styleLabel}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Background</dt>
          <dd className="font-medium text-slate-900">
            {summary.backgroundLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Dimension</dt>
          <dd className="font-medium text-slate-900">
            {summary.dimensionLabel}
          </dd>
        </div>
      </dl>
    </div>
  );
}

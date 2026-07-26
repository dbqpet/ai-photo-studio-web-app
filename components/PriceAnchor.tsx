"use client";

import { PRICING, formatUsd } from "@/lib/pricing";

/** Compact strikethrough + sale price + launch badge for checkout CTAs. */
export default function PriceAnchor({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
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
  );
}

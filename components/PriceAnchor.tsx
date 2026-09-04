"use client";

import { PRICING, formatUsd } from "@/lib/pricing";
import { usePricingMarket, useUnlockPrice } from "@/hooks/useUnlockPrice";

/** Compact strikethrough + sale price + launch badge for checkout CTAs. */
export default function PriceAnchor({ className = "" }: { className?: string }) {
  const market = usePricingMarket();
  const salePrice = useUnlockPrice();

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {market === "usd" ? (
        <del className="text-lg text-gray-400">
          {formatUsd(PRICING.originalUsd)}
        </del>
      ) : null}
      <span className="text-3xl font-bold text-red-600">{salePrice}</span>
      <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
        {PRICING.badge}
      </span>
    </div>
  );
}

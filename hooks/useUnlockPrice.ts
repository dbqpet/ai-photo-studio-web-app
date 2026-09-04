"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  detectPricingMarket,
  formatUnlockPrice,
  type PricingMarket,
} from "@/lib/pricing";

/** Resolves HK vs USD after mount so SSR/hydration stay on the USD default. */
export function usePricingMarket(): PricingMarket {
  const { i18n } = useTranslation();
  const [market, setMarket] = useState<PricingMarket>("usd");

  useEffect(() => {
    setMarket(detectPricingMarket(i18n.language));
  }, [i18n.language]);

  return market;
}

export function useUnlockPrice(): string {
  return formatUnlockPrice(usePricingMarket());
}

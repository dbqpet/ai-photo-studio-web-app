/** Unlock pricing by market. Paste Stripe Price IDs when ready. */

export type PricingMarket = "hk" | "usd";

export const UNLOCK_PRICES = {
  usd: {
    currency: "usd" as const,
    sale: 2.99,
    original: 12.99,
    /** Stripe unit amount in cents. Used until a Price ID is set in env. */
    stripeUnitAmount: 299,
    /** Optional hardcoded fallback. Prefer STRIPE_PRICE_ID_USD in .env.local. */
    stripePriceId: "" as string,
  },
  hk: {
    currency: "hkd" as const,
    sale: 20,
    original: null as number | null,
    /** Stripe unit amount in HKD cents (HK$20.00). Used until a Price ID is set in env. */
    stripeUnitAmount: 2000,
    /** Optional hardcoded fallback. Prefer STRIPE_PRICE_ID_HKD in .env.local. */
    stripePriceId: "" as string,
  },
} as const;

export const PRICING = {
  /** Strikethrough anchor price shown in the USD UI. */
  originalUsd: UNLOCK_PRICES.usd.original,
  /** Default / SEO selling price (USD). */
  saleUsd: UNLOCK_PRICES.usd.sale,
  /** Stripe Checkout unit amount in USD cents (fallback). */
  stripeUnitAmount: UNLOCK_PRICES.usd.stripeUnitAmount,
  currency: "usd" as const,
  badge: "🔥 Launch Special - Save 60%",
  checkoutCta: "Unlock High-Res Download",
  productName: "Official HD Photo & 4R Print Sheet",
  /** Stripe tax code: digital photos downloaded with permanent rights. */
  stripeTaxCode: "txcd_10501000",
  /** Bonus preview generations granted after purchase. */
  previewCreditsBonus: 3,
  /** HD unlocks banked per purchase (top-up pack or single-photo unlock). */
  hdUnlocksPerPurchase: 1,
  /** Free preview credits seeded on first signup. */
  signupPreviewCredits: 3,
} as const;

export function detectPricingMarket(locale?: string): PricingMarket {
  if (locale === "zh") return "hk";

  if (typeof Intl !== "undefined") {
    try {
      if (Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Hong_Kong") {
        return "hk";
      }
    } catch {
      // Ignore environments without a resolved timezone.
    }
  }

  if (typeof navigator !== "undefined") {
    const langs =
      navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language];
    if (langs.some((lang) => /^zh-hk\b|^zh-mo\b/i.test(lang))) return "hk";
  }

  return "usd";
}

export function formatUnlockPrice(market: PricingMarket = "usd"): string {
  if (market === "hk") return "HK$20";
  return `$${UNLOCK_PRICES.usd.sale.toFixed(2)}`;
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/** Server-only. Reads Price IDs from env, then the hardcoded fallback. */
export function stripePriceIdForMarket(market: PricingMarket): string {
  const fromEnv =
    market === "hk"
      ? process.env.STRIPE_PRICE_ID_HKD
      : process.env.STRIPE_PRICE_ID_USD;
  return fromEnv?.trim() || UNLOCK_PRICES[market].stripePriceId;
}

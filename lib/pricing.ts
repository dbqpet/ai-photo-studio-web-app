/** Launch-special price anchoring for the high-res unlock paywall. */

export const PRICING = {
  /** Strikethrough anchor price shown in the UI. */
  originalUsd: 12.99,
  /** Actual selling price shown prominently. */
  saleUsd: 4.99,
  /** Stripe Checkout unit amount in the smallest currency unit. */
  stripeUnitAmount: 499,
  currency: "usd" as const,
  badge: "🔥 Launch Special - Save 60%",
  checkoutCta: "Unlock High-Res Download",
  productName: "AI Studio ID — High-Res Photo Pack (No Watermark)",
  /** Credits granted to the user after a successful Stripe payment. */
  creditsPerPurchase: 5,
} as const;

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

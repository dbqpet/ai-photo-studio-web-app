/** Launch-special price anchoring for the Single Photo Unlock Package. */

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

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

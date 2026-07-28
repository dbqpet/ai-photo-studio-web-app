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
  productName: "AI Studio ID — Single Photo Unlock Package",
  /** Bonus preview generations granted after purchase. */
  previewCreditsBonus: 5,
  /** HD unlocks banked on a top-up pack purchase (not on photo unlock). */
  hdUnlocksPerTopup: 1,
  /** Free preview credits seeded on first signup. */
  signupPreviewCredits: 5,
} as const;

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

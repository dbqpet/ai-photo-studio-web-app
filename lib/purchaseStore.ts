/**
 * Session storage bridge between the studio page and the post-payment
 * success page: the clean (watermark-free) renders are stashed here right
 * before redirecting to Stripe Checkout, and released after payment is
 * verified.
 */

const KEY_SINGLE = "aiStudioId.clean.single";
const KEY_SHEET = "aiStudioId.clean.sheet";
const KEY_LABEL = "aiStudioId.clean.label";

export interface PendingPurchase {
  singleDataUrl: string;
  sheetDataUrl: string;
  /** Human-readable preset label, used in download filenames. */
  presetLabel: string;
}

export function storePendingPurchase(purchase: PendingPurchase): void {
  sessionStorage.setItem(KEY_SINGLE, purchase.singleDataUrl);
  sessionStorage.setItem(KEY_SHEET, purchase.sheetDataUrl);
  sessionStorage.setItem(KEY_LABEL, purchase.presetLabel);
}

export function readPendingPurchase(): PendingPurchase | null {
  const singleDataUrl = sessionStorage.getItem(KEY_SINGLE);
  const sheetDataUrl = sessionStorage.getItem(KEY_SHEET);
  const presetLabel = sessionStorage.getItem(KEY_LABEL) ?? "id-photo";
  if (!singleDataUrl || !sheetDataUrl) return null;
  return { singleDataUrl, sheetDataUrl, presetLabel };
}

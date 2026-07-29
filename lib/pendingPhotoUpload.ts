/**
 * Persist uploaded photo + specs across Google OAuth redirect.
 * Saved to localStorage before sign-in; restored on return, then cleared.
 */

import type { BackgroundMode, ProcessingMode } from "@/lib/types";

export const PENDING_PHOTO_UPLOAD_KEY = "pending_photo_upload";

export interface PendingPhotoUpload {
  sourcePhoto: string;
  uploadSessionId: string | null;
  resolutionWarning?: string;
  presetId: string;
  customWidthMm: number;
  customHeightMm: number;
  backgroundId: string;
  backgroundMode: BackgroundMode;
  mode: ProcessingMode;
  /** Wizard step to restore (usually 2 = Specs). */
  step: 1 | 2 | 3;
  savedAt: number;
}

export function savePendingPhotoUpload(
  payload: Omit<PendingPhotoUpload, "savedAt">,
): void {
  if (typeof window === "undefined") return;
  try {
    const data: PendingPhotoUpload = {
      ...payload,
      savedAt: Date.now(),
    };
    localStorage.setItem(PENDING_PHOTO_UPLOAD_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("[pendingPhotoUpload] save failed:", err);
  }
}

export function readPendingPhotoUpload(): PendingPhotoUpload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_PHOTO_UPLOAD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingPhotoUpload;
    if (!parsed?.sourcePhoto || typeof parsed.sourcePhoto !== "string") {
      return null;
    }
    return parsed;
  } catch (err) {
    console.warn("[pendingPhotoUpload] read failed:", err);
    return null;
  }
}

export function clearPendingPhotoUpload(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PENDING_PHOTO_UPLOAD_KEY);
  } catch {
    // ignore
  }
}

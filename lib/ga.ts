import { sendGAEvent } from "@next/third-parties/google";

/**
 * Fire a Google Analytics (GA4) custom event.
 *
 * Client-only by design: `sendGAEvent` reaches into `window.dataLayer`, so
 * this is a no-op (and never throws) during SSR or if GA hasn't loaded yet
 * (e.g. ad-blockers, consent not granted). Never await this — it must not
 * block the UI thread or the caller's click handler.
 */
export function trackGAEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>,
): void {
  if (typeof window === "undefined") return;
  try {
    sendGAEvent("event", eventName, params ?? {});
  } catch {
    // Swallow analytics failures — tracking must never break the UI.
  }
}

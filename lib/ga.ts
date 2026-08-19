import { sendGAEvent } from "@next/third-parties/google";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function cleanParams(
  params?: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
  if (!params) return {};
  return Object.fromEntries(
    Object.entries(params).filter(
      (entry): entry is [string, string | number | boolean] =>
        entry[1] !== undefined,
    ),
  );
}

/**
 * Fire a Google Analytics (GA4) custom event.
 *
 * Prefers `window.gtag` when available (defined by the GA init script as soon
 * as `<GoogleAnalytics />` mounts). Falls back to `sendGAEvent` from
 * `@next/third-parties/google`.
 *
 * Client-only — no-op during SSR. Never await; must not block click handlers.
 */
export function trackGAEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>,
  options?: { beacon?: boolean },
): void {
  if (typeof window === "undefined") return;

  const payload = cleanParams(params);
  if (options?.beacon) {
    payload.transport_type = "beacon";
  }

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
      return;
    }
    sendGAEvent("event", eventName, payload);
  } catch {
    // Swallow analytics failures — tracking must never break the UI.
  }
}

/** Brief pause so beacon transport can flush before leaving the page. */
export function navigateAfterAnalytics(url: string, delayMs = 150): void {
  window.setTimeout(() => {
    window.location.href = url;
  }, delayMs);
}

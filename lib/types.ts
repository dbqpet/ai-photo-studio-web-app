/** Shared domain types for the AI Studio ID photo pipeline. */

export type ProcessingMode = "classic" | "korean" | "corporate";

/**
 * How the final photo background is produced.
 * - solid: subject on the user-selected solid colour (opaque JPEG)
 * - studio: full professional AI studio backdrop with depth / texture
 */
export type BackgroundMode = "solid" | "studio";

export interface ProcessingModeOption {
  id: ProcessingMode;
  label: string;
  description: string;
  icon: string;
}

export const PROCESSING_MODES: ProcessingModeOption[] = [
  {
    id: "classic",
    label: "Classic Passport",
    description:
      "Clean natural lighting with a professional ID-photo finish.",
    icon: "🛂",
  },
  {
    id: "korean",
    label: "Korean Studio Style",
    description:
      "Soft high-key lighting, gentle skin smoothing and a refined studio tone.",
    icon: "✨",
  },
  {
    id: "corporate",
    label: "Corporate Pro",
    description:
      "Sharp focus, cool professional tint and a formal corporate finish.",
    icon: "🏢",
  },
];

/** Gemini Nano Banana Pro is the exclusive image engine. */
export type AiProvider = "gemini";

export interface ProcessPhotoRequest {
  /** Base64 data URL of the (already cropped) source photo. */
  imageDataUrl: string;
  mode: ProcessingMode;
  backgroundMode: BackgroundMode;
  /** Hex background colour for solid mode, e.g. "#FFFFFF". */
  backgroundColor: string;
  /** Target output pixel dimensions (300 DPI print size). */
  targetWidth: number;
  targetHeight: number;
}

export interface ProcessPhotoResponse {
  /** Base64 data URL (JPEG) of the processed ID photo. */
  imageDataUrl: string;
  provider: AiProvider;
  mode: ProcessingMode;
  backgroundMode: BackgroundMode;
  /** Remaining generation credits after a successful deduction (when auth is on). */
  creditsRemaining?: number;
}

export interface ValidatePhotoRequest {
  /** Base64 data URL of the candidate photo (downscaled by the client). */
  imageDataUrl: string;
}

export interface ValidatePhotoResponse {
  /** False when GEMINI_API_KEY is not set and the check was skipped. */
  configured: boolean;
  /** Whether the photo is suitable for an ID photo. */
  suitable: boolean;
  personCount: number;
  sunglassesOrCovered: boolean;
  faceClearlyVisible: boolean;
  /** Human-readable explanation, shown to the user when unsuitable. */
  reason: string;
}

export interface CheckoutRequest {
  presetId: string;
  mode: ProcessingMode;
  /** Human-readable dimension for Stripe / mock checkout copy. */
  dimensionLabel?: string;
  /**
   * - topup: out-of-tokens pack (+5 preview + 1 HD unlock banked)
   * - unlock_photo: pay for current preview (instant download +5 preview)
   */
  intent?: "topup" | "unlock_photo";
  /** Unique id for the AI generation being unlocked (NOT the upload session). */
  generationId?: string;
  /** @deprecated Use generationId */
  photoId?: string;
}

export interface CheckoutResponse {
  /** URL to redirect the browser to (Stripe Checkout or mock success page). */
  url: string;
  /** True when Stripe is not configured and a mock session was created. */
  mock: boolean;
}

export interface VerifyPaymentResponse {
  paid: boolean;
  mock: boolean;
}

/** Friendly copy when Gemini is busy / rate-limited / unavailable. */
export const HIGH_DEMAND_MESSAGE =
  "Our AI servers are currently in high demand. Please be patient — we're retrying your photo. This can take a little longer than usual.";

/**
 * Copy for a depleted-billing outage (Gemini API prepayment credits are
 * exhausted). Deliberately does NOT say "please be patient" / "retrying" —
 * unlike high demand, this will not resolve itself, so we tell the user
 * plainly that the service is down instead of implying a retry will help.
 */
export const AI_SERVICE_UNAVAILABLE_MESSAGE =
  "Our AI photo service is temporarily unavailable. No credits were deducted — please try again later or contact support if this continues.";

/** Shared domain types for the AI Studio ID photo pipeline. */

export type ProcessingMode = "classic" | "korean" | "corporate";

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
      "Background removal, solid background replacement and clean natural lighting.",
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

export type AiProvider = "fal" | "replicate" | "removebg" | "mock";

export interface ProcessPhotoRequest {
  /** Base64 data URL of the (already cropped) source photo. */
  imageDataUrl: string;
  mode: ProcessingMode;
  /** Hex background colour to composite behind the subject, e.g. "#FFFFFF". */
  backgroundColor: string;
  /** Target output pixel dimensions (300 DPI print size). */
  targetWidth: number;
  targetHeight: number;
}

export interface ProcessPhotoResponse {
  /** Base64 data URL (JPEG) of the fully processed ID photo. */
  imageDataUrl: string;
  /** Which backend performed the background removal. */
  provider: AiProvider;
  mode: ProcessingMode;
  /** Set when a configured AI provider failed and the mock engine took over. */
  fallbackReason?: string;
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

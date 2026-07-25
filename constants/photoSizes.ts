/**
 * ID photo specification presets.
 *
 * All dimensions are stored in millimetres. Pixel dimensions are derived at
 * 300 DPI (print resolution) via `mmToPx300`.
 */

export const PRINT_DPI = 300;
export const MM_PER_INCH = 25.4;

/** Convert millimetres to pixels at 300 DPI. */
export const mmToPx300 = (mm: number): number =>
  Math.round((mm / MM_PER_INCH) * PRINT_DPI);

export interface PhotoSizePreset {
  id: string;
  /** Display name of the document type. */
  label: string;
  /** Short descriptor shown under the label. */
  description: string;
  /** Physical width in millimetres. */
  widthMm: number;
  /** Physical height in millimetres. */
  heightMm: number;
  /** Width / height. */
  aspectRatio: number;
  /** Pixel dimensions at 300 DPI. */
  pixels: { width: number; height: number };
  /** Emoji flag / icon for quick recognition in the UI. */
  icon: string;
}

const makePreset = (
  id: string,
  label: string,
  description: string,
  widthMm: number,
  heightMm: number,
  icon: string,
): PhotoSizePreset => ({
  id,
  label,
  description,
  widthMm,
  heightMm,
  aspectRatio: widthMm / heightMm,
  pixels: { width: mmToPx300(widthMm), height: mmToPx300(heightMm) },
  icon,
});

export const PHOTO_SIZE_PRESETS: PhotoSizePreset[] = [
  makePreset(
    "hk-passport",
    "Hong Kong Passport / BNO",
    "40mm × 50mm",
    40,
    50,
    "🇭🇰",
  ),
  makePreset(
    "us-visa",
    "US Visa / Passport",
    "2in × 2in (51mm × 51mm)",
    51,
    51,
    "🇺🇸",
  ),
  makePreset(
    "cn-travel-permit",
    "Mainland China Travel Permit / Visa",
    "33mm × 48mm",
    33,
    48,
    "🇨🇳",
  ),
  makePreset("resume", "Standard Resume / CV", "35mm × 45mm", 35, 45, "💼"),
];

export interface BackgroundColorOption {
  id: string;
  label: string;
  /** CSS hex value used for compositing and UI swatches. */
  hex: string;
}

export const BACKGROUND_COLORS: BackgroundColorOption[] = [
  { id: "white", label: "White", hex: "#FFFFFF" },
  { id: "light-blue", label: "Light Blue", hex: "#AECFEA" },
  { id: "grey", label: "Grey", hex: "#C9CDD1" },
  { id: "red", label: "Red", hex: "#C0362C" },
];

export const getPresetById = (id: string): PhotoSizePreset | undefined =>
  PHOTO_SIZE_PRESETS.find((p) => p.id === id);

export const getBackgroundById = (
  id: string,
): BackgroundColorOption | undefined =>
  BACKGROUND_COLORS.find((c) => c.id === id);

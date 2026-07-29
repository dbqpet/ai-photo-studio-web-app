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
  /** True when dimensions come from user custom inputs. */
  isCustom?: boolean;
}

export const makePreset = (
  id: string,
  label: string,
  description: string,
  widthMm: number,
  heightMm: number,
  icon: string,
  isCustom = false,
): PhotoSizePreset => ({
  id,
  label,
  description,
  widthMm,
  heightMm,
  aspectRatio: widthMm / heightMm,
  pixels: { width: mmToPx300(widthMm), height: mmToPx300(heightMm) },
  icon,
  isCustom,
});

export const PHOTO_SIZE_PRESETS: PhotoSizePreset[] = [
  makePreset(
    "eu-35x45",
    "35×45 mm (HK / UK / EU Standard)",
    "35mm × 45mm · common passport & visa size",
    35,
    45,
    "🛂",
  ),
  makePreset(
    "us-2x2",
    "2×2 inches (US Passport)",
    "2in × 2in (51mm × 51mm)",
    51,
    51,
    "🇺🇸",
  ),
  makePreset(
    "hk-passport",
    "40×50 mm (Hong Kong Passport / BNO)",
    "40mm × 50mm",
    40,
    50,
    "🇭🇰",
  ),
  makePreset(
    "cn-travel-permit",
    "33×48 mm (Mainland China Travel Permit)",
    "33mm × 48mm",
    33,
    48,
    "🇨🇳",
  ),
  makePreset("custom", "Custom", "Enter your own width × height in mm", 35, 45, "📐", true),
];

/** Custom dimension limits (mm) at 300 DPI print size. */
export const CUSTOM_MM_MIN = 20;
export const CUSTOM_MM_MAX = 100;

export function buildCustomPreset(
  widthMm: number,
  heightMm: number,
): PhotoSizePreset {
  const w = Math.round(widthMm * 10) / 10;
  const h = Math.round(heightMm * 10) / 10;
  return makePreset(
    "custom",
    "Custom",
    `${w}mm × ${h}mm`,
    w,
    h,
    "📐",
    true,
  );
}

export function resolvePhotoPreset(
  presetId: string,
  customWidthMm: number,
  customHeightMm: number,
): PhotoSizePreset {
  if (presetId === "custom") {
    return buildCustomPreset(customWidthMm, customHeightMm);
  }
  return getPresetById(presetId) ?? PHOTO_SIZE_PRESETS[0];
}

export function formatDimensionLabel(preset: PhotoSizePreset): string {
  if (preset.isCustom || preset.id === "custom") {
    return `${preset.widthMm}×${preset.heightMm} mm (Custom)`;
  }
  return `${preset.widthMm}×${preset.heightMm} mm`;
}

export interface BackgroundColorOption {
  id: string;
  /** Short label shown as the card's main text (kept concise to avoid overflow). */
  label: string;
  /** Small secondary text shown under the label. */
  subLabel: string;
  /** CSS hex value used for compositing the final image. */
  hex: string;
  /** Tailwind classes for the swatch circle (bg + border). */
  swatchClassName: string;
}

export const BACKGROUND_COLORS: BackgroundColorOption[] = [
  {
    id: "white",
    label: "White",
    subLabel: "Passport / Visa",
    hex: "#FFFFFF",
    swatchClassName: "bg-white border-gray-300",
  },
  {
    id: "off-white-grey",
    label: "Off-White",
    subLabel: "Light Grey",
    hex: "#F0F0F0",
    swatchClassName: "bg-[#f0f0f0] border-gray-300",
  },
  {
    id: "blue",
    label: "Blue",
    subLabel: "Standard Blue",
    hex: "#2B6CB0",
    swatchClassName: "bg-[#2b6cb0] border-blue-600",
  },
];

export const getPresetById = (id: string): PhotoSizePreset | undefined =>
  PHOTO_SIZE_PRESETS.find((p) => p.id === id);

export const getBackgroundById = (
  id: string,
): BackgroundColorOption | undefined =>
  BACKGROUND_COLORS.find((c) => c.id === id);

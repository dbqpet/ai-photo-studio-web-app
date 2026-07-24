/**
 * Deterministic photometric styling applied on top of the subject cutout.
 *
 * Because styles are implemented as tone/lighting adjustments (never
 * generative redraws), facial identity is preserved 100% — every output pixel
 * of the face originates from the source photo.
 */

import sharp, { type Sharp } from "sharp";
import type { ProcessingMode } from "@/lib/types";

function applyStyle(image: Sharp, mode: ProcessingMode): Sharp {
  switch (mode) {
    case "classic":
      // Clean natural lighting: neutral, faithful rendition.
      return image.modulate({ brightness: 1.02 }).normalise({ lower: 1, upper: 99 });
    case "korean":
      // Soft high-key lighting + gentle skin smoothing (edge-preserving
      // median filter) + refined, slightly desaturated studio tone.
      return image
        .median(3)
        .modulate({ brightness: 1.1, saturation: 0.92 })
        .gamma(1.05);
    case "corporate":
      // Sharp focus + cool professional tint (blue channel lift, red pulled
      // back slightly) + mild contrast for a formal corporate finish.
      return image
        .sharpen({ sigma: 1.1 })
        .modulate({ brightness: 1.01, saturation: 0.88 })
        .linear([0.97, 1.0, 1.05, 1.0], [0, 0, 8, 0]);
  }
}

export interface StylePipelineOptions {
  mode: ProcessingMode;
  /** Hex colour, e.g. "#FFFFFF". */
  backgroundColor: string;
  targetWidth: number;
  targetHeight: number;
}

/**
 * cutout (transparent PNG) → styled subject → composite onto solid
 * background colour → exact 300 DPI print dimensions → JPEG.
 */
export async function finalizeIdPhoto(
  cutoutPng: Buffer,
  options: StylePipelineOptions,
): Promise<Buffer> {
  const { mode, backgroundColor, targetWidth, targetHeight } = options;
  const styled = applyStyle(sharp(cutoutPng).ensureAlpha(), mode);
  return styled
    .flatten({ background: backgroundColor })
    .resize(targetWidth, targetHeight, { fit: "cover", position: "attention" })
    .jpeg({ quality: 92 })
    .toBuffer();
}

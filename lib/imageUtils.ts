/** Client-side image helpers: loading, validation and aspect-ratio cropping. */

export const MIN_SOURCE_WIDTH = 600;
export const MIN_SOURCE_HEIGHT = 600;
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export interface ImageValidation {
  ok: boolean;
  warning?: string;
  error?: string;
  width: number;
  height: number;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load the image."));
    img.src = src;
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

/** Pre-validation: rejects non-images / oversized files, warns on low resolution. */
export async function validateSourceImage(
  dataUrl: string,
): Promise<ImageValidation> {
  const img = await loadImage(dataUrl);
  const { naturalWidth: width, naturalHeight: height } = img;
  if (width < MIN_SOURCE_WIDTH || height < MIN_SOURCE_HEIGHT) {
    return {
      ok: true,
      width,
      height,
      warning: `Low resolution (${width}×${height}px). For crisp prints we recommend at least ${MIN_SOURCE_WIDTH}×${MIN_SOURCE_HEIGHT}px.`,
    };
  }
  return { ok: true, width, height };
}

/**
 * Centre-crop an image to the target aspect ratio and scale it to the exact
 * 300 DPI pixel dimensions of the selected document preset.
 *
 * When cropping vertically the window is biased slightly upwards so the head
 * (typically in the upper part of a portrait) stays inside the frame.
 */
export async function cropToAspect(
  dataUrl: string,
  targetWidth: number,
  targetHeight: number,
): Promise<string> {
  const img = await loadImage(dataUrl);
  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;
  const targetAspect = targetWidth / targetHeight;
  const srcAspect = srcW / srcH;

  let cropW = srcW;
  let cropH = srcH;
  let cropX = 0;
  let cropY = 0;

  if (srcAspect > targetAspect) {
    // Source is wider: crop the sides.
    cropW = Math.round(srcH * targetAspect);
    cropX = Math.round((srcW - cropW) / 2);
  } else {
    // Source is taller: crop top/bottom, biased 35/65 towards the top.
    cropH = Math.round(srcW / targetAspect);
    cropY = Math.round((srcH - cropH) * 0.35);
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL("image/jpeg", 0.95);
}

/**
 * Downscale an image so its longest edge is at most `maxDim` pixels.
 * Used to keep AI validation requests small and cheap.
 */
export async function downscaleDataUrl(
  dataUrl: string,
  maxDim = 800,
): Promise<string> {
  const img = await loadImage(dataUrl);
  const { naturalWidth: w, naturalHeight: h } = img;
  const scale = Math.min(1, maxDim / Math.max(w, h));
  if (scale === 1) return dataUrl;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

/** Trigger a browser download of a data URL. */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

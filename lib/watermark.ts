/**
 * Semi-transparent repeating watermark for preview images.
 * The clean (un-watermarked) originals are only released after payment.
 */

import { loadImage } from "@/lib/imageUtils";

export const WATERMARK_TEXT = "AI Studio ID - Preview";

/** Tile rotated watermark text across a canvas. */
export function applyWatermarkToCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");

  const fontSize = Math.max(18, Math.round(canvas.width / 16));
  const stepX = fontSize * 9;
  const stepY = fontSize * 4;

  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = "#1e293b";
  ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 7);

  const diagonal = Math.hypot(canvas.width, canvas.height);
  for (let y = -diagonal; y <= diagonal; y += stepY) {
    // Offset alternate rows for a brick-like tiling.
    const rowOffset = (Math.round(y / stepY) % 2) * (stepX / 2);
    for (let x = -diagonal; x <= diagonal; x += stepX) {
      ctx.fillText(WATERMARK_TEXT, x + rowOffset, y);
    }
  }
  ctx.restore();
  return canvas;
}

/** Return a watermarked JPEG data URL of the given image. */
export async function watermarkDataUrl(dataUrl: string): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");
  ctx.drawImage(img, 0, 0);
  applyWatermarkToCanvas(canvas);
  return canvas.toDataURL("image/jpeg", 0.9);
}

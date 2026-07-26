/**
 * Semi-transparent repeating watermark for preview images.
 * The clean (un-watermarked) originals are only released after payment.
 */

import { loadImage } from "@/lib/imageUtils";

export const WATERMARK_TEXT = "AI Studio ID - Preview";

function fillCheckerboard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cell = 16,
): void {
  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {
      const odd = ((x / cell) | 0) % 2 !== ((y / cell) | 0) % 2;
      ctx.fillStyle = odd ? "#e2e8f0" : "#f8fafc";
      ctx.fillRect(x, y, cell, cell);
    }
  }
}

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
    const rowOffset = (Math.round(y / stepY) % 2) * (stepX / 2);
    for (let x = -diagonal; x <= diagonal; x += stepX) {
      ctx.fillText(WATERMARK_TEXT, x + rowOffset, y);
    }
  }
  ctx.restore();
  return canvas;
}

/**
 * Return a watermarked preview data URL.
 * Transparent sources get a checkerboard underlay and PNG output.
 */
export async function watermarkDataUrl(
  dataUrl: string,
  options?: { transparent?: boolean },
): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");
  if (options?.transparent) {
    fillCheckerboard(ctx, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);
  applyWatermarkToCanvas(canvas);
  return options?.transparent
    ? canvas.toDataURL("image/png")
    : canvas.toDataURL("image/jpeg", 0.9);
}

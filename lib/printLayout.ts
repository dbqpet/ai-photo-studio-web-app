/**
 * 4R print layout engine (client-side HTML5 Canvas).
 *
 * Arranges copies of a single ID photo onto a standard 4R sheet
 * (4in × 6in at 300 DPI). Both sheet orientations are evaluated and the one
 * that fits the most photos wins.
 */

import { PRINT_DPI, mmToPx300 } from "@/constants/photoSizes";
import { loadImage } from "@/lib/imageUtils";

/** 4R = 4in × 6in at 300 DPI. */
export const SHEET_PORTRAIT = { width: 4 * PRINT_DPI, height: 6 * PRINT_DPI }; // 1200×1800
export const SHEET_LANDSCAPE = { width: 6 * PRINT_DPI, height: 4 * PRINT_DPI }; // 1800×1200

/** Outer margin and gap between photos (3mm each ≈ printer-safe cut spacing). */
const MARGIN_PX = mmToPx300(3);
const GAP_PX = mmToPx300(3);

export interface SheetLayout {
  sheetWidth: number;
  sheetHeight: number;
  columns: number;
  rows: number;
  count: number;
  photoWidth: number;
  photoHeight: number;
  /** Top-left position of the grid (grid is centred on the sheet). */
  offsetX: number;
  offsetY: number;
}

function layoutFor(
  sheet: { width: number; height: number },
  photoWidth: number,
  photoHeight: number,
): SheetLayout {
  const usableW = sheet.width - 2 * MARGIN_PX;
  const usableH = sheet.height - 2 * MARGIN_PX;
  const columns = Math.max(0, Math.floor((usableW + GAP_PX) / (photoWidth + GAP_PX)));
  const rows = Math.max(0, Math.floor((usableH + GAP_PX) / (photoHeight + GAP_PX)));
  const gridW = columns * photoWidth + (columns - 1) * GAP_PX;
  const gridH = rows * photoHeight + (rows - 1) * GAP_PX;
  return {
    sheetWidth: sheet.width,
    sheetHeight: sheet.height,
    columns,
    rows,
    count: columns * rows,
    photoWidth,
    photoHeight,
    offsetX: Math.round((sheet.width - gridW) / 2),
    offsetY: Math.round((sheet.height - gridH) / 2),
  };
}

/** Pick the sheet orientation that fits the most photos. */
export function bestSheetLayout(photoWidth: number, photoHeight: number): SheetLayout {
  const portrait = layoutFor(SHEET_PORTRAIT, photoWidth, photoHeight);
  const landscape = layoutFor(SHEET_LANDSCAPE, photoWidth, photoHeight);
  return landscape.count > portrait.count ? landscape : portrait;
}

/**
 * Render the 4R sheet: white paper, repeated photos, and light dashed cut
 * guides around each photo. Returns the canvas for further compositing
 * (e.g. watermarking) or export.
 */
export async function renderPrintSheet(
  photoDataUrl: string,
  photoWidth: number,
  photoHeight: number,
): Promise<{ canvas: HTMLCanvasElement; layout: SheetLayout }> {
  const layout = bestSheetLayout(photoWidth, photoHeight);
  if (layout.count === 0) {
    throw new Error("The selected photo size does not fit on a 4R sheet.");
  }

  const img = await loadImage(photoDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = layout.sheetWidth;
  canvas.height = layout.sheetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingQuality = "high";

  ctx.strokeStyle = "rgba(148, 163, 184, 0.9)";
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 6]);

  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.columns; col++) {
      const x = layout.offsetX + col * (photoWidth + GAP_PX);
      const y = layout.offsetY + row * (photoHeight + GAP_PX);
      ctx.drawImage(img, x, y, photoWidth, photoHeight);
      ctx.strokeRect(x - 1.5, y - 1.5, photoWidth + 3, photoHeight + 3);
    }
  }
  ctx.setLineDash([]);

  return { canvas, layout };
}

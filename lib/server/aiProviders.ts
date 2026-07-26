/**
 * AI processing engine — Gemini Nano Banana Pro exclusively.
 *
 * Solid Color mode: flatten onto the user-chosen colour and return JPEG.
 * AI Studio mode: return JPEG with Gemini's generated backdrop.
 */

import sharp from "sharp";
import {
  generateStyledPortraitWithNanoBanana,
  isGeminiImageConfigured,
} from "@/lib/server/geminiImage";
import type { AiProvider, BackgroundMode, ProcessingMode } from "@/lib/types";

export interface ProcessResult {
  image: Buffer;
  provider: AiProvider;
  mimeType: "image/jpeg";
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export async function processPhoto(
  input: Buffer,
  mode: ProcessingMode,
  backgroundMode: BackgroundMode,
  backgroundColor: string,
  targetWidth: number,
  targetHeight: number,
): Promise<ProcessResult> {
  if (!isGeminiImageConfigured()) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Real AI processing requires a valid Google Gemini API key.",
    );
  }

  const styled = await generateStyledPortraitWithNanoBanana(
    input,
    mode,
    targetWidth,
    targetHeight,
    backgroundMode,
    backgroundColor,
  );

  const resized = sharp(styled).resize(targetWidth, targetHeight, {
    fit: "cover",
    position: "attention",
  });

  if (backgroundMode === "solid") {
    const bg = parseHex(backgroundColor);
    const jpeg = await resized
      .flatten({ background: bg })
      .jpeg({ quality: 92 })
      .toBuffer();
    return { image: jpeg, provider: "gemini", mimeType: "image/jpeg" };
  }

  const jpeg = await resized.jpeg({ quality: 92 }).toBuffer();
  return { image: jpeg, provider: "gemini", mimeType: "image/jpeg" };
}

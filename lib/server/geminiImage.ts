/**
 * Gemini Nano Banana Pro — exclusive image editing engine for ID photos.
 *
 * Uses `@google/genai` generateContent with the source portrait + text prompt.
 * Default model: gemini-3-pro-image (Nano Banana Pro).
 *
 * @see https://ai.google.dev/gemini-api/docs/models/gemini-3-pro-image
 */

import { GoogleGenAI, Modality } from "@google/genai";
import sharp from "sharp";
import { buildStylePrompt } from "@/lib/server/stylePrompts";
import type { BackgroundMode, ProcessingMode } from "@/lib/types";

/** Nano Banana Pro (override via GEMINI_IMAGE_MODEL). */
export const GEMINI_IMAGE_MODEL =
  process.env.GEMINI_IMAGE_MODEL || "gemini-3-pro-image";

const MAX_RETRIES = 4;
const BASE_DELAY_MS = 1200;

const ASPECT_RATIOS: Array<{ label: string; value: number }> = [
  { label: "1:1", value: 1 },
  { label: "3:4", value: 3 / 4 },
  { label: "4:5", value: 4 / 5 },
  { label: "2:3", value: 2 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "4:3", value: 4 / 3 },
  { label: "5:4", value: 5 / 4 },
  { label: "9:16", value: 9 / 16 },
  { label: "16:9", value: 16 / 9 },
];

export function isGeminiImageConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function closestAspectRatio(width: number, height: number): string {
  const target = width / height;
  let best = ASPECT_RATIOS[0];
  let bestDiff = Math.abs(target - best.value);
  for (const option of ASPECT_RATIOS) {
    const diff = Math.abs(target - option.value);
    if (diff < bestDiff) {
      best = option;
      bestDiff = diff;
    }
  }
  return best.label;
}

function detectMime(buffer: Buffer): string {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return "image/jpeg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return "image/png";
  return "image/jpeg";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();
  return (
    lower.includes("429") ||
    lower.includes("rate") ||
    lower.includes("quota") ||
    lower.includes("503") ||
    lower.includes("502") ||
    lower.includes("500") ||
    lower.includes("unavailable") ||
    lower.includes("timeout") ||
    lower.includes("econnreset") ||
    lower.includes("fetch failed") ||
    lower.includes("high demand") ||
    lower.includes("resource_exhausted")
  );
}

async function callGeminiOnce(
  apiKey: string,
  mimeType: string,
  base64: string,
  prompt: string,
  aspectRatio: string,
): Promise<Buffer> {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: GEMINI_IMAGE_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
      imageConfig: {
        aspectRatio,
        imageSize: "2K",
      },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const data = part.inlineData?.data;
    if (data) {
      return sharp(Buffer.from(data, "base64")).png().toBuffer();
    }
  }

  throw new Error("Gemini Nano Banana Pro returned no image.");
}

/**
 * Edit the source portrait with Gemini Nano Banana Pro.
 * Retries with exponential backoff. Never returns mock imagery.
 */
export async function generateStyledPortraitWithNanoBanana(
  input: Buffer,
  mode: ProcessingMode,
  targetWidth: number,
  targetHeight: number,
  backgroundMode: BackgroundMode,
  backgroundColor: string,
): Promise<Buffer> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Real AI processing requires a valid Google Gemini API key.",
    );
  }

  const mimeType = detectMime(input);
  const base64 = input.toString("base64");
  const aspectRatio = closestAspectRatio(targetWidth, targetHeight);
  const prompt = buildStylePrompt(mode, backgroundMode, backgroundColor);

  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await callGeminiOnce(apiKey, mimeType, base64, prompt, aspectRatio);
    } catch (err) {
      lastError = err;
      console.warn(
        `[geminiImage] attempt ${attempt + 1}/${MAX_RETRIES} failed:`,
        err,
      );
      if (attempt < MAX_RETRIES - 1 && isRetryableError(err)) {
        const delay =
          Math.min(BASE_DELAY_MS * 2 ** attempt, 16000) + Math.random() * 400;
        await sleep(delay);
        continue;
      }
      break;
    }
  }

  const detail =
    lastError instanceof Error ? lastError.message : "unknown error";
  throw new Error(
    `AI_HIGH_DEMAND: Gemini Nano Banana Pro unavailable after ${MAX_RETRIES} attempts (${detail})`,
  );
}

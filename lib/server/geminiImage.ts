/**
 * Gemini Nano Banana 2 Lite — exclusive image editing engine for ID photos.
 *
 * Uses `@google/genai` generateContent with the source portrait + text prompt.
 * Default model: gemini-3.1-flash-lite-image (Nano Banana 2 Lite) — Google's
 * fastest, lowest-cost image model, chosen here to minimize per-generation
 * API cost. It only supports 1K output resolution (see imageConfig below),
 * which is more than enough for passport/visa-size crops.
 *
 * @see https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite-image
 */

import { GoogleGenAI, Modality } from "@google/genai";
import sharp from "sharp";
import { buildStylePrompt } from "@/lib/server/stylePrompts";
import type { BackgroundMode, ProcessingMode } from "@/lib/types";

/** Nano Banana 2 Lite (override via GEMINI_IMAGE_MODEL). */
export const GEMINI_IMAGE_MODEL =
  process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-lite-image";

/**
 * gemini-3.1-flash-lite-image only supports 1K output (unlike the full
 * gemini-3.1-flash-image, which also supports 512/2K/4K) — requesting 2K
 * against the Lite model would be an invalid/ignored parameter. 1K is still
 * ample resolution for passport/visa photo crops and 4R print sheets, since
 * `processPhoto` (lib/server/aiProviders.ts) resizes to the exact target
 * pixel dimensions with sharp afterwards.
 */
const IMAGE_SIZE = "1K";

/**
 * A single attempt, no retries. Each attempt is a billed Gemini call, so
 * retrying on failure silently doubles/triples cost per user click. Fail
 * fast instead and let the user decide whether to click again.
 */
const MAX_RETRIES = 1;
const BASE_DELAY_MS = 1200;
/**
 * Bound a single Gemini attempt so a hung upstream call can't stall the
 * whole request past the serverless function's max duration.
 *
 * Image edits often take 10–25s; 35s was cutting off slow-but-valid calls.
 * The wrapper MUST abort the SDK fetch (not just reject a wrapper promise),
 * otherwise Next.js can keep the route open until the client/platform timeout.
 */
const ATTEMPT_TIMEOUT_MS = 90_000;
/** Longest edge sent to the 1K image model — smaller payload, faster edits. */
const GEMINI_INPUT_MAX_EDGE = 1024;

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run `fn` with an AbortSignal that fires after `ms`, also chaining any
 * parent signal (e.g. the incoming Next.js request aborting).
 */
async function withTimeout<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  ms: number,
  parentSignal?: AbortSignal,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  const onParentAbort = () => controller.abort();
  if (parentSignal) {
    if (parentSignal.aborted) controller.abort();
    else parentSignal.addEventListener("abort", onParentAbort, { once: true });
  }
  try {
    return await fn(controller.signal);
  } catch (err) {
    if (controller.signal.aborted && !parentSignal?.aborted) {
      throw new Error(`Gemini request timeout after ${ms}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
    parentSignal?.removeEventListener("abort", onParentAbort);
  }
}

/**
 * Depleted account billing/prepayment credits (Gemini "RESOURCE_EXHAUSTED"
 * with a billing-specific message). Unlike per-minute rate limiting, this
 * cannot resolve itself within the request's lifetime — retrying just
 * burns ~12s of the user's time on 4 guaranteed failures. Detected
 * separately so callers can fail fast instead of retrying.
 */
export function isQuotaExhaustedError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();
  return (
    lower.includes("resource_exhausted") &&
    (lower.includes("prepayment") ||
      lower.includes("billing") ||
      lower.includes("credits are depleted"))
  );
}

function isRetryableError(err: unknown): boolean {
  if (isQuotaExhaustedError(err)) return false;
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
  signal: AbortSignal,
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
      abortSignal: signal,
      responseModalities: [Modality.TEXT, Modality.IMAGE],
      imageConfig: {
        aspectRatio,
        imageSize: IMAGE_SIZE,
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

  throw new Error("Gemini Nano Banana 2 Lite returned no image.");
}

/**
 * Edit the source portrait with Gemini Nano Banana 2 Lite.
 * Single attempt, no retries (see MAX_RETRIES). Never returns mock imagery.
 */
export async function generateStyledPortraitWithNanoBanana(
  input: Buffer,
  mode: ProcessingMode,
  targetWidth: number,
  targetHeight: number,
  backgroundMode: BackgroundMode,
  backgroundColor: string,
  abortSignal?: AbortSignal,
): Promise<Buffer> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Real AI processing requires a valid Google Gemini API key.",
    );
  }

  const prepared = await sharp(input)
    .rotate()
    .resize(GEMINI_INPUT_MAX_EDGE, GEMINI_INPUT_MAX_EDGE, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 90 })
    .toBuffer();
  const mimeType = "image/jpeg";
  const base64 = prepared.toString("base64");
  const aspectRatio = closestAspectRatio(targetWidth, targetHeight);
  const prompt = buildStylePrompt(mode, backgroundMode, backgroundColor);

  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await withTimeout(
        (signal) =>
          callGeminiOnce(
            apiKey,
            mimeType,
            base64,
            prompt,
            aspectRatio,
            signal,
          ),
        ATTEMPT_TIMEOUT_MS,
        abortSignal,
      );
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
  if (isQuotaExhaustedError(lastError)) {
    throw new Error(
      `AI_QUOTA_EXHAUSTED: Gemini API billing credits are depleted (${detail})`,
    );
  }
  throw new Error(
    `AI_HIGH_DEMAND: Gemini Nano Banana 2 Lite unavailable (${detail})`,
  );
}

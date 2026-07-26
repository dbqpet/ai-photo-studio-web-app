/**
 * Shared Gemini ID-photo pre-validation.
 * Used by /api/validate-photo (client upload gate) and /api/process-photo
 * (server-side credit protection before Fal.ai).
 */

import type { ValidatePhotoResponse } from "@/lib/types";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

const VALIDATION_PROMPT = `You are a strict ID photo compliance checker. Analyse the attached photo and answer in JSON only, with exactly these keys:
{
  "person_count": <number of people visible>,
  "sunglasses_or_covered": <true if the (main) person wears sunglasses, a mask, or anything covering a significant part of the face>,
  "face_clearly_visible": <true if a human face is clearly visible, well lit, mostly front-facing and in focus>,
  "suitable": <true only if person_count is exactly 1, sunglasses_or_covered is false, and face_clearly_visible is true>,
  "reason": "<one short user-facing sentence explaining the verdict; if unsuitable, say what to fix>"
}
Respond with JSON only, no other text.`;

interface GeminiVerdict {
  person_count: number;
  sunglasses_or_covered: boolean;
  face_clearly_visible: boolean;
  suitable: boolean;
  reason: string;
}

function parseDataUrl(dataUrl: string): { mimeType: string; base64: string } {
  const match = /^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("imageDataUrl must be a base64 JPEG/PNG/WebP data URL.");
  return { mimeType: match[1], base64: match[2] };
}

function extractJson(text: string): GeminiVerdict {
  const cleaned = text.replace(/```(?:json)?/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found in Gemini response.");
  return JSON.parse(cleaned.slice(start, end + 1)) as GeminiVerdict;
}

/** True when GEMINI_API_KEY is set so validation can run. */
export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * Run Gemini suitability checks. When the key is missing, returns
 * `configured: false` and `suitable: true` so local mock flows still work.
 */
export async function validatePhotoWithGemini(
  imageDataUrl: string,
): Promise<ValidatePhotoResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      configured: false,
      suitable: true,
      personCount: 1,
      sunglassesOrCovered: false,
      faceClearlyVisible: true,
      reason: "AI pre-validation skipped (GEMINI_API_KEY not configured).",
    };
  }

  const image = parseDataUrl(imageDataUrl);
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: VALIDATION_PROMPT },
              { inline_data: { mime_type: image.mimeType, data: image.base64 } },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0,
        },
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`Gemini request failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = json.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("");
  if (!text) throw new Error("Gemini returned no text.");

  const verdict = extractJson(text);
  return {
    configured: true,
    suitable: Boolean(verdict.suitable),
    personCount: Number(verdict.person_count) || 0,
    sunglassesOrCovered: Boolean(verdict.sunglasses_or_covered),
    faceClearlyVisible: Boolean(verdict.face_clearly_visible),
    reason:
      verdict.reason ||
      "Please upload a clear, single-person photo without sunglasses.",
  };
}

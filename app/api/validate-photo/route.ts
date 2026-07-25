import { NextRequest, NextResponse } from "next/server";
import type { ValidatePhotoRequest, ValidatePhotoResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Smart pre-validation via Google Gemini, run BEFORE any generative
 * processing so unsuitable photos never consume fal.ai credits.
 *
 * Checks: exactly one person, no sunglasses / face coverings, and a clearly
 * visible face suitable for an ID photo.
 */

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
  // The model is asked for pure JSON, but strip code fences defensively.
  const cleaned = text.replace(/```(?:json)?/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found in Gemini response.");
  return JSON.parse(cleaned.slice(start, end + 1)) as GeminiVerdict;
}

export async function POST(req: NextRequest) {
  let body: ValidatePhotoRequest;
  try {
    body = (await req.json()) as ValidatePhotoRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Validation is skipped when Gemini is not configured; the flow proceeds.
    const response: ValidatePhotoResponse = {
      configured: false,
      suitable: true,
      personCount: 1,
      sunglassesOrCovered: false,
      faceClearlyVisible: true,
      reason: "AI pre-validation skipped (GEMINI_API_KEY not configured).",
    };
    return NextResponse.json(response);
  }

  let image: { mimeType: string; base64: string };
  try {
    image = parseDataUrl(body.imageDataUrl ?? "");
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid image." },
      { status: 400 },
    );
  }

  try {
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

    const response: ValidatePhotoResponse = {
      configured: true,
      suitable: Boolean(verdict.suitable),
      personCount: Number(verdict.person_count) || 0,
      sunglassesOrCovered: Boolean(verdict.sunglasses_or_covered),
      faceClearlyVisible: Boolean(verdict.face_clearly_visible),
      reason:
        verdict.reason ||
        "Please upload a clear, single-person photo without sunglasses.",
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[validate-photo] Gemini validation failed:", err);
    // Fail open: a validation outage should not block the whole product.
    const response: ValidatePhotoResponse = {
      configured: true,
      suitable: true,
      personCount: 1,
      sunglassesOrCovered: false,
      faceClearlyVisible: true,
      reason: "AI pre-validation unavailable — proceeding without it.",
    };
    return NextResponse.json(response);
  }
}

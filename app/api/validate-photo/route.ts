import { NextRequest, NextResponse } from "next/server";
import { validatePhotoWithGemini } from "@/lib/server/geminiValidate";
import type { ValidatePhotoRequest, ValidatePhotoResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Smart pre-validation via Google Gemini, run BEFORE any image generation
 * so unsuitable photos never consume Gemini / Fal credits.
 *
 * Checks: exactly one person, no sunglasses / face coverings, and a clearly
 * visible face suitable for an ID photo.
 */

export async function POST(req: NextRequest) {
  let body: ValidatePhotoRequest;
  try {
    body = (await req.json()) as ValidatePhotoRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const response = await validatePhotoWithGemini(body.imageDataUrl ?? "");
    return NextResponse.json(response);
  } catch (err) {
    console.error("[validate-photo] Gemini validation failed:", err);
    // Fail open on the client upload step so a transient Gemini outage
    // does not brick the product; /api/process-photo re-checks before Fal.
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

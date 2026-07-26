import { NextRequest, NextResponse } from "next/server";
import { processPhoto } from "@/lib/server/aiProviders";
import {
  requireGenerationCredit,
  spendGenerationCredit,
} from "@/lib/server/credits";
import { isGeminiImageConfigured } from "@/lib/server/geminiImage";
import {
  isGeminiConfigured,
  validatePhotoWithGemini,
} from "@/lib/server/geminiValidate";
import { createClient } from "@/lib/supabase/server";
import {
  HIGH_DEMAND_MESSAGE,
  type BackgroundMode,
  type ProcessPhotoRequest,
  type ProcessPhotoResponse,
  type ProcessingMode,
} from "@/lib/types";

export const runtime = "nodejs";
/** Gemini Nano Banana Pro image edits + retries can take a while. */
export const maxDuration = 180;

const VALID_MODES: ProcessingMode[] = ["classic", "korean", "corporate"];
const VALID_BG_MODES: BackgroundMode[] = ["solid", "studio"];
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const MAX_DIMENSION = 4000;

function dataUrlToBuffer(dataUrl: string): Buffer {
  const match = /^data:image\/(?:jpeg|jpg|png|webp);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("imageDataUrl must be a base64 JPEG/PNG/WebP data URL.");
  return Buffer.from(match[1], "base64");
}

function isHighDemandError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("AI_HIGH_DEMAND") ||
    msg.includes("429") ||
    msg.includes("rate") ||
    msg.includes("quota") ||
    msg.includes("503") ||
    msg.includes("unavailable")
  );
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function POST(req: NextRequest) {
  let body: ProcessPhotoRequest;
  try {
    body = (await req.json()) as ProcessPhotoRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const {
    imageDataUrl,
    mode,
    backgroundMode = "studio",
    backgroundColor,
    targetWidth,
    targetHeight,
  } = body;

  // Auth + credit gate — generation requires a logged-in user with credits > 0.
  const supabase = isSupabaseConfigured() ? await createClient() : null;
  if (supabase) {
    const gate = await requireGenerationCredit(supabase);
    if (!gate.ok) {
      return NextResponse.json(
        { error: gate.error, code: gate.code },
        { status: gate.status },
      );
    }
  }

  if (!isGeminiImageConfigured()) {
    return NextResponse.json(
      {
        error:
          "Gemini AI is not configured. Please set GEMINI_API_KEY to generate photos.",
        highDemand: false,
      },
      { status: 503 },
    );
  }

  if (!VALID_MODES.includes(mode)) {
    return NextResponse.json(
      { error: `mode must be one of: ${VALID_MODES.join(", ")}` },
      { status: 400 },
    );
  }
  if (!VALID_BG_MODES.includes(backgroundMode)) {
    return NextResponse.json(
      { error: `backgroundMode must be one of: ${VALID_BG_MODES.join(", ")}` },
      { status: 400 },
    );
  }
  if (backgroundMode === "solid" && !HEX_COLOR.test(backgroundColor ?? "")) {
    return NextResponse.json(
      { error: "backgroundColor must be a #RRGGBB hex value for Solid Color Background mode." },
      { status: 400 },
    );
  }
  if (
    !Number.isInteger(targetWidth) ||
    !Number.isInteger(targetHeight) ||
    targetWidth < 100 ||
    targetHeight < 100 ||
    targetWidth > MAX_DIMENSION ||
    targetHeight > MAX_DIMENSION
  ) {
    return NextResponse.json(
      { error: `target dimensions must be integers between 100 and ${MAX_DIMENSION}px.` },
      { status: 400 },
    );
  }

  let source: Buffer;
  try {
    source = dataUrlToBuffer(imageDataUrl ?? "");
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid image." },
      { status: 400 },
    );
  }

  // Optional pre-validation — generation still proceeds if this check errors.
  if (isGeminiConfigured()) {
    try {
      const verdict = await validatePhotoWithGemini(imageDataUrl);
      if (!verdict.suitable) {
        return NextResponse.json(
          {
            error:
              verdict.reason ||
              "Please upload a clear, single-person photo without sunglasses.",
          },
          { status: 422 },
        );
      }
    } catch (err) {
      console.error("[process-photo] Gemini pre-check failed:", err);
    }
  }

  try {
    const { image, provider, mimeType } = await processPhoto(
      source,
      mode,
      backgroundMode,
      backgroundColor ?? "#FFFFFF",
      targetWidth,
      targetHeight,
    );

    let remainingCredits: number | undefined;
    if (supabase) {
      const spend = await spendGenerationCredit(supabase);
      if (!spend.ok) {
        // Generation succeeded but credit spend raced to zero — still return the image.
        console.error("[process-photo] credit spend failed after generation:", spend);
      } else {
        remainingCredits = spend.credits;
      }
    }

    const response: ProcessPhotoResponse = {
      imageDataUrl: `data:${mimeType};base64,${image.toString("base64")}`,
      provider,
      mode,
      backgroundMode,
      creditsRemaining: remainingCredits,
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[process-photo] processing failed:", err);
    if (isHighDemandError(err)) {
      return NextResponse.json(
        { error: HIGH_DEMAND_MESSAGE, highDemand: true },
        { status: 503 },
      );
    }
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Photo processing failed. Please try again.",
        highDemand: false,
      },
      { status: 502 },
    );
  }
}

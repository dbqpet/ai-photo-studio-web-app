import { NextRequest, NextResponse } from "next/server";
import { processPhoto } from "@/lib/server/aiProviders";
import {
  requirePreviewCredit,
  spendPreviewCredit,
} from "@/lib/server/credits";
import { isGeminiImageConfigured } from "@/lib/server/geminiImage";
import { createClient } from "@/lib/supabase/server";
import {
  AI_SERVICE_UNAVAILABLE_MESSAGE,
  HIGH_DEMAND_MESSAGE,
  type BackgroundMode,
  type ProcessPhotoRequest,
  type ProcessPhotoResponse,
  type ProcessingMode,
} from "@/lib/types";

export const runtime = "nodejs";
/** Gemini Nano Banana 2 Lite image edits (single attempt) can take a while. */
export const maxDuration = 180;

const VALID_MODES: ProcessingMode[] = ["classic", "korean", "corporate"];
const VALID_BG_MODES: BackgroundMode[] = ["solid", "studio"];
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const MAX_DIMENSION = 4000;

const AI_FAILURE_MESSAGE =
  "AI generation failed, no credits were deducted.";

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

/** Depleted Gemini API billing — distinct from transient "high demand". */
function isQuotaExhaustedError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("AI_QUOTA_EXHAUSTED");
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function POST(req: NextRequest) {
  try {
    return await handleProcessPhoto(req);
  } catch (err) {
    // Unhandled throws otherwise become an HTML error document in production,
    // which the client then fails to parse (`Unexpected token '<'`).
    console.error("[process-photo] unhandled:", err);
    return NextResponse.json(
      { error: AI_FAILURE_MESSAGE, highDemand: false },
      { status: 500 },
    );
  }
}

async function handleProcessPhoto(req: NextRequest) {
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

  // 1) Preview-credit check FIRST — never call AI when preview_credits <= 0.
  const supabase = isSupabaseConfigured() ? await createClient() : null;
  if (supabase) {
    const gate = await requirePreviewCredit(supabase);
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

  // Standalone Gemini pre-validation call intentionally disabled here to
  // avoid burning a second Gemini API call per click — generation below
  // (processPhoto) handles suitability directly. /api/validate-photo still
  // uses validatePhotoWithGemini for the client-side upload gate.

  // 2) Generate image FIRST — do not deduct preview credits yet.
  let image: Buffer;
  let provider: ProcessPhotoResponse["provider"];
  let mimeType: string;
  try {
    const result = await processPhoto(
      source,
      mode,
      backgroundMode,
      backgroundColor ?? "#FFFFFF",
      targetWidth,
      targetHeight,
      req.signal,
    );
    image = result.image;
    provider = result.provider;
    mimeType = result.mimeType;
  } catch (err) {
    // 4) AI failure — never deduct preview credits.
    console.error("[process-photo] processing failed:", err);
    if (isQuotaExhaustedError(err)) {
      // Billing outage, not transient load — don't tell the user "please be
      // patient, we're retrying" since retrying will not help here.
      return NextResponse.json(
        { error: AI_SERVICE_UNAVAILABLE_MESSAGE, highDemand: false },
        { status: 503 },
      );
    }
    if (isHighDemandError(err)) {
      return NextResponse.json(
        {
          error: `${HIGH_DEMAND_MESSAGE} No credits were deducted.`,
          highDemand: true,
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      {
        error: AI_FAILURE_MESSAGE,
        highDemand: false,
      },
      { status: 502 },
    );
  }

  // 3) Deduct preview credit ONLY after successful AI generation.
  // Watermark / downsample for preview is applied client-side on the returned image.
  let remainingCredits: number | undefined;
  if (supabase) {
    const spend = await spendPreviewCredit(supabase);
    if (!spend.ok) {
      console.error(
        "[process-photo] preview credit spend failed after successful generation:",
        spend,
      );
    } else {
      remainingCredits = spend.previewCredits;
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
}

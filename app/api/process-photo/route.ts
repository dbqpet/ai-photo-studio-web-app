import { NextRequest, NextResponse } from "next/server";
import { processCutout } from "@/lib/server/aiProviders";
import { finalizeIdPhoto } from "@/lib/server/stylePipeline";
import type { ProcessPhotoRequest, ProcessPhotoResponse, ProcessingMode } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const VALID_MODES: ProcessingMode[] = ["classic", "korean", "corporate"];
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const MAX_DIMENSION = 4000;

function dataUrlToBuffer(dataUrl: string): Buffer {
  const match = /^data:image\/(?:jpeg|jpg|png|webp);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("imageDataUrl must be a base64 JPEG/PNG/WebP data URL.");
  return Buffer.from(match[1], "base64");
}

export async function POST(req: NextRequest) {
  let body: ProcessPhotoRequest;
  try {
    body = (await req.json()) as ProcessPhotoRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { imageDataUrl, mode, backgroundColor, targetWidth, targetHeight } = body;

  if (!VALID_MODES.includes(mode)) {
    return NextResponse.json(
      { error: `mode must be one of: ${VALID_MODES.join(", ")}` },
      { status: 400 },
    );
  }
  if (!HEX_COLOR.test(backgroundColor ?? "")) {
    return NextResponse.json(
      { error: "backgroundColor must be a #RRGGBB hex value." },
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

  try {
    const { png, provider, styleApplied, fallbackReason } = await processCutout(
      source,
      mode,
    );
    const finalJpeg = await finalizeIdPhoto(png, {
      mode,
      backgroundColor,
      targetWidth,
      targetHeight,
      skipStyle: styleApplied,
    });
    const response: ProcessPhotoResponse = {
      imageDataUrl: `data:image/jpeg;base64,${finalJpeg.toString("base64")}`,
      provider,
      mode,
      fallbackReason,
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[process-photo] processing failed:", err);
    return NextResponse.json(
      { error: "Photo processing failed. Please try a different photo." },
      { status: 502 },
    );
  }
}

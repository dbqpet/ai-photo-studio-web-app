import { NextRequest, NextResponse } from "next/server";
import { unlockGenerationIdempotent } from "@/lib/server/credits";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Authorize an HD download for a specific generation_id (idempotent).
 * - Already unlocked for THIS generation → no token deduction
 * - Not unlocked → spend 1 hd_unlock then mark this generation unlocked
 *
 * Never authorizes based on a prior upload / older generation.
 * Clean image bytes stay client-side; frontend builds the ZIP after ok.
 */
export async function POST(req: NextRequest) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  let body: { generationId?: string; photoId?: string };
  try {
    body = (await req.json()) as { generationId?: string; photoId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const generationId = (body.generationId ?? body.photoId)?.trim();
  if (!generationId) {
    return NextResponse.json(
      { error: "generationId is required.", code: "INVALID_GENERATION_ID" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const spend = await unlockGenerationIdempotent(supabase, generationId, {
    source: "token",
    requireToken: true,
  });
  if (!spend.ok) {
    return NextResponse.json(
      { error: spend.error, code: spend.code },
      { status: spend.status },
    );
  }

  return NextResponse.json({
    ok: true,
    generationId,
    alreadyUnlocked: spend.alreadyUnlocked ?? false,
    hdUnlocksRemaining: spend.hdUnlocks,
  });
}

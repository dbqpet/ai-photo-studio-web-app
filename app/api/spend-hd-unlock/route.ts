import { NextResponse } from "next/server";
import { spendHdUnlock } from "@/lib/server/credits";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Spend one HD unlock before the client releases watermark-free downloads.
 * The clean image bytes stay client-side; this endpoint only authorizes the unlock.
 */
export async function POST() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const spend = await spendHdUnlock(supabase);
  if (!spend.ok) {
    return NextResponse.json(
      { error: spend.error, code: spend.code },
      { status: spend.status },
    );
  }

  return NextResponse.json({
    ok: true,
    hdUnlocksRemaining: spend.hdUnlocks,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { unlockGenerationIdempotent } from "@/lib/server/credits";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mark a generation unlocked after a successful Stripe payment.
 * Used when returning from checkout with ?payment=success&generation_id=...
 *
 * The $4.99 "Unlock HD & 4R Print Sheet" purchase grants +1 banked
 * hd_unlock (via /api/verify-payment, called by the client right before
 * this route) and this call immediately spends that same token to unlock
 * THIS generation. Net effect of the purchase: 0 change to the hd_unlocks
 * bank (received 1, spent 1 here) + 3 bonus preview credits kept + this
 * photo permanently unlocked — not a free extra banked token on top of a
 * free unlock, which is what happened before this required a token.
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

  let body: {
    generationId?: string;
    photoId?: string;
    sessionId?: string;
  };
  try {
    body = (await req.json()) as {
      generationId?: string;
      photoId?: string;
      sessionId?: string;
    };
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
  let result = await unlockGenerationIdempotent(supabase, generationId, {
    source: "payment",
    requireToken: true,
  });

  // NO_HD_UNLOCKS here almost always means the grant from /api/verify-payment
  // (awaited by the client right before this call) hasn't committed yet —
  // retry once after a short delay instead of immediately giving up on the
  // token spend, since that's the exact scenario this route exists for.
  if (!result.ok && result.code === "NO_HD_UNLOCKS") {
    console.warn(
      `[mark-photo-unlocked] NO_HD_UNLOCKS on first attempt for generation=${generationId}, retrying once after 900ms`,
    );
    await sleep(900);
    result = await unlockGenerationIdempotent(supabase, generationId, {
      source: "payment",
      requireToken: true,
    });
  }

  if (!result.ok) {
    // Last-resort fallback with service role so a confirmed paid user is
    // never blocked from their photo. This is NOT the happy path — it means
    // the token spend above genuinely failed (even after the retry), so log
    // loudly with the real reason instead of silently eating it, otherwise
    // "HD token never deducted" bugs like this are invisible in prod logs.
    if (
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      result.code !== "NOT_AUTHENTICATED"
    ) {
      console.error(
        `[mark-photo-unlocked] RPC token spend failed (code=${result.code}, error=${result.error}) for generation=${generationId} — attempting a direct admin unlock via unlock_generation_admin before falling back to a free unlock.`,
      );
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const admin = createAdminClient();

          // Single atomic call: claims (user, generation) and spends the
          // token in one DB transaction — same function the webhook uses,
          // so this can never double-spend against a concurrent webhook
          // call for the same purchase (see migrations/009).
          const { data: rpcData, error: rpcError } = await admin.rpc(
            "unlock_generation_admin",
            {
              target_user_id: user.id,
              p_generation_id: generationId,
              p_source: "payment",
              p_require_token: true,
            },
          );

          if (rpcError) {
            console.error(
              "[mark-photo-unlocked] unlock_generation_admin RPC failed (run supabase/migrations/009_unlock_generation_admin.sql?):",
              rpcError,
            );
            // Legacy last-resort so a confirmed paid user is never blocked —
            // no token spend here, this should be rare and is logged loudly.
            await admin.from("unlocked_photos").upsert(
              { user_id: user.id, generation_id: generationId, source: "payment" },
              { onConflict: "user_id,generation_id" },
            );
            const { data: profile } = await admin
              .from("profiles")
              .select("hd_unlocks")
              .eq("id", user.id)
              .maybeSingle();
            console.error(
              `[mark-photo-unlocked] admin fallback unlocked generation=${generationId} WITHOUT a token spend (hd_unlocks=${profile?.hd_unlocks ?? "?"}). This should be rare — investigate the RPC failure above.`,
            );
            return NextResponse.json({
              ok: true,
              generationId,
              alreadyUnlocked: false,
              hdUnlocksRemaining: profile?.hd_unlocks ?? undefined,
            });
          }

          const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
          if (row?.already_unlocked) {
            console.log(
              `[mark-photo-unlocked] generation=${generationId} was already unlocked (webhook likely won the race) — no spend needed here.`,
            );
          }
          return NextResponse.json({
            ok: true,
            generationId,
            alreadyUnlocked: Boolean(row?.already_unlocked),
            hdUnlocksRemaining: row?.out_hd_unlocks,
          });
        }
      } catch (err) {
        console.error("[mark-photo-unlocked] admin fallback failed:", err);
      }
    }
    return NextResponse.json(
      { error: result.error, code: result.code },
      { status: result.status },
    );
  }

  return NextResponse.json({
    ok: true,
    generationId,
    alreadyUnlocked: result.alreadyUnlocked ?? false,
    hdUnlocksRemaining: result.hdUnlocks,
  });
}

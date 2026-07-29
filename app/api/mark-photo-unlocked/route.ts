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
        `[mark-photo-unlocked] RPC token spend failed (code=${result.code}, error=${result.error}) for generation=${generationId} — attempting a direct admin token spend before falling back to a free unlock.`,
      );
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const admin = createAdminClient();

          // Try a real admin-privileged spend first (bypasses whatever made
          // the user-scoped RPC above fail, e.g. a stale RPC signature) so
          // this fallback still deducts hd_unlocks whenever a token is
          // actually available — it should only ever grant a free unlock if
          // there truly isn't one, which would itself be worth investigating.
          let hdUnlocksRemaining: number | undefined;
          try {
            const { data: rpcSpend, error: rpcError } = await admin.rpc(
              "spend_hd_unlock_admin",
              { target_user_id: user.id },
            );
            if (rpcError) throw rpcError;
            hdUnlocksRemaining =
              rpcSpend === null ? undefined : (rpcSpend as number);
          } catch (spendErr) {
            console.error(
              "[mark-photo-unlocked] spend_hd_unlock_admin RPC failed (run supabase/migrations/008_spend_hd_unlock_admin.sql?):",
              spendErr,
            );
          }

          const upsertNew = await admin.from("unlocked_photos").upsert(
            {
              user_id: user.id,
              generation_id: generationId,
              source: "payment",
            },
            { onConflict: "user_id,generation_id" },
          );
          if (upsertNew.error) {
            await admin.from("unlocked_photos").upsert(
              {
                user_id: user.id,
                photo_id: generationId,
                source: "payment",
              },
              { onConflict: "user_id,photo_id" },
            );
          }
          if (hdUnlocksRemaining === undefined) {
            const { data: profile } = await admin
              .from("profiles")
              .select("hd_unlocks")
              .eq("id", user.id)
              .maybeSingle();
            hdUnlocksRemaining = profile?.hd_unlocks ?? undefined;
            console.error(
              `[mark-photo-unlocked] admin fallback unlocked generation=${generationId} WITHOUT a token spend (hd_unlocks=${hdUnlocksRemaining}). This should be rare — investigate the RPC failure above.`,
            );
          }
          return NextResponse.json({
            ok: true,
            generationId,
            alreadyUnlocked: false,
            hdUnlocksRemaining,
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

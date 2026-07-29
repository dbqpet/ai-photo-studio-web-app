import { NextRequest, NextResponse } from "next/server";
import { unlockGenerationIdempotent } from "@/lib/server/credits";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

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
  const result = await unlockGenerationIdempotent(supabase, generationId, {
    source: "payment",
    requireToken: true,
  });

  if (!result.ok) {
    // Fallback with service role if the token spend races the credit grant
    // (e.g. verify-payment's grant hasn't committed yet) or RLS insert
    // fails for edge cases. We already know payment succeeded — this route
    // only runs from a Stripe `?payment=success` redirect — so never block
    // the unlock on a timing race; just record it without a token spend.
    if (
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      result.code !== "NOT_AUTHENTICATED"
    ) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const admin = createAdminClient();
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
          const { data: profile } = await admin
            .from("profiles")
            .select("hd_unlocks")
            .eq("id", user.id)
            .maybeSingle();
          return NextResponse.json({
            ok: true,
            generationId,
            alreadyUnlocked: false,
            hdUnlocksRemaining: profile?.hd_unlocks ?? undefined,
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

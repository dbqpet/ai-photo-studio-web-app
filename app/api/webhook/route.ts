import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { grantUnlockPackOnceForSession } from "@/lib/server/credits";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Stripe webhook — durable record of successful payments.
 *
 * Every purchase ($4.99) grants: +{PRICING.previewCreditsBonus} preview_credits
 * and +{PRICING.hdUnlocksPerPurchase} hd_unlocks (banked for future downloads).
 * unlock_photo additionally marks the specific generation_id unlocked instantly.
 *
 * The grant is deduped per Checkout session id (see
 * grantUnlockPackOnceForSession) because /api/verify-payment also attempts
 * the same grant as a client-triggered fallback — whichever fires first
 * wins, so credits are never doubled or silently lost if this webhook is
 * delayed or not reachable (e.g. `stripe listen` not running locally).
 */
export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 501 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const rawType = session.metadata?.type || session.metadata?.intent;
    const intent = rawType === "topup" ? "topup" : "unlock_photo";
    const generationId =
      session.metadata?.generationId || session.metadata?.photoId;
    console.log(
      `[webhook] payment completed: session=${session.id} intent=${intent} generation=${generationId ?? "-"}`,
    );

    const userId = session.metadata?.user_id || session.metadata?.userId;
    if (userId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const admin = createAdminClient();
        const granted = await grantUnlockPackOnceForSession(admin, {
          sessionId: session.id,
          userId,
        });
        console.log(
          `[webhook] ${granted.granted ? "granted" : "already granted (deduped)"} pack to user=${userId} intent=${intent} preview=${granted.previewCredits} hd=${granted.hdUnlocks}`,
        );

        if (intent === "unlock_photo" && generationId) {
          const upsertNew = await admin.from("unlocked_photos").upsert(
            {
              user_id: userId,
              generation_id: generationId,
              source: "payment",
            },
            { onConflict: "user_id,generation_id" },
          );
          if (upsertNew.error) {
            await admin.from("unlocked_photos").upsert(
              {
                user_id: userId,
                photo_id: generationId,
                source: "payment",
              },
              { onConflict: "user_id,photo_id" },
            );
          }
        }
      } catch (err) {
        console.error("[webhook] unlock pack grant failed:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}

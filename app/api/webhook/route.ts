import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { grantUnlockPackAdmin } from "@/lib/server/credits";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Stripe webhook — durable record of successful payments.
 *
 * - topup: +5 preview_credits and +1 hd_unlock
 * - unlock_photo: +5 preview_credits + mark generation_id unlocked (no hd token spend)
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
    const intent = session.metadata?.intent === "topup" ? "topup" : "unlock_photo";
    const generationId =
      session.metadata?.generationId || session.metadata?.photoId;
    console.log(
      `[webhook] payment completed: session=${session.id} intent=${intent} generation=${generationId ?? "-"}`,
    );

    const userId = session.metadata?.userId;
    if (userId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const admin = createAdminClient();
        const granted = await grantUnlockPackAdmin(admin, userId, null, {
          includeHdUnlock: intent === "topup",
        });
        console.log(
          `[webhook] granted pack to user=${userId} intent=${intent} preview=${granted.previewCredits} hd=${granted.hdUnlocks}`,
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

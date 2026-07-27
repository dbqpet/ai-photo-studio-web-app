import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRICING } from "@/lib/pricing";
import { grantUnlockPackAdmin } from "@/lib/server/credits";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Stripe webhook — durable record of successful payments.
 *
 * On `checkout.session.completed` for the Single Photo Unlock Package:
 * - Grant instant HD download for that purchase (client success page)
 * - preview_credits += 5 (bonus only — do NOT bank hd_unlocks)
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
    console.log(
      `[webhook] payment completed: session=${session.id} preset=${session.metadata?.presetId} mode=${session.metadata?.mode}`,
    );

    const userId = session.metadata?.userId;
    if (userId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const admin = createAdminClient();
        const granted = await grantUnlockPackAdmin(admin, userId);
        console.log(
          `[webhook] granted preview bonus to user=${userId} preview=${granted.previewCredits}`,
        );
      } catch (err) {
        console.error("[webhook] unlock pack grant failed:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}

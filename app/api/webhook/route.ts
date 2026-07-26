import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRICING } from "@/lib/pricing";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Stripe webhook — the durable record of successful payments.
 *
 * On `checkout.session.completed`:
 * - Client may download watermark-free files via /success + verify-payment
 * - Signed-in buyers receive generation credits on their profile
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
        const amount = Number(
          session.metadata?.creditsToGrant ?? PRICING.creditsPerPurchase,
        );
        const admin = createAdminClient();
        const { error } = await admin.rpc("add_credits", {
          target_user_id: userId,
          amount: Number.isFinite(amount) ? amount : PRICING.creditsPerPurchase,
        });
        if (error) {
          // Fallback if RPC is missing: direct update.
          const { data: profile } = await admin
            .from("profiles")
            .select("credits")
            .eq("id", userId)
            .maybeSingle();
          const next =
            (profile?.credits ?? 0) +
            (Number.isFinite(amount) ? amount : PRICING.creditsPerPurchase);
          await admin.from("profiles").upsert({
            id: userId,
            credits: next,
            updated_at: new Date().toISOString(),
          });
          console.log(
            `[webhook] granted credits via upsert to user=${userId} credits=${next}`,
          );
        } else {
          console.log(
            `[webhook] granted ${amount} credits to user=${userId}`,
          );
        }
      } catch (err) {
        console.error("[webhook] credit grant failed:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}

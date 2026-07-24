import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

/**
 * Stripe webhook — the durable record of successful payments.
 *
 * On `checkout.session.completed` the purchase is fulfilled: the client is
 * entitled to the watermark-free high-res download (delivered on the
 * /success page after `/api/verify-payment` confirms the session).
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
  }

  return NextResponse.json({ received: true });
}

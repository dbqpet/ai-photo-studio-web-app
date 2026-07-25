import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import type { VerifyPaymentResponse } from "@/lib/types";

export const runtime = "nodejs";

/**
 * Confirms a Checkout session was paid before the client unlocks the
 * watermark-free download. Complements the webhook (the durable payment
 * record) for the interactive post-payment redirect.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required." }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    // Mock mode: any session issued by the mock checkout counts as paid.
    const response: VerifyPaymentResponse = {
      paid: sessionId === "mock_session",
      mock: true,
    };
    return NextResponse.json(response);
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const response: VerifyPaymentResponse = {
      paid: session.payment_status === "paid",
      mock: false,
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[verify-payment] failed:", err);
    return NextResponse.json({ error: "Could not verify payment." }, { status: 502 });
  }
}

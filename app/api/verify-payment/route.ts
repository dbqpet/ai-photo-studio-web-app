import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRICING } from "@/lib/pricing";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { VerifyPaymentResponse } from "@/lib/types";

export const runtime = "nodejs";

async function grantCreditsToCurrentUser(): Promise<void> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createAdminClient();
    const { error } = await admin.rpc("add_credits", {
      target_user_id: user.id,
      amount: PRICING.creditsPerPurchase,
    });
    if (!error) return;

    const { data: profile } = await admin
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .maybeSingle();
    await admin.from("profiles").upsert({
      id: user.id,
      email: user.email,
      credits: (profile?.credits ?? 0) + PRICING.creditsPerPurchase,
      updated_at: new Date().toISOString(),
    });
  }
}

/**
 * Confirms a Checkout session was paid before the client unlocks the
 * watermark-free download. Complements the webhook (the durable payment
 * record) for the interactive post-payment redirect.
 *
 * In mock mode (no STRIPE_SECRET_KEY), also grants credits to the signed-in
 * user so local auth/credit flows are testable end-to-end.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required." }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    const paid = sessionId === "mock_session";
    if (paid) {
      try {
        await grantCreditsToCurrentUser();
      } catch (err) {
        console.error("[verify-payment] mock credit grant failed:", err);
      }
    }
    const response: VerifyPaymentResponse = {
      paid,
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

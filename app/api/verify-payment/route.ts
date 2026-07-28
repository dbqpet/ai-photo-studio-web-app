import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { grantUnlockPackAdmin } from "@/lib/server/credits";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { VerifyPaymentResponse } from "@/lib/types";

export const runtime = "nodejs";

async function grantPackToCurrentUser(includeHdUnlock: boolean): Promise<void> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const admin = createAdminClient();
  await grantUnlockPackAdmin(admin, user.id, user.email, { includeHdUnlock });
}

/**
 * Confirms a Checkout session was paid before the client unlocks downloads.
 *
 * In mock mode (no STRIPE_SECRET_KEY), also grants the pack so local
 * auth / credit flows are testable end-to-end.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const intent = req.nextUrl.searchParams.get("intent");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required." }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    const paid = sessionId === "mock_session";
    if (paid) {
      try {
        // Top-up banks an HD unlock; photo unlock only adds preview bonus.
        await grantPackToCurrentUser(intent === "topup");
      } catch (err) {
        console.error("[verify-payment] mock unlock pack grant failed:", err);
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

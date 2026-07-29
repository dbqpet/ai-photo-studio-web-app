import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { grantUnlockPackOnceForSession } from "@/lib/server/credits";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { VerifyPaymentResponse } from "@/lib/types";

export const runtime = "nodejs";

/**
 * Client-triggered fallback grant, deduped per session id via
 * grantUnlockPackOnceForSession. Safe to call even if the Stripe webhook
 * already granted (or will grant) the same session — this exists because
 * webhook delivery can be delayed, misconfigured, or (in local dev)
 * unreachable entirely without `stripe listen` running.
 */
async function grantPackToCurrentUser(sessionId: string): Promise<void> {
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
  const granted = await grantUnlockPackOnceForSession(admin, {
    sessionId,
    userId: user.id,
    email: user.email,
  });
  console.log(
    `[verify-payment] ${granted.granted ? "granted" : "already granted (deduped)"} pack to user=${user.id} session=${sessionId} preview=${granted.previewCredits} hd=${granted.hdUnlocks}`,
  );
}

/**
 * Confirms a Checkout session was paid before the client unlocks downloads.
 * Also grants the credit pack as a fallback (deduped per session id) so a
 * paid session never leaves the user without their tokens, even if the
 * Stripe webhook hasn't fired yet.
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
        await grantPackToCurrentUser(sessionId);
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
    const paid = session.payment_status === "paid";
    if (paid) {
      try {
        await grantPackToCurrentUser(session.id);
      } catch (err) {
        console.error("[verify-payment] unlock pack grant failed:", err);
      }
    }
    const response: VerifyPaymentResponse = {
      paid,
      mock: false,
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[verify-payment] failed:", err);
    return NextResponse.json({ error: "Could not verify payment." }, { status: 502 });
  }
}

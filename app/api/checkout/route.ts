import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import type { CheckoutRequest, CheckoutResponse } from "@/lib/types";
import { getPresetById } from "@/constants/photoSizes";

export const runtime = "nodejs";

/** Price of the high-res, watermark-free download: $18 HKD. */
export const PRICE_HKD_CENTS = 1800;

export async function POST(req: NextRequest) {
  let body: CheckoutRequest;
  try {
    body = (await req.json()) as CheckoutRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const preset = getPresetById(body.presetId);
  // Custom dimensions are client-defined; allow "custom" without a static preset match.
  if (!preset && body.presetId !== "custom") {
    return NextResponse.json({ error: "Unknown photo size preset." }, { status: 400 });
  }

  const dimensionLabel =
    body.dimensionLabel ||
    preset?.description ||
    preset?.label ||
    "Custom dimensions";
  const presetId = preset?.id ?? body.presetId;

  const origin = req.nextUrl.origin;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  // Mock fallback so the full flow is testable before Stripe is configured.
  if (!secretKey) {
    const response: CheckoutResponse = {
      url: `${origin}/success?session_id=mock_session&mock=1`,
      mock: true,
    };
    return NextResponse.json(response);
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "hkd",
            unit_amount: PRICE_HKD_CENTS,
            product_data: {
              name: "AI Studio ID — High-Res Photo Pack (No Watermark)",
              description: `${dimensionLabel} · single photo + 4R print sheet, ${body.mode} style`,
            },
          },
        },
      ],
      metadata: { presetId, mode: body.mode, dimensionLabel },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
    });
    if (!session.url) throw new Error("Stripe session has no URL.");
    const response: CheckoutResponse = { url: session.url, mock: false };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[checkout] Stripe session creation failed:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 502 },
    );
  }
}

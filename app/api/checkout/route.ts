import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRICING } from "@/lib/pricing";
import type { CheckoutRequest, CheckoutResponse } from "@/lib/types";
import { getPresetById } from "@/constants/photoSizes";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Launch-special price for the Single Photo Unlock Package. */
export const PRICE_USD_CENTS = PRICING.stripeUnitAmount;

export async function POST(req: NextRequest) {
  let body: CheckoutRequest;
  try {
    body = (await req.json()) as CheckoutRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const intent = body.intent === "topup" ? "topup" : "unlock_photo";
  const generationId =
    body.generationId?.trim() || body.photoId?.trim() || undefined;

  if (intent === "unlock_photo" && !generationId) {
    return NextResponse.json(
      { error: "generationId is required for photo unlock checkout." },
      { status: 400 },
    );
  }

  const preset = getPresetById(body.presetId);
  if (!preset && body.presetId !== "custom") {
    return NextResponse.json({ error: "Unknown photo size preset." }, { status: 400 });
  }

  const dimensionLabel =
    body.dimensionLabel ||
    preset?.description ||
    preset?.label ||
    "Custom dimensions";
  const presetId = preset?.id ?? body.presetId;

  let userId: string | undefined;
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id;
    } catch (err) {
      console.error("[checkout] could not read auth user:", err);
    }
  }

  const origin = req.nextUrl.origin;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const packLabel =
    intent === "topup"
      ? `1 HD Photo Unlock + ${PRICING.previewCreditsBonus} Bonus Preview Tokens`
      : `instant HD unlock for this generation · +${PRICING.previewCreditsBonus} preview tokens`;

  // Photo unlock returns to the studio with restored session; top-up uses success page.
  const successUrl =
    intent === "unlock_photo" && generationId
      ? `${origin}/?payment=success&generation_id=${encodeURIComponent(generationId)}&session_id={CHECKOUT_SESSION_ID}`
      : `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;

  if (!secretKey) {
    const mockSuccess =
      intent === "unlock_photo" && generationId
        ? `${origin}/?payment=success&generation_id=${encodeURIComponent(generationId)}&session_id=mock_session&intent=${intent}`
        : `${origin}/success?session_id=mock_session&mock=1&intent=${intent}${
            userId ? `&user_id=${userId}` : ""
          }`;
    const response: CheckoutResponse = {
      url: mockSuccess,
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
            currency: PRICING.currency,
            unit_amount: PRICE_USD_CENTS,
            product_data: {
              name:
                intent === "topup"
                  ? "AI Studio ID — Preview Top-up Pack"
                  : PRICING.productName,
              description: `${dimensionLabel} · ${packLabel} · ${body.mode} style · ${PRICING.badge}`,
            },
          },
        },
      ],
      metadata: {
        presetId,
        mode: body.mode,
        dimensionLabel,
        intent,
        product:
          intent === "topup" ? "preview_topup_pack" : "single_photo_unlock_pack",
        previewCreditsBonus: String(PRICING.previewCreditsBonus),
        hdUnlocksBonus:
          intent === "topup" ? String(PRICING.hdUnlocksPerTopup) : "0",
        ...(generationId ? { generationId, photoId: generationId } : {}),
        ...(userId ? { userId } : {}),
      },
      success_url: successUrl,
      cancel_url: `${origin}/?checkout=cancelled${
        generationId
          ? `&generation_id=${encodeURIComponent(generationId)}`
          : ""
      }`,
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

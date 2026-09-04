import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRICING, UNLOCK_PRICES, type PricingMarket } from "@/lib/pricing";
import type { CheckoutRequest, CheckoutResponse } from "@/lib/types";
import { getPresetById } from "@/constants/photoSizes";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function priceIdFromEnv(market: PricingMarket): string {
  const raw =
    market === "hk"
      ? process.env.STRIPE_PRICE_ID_HKD
      : process.env.STRIPE_PRICE_ID_USD;
  return raw?.trim() || UNLOCK_PRICES[market].stripePriceId.trim();
}

function stripeMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    const message = (err as { message: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return "Could not start checkout. Please try again.";
}

export async function POST(req: NextRequest) {
  let body: CheckoutRequest;
  try {
    body = (await req.json()) as CheckoutRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const intent = body.intent === "topup" ? "topup" : "unlock_photo";
  const market: PricingMarket = body.market === "hk" ? "hk" : "usd";
  const unlockPrice = UNLOCK_PRICES[market];
  const stripePriceId = priceIdFromEnv(market);
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
  const packLabel = `1 HD Photo Download + ${PRICING.previewCreditsBonus} Bonus Preview Tokens`;

  // Both intents return straight to the studio so the in-progress photo /
  // specs / step can be restored instead of stranding the user on a
  // separate success page.
  const successUrl =
    intent === "unlock_photo" && generationId
      ? `${origin}/?payment=success&generation_id=${encodeURIComponent(generationId)}&session_id={CHECKOUT_SESSION_ID}`
      : `${origin}/?topup=success&session_id={CHECKOUT_SESSION_ID}`;

  if (!secretKey) {
    const mockSuccess =
      intent === "unlock_photo" && generationId
        ? `${origin}/?payment=success&generation_id=${encodeURIComponent(generationId)}&session_id=mock_session&intent=${intent}`
        : `${origin}/?topup=success&session_id=mock_session`;
    const response: CheckoutResponse = {
      url: mockSuccess,
      mock: true,
    };
    return NextResponse.json(response);
  }

  const productName =
    intent === "topup"
      ? "AI Images Studio — Preview Top-up Pack"
      : PRICING.productName;

  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = stripePriceId
    ? { quantity: 1, price: stripePriceId }
    : {
        quantity: 1,
        price_data: {
          currency: unlockPrice.currency,
          unit_amount: unlockPrice.stripeUnitAmount,
          product_data: {
            name: productName,
            description: `${dimensionLabel} · ${packLabel} · ${body.mode} style · ${PRICING.badge}`,
            tax_code: PRICING.stripeTaxCode,
          },
        },
      };

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [lineItem],
      // Price IDs in Dashboard may not have a product tax_code. Managed
      // Payments requires one; disable it on this session so Checkout can
      // start. Set tax_code on the Stripe Product to re-enable later.
      managed_payments: { enabled: false },
      metadata: {
        presetId,
        mode: body.mode,
        dimensionLabel,
        intent,
        // `type` mirrors `intent` — the webhook accepts either key.
        type: intent,
        product:
          intent === "topup" ? "preview_topup_pack" : "single_photo_unlock_pack",
        previewCreditsBonus: String(PRICING.previewCreditsBonus),
        hdUnlocksBonus: String(PRICING.hdUnlocksPerPurchase),
        market,
        ...(generationId ? { generationId, photoId: generationId } : {}),
        // `user_id` mirrors `userId` — the webhook accepts either key.
        ...(userId ? { userId, user_id: userId } : {}),
      },
      success_url: successUrl,
      cancel_url: `${origin}/?checkout=cancelled${
        generationId
          ? `&generation_id=${encodeURIComponent(generationId)}`
          : ""
      }`,
    } as Stripe.Checkout.SessionCreateParams);
    if (!session.url) throw new Error("Stripe session has no URL.");
    const response: CheckoutResponse = { url: session.url, mock: false };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[checkout] Stripe session creation failed:", {
      market,
      stripePriceId: stripePriceId || "(price_data fallback)",
      err,
    });
    return NextResponse.json({ error: stripeMessage(err) }, { status: 502 });
  }
}

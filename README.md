# AI Studio ID 📸

A mobile-first AI ID photo web application built with **Next.js (App Router)**, **TypeScript** and **Tailwind CSS**. Take or upload a photo and get compliant passport / visa / resume ID photos with AI background removal, studio styles, a 4R print sheet, and a Stripe-gated high-res download.

## Features

- **Photo input** — WebRTC camera capture with an oval dashed face-alignment guide, or file upload with resolution pre-validation.
- **Document presets** (`constants/photoSizes.ts`) — Hong Kong Passport/BNO (40×50mm), US Visa/Passport (2×2in), Mainland China Travel Permit/Visa (33×48mm), Standard Resume/CV (35×45mm); backgrounds in White, Light Blue, Grey and Red.
- **AI processing engine** (`/api/process-photo`) — **Gemini Nano Banana Pro exclusively** (`gemini-3-pro-image`). Retries with exponential backoff on high demand. Background modes: solid colour or full AI studio backdrop. Interactive crop (`react-easy-crop`) runs before processing. Facial identity is locked 100%.
- **Optional Gemini pre-validation** (`/api/validate-photo`) — photos can be checked for one clear face (no sunglasses) before generation.
- **4R print layout engine** (`lib/printLayout.ts`) — client-side Canvas that packs the maximum number of photos onto a 4×6in / 300 DPI sheet (1200×1800 or 1800×1200 px) with dashed cut guides.
- **Google OAuth + preview / HD balances** — Supabase Auth (Google). First login seeds `preview_credits = 5` and `hd_unlocks = 0`. Generate requires sign-in and spends 1 preview credit only after successful AI generation. Stripe Single Photo Unlock Package grants +1 HD unlock and +5 preview credits.
- **Watermarked previews & Stripe checkout** — repeating "AI Studio ID - Preview" watermark; `/api/checkout` creates a Stripe Checkout session (**$4.99 USD** launch special, anchored vs $12.99), `/api/webhook` records payment and grants credits, and the success page verifies the session and triggers the instant clean high-res JPEG download.

## Getting started

```bash
npm install
cp .env.example .env.local   # optionally fill in API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without API keys the app runs fully in **mock mode**: the built-in background remover handles photos taken against a plain backdrop, and checkout skips Stripe and redirects straight to the success page.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Google Gemini key — **required** for Nano Banana Pro generation |
| `GEMINI_MODEL` | Optional validation model override (default `gemini-flash-latest`) |
| `GEMINI_IMAGE_MODEL` | Optional image model (default `gemini-3-pro-image` / Nano Banana Pro) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (Google OAuth + profiles) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role for webhook/mock credit grants (server only) |
| `STRIPE_SECRET_KEY` | Stripe secret key — enables real checkout ($4.99 USD) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret for `/api/webhook` |

Apply `supabase/migrations/001_profiles_and_credits.sql` in the Supabase SQL editor, and enable the **Google** provider under Authentication → Providers. Set the redirect URL to `http://localhost:3000/auth/callback` (plus your production URL).

## Project structure

```
app/
  page.tsx                    # 3-step studio wizard (Photo → Specs → Preview)
  success/page.tsx            # post-payment verification + clean download
  api/process-photo/route.ts  # AI processing engine
  api/checkout/route.ts       # Stripe Checkout session ($4.99 USD)
  api/verify-payment/route.ts # session verification for the success page
  api/webhook/route.ts        # Stripe webhook + credit grants
  auth/callback/route.ts      # Supabase OAuth code exchange
components/
  PhotoInput.tsx              # upload / camera tabs + validation
  CameraCapture.tsx           # WebRTC stream + oval face guide
  SpecSelector.tsx            # size, background and style pickers
  PreviewPanel.tsx            # watermarked previews + anchored checkout CTA
  LoginModal.tsx              # Google sign-in gate for Generate
  PaywallModal.tsx            # price-anchored unlock / out-of-credits paywall
constants/photoSizes.ts       # document presets & background colours
lib/
  pricing.ts                  # launch-special price anchoring constants
  types.ts                    # shared TypeScript interfaces
  imageUtils.ts               # load / validate / aspect-crop helpers
  printLayout.ts              # 4R Canvas layout engine
  watermark.ts                # tiled preview watermark
  purchaseStore.ts            # IndexedDB bridge to the success page
  supabase/                   # browser / server / admin clients
  server/credits.ts           # auth + credit spend helpers
  server/aiProviders.ts       # Gemini-only processing pipeline
  server/geminiImage.ts       # Nano Banana Pro via @google/genai
  server/stylePrompts.ts      # Classic / Korean / Corporate prompts
  server/stylePipeline.ts     # legacy sharp helpers
supabase/migrations/          # profiles table, triggers, credit RPCs
```

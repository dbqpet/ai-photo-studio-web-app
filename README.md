# AI Studio ID 📸

A mobile-first AI ID photo web application built with **Next.js (App Router)**, **TypeScript** and **Tailwind CSS**. Take or upload a photo and get compliant passport / visa / resume ID photos with AI background removal, studio styles, a 4R print sheet, and a Stripe-gated high-res download.

## Features

- **Photo input** — WebRTC camera capture with an oval dashed face-alignment guide, or file upload with resolution pre-validation.
- **Document presets** (`constants/photoSizes.ts`) — Hong Kong Passport/BNO (40×50mm), US Visa/Passport (2×2in), Mainland China Travel Permit/Visa (33×48mm), Standard Resume/CV (35×45mm); backgrounds in White, Light Blue, Grey and Red.
- **AI processing engine** (`/api/process-photo`) — background removal via fal.ai, Replicate or remove.bg, with a built-in flood-fill mock for keyless local development. Three styles: Classic Passport, Korean Studio, Corporate Pro. Styles are deterministic photometric adjustments — facial identity is preserved 100%.
- **4R print layout engine** (`lib/printLayout.ts`) — client-side Canvas that packs the maximum number of photos onto a 4×6in / 300 DPI sheet (1200×1800 or 1800×1200 px) with dashed cut guides.
- **Watermarked previews & Stripe checkout** — repeating "AI Studio ID - Preview" watermark; `/api/checkout` creates a Stripe Checkout session ($18 HKD), `/api/webhook` records payment, and the success page verifies the session and triggers the instant clean high-res JPEG download.

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
| `FAL_KEY` | fal.ai key (BiRefNet segmentation, first priority) |
| `REPLICATE_API_TOKEN` | Replicate token (background remover, second priority) |
| `REMOVE_BG_API_KEY` | remove.bg key (third priority) |
| `STRIPE_SECRET_KEY` | Stripe secret key — enables real checkout |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret for `/api/webhook` |

## Project structure

```
app/
  page.tsx                    # 3-step studio wizard (Photo → Specs → Preview)
  success/page.tsx            # post-payment verification + clean download
  api/process-photo/route.ts  # AI processing engine
  api/checkout/route.ts       # Stripe Checkout session ($18 HKD)
  api/verify-payment/route.ts # session verification for the success page
  api/webhook/route.ts        # Stripe webhook (payment record)
components/
  PhotoInput.tsx              # upload / camera tabs + validation
  CameraCapture.tsx           # WebRTC stream + oval face guide
  SpecSelector.tsx            # size, background and style pickers
  PreviewPanel.tsx            # watermarked previews + checkout CTA
constants/photoSizes.ts       # document presets & background colours
lib/
  types.ts                    # shared TypeScript interfaces
  imageUtils.ts               # load / validate / aspect-crop helpers
  printLayout.ts              # 4R Canvas layout engine
  watermark.ts                # tiled preview watermark
  purchaseStore.ts            # sessionStorage bridge to the success page
  server/aiProviders.ts       # fal.ai / Replicate / remove.bg / mock cutouts
  server/stylePipeline.ts     # sharp-based styling + background compositing
```

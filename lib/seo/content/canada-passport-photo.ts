import type { SeoPageContent } from "@/lib/seo/types";
import { enSeoFooter } from "@/lib/seo/content/en-shared";

const CANADA_PASSPORT_PHOTO_OFFICIAL_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html";

export const canadaPassportPhotoPage: SeoPageContent = {
  slug: "canada-passport-photo",
  meta: {
    title: "Canada Passport Photo – 50×70 mm Size, Background & IRCC Rules",
    description:
      "Canada passport photo requirements from IRCC: 50×70 mm, white background, recent photo. Prepare a Canadian passport-style image online, then verify on Canada.ca.",
    keywords: [
      "Canada passport photo",
      "Canadian passport photo requirements",
      "50x70 passport photo",
      "IRCC passport photo",
      "Canada passport photo size",
    ],
    htmlLang: "en",
    locale: "en_CA",
  },
  nav: { headerCta: "Prepare Canada Photo" },
  hero: {
    title: "Canada Passport Photo – IRCC Size and Background",
    subtitle:
      "Immigration, Refugees and Citizenship Canada (IRCC) uses a taller 50×70 mm photo with a plain white background — not the US 2×2 square. Confirm the latest Canada.ca instructions, including any guarantor or professional-photo rules for your application type.",
    primaryCta: "Prepare 50×70 mm Photo",
    secondaryCta: "Canada requirements",
    secondaryTargetId: "requirements",
  },
  sections: [
    {
      type: "disclaimer",
      title: "Verify with Canada.ca / IRCC",
      paragraphs: [
        "Paper and online streams can differ (photographer stamp, guarantor, digital file). Always use the official IRCC photo page for your application.",
      ],
      links: [
        {
          href: CANADA_PASSPORT_PHOTO_OFFICIAL_URL,
          label: "Official IRCC passport photograph specifications",
        },
      ],
    },
    {
      type: "prose",
      id: "requirements",
      title: "General Canada passport photo requirements (summary)",
      bullets: [
        "Size: 50 mm wide × 70 mm high",
        "Background: plain white, no shadows or texture",
        "Taken within the timeframe IRCC currently requires, showing current appearance",
        "Neutral expression, mouth closed, both eyes open",
        "Face and shoulders visible; head size within IRCC’s millimetre range",
        "No uniforms except as IRCC allows; religious headwear must not hide the face",
        "Glasses: follow the current IRCC list (glare and tinted lenses are typical rejection reasons)",
      ],
    },
    {
      type: "prose",
      title: "Why Canadian photos get rejected",
      bullets: [
        "Using a 2×2 inch US crop instead of 50×70 mm",
        "Off-white or grey background that is not plain white",
        "Shadows behind the head",
        "Smile or hair covering the eyes",
        "Missing photographer information when your stream still requires it",
      ],
    },
    {
      type: "steps",
      title: "Prepare a Canada passport-style photo",
      items: [
        {
          title: "Read IRCC’s current photo page",
          description:
            "Note whether you need a commercial photographer, a guarantor, or a digital file only.",
        },
        {
          title: "Capture a white-wall portrait",
          description:
            "Even front light, camera at eye level, no heavy shadow on the wall.",
        },
        {
          title: "Upload and set 50×70 mm",
          description:
            "Use a custom millimetre size if needed so the crop is 50×70, not a square 2×2.",
        },
        {
          title: "Review white background and head position",
          description:
            "Compare against IRCC sample photos before you download.",
        },
        {
          title: "Print on a 4R sheet or follow digital specs",
          description:
            "Cut the 50×70 mm portraits from a 4R print, or resize to the portal’s pixel limits.",
        },
      ],
    },
    {
      type: "solution",
      title: "How AI Images Studio helps",
      bullets: [
        "White background cleanup",
        "Lighting balance",
        "Custom millimetre crop for 50×70",
        "4R multi-copy print layout",
      ],
    },
    {
      type: "disclaimer",
      title: "What we do not claim",
      paragraphs: [
        "AI Images Studio does not replace a photographer’s stamp or IRCC approval. Use it to prepare a clean image, then complete any certification steps your application still requires.",
      ],
      links: [
        { href: "/en/passport-photo-size", label: "Photo size chart" },
        { href: "/en/passport-photo-requirements", label: "Requirements by country" },
      ],
    },
  ],
  faq: {
    title: "Canada passport photo — FAQ",
    items: [
      {
        question: "Can I use a US 2×2 photo for a Canadian passport?",
        answer:
          "No. Canada’s standard passport photo is 50×70 mm, which is taller than 2×2 inches. Recrop to 50×70 mm.",
      },
      {
        question: "Do I still need a photographer to sign the back?",
        answer:
          "Some IRCC streams still require a professional photo with details on the back. Check Canada.ca for your application type before relying on a home print alone.",
      },
      {
        question: "Can I take the photo with my phone?",
        answer:
          "You can capture the portrait with a phone. Acceptance depends on meeting IRCC’s composition rules and any certification rules that still apply.",
      },
    ],
  },
  bottomCta: {
    title: "Preparing a Canada passport photo?",
    subtitle: "Upload a portrait, crop to 50×70 mm, and download a clean file — then verify on Canada.ca.",
    button: "Start Canada Photo Prep",
  },
  relatedPages: [
    { slug: "passport-photo-size", label: "Photo size chart" },
    { slug: "passport-photo-requirements", label: "Photo requirements" },
    { slug: "passport-photo", label: "Passport photo maker" },
    { slug: "us-passport-photo", label: "US 2×2 photo (different size)" },
  ],
  footer: enSeoFooter,
};

export { CANADA_PASSPORT_PHOTO_OFFICIAL_URL };

import type { SeoPageContent } from "@/lib/seo/types";
import { enSeoFooter } from "@/lib/seo/content/en-shared";

const US_URL =
  "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html";
const UK_URL = "https://www.gov.uk/photos-for-passports";
const CA_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html";

export const passportPhotoRequirementsPage: SeoPageContent = {
  slug: "passport-photo-requirements",
  meta: {
    title: "Passport Photo Requirements – Background, Expression & Rejection Reasons",
    description:
      "Passport and ID photo requirements: background colour, expression, lighting, glasses and headwear for US, UK, Canada, Schengen, India, and the Philippines — plus common rejection reasons.",
    keywords: [
      "passport photo requirements",
      "ID photo requirements",
      "passport photo background",
      "passport photo glasses",
      "passport photo rejected",
      "US UK Canada passport photo rules",
    ],
    htmlLang: "en",
    locale: "en_US",
  },
  nav: { headerCta: "Check & Prepare Photo" },
  hero: {
    title: "Passport Photo Requirements (and Common ID Photo Rules)",
    subtitle:
      "Most rejections are not about camera megapixels. They are about background, shadows, expression, glasses, and head size. This page summarises widely published rules by authority — always open the official page for the document you are filing.",
    primaryCta: "Avoid Rejection — Prepare With AI",
    secondaryCta: "Common rejection list",
    secondaryTargetId: "rejections",
  },
  sections: [
    {
      type: "disclaimer",
      title: "Educational summary — not legal advice",
      paragraphs: [
        "Photo rules change. Use this as a checklist, then verify the current guidance from the authority that will review your application.",
      ],
      links: [
        { href: US_URL, label: "U.S. Department of State — passport photos" },
        { href: UK_URL, label: "UK HMPO — photos for passports (GOV.UK)" },
        { href: CA_URL, label: "Canada IRCC — passport photographs" },
      ],
    },
    {
      type: "prose",
      title: "Rules that almost every authority shares",
      bullets: [
        "Taken recently (often within 6 months) and looking like you now",
        "Colour photo, in focus, no heavy filters",
        "Face towards the camera, both eyes open, head not tilted",
        "Even lighting — no heavy shadow on the face or the backdrop",
        "Plain clothing; no uniforms unless the rules allow them",
      ],
    },
    {
      type: "prose",
      title: "Background, expression, lighting, glasses, and headwear by authority",
      subsections: [
        {
          title: "United States — Department of State",
          bullets: [
            "Size: 2×2 inches. Background: plain white or off-white, no pattern, no shadows",
            "Expression: neutral, mouth closed. Glasses: generally not allowed (limited medical exceptions)",
            "Head size in the print is specified in inches (chin to top of hair)",
            "Hats only for religious daily wear that does not hide the face",
          ],
        },
        {
          title: "United Kingdom — HMPO / GOV.UK",
          bullets: [
            "Size: 45 mm high × 35 mm wide. Background: light grey or cream — not bright white, not busy",
            "No smiling; mouth closed; no hair covering the eyes",
            "No glasses. No headphones, no toys in children’s photos",
            "Head height and eye position are specified on GOV.UK — compare against their examples",
          ],
        },
        {
          title: "Canada — IRCC",
          bullets: [
            "Size: 50×70 mm. Background: plain white",
            "Neutral expression, mouth closed, both eyes visible",
            "Glasses: follow current IRCC photo specifications (glare-free if permitted for your case)",
            "Photos are often certified by a professional or a guarantor for paper applications — check your stream",
          ],
        },
        {
          title: "Schengen / EU (ICAO-style 35×45 mm)",
          bullets: [
            "Most Schengen visas use 35×45 mm with a light, even background (white or light grey depending on the consulate)",
            "Face must be clearly visible; no shadows; no red-eye",
            "Glasses and headwear rules follow the consulate — many follow ICAO: no tinted lenses, no glare",
          ],
        },
        {
          title: "India — Passport Seva",
          bullets: [
            "Common size: 51×51 mm (2×2 inches) with a white background",
            "Face typically about 70–80% of the photo; ears visible in many instructions",
            "No uniform (except allowed religious attire); no dark glasses",
          ],
        },
        {
          title: "Philippines — DFA (passport) and common IDs",
          bullets: [
            "DFA passport photos are commonly 4.5×3.5 cm (45×35 mm) on a white background",
            "NBI, PRC, postal ID and many local IDs use 2×2 inches instead — do not mix the two sizes",
            "Neutral expression, no eyeglasses for many PH IDs unless a medical exception applies",
          ],
        },
      ],
    },
    {
      type: "prose",
      id: "rejections",
      title: "Common rejection reasons",
      bullets: [
        "Shadows on the face or a grey halo on the wall",
        "Busy, coloured, or patterned background",
        "Portrait Mode blur, beauty filters, or over-smoothed skin",
        "Head too small, too large, or cropped through the hair",
        "Smile, open mouth, or looking away from the lens",
        "Glasses glare, tinted lenses, or frames covering the eyes",
        "Hat, headphones, or hair covering the face",
        "Photo older than the allowed window, or no longer looking like the applicant",
        "Low-resolution screenshot or a stretched, non-square US 2×2 crop",
        "Wrong size (for example submitting a 2×2 print where 35×45 mm is required)",
      ],
    },
    {
      type: "solution",
      title: "Avoid rejection — let AI handle compliance prep",
      paragraphs: [
        "AI Images Studio cannot stamp an official approval. It can remove the issues that cause most DIY failures: messy backgrounds, uneven light, and the wrong crop.",
      ],
      bullets: [
        "Plain background replacement for white / off-white / light grey looks",
        "Lighting balance to reduce facial and wall shadows",
        "Presets for 35×45 mm, 2×2 inches, and custom millimetre sizes",
        "A 4R sheet so you print several identical copies after you are happy with the crop",
      ],
    },
    {
      type: "disclaimer",
      title: "Next step",
      paragraphs: [
        "Match the millimetre or inch size on the size chart, then prepare the photo. Country pages collect the same rules in one place for US, UK, Canada, India, and the Philippines.",
      ],
      links: [
        { href: "/en/passport-photo-size", label: "Passport photo size chart" },
        { href: "/en/passport-photo", label: "Passport photo maker" },
        { href: "/en/passport-photo-with-phone", label: "Take the photo with your phone" },
      ],
    },
  ],
  faq: {
    title: "Passport photo requirements — FAQ",
    items: [
      {
        question: "Can I smile in a passport photo?",
        answer:
          "Usually no — or only a very slight closed-mouth expression. US, UK, Canada, and most Schengen posts want a neutral face. Follow the examples on the official site for your country.",
      },
      {
        question: "Are glasses allowed in passport photos?",
        answer:
          "Often no. The US generally prohibits glasses. The UK does not allow glasses. Other countries may allow clear lenses with no glare. When in doubt, remove them.",
      },
      {
        question: "What background colour do I need?",
        answer:
          "US and Canada typically want white or off-white. The UK prefers light grey or cream, not bright white. Schengen posts vary between white and light grey. Check your form.",
      },
      {
        question: "Why was my digital photo rejected?",
        answer:
          "Common causes are compression, the wrong pixel size, shadows, a non-plain background, or a filter. Re-export from the original file and compare against the official sample images.",
      },
    ],
  },
  bottomCta: {
    title: "Want fewer DIY rejection risks?",
    subtitle: "Upload a portrait and let AI clean the background, lighting, and crop — then verify against official rules.",
    button: "Prepare a Compliant-Style Photo",
  },
  relatedPages: [
    { slug: "passport-photo-size", label: "Photo size chart" },
    { slug: "passport-photo", label: "Passport photo maker" },
    { slug: "us-passport-photo", label: "US requirements" },
    { slug: "uk-passport-photo", label: "UK requirements" },
    { slug: "passport-photo-with-phone", label: "Phone photo guide" },
  ],
  footer: enSeoFooter,
};

import type { SeoPageContent } from "@/lib/seo/types";
import { enSeoFooter } from "@/lib/seo/content/en-shared";

const INDIA_PASSPORT_PHOTO_OFFICIAL_URL = "https://www.passportindia.gov.in/";

export const indiaPassportPhotoPage: SeoPageContent = {
  slug: "india-passport-photo",
  meta: {
    title: "India Passport Photo – 2×2 Size, White Background & Passport Seva",
    description:
      "India passport photo size is typically 51×51 mm (2×2 inches) with a white background. Prepare a Passport Seva-style photo online, then confirm on passportindia.gov.in.",
    keywords: [
      "India passport photo",
      "Indian passport photo size",
      "2x2 passport photo India",
      "Passport Seva photo",
      "India passport photo requirements",
    ],
    htmlLang: "en",
    locale: "en_IN",
  },
  nav: { headerCta: "Prepare India Photo" },
  hero: {
    title: "India Passport Photo – 2×2 Size and White Background",
    subtitle:
      "Passport Seva applications commonly ask for a 51×51 mm (2×2 inch) colour photo with a white background and a large, clearly visible face. Confirm the latest pixel and print rules on the official portal before you upload.",
    primaryCta: "Prepare 2×2 Photo",
    secondaryCta: "India requirements",
    secondaryTargetId: "requirements",
  },
  sections: [
    {
      type: "disclaimer",
      title: "Verify with Passport Seva",
      paragraphs: [
        "Digital upload specifications (pixels, file size, format) are set in the live application form. Use passportindia.gov.in as the source of truth.",
      ],
      links: [
        {
          href: INDIA_PASSPORT_PHOTO_OFFICIAL_URL,
          label: "Official Passport Seva website",
        },
      ],
    },
    {
      type: "prose",
      id: "requirements",
      title: "General India passport photo requirements (summary)",
      bullets: [
        "Printed size commonly 51×51 mm (2×2 inches)",
        "Background: white, no shadows or objects",
        "Face typically occupies most of the frame (often about 70–80%)",
        "Ears visible in many published instructions; hair not covering the face",
        "Neutral expression; no sunglasses; uniforms usually not allowed",
        "Recent photo matching your current appearance",
      ],
    },
    {
      type: "prose",
      title: "Why Indian passport photos get rejected",
      bullets: [
        "Grey or off-white background instead of white",
        "Face too small in the square",
        "Heavy makeup or filters that change appearance",
        "Glare on glasses",
        "Wrong digital pixel size on the Passport Seva upload",
      ],
    },
    {
      type: "steps",
      title: "Prepare an India passport-style photo",
      items: [
        {
          title: "Read the current Passport Seva photo instructions",
          description:
            "Note print size and any digital pixel limits shown in your form.",
        },
        {
          title: "Take a portrait on a white or light wall",
          description:
            "Even light from the front; camera at eye level.",
        },
        {
          title: "Upload and choose the 2×2 inch preset",
          description:
            "Centre the face so it fills the square as the portal examples show.",
        },
        {
          title: "Check ears, background, and shadows",
          description:
            "Zoom the preview. The background should read as white.",
        },
        {
          title: "Export for print or portal upload",
          description:
            "Print several copies on a 4R sheet, or resize to the portal’s pixel cap without stretching.",
        },
      ],
    },
    {
      type: "solution",
      title: "How AI Images Studio helps",
      bullets: [
        "White background replacement",
        "Lighting cleanup",
        "2×2 inch (51×51 mm) crop",
        "4R sheet for multiple prints",
      ],
    },
    {
      type: "disclaimer",
      title: "What we do not claim",
      paragraphs: [
        "AI Images Studio does not guarantee Passport Seva acceptance. Match your file to the live form’s technical limits.",
      ],
      links: [
        { href: "/en/passport-photo-size", label: "Photo size chart" },
        { href: "/en/passport-photo-requirements", label: "Requirements by country" },
      ],
    },
  ],
  faq: {
    title: "India passport photo — FAQ",
    items: [
      {
        question: "Is the India passport photo the same as a US 2×2?",
        answer:
          "The printed square is the same 2×2 inches, but India may specify a larger face in the frame and a strictly white background. Follow Passport Seva examples, not only a US crop.",
      },
      {
        question: "Can I wear a hijab or turban?",
        answer:
          "Religious headwear is often allowed if the face is fully visible from forehead to chin. Confirm the current Passport Seva note for your case.",
      },
      {
        question: "Can I take it with a phone?",
        answer:
          "Yes for the original portrait. Upload a sharp original file, not a screenshot, then crop to 2×2.",
      },
    ],
  },
  bottomCta: {
    title: "Preparing an India passport photo?",
    subtitle: "Upload a portrait, apply 2×2, and download a clean file — then check Passport Seva.",
    button: "Start India Photo Prep",
  },
  relatedPages: [
    { slug: "passport-photo-size", label: "Photo size chart" },
    { slug: "passport-photo-requirements", label: "Photo requirements" },
    { slug: "passport-photo", label: "Passport photo maker" },
    { slug: "us-passport-photo", label: "US 2×2 guide" },
  ],
  footer: enSeoFooter,
};

export { INDIA_PASSPORT_PHOTO_OFFICIAL_URL };

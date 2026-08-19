import type { SeoPageContent } from "@/lib/seo/types";
import { enSeoFooter } from "@/lib/seo/content/en-shared";

const UK_PASSPORT_PHOTO_OFFICIAL_URL = "https://www.gov.uk/photos-for-passports";

export const ukPassportPhotoPage: SeoPageContent = {
  slug: "uk-passport-photo",
  meta: {
    title: "UK Passport Photo – Size, Background & How to Prepare Online",
    description:
      "UK passport photo requirements: 35×45 mm, light grey or cream background, no glasses. Prepare a HMPO-style photo from a home portrait with AI — then verify on GOV.UK.",
    keywords: [
      "UK passport photo",
      "UK passport photo requirements",
      "35x45 passport photo",
      "British passport photo",
      "HMPO passport photo",
    ],
    htmlLang: "en",
    locale: "en_GB",
  },
  nav: { headerCta: "Prepare UK Photo" },
  hero: {
    title: "UK Passport Photo – Size, Background and Online Prep",
    subtitle:
      "His Majesty’s Passport Office (HMPO) expects a 45×35 mm colour photo on a light grey or cream background. This page summarises widely published GOV.UK rules — always open the official guide before you submit.",
    primaryCta: "Prepare 35×45 mm Photo",
    secondaryCta: "UK requirements summary",
    secondaryTargetId: "requirements",
  },
  sections: [
    {
      type: "disclaimer",
      title: "Verify with GOV.UK",
      paragraphs: [
        "UK photo rules can change, including digital upload specifications for online applications. The authoritative source is GOV.UK.",
      ],
      links: [
        {
          href: UK_PASSPORT_PHOTO_OFFICIAL_URL,
          label: "Official UK passport photo rules (GOV.UK)",
        },
      ],
    },
    {
      type: "prose",
      id: "requirements",
      title: "General UK passport photo requirements (summary)",
      bullets: [
        "Size: 45 millimetres high × 35 millimetres wide",
        "Background: light grey or cream — not pure white, not patterned",
        "No glasses (including tinted and reading glasses in standard cases)",
        "Neutral expression, mouth closed, eyes open and visible",
        "No hair across the eyes; head not tilted",
        "Hats only for religious or medical reasons that do not hide the face",
        "Recent photo that looks like you now",
      ],
    },
    {
      type: "prose",
      title: "Why UK photos get rejected",
      bullets: [
        "Bright white studio background (UK prefers grey/cream)",
        "Shadows or a ‘halo’ around the head",
        "Smiling or an open mouth",
        "Glasses glare or frames covering the eyes",
        "Head too small or cropped through the hair",
      ],
    },
    {
      type: "steps",
      title: "Prepare a UK passport-style photo at home",
      items: [
        {
          title: "Read the latest GOV.UK photo examples",
          description:
            "Compare head position and background colour with the official samples, including child photos if relevant.",
        },
        {
          title: "Capture a well-lit portrait",
          description:
            "Plain wall, even light, camera at eye level. See the at-home and phone guides for setup.",
        },
        {
          title: "Upload and choose 35×45 mm",
          description:
            "In AI Images Studio pick the 35×45 mm preset and centre the face in the crop frame.",
        },
        {
          title: "Check the background look",
          description:
            "Aim for a light, even backdrop. If your wall was white, review whether the result still looks too stark versus GOV.UK examples.",
        },
        {
          title: "Download, print, or upload digitally",
          description:
            "Follow your application path: printed photos or the current digital file rules on GOV.UK.",
        },
      ],
    },
    {
      type: "solution",
      title: "How AI Images Studio helps",
      paragraphs: [
        "The tool does not replace HMPO review. It helps with background cleanup, lighting, and a 35×45 mm crop.",
      ],
      bullets: [
        "Plain background replacement",
        "Shadow reduction",
        "35×45 mm crop preset",
        "4R sheet with several copies for paper applications",
      ],
    },
    {
      type: "disclaimer",
      title: "What we do not claim",
      paragraphs: [
        "AI Images Studio does not guarantee UK passport acceptance. Compare your result with GOV.UK examples before you submit.",
      ],
      links: [
        { href: "/en/passport-photo-size", label: "Photo size chart" },
        { href: "/en/passport-photo-requirements", label: "Requirements by country" },
      ],
    },
  ],
  faq: {
    title: "UK passport photo — FAQ",
    items: [
      {
        question: "Can I take a UK passport photo with my phone?",
        answer:
          "Yes, if the final image meets GOV.UK rules. Use even light, no glasses, and a 35×45 mm crop. See the phone guide for iPhone and Android settings.",
      },
      {
        question: "Is a white background OK for a UK passport?",
        answer:
          "GOV.UK asks for light grey or cream, not a bright white studio wall. Check the official examples if your tool output looks pure white.",
      },
      {
        question: "Can children smile?",
        answer:
          "UK child photo rules are stricter than a casual snapshot. Follow the children’s examples on GOV.UK (no toys, mouth closed where required).",
      },
    ],
  },
  bottomCta: {
    title: "Preparing a UK passport photo?",
    subtitle: "Upload a portrait, apply 35×45 mm, and download a printable result — then verify on GOV.UK.",
    button: "Start UK Photo Prep",
  },
  relatedPages: [
    { slug: "passport-photo-size", label: "Photo size chart" },
    { slug: "passport-photo-requirements", label: "Photo requirements" },
    { slug: "passport-photo", label: "Passport photo maker" },
    { slug: "passport-photo-with-phone", label: "Phone photo guide" },
  ],
  footer: enSeoFooter,
};

export { UK_PASSPORT_PHOTO_OFFICIAL_URL };

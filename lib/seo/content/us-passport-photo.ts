import type { SeoPageContent } from "@/lib/seo/types";

const US_PASSPORT_PHOTO_OFFICIAL_URL =
  "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html";

const footer = {
  privacy:
    "AI Images Studio · Photos are processed securely and never stored long-term on our servers.",
  supportLabel: "Support: ",
};

export const usPassportPhotoPage: SeoPageContent = {
  slug: "us-passport-photo",
  meta: {
    title: "US Passport Photo – How to Take and Prepare Your Photo Online",
    description:
      "Learn how to prepare a US passport photo from a portrait taken at home. Understand the basic requirements and use AI to prepare your image.",
    keywords: [
      "US passport photo",
      "US passport photo requirements",
      "2x2 passport photo",
      "American passport photo online",
      "US passport photo at home",
    ],
    htmlLang: "en",
    locale: "en_US",
  },
  nav: { headerCta: "Prepare US Photo" },
  hero: {
    title: "US Passport Photo – How to Take and Prepare Your Photo Online",
    subtitle:
      "US passport applications require a specific 2×2 inch color photo with plain background and strict composition rules. This guide summarizes widely published requirements — always verify the latest official guidance before you submit.",
    primaryCta: "Prepare 2×2 Photo",
    secondaryCta: "US requirements summary",
    secondaryTargetId: "requirements",
  },
  sections: [
    {
      type: "disclaimer",
      title: "Verify with the official U.S. government source",
      paragraphs: [
        "Passport photo rules can change. The authoritative source is the U.S. Department of State. Review their current photo requirements before submitting your application or renewal.",
      ],
      links: [
        {
          href: US_PASSPORT_PHOTO_OFFICIAL_URL,
          label: "Official U.S. passport photo requirements (travel.state.gov)",
        },
      ],
    },
    {
      type: "prose",
      id: "requirements",
      title: "General US passport photo requirements (summary)",
      paragraphs: [
        "The following points reflect commonly published US passport photo guidance. They are provided for educational purposes and may not reflect the latest rule changes:",
      ],
      bullets: [
        "Size: 2 × 2 inches (51 × 51 mm) square",
        "Recency: taken within the last six months, showing current appearance",
        "Background: plain white or off-white, with no shadows or patterns",
        "Head size: head must measure between 1 and 1⅜ inches (25–35 mm) from chin to top of head in the photo",
        "Expression: neutral, both eyes open, mouth closed",
        "Pose: full face, front view, head centered",
        "Attire: everyday clothing; uniforms should be avoided except religious attire worn daily",
        "Glasses: generally not permitted in US passport photos (with limited medical exceptions per official rules)",
        "Photo quality: in focus, color, printed on matte or glossy photo paper if submitting physically",
      ],
    },
    {
      type: "prose",
      title: "Why US passport photos get rejected",
      bullets: [
        "Shadows on the face or background",
        "Head too small or too large in the frame",
        "Busy or non-white backgrounds",
        "Filters, over-retouching, or low resolution",
        "Photo older than six months or no longer resembling the applicant",
      ],
    },
    {
      type: "steps",
      title: "Prepare a US passport-style photo at home",
      items: [
        {
          title: "Read the latest rules on travel.state.gov",
          description:
            "Confirm current size, background, and submission format (printed vs digital upload for online renewal).",
        },
        {
          title: "Capture a well-lit portrait",
          description:
            "Stand in front of a plain wall, face natural light, and use your phone's rear camera at eye level.",
        },
        {
          title: "Upload and select the US 2×2 inch preset",
          description:
            "In AI Images Studio, choose the US passport preset and adjust the crop so head size looks proportionate.",
        },
        {
          title: "Review background and shadows",
          description:
            "Zoom in on the preview. The background should look evenly white or off-white with no harsh shadows.",
        },
        {
          title: "Download and print if required",
          description:
            "For paper applications, print on photo-quality paper. For online renewal, follow the portal's digital upload specs.",
        },
      ],
    },
    {
      type: "solution",
      title: "How AI Images Studio helps with US photo preparation",
      paragraphs: [
        "The tool does not replace official review, but it helps with the parts home users struggle with most:",
      ],
      bullets: [
        "Replacing non-white backgrounds with a plain backdrop",
        "Balancing lighting to reduce facial shadows",
        "Cropping to the 2×2 inch square format",
        "Exporting high-resolution output suitable for printing",
        "Creating a 4R sheet with multiple 2×2 copies for family applications",
      ],
    },
    {
      type: "disclaimer",
      title: "What we do not claim",
      paragraphs: [
        "AI Images Studio does not guarantee US passport compliance or approval. Automated cropping cannot measure head size to the exact inch the way a trained photo technician might.",
        "Use the preview as a helpful starting point, then compare your result against the official examples published by the U.S. Department of State before submitting.",
      ],
      links: [
        { href: "/en/passport-photo-at-home", label: "Home photo capture guide" },
        { href: "/en/passport-photo-with-phone", label: "Phone photo tutorial" },
      ],
    },
  ],
  faq: {
    title: "US passport photo — FAQ",
    items: [
      {
        question: "Can I use AI Images Studio for US passport online renewal?",
        answer:
          "You can prepare a digital file with the 2×2 preset, but you must confirm that the exported image meets the Department of State's current digital upload requirements for your specific renewal path.",
      },
      {
        question: "Where can I print a 2×2 US passport photo?",
        answer:
          "Many pharmacies, warehouse stores, and dedicated photo shops offer 2×2 printing. You can also print at home on photo paper if your printer supports high-quality photo output.",
      },
      {
        question: "Are baby passport photos supported?",
        answer:
          "Infant passport photos have additional official rules (e.g., lying on a white sheet). Review the Department of State guidance for applicants under six months old.",
      },
    ],
  },
  bottomCta: {
    title: "Preparing a US passport photo?",
    subtitle: "Upload a portrait, apply the 2×2 preset, and download a printable result — then verify against official rules.",
    button: "Start US Photo Prep",
  },
  relatedPages: [
    { slug: "passport-photo", label: "Passport photo maker" },
    { slug: "passport-photo-at-home", label: "Photo at home guide" },
    { slug: "passport-photo-printing", label: "Print passport photos" },
    { slug: "passport-photo-with-phone", label: "Phone photo guide" },
  ],
  footer,
};

export { US_PASSPORT_PHOTO_OFFICIAL_URL };

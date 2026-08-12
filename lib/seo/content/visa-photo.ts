import type { SeoPageContent } from "@/lib/seo/types";

const footer = {
  privacy:
    "AI Images Studio · Photos are processed securely and never stored long-term on our servers.",
  supportLabel: "Support: ",
};

export const visaPhotoPage: SeoPageContent = {
  slug: "visa-photo",
  meta: {
    title: "AI Visa Photo Maker – Create a Visa Photo Online",
    description:
      "Create a visa-style photo from a normal portrait online. Prepare a clean photo with AI background removal and lighting enhancement.",
    keywords: [
      "visa photo",
      "visa photo maker",
      "visa photo online",
      "visa application photo",
      "Schengen visa photo",
      "travel visa photo",
    ],
    htmlLang: "en",
    locale: "en_US",
  },
  nav: { headerCta: "Prepare Visa Photo" },
  hero: {
    title: "AI Visa Photo Maker – Create a Visa Photo Online",
    subtitle:
      "Visa applications often ask for a recent, plain-background portrait with specific dimensions. AI Images Studio helps you start from a normal photo and prepare a clean visa-style image — while reminding you to verify the rules for your destination country.",
    primaryCta: "Create Visa-Style Photo",
    secondaryCta: "Why visa photos differ",
    secondaryTargetId: "why-difficult",
  },
  sections: [
    {
      type: "prose",
      id: "why-difficult",
      title: "Why visa photos can be difficult",
      paragraphs: [
        "Every destination country sets its own visa photo standards. Size, background color, head proportion, and even paper vs digital submission rules can differ between Schengen, US, UK, Canadian, and other visa categories.",
        "Applicants often discover these details late — after already taking casual photos or paying for studio sessions that used the wrong dimensions. Starting with a flexible online workflow lets you re-crop and re-export without another photoshoot.",
      ],
      bullets: [
        "Different width × height requirements (35×45 mm, 2×2 in, 33×48 mm, etc.)",
        "Background color may need to be white, off-white, or light grey",
        "Some embassies reject photos with shadows, glare on glasses, or incorrect head size",
        "Digital uploads may need a minimum resolution or specific file size limits",
      ],
    },
    {
      type: "prose",
      title: "Always verify official requirements first",
      paragraphs: [
        "Before submitting any visa application, read the photo guidance published by the embassy, consulate, or official visa portal for your destination. Requirements change, and third-party summaries may be outdated.",
        "AI Images Studio is a preparation tool — it helps you produce a clean portrait with background removal, lighting adjustment, and size presets. It does not guarantee visa approval or universal compliance with every country's rules.",
      ],
    },
    {
      type: "steps",
      title: "Prepare a visa-style photo online",
      items: [
        {
          title: "Confirm your destination's photo specification",
          description:
            "Note the required dimensions, background color, and whether the photo must be printed or uploaded digitally.",
        },
        {
          title: "Upload a suitable portrait",
          description:
            "Use a recent front-facing photo with even lighting and no filters.",
        },
        {
          title: "Apply the matching size preset",
          description:
            "Select 35×45 mm, 2×2 inches, or another preset that aligns with your visa category, then adjust the crop.",
        },
        {
          title: "Review background and face positioning",
          description:
            "Ensure the background looks plain and your face is centered with appropriate headroom.",
        },
        {
          title: "Download and submit according to official instructions",
          description:
            "Print on photo paper if required, or upload the digital file directly to the visa portal.",
        },
      ],
    },
    {
      type: "features",
      title: "Tools that help with visa photo preparation",
      items: [
        {
          icon: "🌍",
          title: "Multiple size presets",
          description:
            "Switch between common international formats without retaking the original portrait.",
        },
        {
          icon: "🧹",
          title: "Background cleanup",
          description:
            "Remove household clutter and replace it with a plain backdrop.",
        },
        {
          icon: "🔆",
          title: "Lighting balance",
          description:
            "Reduce harsh shadows that sometimes cause automated or manual rejection.",
        },
        {
          icon: "🖨️",
          title: "Print-ready output",
          description:
            "Export high-resolution files or 4R sheets for embassy submissions that require physical photos.",
        },
      ],
    },
    {
      type: "disclaimer",
      title: "Disclaimer",
      paragraphs: [
        "Visa decisions depend on many factors beyond your photo. AI Images Studio does not provide immigration advice and cannot guarantee that a prepared image will be accepted by any embassy or consulate.",
        "Use official government and embassy sources as the final authority on photo requirements.",
      ],
      links: [
        { href: "/en/passport-photo-background", label: "Background preparation guide" },
        { href: "/en/passport-photo-printing", label: "Printing visa photos" },
      ],
    },
  ],
  faq: {
    title: "Visa photo — FAQ",
    items: [
      {
        question: "Are Schengen and US visa photos the same size?",
        answer:
          "No. Schengen visa photos are commonly 35×45 mm, while US visa photos typically use 2×2 inches (51×51 mm). Always confirm the specification for your application.",
      },
      {
        question: "Can I prepare a visa photo from an old portrait?",
        answer:
          "Many visa rules require a photo taken within the last six months. Even if AI improves an older image, the capture date may still matter to the reviewing authority.",
      },
      {
        question: "Should I print or upload digitally?",
        answer:
          "That depends on the visa portal. Some accept digital uploads only; others require printed photos attached to paper forms. Follow the official submission method.",
      },
    ],
  },
  bottomCta: {
    title: "Preparing a visa application photo?",
    subtitle: "Upload your portrait and create a clean visa-style image with flexible size presets.",
    button: "Start Visa Photo Prep",
  },
  relatedPages: [
    { slug: "passport-photo-background", label: "Photo background guide" },
    { slug: "passport-photo", label: "Passport photo maker" },
    { slug: "us-passport-photo", label: "US photo requirements" },
    { slug: "passport-photo-printing", label: "Print photo sheets" },
  ],
  footer,
};

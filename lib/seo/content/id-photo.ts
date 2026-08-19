import type { SeoPageContent } from "@/lib/seo/types";

const footer = {
  privacy:
    "AI Images Studio · Photos are processed securely and never stored long-term on our servers.",
  supportLabel: "Support: ",
};

export const idPhotoPage: SeoPageContent = {
  slug: "id-photo",
  meta: {
    title: "AI ID Photo Maker – Create Professional ID Photos Online",
    description:
      "Turn a normal portrait into a professional ID photo with AI. Remove backgrounds, improve lighting and create a clean printable ID photo online.",
    keywords: [
      "ID photo maker",
      "ID photo online",
      "professional ID photo",
      "AI ID photo",
      "identification photo",
      "ID picture maker",
    ],
    htmlLang: "en",
    locale: "en_US",
  },
  nav: { headerCta: "Create ID Photo" },
  hero: {
    title: "AI ID Photo Maker – Create Professional ID Photos Online",
    subtitle:
      "Identification photos appear on employee badges, student cards, membership passes, and many online verification flows. AI Images Studio helps you turn an everyday portrait into a clean, consistent ID-style image — without a studio visit.",
    primaryCta: "Make Your ID Photo",
    secondaryCta: "See use cases",
    secondaryTargetId: "uses",
  },
  sections: [
    {
      type: "prose",
      id: "uses",
      title: "ID photos vs ordinary portraits",
      paragraphs: [
        "An ID photo is meant to identify you clearly — not to showcase a lifestyle moment. That usually means a plain background, even lighting, a direct gaze, and framing that shows your face and upper shoulders without distraction.",
        "A normal selfie often fails for ID purposes because of filters, tilted angles, busy backgrounds, or inconsistent lighting. Even when an organization does not publish strict rules, a cleaner ID-style image looks more professional and reads better at small sizes on badges and cards.",
      ],
    },
    {
      type: "prose",
      title: "Common uses for ID photos",
      bullets: [
        "Employee and contractor badge photos",
        "Student and campus ID applications",
        "Professional license or certification submissions",
        "Membership and access-control cards",
        "Online identity verification where a plain portrait is requested",
        "Internal HR records and directory profiles",
      ],
    },
    {
      type: "beforeAfter",
      title: "What changes when you prepare an ID-style photo",
      beforeTitle: "Typical casual portrait",
      afterTitle: "Prepared ID-style photo",
      before: [
        "Cluttered or colored background",
        "Uneven shadows on one side of the face",
        "Slight head tilt or off-center framing",
        "Casual crop that cuts off shoulders awkwardly",
      ],
      after: [
        "Plain, neutral background",
        "Balanced lighting across the face",
        "Straight-on framing suitable for badges",
        "Consistent crop that scales well when printed small",
      ],
    },
    {
      type: "features",
      title: "How AI Images Studio prepares ID photos",
      items: [
        {
          icon: "✂️",
          title: "AI background removal",
          description:
            "Replace distracting environments with a clean backdrop appropriate for identification portraits.",
        },
        {
          icon: "💡",
          title: "Lighting enhancement",
          description:
            "Improve exposure so facial details remain visible when the photo is printed small on a card.",
        },
        {
          icon: "👤",
          title: "Consistent facial identity",
          description:
            "Processing focuses on cleanup — not altering your features — so you still look like you.",
        },
        {
          icon: "📐",
          title: "Size presets",
          description:
            "Choose dimensions that match common ID and passport formats, or set custom millimeter sizes.",
        },
      ],
    },
    {
      type: "steps",
      title: "Create your ID photo in four steps",
      items: [
        {
          title: "Capture or upload a front-facing portrait",
          description:
            "Use a recent photo with your face fully visible. Avoid group shots or heavy filters.",
        },
        {
          title: "Select the dimensions you need",
          description:
            "Pick a preset that matches your organization's guidance, or enter custom width and height.",
        },
        {
          title: "Adjust crop and review the AI preview",
          description:
            "Fine-tune head position inside the crop frame and confirm the background looks clean.",
        },
        {
          title: "Download for digital use or printing",
          description:
            "Get a high-resolution file for online submission, or a 4R sheet if you need multiple physical copies.",
        },
      ],
    },
    {
      type: "disclaimer",
      title: "Check your organization's rules",
      paragraphs: [
        "Employers, schools, and licensing bodies sometimes publish their own ID photo specifications. AI Images Studio helps you prepare a professional image, but you should confirm any size, background color, or file format requirements before submitting.",
      ],
      links: [
        { href: "/en/passport-photo-background", label: "ID photo background guide" },
        { href: "/en/passport-photo-printing", label: "Printable ID photo sheets" },
      ],
    },
  ],
  faq: {
    title: "ID photo maker — FAQ",
    items: [
      {
        question: "Is an ID photo the same as a passport photo?",
        answer:
          "They are similar in style — plain background, clear face — but requirements differ by use case. Passport applications often have strict government rules; internal ID badges may be more flexible.",
      },
      {
        question: "Can I reuse one photo for multiple ID applications?",
        answer:
          "Sometimes, if the size and style meet each organization's rules. When in doubt, prepare a fresh crop for each specification.",
      },
      {
        question: "What file format will I receive?",
        answer:
          "You can download high-resolution JPEG output suitable for printing and most online uploads.",
      },
    ],
  },
  bottomCta: {
    title: "Need a professional ID photo today?",
    subtitle: "Upload a portrait and download a clean, printable ID-style image.",
    button: "Create ID Photo Free",
  },
  relatedPages: [
    { slug: "passport-photo-background", label: "Photo background remover" },
    { slug: "passport-photo-printing", label: "4R ID photo sheet" },
    { slug: "philippines-id-photo", label: "Philippines ID photos" },
    { slug: "passport-photo", label: "Passport photo maker" },
    { slug: "passport-photo-size", label: "Photo size chart" },
  ],
  footer,
};

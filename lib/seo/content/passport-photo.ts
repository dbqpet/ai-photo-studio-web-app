import type { SeoPageContent } from "@/lib/seo/types";

const footer = {
  privacy:
    "AI Images Studio · Photos are processed securely and never stored long-term on our servers.",
  supportLabel: "Support: ",
};

export const passportPhotoPage: SeoPageContent = {
  slug: "passport-photo",
  meta: {
    title: "AI Passport Photo Maker – Create a Professional Passport Photo Online",
    description:
      "Create a professional passport photo online from a normal portrait with AI. Remove the background, improve lighting and prepare a printable passport photo at home.",
    keywords: [
      "passport photo maker",
      "AI passport photo",
      "passport photo online",
      "professional passport photo",
      "passport photo at home",
      "online passport photo generator",
    ],
    htmlLang: "en",
    locale: "en_US",
  },
  nav: { headerCta: "Make Passport Photo" },
  hero: {
    title: "AI Passport Photo Maker – Create a Professional Passport Photo Online",
    subtitle:
      "Turn a normal portrait into a clean, professional-looking passport-style photo. Upload from your phone or computer, let AI handle background removal and lighting, then download a printable result in minutes.",
    primaryCta: "Create Your Passport Photo",
    secondaryCta: "How it works",
    secondaryTargetId: "how-it-works",
  },
  sections: [
    {
      type: "prose",
      title: "What is a passport photo?",
      paragraphs: [
        "A passport photo is a standardized portrait used on travel documents and many official applications. Unlike a casual selfie, it is usually taken against a plain background, with your face centered, evenly lit, and a neutral expression.",
        "People need passport photos when renewing or applying for a passport, updating travel documents, or preparing photos for related government forms. Because requirements vary by country, it is always your responsibility to confirm the latest rules for your specific application.",
      ],
    },
    {
      type: "prose",
      title: "Why passport photos are harder than they look",
      bullets: [
        "Busy or cluttered backgrounds that are hard to replace cleanly",
        "Uneven lighting, shadows, or color casts from indoor lamps",
        "Wrong framing — too much headroom or the face too small in the frame",
        "Casual angles, filters, or expressions that do not suit official portraits",
        "Last-minute deadlines when visiting a photo studio is inconvenient",
      ],
    },
    {
      type: "steps",
      id: "how-it-works",
      title: "How AI Images Studio helps you prepare a passport-style photo",
      items: [
        {
          title: "Upload a clear portrait",
          description:
            "Take or choose a front-facing photo with your shoulders visible. A recent smartphone picture is usually enough for the original portrait.",
        },
        {
          title: "Choose your target size preset",
          description:
            "Select a common passport or ID dimension preset — for example 35×45 mm or US 2×2 inches — then adjust crop and position.",
        },
        {
          title: "Let AI refine the image",
          description:
            "Background removal, lighting balance, and face-aware cropping help you move from a casual photo toward a clean, printable passport-style result.",
        },
        {
          title: "Preview, unlock, and download",
          description:
            "Review the watermarked preview. When you are satisfied, unlock the high-resolution file or a 4R print sheet with multiple copies.",
        },
      ],
    },
    {
      type: "features",
      title: "What you get with an AI passport photo workflow",
      items: [
        {
          icon: "🎯",
          title: "Background removal",
          description:
            "Replace messy home or office backgrounds with a clean, plain look suitable for passport-style portraits.",
        },
        {
          icon: "💡",
          title: "Lighting enhancement",
          description:
            "Balance exposure and reduce harsh shadows so your face is easier to see in the final image.",
        },
        {
          icon: "🧑",
          title: "Face preservation",
          description:
            "AI processing is designed to keep your facial identity natural — not an artificial makeover.",
        },
        {
          icon: "🖨️",
          title: "Printable output",
          description:
            "Download a high-resolution photo or arrange multiple copies on a standard 4R print sheet for home or shop printing.",
        },
      ],
    },
    {
      type: "disclaimer",
      title: "Important note on official requirements",
      paragraphs: [
        "AI Images Studio helps you prepare and print a professional-looking passport-style photo from a normal portrait. It does not automatically guarantee acceptance for every country or every application type.",
        "Governments update photo rules over time. Before you submit an application, verify the latest official requirements for your country and document type.",
      ],
      links: [
        {
          href: "/en/us-passport-photo",
          label: "US passport photo requirements guide",
        },
        {
          href: "/en/passport-photo-at-home",
          label: "How to take a passport photo at home",
        },
      ],
    },
  ],
  faq: {
    title: "Passport photo maker — FAQ",
    items: [
      {
        question: "Can I use a phone photo as the starting point?",
        answer:
          "Yes. Modern smartphone cameras are usually sharp enough for the original portrait, provided you use good lighting, stand at a sensible distance, and face the camera directly.",
      },
      {
        question: "Does AI Images Studio guarantee passport approval?",
        answer:
          "No. The tool helps you prepare a clean, printable passport-style image. Final acceptance depends on the official rules of the authority reviewing your application.",
      },
      {
        question: "What size presets are available?",
        answer:
          "Common presets include 35×45 mm (widely used in Europe and Hong Kong), US 2×2 inches, Hong Kong passport 40×50 mm, and custom millimeter sizes if you need flexibility.",
      },
      {
        question: "Can I print multiple copies on one sheet?",
        answer:
          "Yes. You can download a 4R layout that arranges several photos on one standard print sheet — useful when you need spare copies for forms or family members.",
      },
    ],
  },
  bottomCta: {
    title: "Ready to create your passport-style photo?",
    subtitle: "Upload a portrait, choose a size preset, and download a printable result in minutes.",
    button: "Start Free — Upload Photo",
  },
  relatedPages: [
    { slug: "passport-photo-at-home", label: "Passport photo at home" },
    { slug: "passport-photo-with-phone", label: "Passport photo with phone" },
    { slug: "us-passport-photo", label: "US passport photo guide" },
    { slug: "passport-photo-printing", label: "Passport photo printing" },
  ],
  footer,
};

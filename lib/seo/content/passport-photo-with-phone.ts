import type { SeoPageContent } from "@/lib/seo/types";

const footer = {
  privacy:
    "AI Images Studio · Photos are processed securely and never stored long-term on our servers.",
  supportLabel: "Support: ",
};

export const passportPhotoWithPhonePage: SeoPageContent = {
  slug: "passport-photo-with-phone",
  meta: {
    title: "How to Take a Passport Photo With Your Phone",
    description:
      "Learn how to take a passport-style photo with your phone and turn your portrait into a clean professional photo online with AI.",
    keywords: [
      "passport photo with phone",
      "smartphone passport photo",
      "take passport photo iPhone",
      "phone ID photo",
      "mobile passport photo",
    ],
    htmlLang: "en",
    locale: "en_US",
  },
  nav: { headerCta: "Upload Phone Photo" },
  hero: {
    title: "How to Take a Passport Photo With Your Phone",
    subtitle:
      "Your smartphone is already a capable camera. This practical guide shows how to capture a portrait that works well as the starting point for a passport-style photo — then how to prepare the final image online.",
    primaryCta: "Upload From Phone",
    secondaryCta: "Phone setup tips",
    secondaryTargetId: "setup",
  },
  sections: [
    {
      type: "prose",
      title: "Why your phone is enough for the original portrait",
      paragraphs: [
        "Passport and ID applications care about clarity, lighting, and composition — not whether the photo was taken on a DSLR. Modern phones capture more than enough resolution for a head-and-shoulders portrait when you follow a few simple setup rules.",
        "The phone handles capture; AI Images Studio handles preparation — background cleanup, sizing, and printable output.",
      ],
    },
    {
      type: "prose",
      id: "setup",
      title: "Phone positioning and distance",
      bullets: [
        "Place the phone at eye level — use a tripod, stack of books, or ask someone to hold it steady",
        "Stand about 1–1.5 meters (3–5 feet) from the camera for a natural head-and-shoulders frame",
        "Use the rear camera when possible; it typically has higher quality than the selfie camera",
        "Enable grid lines in your camera app to keep your face centered",
        "Use a timer or remote shutter to avoid arm-length distortion from selfies",
      ],
    },
    {
      type: "prose",
      title: "Lighting and background with a phone",
      subsections: [
        {
          title: "Lighting",
          bullets: [
            "Face a window during daytime for soft, even light",
            "If indoors at night, place two lamps in front of you at 45° angles",
            "Avoid standing directly under a ceiling light — it creates nose shadows",
            "Watch for screen reflections if someone else is holding the phone",
          ],
        },
        {
          title: "Background",
          bullets: [
            "A plain wall works best",
            "If the background is busy, you can still proceed — AI background removal helps later",
            "Do not use digital background blur; it can look unnatural for official portraits",
          ],
        },
      ],
    },
    {
      type: "steps",
      title: "From phone capture to printable passport photo",
      items: [
        {
          title: "Take 10–15 photos with a neutral expression",
          description:
            "Pick the sharpest image where your eyes are fully open and your head is straight.",
        },
        {
          title: "Transfer the photo if needed",
          description:
            "AirDrop, cloud sync, or email the file to your computer — or upload directly from the phone browser at aiimagesstudio.com.",
        },
        {
          title: "Upload to AI Images Studio",
          description:
            "Select your best portrait. The tool works in mobile browsers without installing an app.",
        },
        {
          title: "Choose size, crop, and process",
          description:
            "Apply a passport preset, adjust the crop frame, and let AI clean the background and lighting.",
        },
        {
          title: "Download or print",
          description:
            "Save the high-resolution file or a 4R sheet for printing at home or at a shop.",
        },
      ],
    },
    {
      type: "prose",
      title: "Common phone photo mistakes to avoid",
      bullets: [
        "Holding the phone too low or too high, causing unflattering angles",
        "Standing too close, which widens the face in wide-angle lenses",
        "Using portrait mode beauty filters that smooth skin unnaturally",
        "Cutting off the top of the head or shoulders in the frame",
        "Submitting a screenshot instead of the original image file",
      ],
    },
    {
      type: "solution",
      title: "After capture — prepare the photo online",
      paragraphs: [
        "Once you have a decent phone portrait, AI Images Studio takes over:",
      ],
      bullets: [
        "Background removal for a plain, passport-style look",
        "Lighting enhancement to reduce shadows",
        "Crop tools aligned to official size presets",
        "Downloadable print layouts including 4R multi-photo sheets",
      ],
    },
  ],
  faq: {
    title: "Phone passport photo — FAQ",
    items: [
      {
        question: "Front camera or rear camera?",
        answer:
          "Rear cameras usually produce sharper, less distorted results. If you must use the front camera, hold the phone farther away and use a timer.",
      },
      {
        question: "Can I do everything on my phone without a computer?",
        answer:
          "Yes. Open aiimagesstudio.com in your mobile browser, upload the photo, and download the result directly to your phone.",
      },
      {
        question: "What image format should I upload?",
        answer:
          "JPEG, PNG, and WebP from your camera roll are supported. Use the original file rather than a compressed messaging app download when possible.",
      },
    ],
  },
  bottomCta: {
    title: "Have a phone photo ready?",
    subtitle: "Upload it now and turn it into a clean passport-style image.",
    button: "Upload Phone Photo",
  },
  relatedPages: [
    { slug: "passport-photo-at-home", label: "Passport photo at home" },
    { slug: "passport-photo", label: "Passport photo maker" },
    { slug: "passport-photo-background", label: "Fix photo background" },
    { slug: "passport-photo-printing", label: "Print your photos" },
  ],
  footer,
};

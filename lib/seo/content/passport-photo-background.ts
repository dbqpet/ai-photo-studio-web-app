import type { SeoPageContent } from "@/lib/seo/types";

const footer = {
  privacy:
    "AI Images Studio · Photos are processed securely and never stored long-term on our servers.",
  supportLabel: "Support: ",
};

export const passportPhotoBackgroundPage: SeoPageContent = {
  slug: "passport-photo-background",
  meta: {
    title: "Passport Photo Background Remover – Create a Clean ID Photo Online",
    description:
      "Remove an unsuitable background from a portrait and create a clean passport or ID-style photo online with AI.",
    keywords: [
      "passport photo background",
      "remove background passport photo",
      "ID photo background remover",
      "plain background ID photo",
      "passport photo background white",
    ],
    htmlLang: "en",
    locale: "en_US",
  },
  nav: { headerCta: "Remove Background" },
  hero: {
    title: "Passport Photo Background Remover – Create a Clean ID Photo Online",
    subtitle:
      "A messy background is one of the fastest ways to ruin an otherwise good portrait. Learn why background matters for passport and ID photos — and how AI removes distractions while keeping your face natural.",
    primaryCta: "Fix My Photo Background",
    secondaryCta: "Common problems",
    secondaryTargetId: "problems",
  },
  sections: [
    {
      type: "prose",
      title: "Why background matters for passport and ID photos",
      paragraphs: [
        "Official portraits are meant to isolate your face, not your living room. Reviewers — human or automated — look for a plain, evenly lit backdrop that makes facial features easy to see.",
        "Background rules vary: some countries require pure white, others accept off-white or light grey. Always confirm the acceptable colors for your specific application.",
      ],
    },
    {
      type: "prose",
      id: "problems",
      title: "Common background problems",
      bullets: [
        "Furniture, door frames, or patterns visible behind the head",
        "Strong color casts from painted walls (bright blue, yellow, or green)",
        "Shadows cast on the wall that look like shapes or edges",
        "Outdoor scenes with trees, sky, or buildings in frame",
        "Other people or objects partially visible at the edges",
        "Using fake digital blur that creates halos around hair",
      ],
    },
    {
      type: "beforeAfter",
      title: "What background removal should achieve",
      beforeTitle: "Before",
      afterTitle: "After",
      before: [
        "Cluttered home environment",
        "Uneven wall color and shadow edges",
        "Distracting objects near shoulders",
        "Hard to crop cleanly to official dimensions",
      ],
      after: [
        "Plain, neutral backdrop",
        "Cleaner edge around hair and shoulders",
        "Focus drawn to the face",
        "Easier to size for passport or ID presets",
      ],
    },
    {
      type: "features",
      title: "How AI background removal works in AI Images Studio",
      items: [
        {
          icon: "🎭",
          title: "Subject detection",
          description:
            "AI identifies your outline — including fine hair strands — to separate you from the environment.",
        },
        {
          icon: "⬜",
          title: "Plain replacement",
          description:
            "The background is replaced with a clean, solid tone suitable for ID-style portraits.",
        },
        {
          icon: "💡",
          title: "Lighting balance",
          description:
            "Exposure is adjusted so your face does not look pasted-on against the new backdrop.",
        },
        {
          icon: "🧑",
          title: "Face preservation",
          description:
            "Processing targets the background — your facial identity stays natural without heavy retouching.",
        },
      ],
    },
    {
      type: "steps",
      title: "Remove a passport photo background in three steps",
      items: [
        {
          title: "Upload your portrait",
          description:
            "Choose the highest-quality original from your camera roll. Avoid screenshots or heavily compressed files.",
        },
        {
          title: "Process with AI",
          description:
            "Background removal and lighting enhancement run automatically. Preview the result before paying.",
        },
        {
          title: "Crop, download, or print",
          description:
            "Apply the size preset you need and export a high-resolution file or 4R print layout.",
        },
      ],
    },
    {
      type: "disclaimer",
      title: "Background color varies by country",
      paragraphs: [
        "AI Images Studio produces a clean, plain background appropriate for many passport and ID-style uses. It does not guarantee that the exact shade meets every country's specification (white vs off-white vs light blue).",
        "Verify acceptable background colors with the official authority handling your application.",
      ],
      links: [
        { href: "/en/visa-photo", label: "Visa photo preparation" },
        { href: "/en/id-photo", label: "ID photo maker" },
        { href: "/en/us-passport-photo", label: "US passport background rules" },
      ],
    },
  ],
  faq: {
    title: "Background removal — FAQ",
    items: [
      {
        question: "Can AI handle curly or fine hair?",
        answer:
          "Modern models preserve hair detail better than manual cutouts, though extremely busy backgrounds may still require a cleaner original photo for best results.",
      },
      {
        question: "Will the background be pure white?",
        answer:
          "The output uses a plain light backdrop suited to ID-style photos. Compare against your application's required color and adjust expectations if pure white is mandatory.",
      },
      {
        question: "Can I fix background without retaking the photo?",
        answer:
          "Often yes — if the original is sharp and your face is well lit. Starting with a plain wall still produces the most reliable results.",
      },
    ],
  },
  bottomCta: {
    title: "Fix your photo background now",
    subtitle: "Upload a portrait and replace a messy backdrop with a clean ID-style background.",
    button: "Remove Background Free Preview",
  },
  relatedPages: [
    { slug: "id-photo", label: "ID photo maker" },
    { slug: "passport-photo-printing", label: "Print photo sheets" },
    { slug: "passport-photo-at-home", label: "Better home backgrounds" },
    { slug: "visa-photo", label: "Visa photo guide" },
  ],
  footer,
};

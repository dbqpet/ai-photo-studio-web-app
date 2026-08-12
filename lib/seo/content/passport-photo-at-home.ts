import type { SeoPageContent } from "@/lib/seo/types";

const footer = {
  privacy:
    "AI Images Studio · Photos are processed securely and never stored long-term on our servers.",
  supportLabel: "Support: ",
};

export const passportPhotoAtHomePage: SeoPageContent = {
  slug: "passport-photo-at-home",
  meta: {
    title: "How to Take a Passport Photo at Home – AI Passport Photo Maker",
    description:
      "Need a passport photo at home? Learn how to take a suitable portrait with your phone and turn it into a professional passport-style photo online.",
    keywords: [
      "passport photo at home",
      "take passport photo at home",
      "DIY passport photo",
      "passport photo without studio",
      "home passport photo guide",
    ],
    htmlLang: "en",
    locale: "en_US",
  },
  nav: { headerCta: "Prepare Photo Now" },
  hero: {
    title: "How to Take a Passport Photo at Home",
    subtitle:
      "You do not always need a photo booth. With the right setup at home and a few practical steps, you can capture a suitable portrait and prepare a clean passport-style photo online — saving time and avoiding a trip to the studio.",
    primaryCta: "Upload Your Home Photo",
    secondaryCta: "Step-by-step guide",
    secondaryTargetId: "steps",
  },
  sections: [
    {
      type: "prose",
      title: "Why take a passport photo at home?",
      paragraphs: [
        "Photo studios can be convenient, but they are not always nearby, fast, or affordable — especially when you need photos for multiple family members or a last-minute application.",
        "Taking the original portrait at home gives you control over timing, retakes, and comfort. The key is separating two tasks: first capture a good source photo, then use a dedicated tool to prepare the final passport-style image.",
      ],
    },
    {
      type: "prose",
      title: "Before you start — choose the right spot",
      bullets: [
        "Stand in front of a plain wall if possible — white, off-white, or light grey works best",
        "Face a window for soft natural light, or use two lamps at 45° angles to reduce shadows",
        "Avoid backlighting (bright window behind you) which silhouettes your face",
        "Clear clutter from the frame so background removal is easier later",
        "Wear plain clothing that contrasts gently with the wall — avoid busy patterns",
      ],
    },
    {
      type: "steps",
      id: "steps",
      title: "Step-by-step: from home portrait to printable passport photo",
      items: [
        {
          title: "Set up lighting and background",
          description:
            "Pick a wall with even light on your face. Turn off mixed-color overhead lights if they cast a yellow tint. Stand about one arm's length from the wall to reduce shadows.",
        },
        {
          title: "Position your phone or camera",
          description:
            "Hold the phone at eye level using a tripod, shelf, or helper. Frame your head and the tops of your shoulders. Leave a little space above your head.",
        },
        {
          title: "Take multiple shots with a neutral expression",
          description:
            "Look straight at the lens, keep both eyes open, and relax your face. Take 10–15 photos so you can pick the sharpest one with the least shadow.",
        },
        {
          title: "Upload the best portrait to AI Images Studio",
          description:
            "Choose the clearest image. The tool removes the background, balances lighting, and lets you crop to a passport size preset.",
        },
        {
          title: "Review, download, and print",
          description:
            "Check the preview carefully. Download a high-resolution file or a 4R sheet, then print at home on photo paper or at a local print shop.",
        },
      ],
    },
    {
      type: "prose",
      title: "Tips that make a real difference",
      subsections: [
        {
          title: "Facial expression and posture",
          paragraphs: [
            "Keep your mouth closed and maintain a natural expression. Face the camera directly — turning even slightly can cause issues with automated cropping.",
          ],
        },
        {
          title: "Clothing and accessories",
          bullets: [
            "Remove hats unless required for religious purposes",
            "Tuck hair behind ears if your application requires ears to be visible",
            "Avoid heavy filters or beauty modes on your phone",
          ],
        },
        {
          title: "Printing at home",
          paragraphs: [
            "Use glossy or matte photo paper and your printer's highest quality setting. If home printing looks soft, a pharmacy or photo kiosk often produces sharper results from your digital file.",
          ],
        },
      ],
    },
    {
      type: "solution",
      title: "Where AI Images Studio fits in",
      paragraphs: [
        "Your phone captures the original portrait. AI Images Studio handles the preparation work that is difficult to do manually:",
      ],
      bullets: [
        "Clean background replacement",
        "Exposure and lighting balance",
        "Size-aware cropping for common passport presets",
        "High-resolution download and 4R multi-photo layouts",
      ],
    },
    {
      type: "disclaimer",
      title: "Verify requirements before submitting",
      paragraphs: [
        "Home capture is flexible, but every country sets its own passport photo rules. Check the official guidance for your application before submitting a photo.",
      ],
      links: [
        { href: "/en/us-passport-photo", label: "US passport photo requirements" },
        { href: "/en/passport-photo", label: "AI passport photo maker overview" },
      ],
    },
  ],
  faq: {
    title: "Passport photo at home — FAQ",
    items: [
      {
        question: "Is a home photo good enough quality?",
        answer:
          "Often yes. Modern phone cameras exceed the resolution needed for the source portrait. Good lighting and a steady camera matter more than an expensive device.",
      },
      {
        question: "What background should I use at home?",
        answer:
          "A plain light-colored wall is ideal. If your wall has texture or color, AI background removal can still help — but a simple backdrop makes the best starting point.",
      },
      {
        question: "Can I wear glasses in the photo?",
        answer:
          "Rules vary. Some countries allow glasses if there is no glare; others discourage them. Check your official requirements before relying on a glasses photo.",
      },
    ],
  },
  bottomCta: {
    title: "Already took your photo at home?",
    subtitle: "Upload it now and prepare a clean passport-style image in minutes.",
    button: "Upload & Prepare Photo",
  },
  relatedPages: [
    { slug: "passport-photo-with-phone", label: "Passport photo with phone" },
    { slug: "passport-photo-background", label: "Passport photo background" },
    { slug: "passport-photo-printing", label: "Print passport photos" },
    { slug: "passport-photo", label: "Passport photo maker" },
  ],
  footer,
};

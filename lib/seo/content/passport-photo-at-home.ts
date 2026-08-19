import type { SeoPageContent } from "@/lib/seo/types";
import { enSeoFooter } from "@/lib/seo/content/en-shared";

export const passportPhotoAtHomePage: SeoPageContent = {
  slug: "passport-photo-at-home",
  meta: {
    title: "How to Take a Passport Photo at Home – Lighting, Background & Setup",
    description:
      "Take a passport photo at home: lighting, background, distance from the wall, clothing, and simple equipment. Then prepare a printable photo online — camera app settings are covered in the phone guide.",
    keywords: [
      "passport photo at home",
      "take passport photo at home",
      "DIY passport photo",
      "passport photo lighting",
      "passport photo background at home",
      "home passport photo setup",
    ],
    htmlLang: "en",
    locale: "en_US",
  },
  nav: { headerCta: "Prepare Photo Now" },
  hero: {
    title: "How to Take a Passport Photo at Home",
    subtitle:
      "You do not need a photo booth. This guide is about the room: lighting, background, positioning, and simple equipment. For iPhone and Android camera menus, use the companion phone guide — then upload the portrait to prepare a printable passport-style photo.",
    primaryCta: "Upload Your Home Photo",
    secondaryCta: "Room setup steps",
    secondaryTargetId: "setup",
  },
  sections: [
    {
      type: "prose",
      title: "What “at home” really means",
      paragraphs: [
        "A studio visit is optional if you can control three things: even light on the face, a plain backdrop, and a steady camera at eye level. The original portrait can be taken in a living room or hallway; sizing, background cleanup, and print layout happen afterwards.",
        "This page does not cover Camera app toggles (grid, timer, Portrait Mode). Those live on the phone passport photo guide so each page stays focused.",
      ],
    },
    {
      type: "prose",
      id: "setup",
      title: "Lighting setup at home",
      paragraphs: [
        "Even light is more important than an expensive camera. Harsh overhead bulbs and windows behind you are the two most common home-lighting failures.",
      ],
      bullets: [
        "Face a large window in daytime — this is the simplest “softbox” you already own",
        "If you shoot at night, put two lamps in front of you at about 45° left and right",
        "Turn off mixed-colour ceiling lights that add a yellow or green cast",
        "Never stand with a bright window behind you; it silhouettes the face",
        "Stand slightly away from the wall so your body does not cast a shadow on the backdrop",
      ],
    },
    {
      type: "prose",
      title: "Background and positioning",
      bullets: [
        "Use a plain wall — white, off-white, or light grey. Remove posters, switches in frame, and hanging clothes",
        "Stand about one arm’s length from the wall to reduce shadow on the backdrop",
        "Keep the camera (or the person holding it) at your eye height so you are not looking up or down",
        "Frame head and the tops of the shoulders; leave a little space above the hair",
        "Distance to camera is typically 1–1.5 meters (3–5 feet) for a natural head-and-shoulders crop",
      ],
    },
    {
      type: "prose",
      title: "Simple equipment (no studio kit required)",
      subsections: [
        {
          title: "What helps",
          bullets: [
            "A stack of books, a shelf, or a cheap phone tripod so the camera stays still",
            "A helper who can hold the phone at eye level if you have no tripod",
            "Plain clothing that contrasts gently with the wall — avoid busy logos and white-on-white",
            "A second lamp if one side of the face is darker than the other",
          ],
        },
        {
          title: "What you can skip",
          bullets: [
            "Professional backdrops — a clean painted wall is enough",
            "Ring lights pressed close to the face (they often create hotspots and glasses glare)",
            "DSLR cameras — a modern phone is enough for the source portrait",
          ],
        },
      ],
    },
    {
      type: "steps",
      id: "steps",
      title: "From home setup to a printable photo",
      items: [
        {
          title: "Pick the wall and the light",
          description:
            "Choose a blank wall and put daylight (or two front lamps) on your face. Clear clutter from the frame.",
        },
        {
          title: "Set height and distance",
          description:
            "Place the camera at eye level, stand a little off the wall, and leave space above the head in the frame.",
        },
        {
          title: "Take several neutral-expression shots",
          description:
            "Look straight ahead, both eyes open, mouth closed. Take 10–15 photos so you can pick the sharpest one.",
        },
        {
          title: "Upload the best portrait",
          description:
            "In AI Images Studio, choose a passport size preset, crop, and let AI clean the background and lighting.",
        },
        {
          title: "Download or print",
          description:
            "Save a high-resolution file or a 4R sheet, then print on photo paper at home or at a shop.",
        },
      ],
    },
    {
      type: "prose",
      title: "Clothing, hair, and expression",
      bullets: [
        "Keep a natural, closed-mouth expression unless your authority allows a slight smile",
        "Remove hats unless worn daily for religious reasons",
        "Tuck hair behind the ears if your application requires ears to be visible",
        "Avoid heavy makeup looks that change your everyday appearance",
      ],
    },
    {
      type: "solution",
      title: "Where AI Images Studio fits in",
      paragraphs: [
        "You control the room. The tool handles preparation that is awkward to do in a phone gallery:",
      ],
      bullets: [
        "Clean background replacement",
        "Exposure and shadow balance",
        "Size-aware cropping for common passport presets",
        "High-resolution download and 4R multi-photo layouts",
      ],
    },
    {
      type: "disclaimer",
      title: "Verify requirements before submitting",
      paragraphs: [
        "Home capture is flexible, but every country sets its own rules. Check official guidance for your application before you submit.",
      ],
      links: [
        { href: "/en/passport-photo-with-phone", label: "How to take a passport photo with your phone" },
        { href: "/en/passport-photo-requirements", label: "Passport photo requirements" },
        { href: "/en/passport-photo-size", label: "Passport photo size by country" },
      ],
    },
  ],
  faq: {
    title: "Passport photo at home — FAQ",
    items: [
      {
        question: "Is a home photo good enough quality?",
        answer:
          "Often yes. Lighting and a steady, eye-level camera matter more than a studio visit. Use a plain wall and window light, then prepare the official size online.",
      },
      {
        question: "What background should I use at home?",
        answer:
          "A plain light-coloured wall is ideal. Texture or colour can still be cleaned up later, but a simple backdrop is the best starting point.",
      },
      {
        question: "Where do I find iPhone or Android camera settings?",
        answer:
          "See the dedicated guide on how to take a passport photo with your phone — grid, timer, Portrait Mode off, and Android equivalents are covered there so this page can stay focused on the room.",
      },
      {
        question: "Can I wear glasses in the photo?",
        answer:
          "Rules vary. Some countries allow glasses with no glare; others do not. Check your official requirements before relying on a glasses photo.",
      },
    ],
  },
  bottomCta: {
    title: "Already set up the room?",
    subtitle: "Upload your home portrait and prepare a clean passport-style image in minutes.",
    button: "Upload & Prepare Photo",
  },
  relatedPages: [
    { slug: "passport-photo-with-phone", label: "Passport photo with phone" },
    { slug: "passport-photo-requirements", label: "Photo requirements" },
    { slug: "passport-photo-size", label: "Photo size chart" },
    { slug: "passport-photo-printing", label: "4R print sheet" },
    { slug: "passport-photo", label: "Passport photo maker" },
  ],
  footer: enSeoFooter,
};

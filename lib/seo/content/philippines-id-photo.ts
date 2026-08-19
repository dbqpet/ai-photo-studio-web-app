import type { SeoPageContent } from "@/lib/seo/types";
import { enSeoFooter } from "@/lib/seo/content/en-shared";

const PH_DFA_URL = "https://www.dfa.gov.ph/";

export const philippinesIdPhotoPage: SeoPageContent = {
  slug: "philippines-id-photo",
  meta: {
    title: "Philippines ID Photo & 4R Grid – DFA, NBI, PRC, Postal ID",
    description:
      "Philippines ID photo sizes: DFA passport 35×45 mm vs 2×2 inches for NBI, PRC, and postal ID. Make a 4R grid layout of identical photos for printing.",
    keywords: [
      "Philippines ID photo",
      "Philippines passport photo",
      "2x2 ID picture Philippines",
      "NBI PRC postal ID photo",
      "4R ID photo grid",
      "DFA passport photo size",
    ],
    htmlLang: "en",
    locale: "en_PH",
  },
  nav: { headerCta: "Make PH ID Photo" },
  hero: {
    title: "Philippines ID Photo – DFA, NBI, PRC, Postal ID & 4R Grid",
    subtitle:
      "Philippine documents do not all use the same size. DFA passport photos are commonly 4.5×3.5 cm (35×45 mm). NBI clearance, PRC, postal ID, and many local IDs still ask for a 2×2 inch colour photo. Print several copies on one 4R (4×6 in) sheet.",
    primaryCta: "Create 2×2 or 35×45 Photo",
    secondaryCta: "Sizes for PH IDs",
    secondaryTargetId: "sizes",
  },
  sections: [
    {
      type: "disclaimer",
      title: "Confirm with DFA, NBI, PRC, or your LGU",
      paragraphs: [
        "Requirements differ by office and can change. Use this as a size and layout guide, then follow the instruction sheet you were given.",
      ],
      links: [
        { href: PH_DFA_URL, label: "Department of Foreign Affairs (DFA)" },
      ],
    },
    {
      type: "prose",
      id: "sizes",
      title: "Philippines photo sizes at a glance",
      paragraphs: [
        "Do not submit a 2×2 print when the DFA asked for 4.5×3.5 cm, or the reverse. Prepare two crops from the same portrait if you need both a passport and an NBI photo.",
      ],
      bullets: [
        "DFA passport (common): 4.5 × 3.5 cm (45 × 35 mm) — white background",
        "NBI clearance: typically 2×2 inches, white background, recent photo",
        "PRC (professional ID): typically 2×2 inches per the current PRC photo guide",
        "Postal ID and many barangay / school IDs: 2×2 inches",
        "Print layout: 4R (4×6 inches / 102×152 mm) with a grid of identical photos and cut guides",
      ],
    },
    {
      type: "prose",
      title: "4R grid layout for Philippine ID photos",
      paragraphs: [
        "Photo shops in the Philippines often print a 4R sheet filled with 2×2 pictures. That is the same idea as AI Images Studio’s 4R print sheet: one file, several copies, cut after printing.",
        "A 4R sheet is paper size — not the ID specification. Each cut-out must still be 2×2 inches or 35×45 mm, whichever your office listed.",
      ],
      image: {
        src: "/images/4r_layout_illustration_2.png",
        alt: "4R print sheet layout with a grid of identical ID photos for cutting",
        caption: "Use a 4R (4×6 in) grid to print several identical 2×2 or passport-size photos at once.",
        layout: "below",
      },
    },
    {
      type: "prose",
      title: "Shared PH ID photo habits",
      bullets: [
        "White background, even light, no heavy shadows",
        "Neutral expression; many offices still prefer no eyeglasses",
        "Formal or plain attire; avoid sando / sleeveless when the form asks for decent clothing",
        "Taken recently — NBI and passport photos are often expected within the last 3–6 months",
      ],
    },
    {
      type: "steps",
      title: "Prepare a Philippines ID or passport photo",
      items: [
        {
          title: "Read the size on your form",
          description:
            "Note 2×2 inches versus 4.5×3.5 cm before you crop.",
        },
        {
          title: "Take a plain-wall portrait",
          description:
            "Front light, eye-level camera, white or light wall.",
        },
        {
          title: "Upload and pick the matching preset",
          description:
            "2×2 inches for NBI/PRC/postal ID, or 35×45 mm for a typical DFA passport photo.",
        },
        {
          title: "Generate a 4R grid",
          description:
            "Download a 4R sheet with several copies for the photo shop or a home printer.",
        },
        {
          title: "Cut and check millimetres",
          description:
            "Measure one print with a ruler before you submit the set.",
        },
      ],
    },
    {
      type: "solution",
      title: "How AI Images Studio helps",
      bullets: [
        "White background cleanup",
        "2×2 and 35×45 mm presets",
        "4R multi-photo grid with cut guides",
        "Works from a phone browser — useful before an NBI or DFA appointment",
      ],
    },
    {
      type: "disclaimer",
      title: "What we do not claim",
      paragraphs: [
        "AI Images Studio does not guarantee DFA, NBI, PRC, or PHLPost acceptance. Some sites still require you to have the photo taken on-site. Bring a compliant print only when the office allows it.",
      ],
      links: [
        { href: "/en/passport-photo-printing", label: "4R photo size and print sheet" },
        { href: "/en/passport-photo-size", label: "International size chart" },
        { href: "/en/id-photo", label: "ID photo maker" },
      ],
    },
  ],
  faq: {
    title: "Philippines ID photo — FAQ",
    items: [
      {
        question: "Is a 2×2 ID picture the same as a DFA passport photo?",
        answer:
          "Usually no. Many IDs use 2×2 inches. DFA passport photos are commonly 4.5×3.5 cm (35×45 mm). Prepare the size printed on your appointment slip.",
      },
      {
        question: "What is a 4R ID photo grid?",
        answer:
          "4R is a 4×6 inch print. A grid layout places several identical 2×2 or passport photos on that sheet so you cut them after printing — the usual photo-shop format in the Philippines.",
      },
      {
        question: "Can I use the same photo for NBI and PRC?",
        answer:
          "If both ask for a recent 2×2 colour photo with a white background, one crop can serve both. Always check each agency’s latest clothing and glasses rules.",
      },
      {
        question: "Can I take the photo with my phone?",
        answer:
          "Yes for the source portrait. Use even light and a plain wall, then crop to 2×2 or 35×45 mm and print on 4R.",
      },
    ],
  },
  bottomCta: {
    title: "Need 2×2 or DFA-size prints on a 4R sheet?",
    subtitle: "Upload a portrait, pick the size your office listed, and download a print-ready 4R grid.",
    button: "Create Philippines ID Photos",
  },
  relatedPages: [
    { slug: "passport-photo-printing", label: "4R photo size & layout" },
    { slug: "passport-photo-size", label: "Photo size chart" },
    { slug: "passport-photo-requirements", label: "Photo requirements" },
    { slug: "id-photo", label: "ID photo maker" },
    { slug: "passport-photo", label: "Passport photo maker" },
  ],
  footer: enSeoFooter,
};

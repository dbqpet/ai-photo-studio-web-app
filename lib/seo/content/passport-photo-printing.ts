import type { SeoPageContent } from "@/lib/seo/types";
import { enSeoFooter } from "@/lib/seo/content/en-shared";

export const passportPhotoPrintingPage: SeoPageContent = {
  slug: "passport-photo-printing",
  meta: {
    title: "4R Photo Size & 4R ID Photo Maker – Printable 4×6 Sheet",
    description:
      "What is 4R photo size? 4×6 inches (102×152 mm). Create a 4R ID photo layout online — multiple passport or ID photos on one print-ready 4R sheet.",
    keywords: [
      "4R photo size",
      "4R ID photo maker",
      "4R photo layout",
      "4R print sheet",
      "4x6 photo sheet",
      "printable ID photos",
      "passport photo printing",
    ],
    htmlLang: "en",
    locale: "en_US",
  },
  nav: { headerCta: "Create 4R Sheet" },
  hero: {
    title: "4R Photo Size – Printable ID & Passport Photo Layout",
    subtitle:
      "4R is the everyday photo print most shops call 4×6. Use it as a 4R ID photo maker: tile several identical passport or ID photos on one sheet, print once, and cut.",
    primaryCta: "Build 4R Print Sheet",
    secondaryCta: "What is 4R size?",
    secondaryTargetId: "what-is-4r",
  },
  sections: [
    {
      type: "prose",
      id: "what-is-4r",
      title: "What is 4R photo size?",
      paragraphs: [
        "4R photo size is 4×6 inches (about 102×152 mm). It is the same sheet many kiosks label as 4×6, 10×15 cm, or simply “standard print.”",
        "AI Images Studio uses that sheet as a 4R photo layout: several copies of your ID or passport photo on one high-resolution page, usually with cut guides, so one shop order covers spare prints.",
      ],
      bullets: [
        "4R = 4×6 in = 102×152 mm",
        "Typical print resolution: 300 DPI (about 1200×1800 pixels for the full sheet)",
        "One sheet can hold multiple 35×45 mm, 2×2 in, or other ID sizes depending on the crop",
      ],
      image: {
        src: "/images/4r_layout_illustration_1.png",
        alt: "4R photo sheet with a grid of identical ID photos and cut guides next to trimmed prints",
        caption: "A 4R (4×6 in) sheet with multiple print-ready ID photos and cut guides.",
        layout: "below",
      },
    },
    {
      type: "prose",
      title: "4R ID photo layout — not only passports",
      paragraphs: [
        "A 4R sheet is useful for any small official portrait: employee badges, student IDs, visa copies, and country-specific cards — not just passports.",
        "If you need several identical prints (forms that ask for two photos, family applications, or a spare in the drawer), a 4R ID photo maker is cheaper than ordering each photo as a separate 2×2 print.",
      ],
      bullets: [
        "Passport photos (35×45 mm, UK, Schengen, Philippines DFA, and similar)",
        "US-style 2×2 inch photos for passports, many visas, and some IDs",
        "School, work, and membership ID photos that print small",
        "Philippines 2×2 IDs (NBI, PRC, postal ID) arranged as a 4R grid",
      ],
    },
    {
      type: "prose",
      title: "Why arrange multiple photos on one 4R sheet?",
      bullets: [
        "Print several identical copies from a single 4×6 / 4R order",
        "Lower cost than one photo per shop order",
        "Keep spares if a form needs two photos or a print is damaged",
        "Prepare photos for more than one family member in one print run",
      ],
    },
    {
      type: "steps",
      title: "How to create a 4R ID photo sheet",
      items: [
        {
          title: "Prepare the source portrait",
          description:
            "Upload a clear photo, choose the ID or passport size you need, and generate a clean preview.",
        },
        {
          title: "Generate the 4R layout",
          description:
            "Create a 4R photo layout that tiles copies on one 4×6 inch sheet. Preview spacing before you pay.",
        },
        {
          title: "Download the high-resolution sheet",
          description:
            "Save the file at print resolution — typically 300 DPI — not a screenshot of the preview.",
        },
        {
          title: "Print as 4R / 4×6",
          description:
            "At a kiosk choose 4×6 / 4R / 10×15 cm. At home use photo paper and turn off “fit to page.”",
        },
        {
          title: "Cut and measure",
          description:
            "Trim along the guides. Measure one copy against your application’s required size before you submit.",
        },
      ],
    },
    {
      type: "prose",
      title: "Home printing vs local print services",
      subsections: [
        {
          title: "Home printing",
          bullets: [
            "Use glossy or matte photo paper — not copy paper",
            "Disable fit-to-page scaling",
            "Let ink dry before cutting",
          ],
        },
        {
          title: "Shop or kiosk",
          bullets: [
            "Ask for 4R or 4×6 — the names vary by country",
            "Staff can often print from a phone file",
            "Usually sharper than a typical home inkjet",
          ],
        },
      ],
    },
    {
      type: "disclaimer",
      title: "Sizing note",
      paragraphs: [
        "Printed millimetres can vary slightly with printer margins. Measure a test print. AI Images Studio helps you prepare a 4R layout; it does not guarantee exact millimetre output on every device.",
      ],
      links: [
        { href: "/en/id-photo", label: "ID photo maker" },
        { href: "/en/passport-photo", label: "Passport photo maker" },
        { href: "/en/philippines-id-photo", label: "Philippines ID photo & 4R grid" },
      ],
    },
  ],
  faq: {
    title: "4R photo size and printing — FAQ",
    items: [
      {
        question: "What is 4R photo size in inches and mm?",
        answer:
          "4R is 4×6 inches, which is about 102×152 mm (also sold as 10×15 cm). It is a standard shop print size, not an official passport dimension by itself.",
      },
      {
        question: "Is a 4R sheet the same as a passport photo?",
        answer:
          "No. 4R is the paper size. Your passport or ID photo is the smaller portrait printed several times on that sheet. After printing, you cut out the individual photos.",
      },
      {
        question: "Can I use a 4R layout for ID photos, not only passports?",
        answer:
          "Yes. Any small official portrait can be tiled on a 4R sheet — work badges, student IDs, visa copies, and 2×2 IDs — as long as each cut-out matches the size your organisation asks for.",
      },
      {
        question: "What paper size should I select at the kiosk?",
        answer:
          "Choose 4×6 inches / 4R / 10×15 cm. Naming varies by region; the dimensions are equivalent.",
      },
      {
        question: "Can I print different sizes on one sheet?",
        answer:
          "The 4R layout repeats one photo size across the sheet. Prepare a separate sheet if you need a second dimension.",
      },
    ],
  },
  bottomCta: {
    title: "Need a 4R ID photo layout?",
    subtitle: "Prepare your photo and download a 4×6 sheet with several print-ready copies.",
    button: "Create 4R Print Sheet",
  },
  relatedPages: [
    { slug: "id-photo", label: "ID photo maker" },
    { slug: "passport-photo", label: "Passport photo maker" },
    { slug: "philippines-id-photo", label: "Philippines ID & 4R" },
    { slug: "passport-photo-size", label: "Photo size chart" },
    { slug: "passport-photo-at-home", label: "Take photos at home" },
  ],
  footer: enSeoFooter,
};

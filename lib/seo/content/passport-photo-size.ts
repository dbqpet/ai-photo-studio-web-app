import type { SeoPageContent } from "@/lib/seo/types";
import { enSeoFooter } from "@/lib/seo/content/en-shared";

export const passportPhotoSizePage: SeoPageContent = {
  slug: "passport-photo-size",
  meta: {
    title: "Passport Photo Size by Country – Dimensions, Inches & 300 DPI Pixels",
    description:
      "Passport photo size chart: US, UK, Canada, Schengen/EU, India, Philippines, and China — millimetres, inches, and pixels at 300 DPI. Plus ID photo size notes.",
    keywords: [
      "passport photo size",
      "passport photo dimensions",
      "ID photo size by country",
      "35x45 mm passport photo",
      "2x2 passport photo size",
      "passport photo pixels 300 DPI",
    ],
    htmlLang: "en",
    locale: "en_US",
  },
  nav: { headerCta: "Choose Size Preset" },
  hero: {
    title: "Passport Photo Size & ID Photo Dimensions by Country",
    subtitle:
      "Passport photo size is not one global standard. Use this chart for common millimetre, inch, and 300 DPI pixel sizes — then confirm the official rule for your application before you print or upload.",
    primaryCta: "Create Photo in Your Size",
    secondaryCta: "Size comparison table",
    secondaryTargetId: "size-table",
  },
  sections: [
    {
      type: "prose",
      title: "What “passport photo size” usually means",
      paragraphs: [
        "Most authorities specify a printed width × height (mm or inches) and a head-height range inside that frame. Digital portals may also ask for pixels or a maximum file size.",
        "300 DPI is a common print standard. Pixel figures below are the print size converted at 300 DPI (rounded). Your portal may ask for a different pixel count — always follow the form you are filling in.",
      ],
    },
    {
      type: "table",
      id: "size-table",
      title: "Standard passport and ID photo sizes",
      caption:
        "Educational summary of widely published sizes. Head-to-photo ratios and background colours still differ by country — see the requirements guide.",
      columns: ["Country / use", "Size (mm)", "Size (inches)", "Pixels at 300 DPI"],
      rows: [
        ["United States (passport)", "51 × 51", "2 × 2", "600 × 600"],
        ["United Kingdom (passport)", "35 × 45", "1.38 × 1.77", "413 × 531"],
        ["Canada (passport)", "50 × 70", "1.97 × 2.76", "591 × 827"],
        ["Schengen / EU (common)", "35 × 45", "1.38 × 1.77", "413 × 531"],
        ["India (passport)", "51 × 51", "2 × 2", "600 × 600"],
        ["Philippines (DFA passport)", "35 × 45", "1.38 × 1.77", "413 × 531"],
        ["China (common passport/visa)", "33 × 48", "1.30 × 1.89", "390 × 567"],
        ["Hong Kong / many visas", "40 × 50", "1.57 × 1.97", "472 × 591"],
        ["4R print sheet (paper, not a photo spec)", "102 × 152", "4 × 6", "1200 × 1800"],
      ],
      footnotes: [
        "UK photos are 45 mm high × 35 mm wide (portrait). Some shops still say “35×45.”",
        "Philippines DFA passport photos are commonly 4.5 × 3.5 cm (45 × 35 mm). Many other PH IDs use 2×2 inches instead.",
        "China and Hong Kong sizes vary by document type (passport, visa, permit). Confirm the form you are using.",
        "4R is the paper you print on, not the official portrait size.",
      ],
    },
    {
      type: "prose",
      title: "ID photo size by country is not always the passport size",
      paragraphs: [
        "Work badges, driving licences, and national IDs often use a different crop from the passport. India and the US reuse 2×2 inches for many visas; the Philippines uses 2×2 inches for NBI, PRC, and postal IDs while the passport is 35×45 mm.",
        "If an employer only says “ID photo,” ask whether they want 35×45 mm, 2×2 inches, or a digital pixel size. You can prepare more than one crop from the same portrait.",
      ],
    },
    {
      type: "prose",
      title: "How to use these numbers in AI Images Studio",
      bullets: [
        "Pick the preset that matches your document (35×45 mm, US 2×2, custom mm, and others)",
        "Check that the face is centred and that there is space above the hair",
        "For printing several copies, download a 4R (4×6 in) sheet — the portraits on the sheet are still your chosen mm or inch size",
        "For digital upload, follow the portal’s pixel and file-size limits; you may need to resize after download",
      ],
    },
    {
      type: "disclaimer",
      title: "Confirm the official specification",
      paragraphs: [
        "Governments change photo rules. This table is a starting point, not a substitute for the embassy, passport office, or visa centre instructions you will submit to.",
      ],
      links: [
        { href: "/en/passport-photo-requirements", label: "Passport photo requirements" },
        { href: "/en/passport-photo", label: "Passport photo maker" },
        { href: "/en/us-passport-photo", label: "US 2×2 passport photo" },
      ],
    },
  ],
  faq: {
    title: "Passport photo size — FAQ",
    items: [
      {
        question: "What is the most common passport photo size?",
        answer:
          "35×45 mm is the most common international size (UK, much of the EU/Schengen, many visas). The United States uses 2×2 inches (51×51 mm). Canada uses 50×70 mm.",
      },
      {
        question: "How many pixels is a passport photo at 300 DPI?",
        answer:
          "A 2×2 inch US photo is 600×600 pixels at 300 DPI. A 35×45 mm photo is about 413×531 pixels. Some websites ask for larger pixel files even when the printed size is the same.",
      },
      {
        question: "Is 4R a passport photo size?",
        answer:
          "No. 4R is 4×6 inches — the paper. You print several smaller passport or ID photos on one 4R sheet and cut them out.",
      },
      {
        question: "Can I use the same photo size for a visa and a passport?",
        answer:
          "Only if both applications list the same dimensions and rules. Many visas follow the destination country’s passport size; others use 2×2 inches. Check each form.",
      },
    ],
  },
  bottomCta: {
    title: "Know your size?",
    subtitle: "Upload a portrait, pick a country preset, and download a printable photo.",
    button: "Start With Your Size",
  },
  relatedPages: [
    { slug: "passport-photo-requirements", label: "Photo requirements" },
    { slug: "passport-photo", label: "Passport photo maker" },
    { slug: "passport-photo-printing", label: "4R print sheet" },
    { slug: "us-passport-photo", label: "US passport photo" },
    { slug: "uk-passport-photo", label: "UK passport photo" },
  ],
  footer: enSeoFooter,
};

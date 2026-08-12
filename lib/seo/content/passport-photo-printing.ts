import type { SeoPageContent } from "@/lib/seo/types";

const footer = {
  privacy:
    "AI Images Studio · Photos are processed securely and never stored long-term on our servers.",
  supportLabel: "Support: ",
};

export const passportPhotoPrintingPage: SeoPageContent = {
  slug: "passport-photo-printing",
  meta: {
    title: "Passport Photo Printing – Create a Printable Photo Sheet Online",
    description:
      "Create a printable passport or ID photo sheet online. Prepare your photo and arrange multiple copies on a 4R print sheet with AI Images Studio.",
    keywords: [
      "passport photo printing",
      "printable passport photo",
      "4R photo sheet",
      "print passport photos at home",
      "passport photo sheet",
    ],
    htmlLang: "en",
    locale: "en_US",
  },
  nav: { headerCta: "Create Print Sheet" },
  hero: {
    title: "Passport Photo Printing – Create a Printable Photo Sheet Online",
    subtitle:
      "Digital files are convenient, but many applications still want physical prints — and families often need several identical copies. Learn how to prepare a photo and lay out multiple prints on one standard 4R sheet.",
    primaryCta: "Build 4R Print Sheet",
    secondaryCta: "Why print sheets matter",
    secondaryTargetId: "why-print",
  },
  sections: [
    {
      type: "prose",
      id: "why-print",
      title: "Digital photo vs printable photo",
      paragraphs: [
        "Some embassies and government portals accept digital uploads only. Others require you to attach printed photos to paper forms or bring them to an in-person appointment.",
        "Even when a digital file is enough for one application, having printed copies is useful for spare forms, renewal reminders, or family members applying together.",
      ],
    },
    {
      type: "prose",
      title: "Why arrange multiple photos on one sheet?",
      bullets: [
        "Print several identical copies from a single 4R order at a kiosk or shop",
        "Reduce cost compared with printing each photo as a separate order",
        "Keep spare copies if one print gets damaged or a form requires two photos",
        "Prepare photos for multiple family members from one print run",
      ],
    },
    {
      type: "prose",
      title: "What is a 4R print sheet?",
      paragraphs: [
        "4R refers to a standard photo print size of approximately 4×6 inches (about 102×152 mm). It is widely supported at self-service kiosks, convenience stores, and online print services.",
        "AI Images Studio can arrange multiple passport or ID photos on one 4R layout. After printing the sheet, you cut out individual photos with scissors or a trimmer.",
      ],
      bullets: [
        "One 4R sheet → several passport-size prints",
        "Works with common presets like 35×45 mm, 40×50 mm, or 2×2 inches",
        "Useful for Hong Kong, European, US, and general ID formats",
      ],
    },
    {
      type: "steps",
      title: "How to create and print a passport photo sheet",
      items: [
        {
          title: "Prepare your source portrait",
          description:
            "Upload a clear photo to AI Images Studio and process it with background removal and your target size preset.",
        },
        {
          title: "Generate the 4R layout",
          description:
            "Choose the print sheet option to tile multiple copies on one 4R page. Preview spacing before downloading.",
        },
        {
          title: "Download the high-resolution sheet",
          description:
            "Save the file at full print resolution — typically 300 DPI for sharp output.",
        },
        {
          title: "Print at home or at a shop",
          description:
            "Home: use photo paper and your printer's best quality setting. Shop: transfer the file via USB, app, or web upload to a kiosk.",
        },
        {
          title: "Cut and verify",
          description:
            "Trim each photo carefully. Compare dimensions against your application's requirements before submitting.",
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
            "Fastest when you already own a photo-capable inkjet printer",
            "Use glossy or matte photo paper — not regular copy paper",
            "Disable 'fit to page' scaling in the print dialog",
            "Allow ink to dry before cutting to avoid smudges",
          ],
        },
        {
          title: "Local photo printing service",
          bullets: [
            "Often sharper and more color-accurate than home printers",
            "Staff may help with sizing if you bring the 4R file on your phone",
            "Typical cost is low per sheet compared with studio packages",
          ],
        },
      ],
    },
    {
      type: "disclaimer",
      title: "Sizing note",
      paragraphs: [
        "Exact printed dimensions can vary slightly depending on printer margins and kiosk settings. Always measure one test print against your application's required size before printing a large batch.",
        "AI Images Studio provides layout tools to help you prepare prints; it does not guarantee exact millimeter output on every device.",
      ],
      links: [
        { href: "/en/passport-photo", label: "Prepare your passport photo" },
        { href: "/en/id-photo", label: "ID photo maker" },
      ],
    },
  ],
  faq: {
    title: "Passport photo printing — FAQ",
    items: [
      {
        question: "What paper size should I select at the kiosk?",
        answer:
          "Choose 4×6 inches / 4R / 10×15 cm — naming varies by region, but the dimensions are equivalent.",
      },
      {
        question: "Can I print different sizes on one sheet?",
        answer:
          "The 4R layout is optimized for one photo size repeated across the sheet. Prepare separate sheets if you need different dimensions.",
      },
      {
        question: "Is 300 DPI necessary?",
        answer:
          "300 DPI is a common standard for sharp passport prints. AI Images Studio exports high-resolution output suitable for photo printing.",
      },
    ],
  },
  bottomCta: {
    title: "Ready to print multiple passport photos?",
    subtitle: "Prepare your photo and download a 4R sheet with several copies in one file.",
    button: "Create Printable Sheet",
  },
  relatedPages: [
    { slug: "passport-photo", label: "Passport photo maker" },
    { slug: "passport-photo-at-home", label: "Take photos at home" },
    { slug: "id-photo", label: "ID photo maker" },
    { slug: "us-passport-photo", label: "US passport photo guide" },
  ],
  footer,
};

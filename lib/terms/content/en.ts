import type { TermsContent } from "@/lib/terms/types";

export const termsEn: TermsContent = {
  meta: {
    title: "Terms & Conditions | AI Images Studio",
    description:
      "Terms and Conditions for AI Images Studio — an AI-powered passport, visa, and ID photo processing service.",
    htmlLang: "en",
    locale: "en_US",
  },
  nav: {
    backToStudio: "← Back to studio",
    switchLang: "繁體中文",
    switchLangLabel: "Language",
  },
  pageTitle: "Terms & Conditions",
  lastUpdated: "Last updated: August 16, 2026",
  disclaimer: {
    title: "Disclaimer",
    text: "While our AI is trained to meet strict passport and visa photo requirements, final approval depends on the subjective judgment of the issuing authority. We recommend reviewing the specific guidelines of your application.",
  },
  sections: [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      paragraphs: [
        "By accessing or using AI Images Studio (\"the Service\"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Service.",
        "We may update these terms from time to time. Continued use after changes are posted constitutes acceptance of the revised terms.",
      ],
    },
    {
      id: "service",
      title: "2. Service Description",
      paragraphs: [
        "AI Images Studio provides online AI-assisted tools to help you prepare passport-style, visa-style, and ID photos from images you upload. Features may include background removal, cropping, style enhancement, watermarked previews, and paid high-resolution downloads.",
        "The Service is provided for personal, non-commercial use unless otherwise agreed in writing.",
      ],
    },
    {
      id: "accounts",
      title: "3. Accounts & Free Previews",
      paragraphs: [
        "Some features require signing in. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.",
        "Free preview tokens may be offered at our discretion. Preview outputs may include watermarks and are not intended for official submission.",
      ],
    },
    {
      id: "payments",
      title: "4. Payments & Refunds",
      paragraphs: [
        "Paid features (such as HD downloads and print layouts) are processed through our third-party payment provider. Prices are displayed before checkout.",
        "Because digital goods are delivered immediately upon successful payment, refunds are generally not provided except where required by applicable law or at our sole discretion in cases of technical failure on our side.",
      ],
    },
    {
      id: "acceptable-use",
      title: "5. Acceptable Use",
      paragraphs: ["You agree not to:"],
      bullets: [
        "Upload content you do not have the right to use, or that violates any law or third-party rights.",
        "Attempt to reverse-engineer, scrape, or abuse the Service or its infrastructure.",
        "Use the Service to create misleading, fraudulent, or illegal identity documents.",
        "Circumvent payment, watermark, or access controls.",
      ],
    },
    {
      id: "ip",
      title: "6. Intellectual Property",
      paragraphs: [
        "You retain ownership of photos you upload. By using the Service, you grant us a limited licence to process your images solely to provide the Service.",
        "AI Images Studio branding, software, and website content are owned by us or our licensors and may not be copied without permission.",
      ],
    },
    {
      id: "privacy",
      title: "7. Privacy & Data Processing",
      paragraphs: [
        "Photos are processed to deliver the Service. We do not intend to store your uploaded images long-term on our servers after processing is complete.",
        "Authentication and payment data may be handled by third-party providers (e.g. Supabase, Stripe) subject to their respective policies.",
      ],
    },
    {
      id: "liability",
      title: "8. Limitation of Liability",
      paragraphs: [
        "The Service is provided \"as is\" and \"as available\" without warranties of any kind, whether express or implied, including fitness for a particular purpose or non-infringement.",
        "To the fullest extent permitted by law, AI Images Studio shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including rejected passport or visa applications.",
        "Our total liability for any claim relating to the Service shall not exceed the amount you paid us in the twelve (12) months preceding the claim.",
      ],
    },
    {
      id: "contact",
      title: "9. Contact",
      paragraphs: [
        "If you have questions about these Terms & Conditions, please contact us at info@aiimagesstudio.com.",
      ],
    },
  ],
  footer: {
    privacy: "AI Images Studio · Photos are processed securely and never stored long-term on our servers.",
    supportLabel: "Support: ",
    terms: "Terms & Conditions",
  },
};

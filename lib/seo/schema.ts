import { PRICING } from "@/lib/pricing";
import {
  PINTEREST_ARTICLE_PUBLISHED_TIME,
  PINTEREST_RICH_PIN_IMAGE,
} from "@/lib/seo/pinterestOpenGraph";
import { SITE_NAME, SITE_URL, HOME_PAGE_DESCRIPTION, HOME_PAGE_TITLE } from "@/lib/site";
import type { SeoLang, SeoPageContent } from "@/lib/seo/types";

/** Slugs that promote the web app as a photo tool (SoftwareApplication schema). */
const SOFTWARE_APPLICATION_SLUGS = new Set([
  "passport-photo",
  "id-photo",
  "visa-photo",
  "id-photo-maker",
]);

export type StructuredContentInput = {
  title: string;
  description: string;
  url: string;
  htmlLang: string;
  datePublished?: string;
};

export function buildArticleSchema({
  title,
  description,
  url,
  htmlLang,
  datePublished = PINTEREST_ARTICLE_PUBLISHED_TIME,
}: StructuredContentInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: title,
    description,
    url,
    inLanguage: htmlLang,
    datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    image: {
      "@type": "ImageObject",
      url: PINTEREST_RICH_PIN_IMAGE.url,
      width: PINTEREST_RICH_PIN_IMAGE.width,
      height: PINTEREST_RICH_PIN_IMAGE.height,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function buildSoftwareApplicationSchema({
  title,
  description,
  url,
  htmlLang,
}: StructuredContentInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#software`,
    name: SITE_NAME,
    headline: title,
    description,
    url,
    inLanguage: htmlLang,
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: PRICING.saleUsd,
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

function buildSeoStructuredInput(
  lang: SeoLang,
  page: SeoPageContent,
): StructuredContentInput {
  return {
    title: page.meta.title,
    description: page.meta.description,
    url: `${SITE_URL}/${lang}/${page.slug}`,
    htmlLang: page.meta.htmlLang,
  };
}

export function buildWebPageSchema(
  lang: SeoLang,
  page: SeoPageContent,
): Record<string, unknown> {
  const pageUrl = `${SITE_URL}/${lang}/${page.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.meta.title,
    description: page.meta.description,
    inLanguage: page.meta.htmlLang,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildBreadcrumbSchema(
  lang: SeoLang,
  page: SeoPageContent,
): Record<string, unknown> {
  const pageUrl = `${SITE_URL}/${lang}/${page.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.hero.title,
        item: pageUrl,
      },
    ],
  };
}

export function buildHowToSchema(
  lang: SeoLang,
  page: SeoPageContent,
): Record<string, unknown> | null {
  const howToSection = page.sections.find(
    (section) => section.type === "steps" && section.howTo,
  );
  if (!howToSection || howToSection.type !== "steps" || howToSection.items.length === 0) {
    return null;
  }

  const pageUrl = `${SITE_URL}/${lang}/${page.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howToSection.title,
    description: howToSection.howToDescription ?? page.meta.description,
    inLanguage: page.meta.htmlLang,
    url: pageUrl,
    step: howToSection.items.map((item, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: item.title,
      text: item.description,
      url: howToSection.id ? `${pageUrl}#${howToSection.id}` : pageUrl,
    })),
  };
}

export function buildFaqSchema(page: SeoPageContent): Record<string, unknown> | null {
  if (page.faq.items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: page.meta.htmlLang,
    mainEntity: page.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildPageSchemas(
  lang: SeoLang,
  page: SeoPageContent,
): Record<string, unknown>[] {
  const structured = buildSeoStructuredInput(lang, page);
  const schemas: Record<string, unknown>[] = [
    buildArticleSchema(structured),
    buildWebPageSchema(lang, page),
    buildBreadcrumbSchema(lang, page),
  ];

  if (SOFTWARE_APPLICATION_SLUGS.has(page.slug)) {
    schemas.push(buildSoftwareApplicationSchema(structured));
  }

  const faq = buildFaqSchema(page);
  if (faq) schemas.push(faq);

  const howTo = buildHowToSchema(lang, page);
  if (howTo) schemas.push(howTo);

  return schemas;
}

export function buildWebSiteSchema(description: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildHomeWebPageSchema(
  title: string,
  description: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: title,
    description,
    inLanguage: "en",
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
  };
}

/** JSON-LD for the main studio app at `/`. */
export function buildHomePageSchemas(): Record<string, unknown>[] {
  const structured: StructuredContentInput = {
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
    url: SITE_URL,
    htmlLang: "en",
  };

  return [
    buildWebSiteSchema(HOME_PAGE_DESCRIPTION),
    buildSoftwareApplicationSchema(structured),
    buildHomeWebPageSchema(HOME_PAGE_TITLE, HOME_PAGE_DESCRIPTION),
  ];
}

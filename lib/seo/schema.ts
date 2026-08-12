import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { SeoLang, SeoPageContent } from "@/lib/seo/types";

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
  const schemas: Record<string, unknown>[] = [
    buildWebPageSchema(lang, page),
    buildBreadcrumbSchema(lang, page),
  ];

  const faq = buildFaqSchema(page);
  if (faq) schemas.push(faq);

  return schemas;
}

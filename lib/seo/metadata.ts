import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { SeoLang, SeoPageContent } from "@/lib/seo/types";

export function buildSeoMetadata(lang: SeoLang, page: SeoPageContent): Metadata {
  const pageUrl = `${SITE_URL}/${lang}/${page.slug}`;

  return {
    title: page.meta.title,
    description: page.meta.description,
    keywords: page.meta.keywords,
    openGraph: {
      title: page.meta.title,
      description: page.meta.description,
      url: pageUrl,
      siteName: SITE_NAME,
      locale: page.meta.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.meta.title,
      description: page.meta.description,
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        en: pageUrl,
        "x-default": pageUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

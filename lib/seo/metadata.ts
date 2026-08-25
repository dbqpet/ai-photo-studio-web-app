import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { buildHreflangAlternates } from "@/lib/seo/hreflang";
import { buildPinterestArticleOpenGraph, OPEN_GRAPH_IMAGE } from "@/lib/seo/pinterestOpenGraph";
import type { SeoLang, SeoPageContent } from "@/lib/seo/types";

export function buildSeoMetadata(lang: SeoLang, page: SeoPageContent): Metadata {
  const pageUrl = `${SITE_URL}/${lang}/${page.slug}`;
  const languages = buildHreflangAlternates(lang, page.slug);

  return {
    title: page.meta.title,
    description: page.meta.description,
    keywords: page.meta.keywords,
    authors: [{ name: SITE_NAME }],
    openGraph: buildPinterestArticleOpenGraph({
      title: page.meta.title,
      description: page.meta.description,
      url: pageUrl,
      locale: page.meta.locale,
    }),
    twitter: {
      card: "summary_large_image",
      title: page.meta.title,
      description: page.meta.description,
      images: [OPEN_GRAPH_IMAGE.url],
    },
    alternates: {
      canonical: pageUrl,
      languages: Object.keys(languages).length > 0 ? languages : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

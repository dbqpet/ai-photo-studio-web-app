import type { MetadataRoute } from "next";
import { INTRO_LANGUAGES } from "@/lib/introduction/dictionaries";
import { getSeoPageSlugs, SEO_LANGS } from "@/lib/seo/pages";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const introductionPages: MetadataRoute.Sitemap = INTRO_LANGUAGES.map((lang) => ({
    url: `${SITE_URL}/${lang}/introduction`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: lang === "zh" ? 0.9 : 0.85,
  }));

  const seoGuidePages: MetadataRoute.Sitemap = SEO_LANGS.flatMap((lang) =>
    getSeoPageSlugs(lang).map((slug) => ({
      url: `${SITE_URL}/${lang}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: lang === "en" ? 0.8 : 0.85,
    })),
  );

  return [...home, ...introductionPages, ...seoGuidePages];
}

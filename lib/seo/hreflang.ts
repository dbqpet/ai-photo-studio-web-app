import { SITE_URL } from "@/lib/site";
import type { SeoLang } from "@/lib/seo/types";

/** Maps equivalent SEO pages across languages (slug per locale). */
export interface SeoHreflangEntry {
  en?: string;
  zh: string;
  "zh-cn": string;
}

/** Chinese SEO page groups and their English equivalents where they exist. */
export const SEO_HREFLANG_GROUPS: SeoHreflangEntry[] = [
  { zh: "4r-id-photo", "zh-cn": "4r-id-photo" },
  { en: "id-photo", zh: "id-photo-maker", "zh-cn": "id-photo-maker" },
  {
    en: "passport-photo-at-home",
    zh: "passport-photo-at-home",
    "zh-cn": "passport-photo-at-home",
  },
  { zh: "passport-photo-size", "zh-cn": "passport-photo-size" },
  { zh: "passport-photo-requirements", "zh-cn": "passport-photo-requirements" },
  {
    en: "passport-photo-with-phone",
    zh: "passport-photo-with-phone",
    "zh-cn": "passport-photo-with-phone",
  },
  { en: "visa-photo", zh: "visa-photo", "zh-cn": "visa-photo" },
  {
    en: "passport-photo-printing",
    zh: "id-photo-print",
    "zh-cn": "id-photo-print",
  },
];

/** English-only SEO pages (no Chinese equivalent in phase 1). */
export const EN_ONLY_SEO_SLUGS = [
  "passport-photo",
  "us-passport-photo",
  "passport-photo-background",
] as const;

export function findHreflangGroup(
  lang: SeoLang,
  slug: string,
): SeoHreflangEntry | undefined {
  return SEO_HREFLANG_GROUPS.find((group) => group[lang] === slug);
}

/** Build Next.js alternates.languages map for a page. */
export function buildHreflangAlternates(
  lang: SeoLang,
  slug: string,
): Record<string, string> {
  const group = findHreflangGroup(lang, slug);
  const alternates: Record<string, string> = {};

  if (group) {
    if (group.en) alternates.en = `${SITE_URL}/en/${group.en}`;
    alternates["zh-HK"] = `${SITE_URL}/zh/${group.zh}`;
    alternates["zh-CN"] = `${SITE_URL}/zh-cn/${group["zh-cn"]}`;
    alternates["x-default"] = group.en
      ? `${SITE_URL}/en/${group.en}`
      : `${SITE_URL}/zh/${group.zh}`;
    return alternates;
  }

  if (lang === "en") {
    alternates.en = `${SITE_URL}/en/${slug}`;
    alternates["x-default"] = `${SITE_URL}/en/${slug}`;
  }

  return alternates;
}

import type { SeoLang, SeoPageContent } from "@/lib/seo/types";
import { idPhotoPage } from "@/lib/seo/content/id-photo";
import { passportPhotoPage } from "@/lib/seo/content/passport-photo";
import { passportPhotoAtHomePage } from "@/lib/seo/content/passport-photo-at-home";
import { passportPhotoBackgroundPage } from "@/lib/seo/content/passport-photo-background";
import { passportPhotoPrintingPage } from "@/lib/seo/content/passport-photo-printing";
import { passportPhotoWithPhonePage } from "@/lib/seo/content/passport-photo-with-phone";
import { usPassportPhotoPage } from "@/lib/seo/content/us-passport-photo";
import { visaPhotoPage } from "@/lib/seo/content/visa-photo";
import { ZH_TW_SEO_PAGES } from "@/lib/seo/content/zh-tw";
import { ZH_CN_SEO_PAGES } from "@/lib/seo/content/zh-cn";

export { SEO_LANGS } from "@/lib/seo/types";

const EN_SEO_PAGES: SeoPageContent[] = [
  passportPhotoPage,
  passportPhotoAtHomePage,
  idPhotoPage,
  visaPhotoPage,
  passportPhotoWithPhonePage,
  usPassportPhotoPage,
  passportPhotoPrintingPage,
  passportPhotoBackgroundPage,
];

export const SEO_PAGES_BY_LANG: Record<SeoLang, SeoPageContent[]> = {
  en: EN_SEO_PAGES,
  zh: ZH_TW_SEO_PAGES,
  "zh-cn": ZH_CN_SEO_PAGES,
};

/** @deprecated Use getSeoPageSlugs(lang) */
export const SEO_PAGE_SLUGS = EN_SEO_PAGES.map((page) => page.slug);

export function getSeoPageSlugs(lang: SeoLang): string[] {
  return SEO_PAGES_BY_LANG[lang].map((page) => page.slug);
}

export function isSeoPageSlug(lang: SeoLang, slug: string): boolean {
  return getSeoPageSlugs(lang).includes(slug);
}

export function getSeoPage(lang: SeoLang, slug: string): SeoPageContent | undefined {
  return SEO_PAGES_BY_LANG[lang].find((page) => page.slug === slug);
}

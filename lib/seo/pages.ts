import type { SeoPageContent } from "@/lib/seo/types";
import { idPhotoPage } from "@/lib/seo/content/id-photo";
import { passportPhotoPage } from "@/lib/seo/content/passport-photo";
import { passportPhotoAtHomePage } from "@/lib/seo/content/passport-photo-at-home";
import { passportPhotoBackgroundPage } from "@/lib/seo/content/passport-photo-background";
import { passportPhotoPrintingPage } from "@/lib/seo/content/passport-photo-printing";
import { passportPhotoWithPhonePage } from "@/lib/seo/content/passport-photo-with-phone";
import { usPassportPhotoPage } from "@/lib/seo/content/us-passport-photo";
import { visaPhotoPage } from "@/lib/seo/content/visa-photo";

export const SEO_PAGES: SeoPageContent[] = [
  passportPhotoPage,
  passportPhotoAtHomePage,
  idPhotoPage,
  visaPhotoPage,
  passportPhotoWithPhonePage,
  usPassportPhotoPage,
  passportPhotoPrintingPage,
  passportPhotoBackgroundPage,
];

export const SEO_PAGE_SLUGS = SEO_PAGES.map((page) => page.slug);

export function isSeoPageSlug(value: string): boolean {
  return SEO_PAGE_SLUGS.includes(value);
}

export function getSeoPage(slug: string): SeoPageContent | undefined {
  return SEO_PAGES.find((page) => page.slug === slug);
}

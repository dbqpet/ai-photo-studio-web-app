import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/** Pinterest Rich Pin (Article) default publish date for SEO guides. */
export const PINTEREST_ARTICLE_PUBLISHED_TIME = "2026-08-21T00:00:00.000Z";

export const PINTEREST_RICH_PIN_IMAGE = {
  url: `${SITE_URL}/images/pins/rich_pins/rich_pin_3_fixed.jpg`,
  width: 1000,
  height: 1500,
} as const;

type ArticleOpenGraphInput = {
  title: string;
  description: string;
  url: string;
  locale?: string;
  publishedTime?: string;
};

/** Open Graph block tuned for Pinterest Rich Pins (Article type). */
export function buildPinterestArticleOpenGraph({
  title,
  description,
  url,
  locale,
  publishedTime = PINTEREST_ARTICLE_PUBLISHED_TIME,
}: ArticleOpenGraphInput): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    url,
    siteName: SITE_NAME,
    locale,
    type: "article",
    publishedTime,
    authors: [SITE_NAME],
    images: [PINTEREST_RICH_PIN_IMAGE],
  };
}

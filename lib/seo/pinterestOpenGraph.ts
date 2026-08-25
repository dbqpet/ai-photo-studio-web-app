import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/** Pinterest Rich Pin (Article) default publish date for SEO guides. */
export const PINTEREST_ARTICLE_PUBLISHED_TIME = "2026-08-21T00:00:00.000Z";

/** Standard Open Graph share image (Facebook, LinkedIn, X, etc.). */
export const OPEN_GRAPH_IMAGE = {
  url: `${SITE_URL}/images/open_graph_1200x630_v1.png`,
  width: 1200,
  height: 630,
  alt: "AI Images Studio turns a casual portrait into a professional ID photo in seconds",
} as const;

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
    images: [OPEN_GRAPH_IMAGE],
  };
}

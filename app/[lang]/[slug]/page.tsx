import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoLandingPage from "@/components/SeoLandingPage";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { getSeoPage, isSeoPageSlug, SEO_PAGE_SLUGS } from "@/lib/seo/pages";
import { buildPageSchemas } from "@/lib/seo/schema";
import { SEO_LANGS, type SeoLang, isSeoLang } from "@/lib/seo/types";
import { isIntroLang } from "@/lib/introduction/dictionaries";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export function generateStaticParams() {
  return SEO_PAGE_SLUGS.flatMap((slug) =>
    SEO_LANGS.map((lang) => ({ lang, slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  if (!isSeoLang(rawLang) || !isSeoPageSlug(slug)) return {};

  const page = getSeoPage(slug)!;
  return buildSeoMetadata(rawLang as SeoLang, page);
}

export default async function SeoGuidePage({ params }: PageProps) {
  const { lang: rawLang, slug } = await params;

  if (!isIntroLang(rawLang) || !isSeoLang(rawLang) || !isSeoPageSlug(slug)) {
    notFound();
  }

  const lang = rawLang as SeoLang;
  const page = getSeoPage(slug)!;
  const schemas = buildPageSchemas(lang, page);

  return (
    <>
      {schemas.map((schema) => (
        <script
          key={schema["@type"] as string}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SeoLandingPage lang={lang} page={page} />
    </>
  );
}

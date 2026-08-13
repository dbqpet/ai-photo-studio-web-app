import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoLandingPage from "@/components/SeoLandingPage";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { getSeoPage, getSeoPageSlugs, isSeoPageSlug, SEO_LANGS } from "@/lib/seo/pages";
import { buildPageSchemas } from "@/lib/seo/schema";
import { isSeoLang, type SeoLang } from "@/lib/seo/types";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export function generateStaticParams() {
  return SEO_LANGS.flatMap((lang) =>
    getSeoPageSlugs(lang).map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  if (!isSeoLang(rawLang) || !isSeoPageSlug(rawLang, slug)) return {};

  const page = getSeoPage(rawLang, slug)!;
  return buildSeoMetadata(rawLang, page);
}

export default async function SeoGuidePage({ params }: PageProps) {
  const { lang: rawLang, slug } = await params;

  if (!isSeoLang(rawLang) || !isSeoPageSlug(rawLang, slug)) {
    notFound();
  }

  const lang = rawLang as SeoLang;
  const page = getSeoPage(lang, slug)!;
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

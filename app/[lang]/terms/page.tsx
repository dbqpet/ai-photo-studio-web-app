import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TermsLanding from "@/components/TermsLanding";
import {
  getTermsDictionary,
  isTermsLang,
  TERMS_LANGUAGES,
  type TermsLang,
} from "@/lib/terms/dictionaries";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return TERMS_LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isTermsLang(rawLang)) return {};

  const lang = rawLang as TermsLang;
  const content = getTermsDictionary(lang);
  const pageUrl = `${SITE_URL}/${lang}/terms`;

  return {
    title: content.meta.title,
    description: content.meta.description,
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: pageUrl,
      siteName: SITE_NAME,
      locale: content.meta.locale,
      type: "website",
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        "zh-HK": `${SITE_URL}/zh/terms`,
        en: `${SITE_URL}/en/terms`,
        "x-default": `${SITE_URL}/en/terms`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TermsPage({ params }: PageProps) {
  const { lang: rawLang } = await params;
  if (!isTermsLang(rawLang)) notFound();

  const lang = rawLang as TermsLang;
  const content = getTermsDictionary(lang);

  return <TermsLanding lang={lang} content={content} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IntroductionLanding from "@/components/IntroductionLanding";
import {
  getIntroductionDictionary,
  INTRO_LANGUAGES,
  introOpenGraphLocale,
  isIntroLang,
  type IntroLang,
} from "@/lib/introduction/dictionaries";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return INTRO_LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isIntroLang(rawLang)) return {};

  const lang = rawLang as IntroLang;
  const dict = getIntroductionDictionary(lang);
  const pageUrl = `${SITE_URL}/${lang}/introduction`;

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: pageUrl,
      siteName: SITE_NAME,
      locale: introOpenGraphLocale(lang),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        "zh-HK": `${SITE_URL}/zh/introduction`,
        en: `${SITE_URL}/en/introduction`,
        "x-default": `${SITE_URL}/zh/introduction`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function buildFaqSchema(lang: IntroLang) {
  const dict = getIntroductionDictionary(lang);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: dict.meta.htmlLang,
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export default async function IntroductionPage({ params }: PageProps) {
  const { lang: rawLang } = await params;
  if (!isIntroLang(rawLang)) notFound();

  const lang = rawLang as IntroLang;
  const dict = getIntroductionDictionary(lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqSchema(lang)),
        }}
      />
      <IntroductionLanding lang={lang} dict={dict} />
    </>
  );
}

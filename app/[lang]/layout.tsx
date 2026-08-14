import SetHtmlLang from "@/components/SetHtmlLang";
import {
  introHtmlLang,
  isIntroLang,
  type IntroLang,
} from "@/lib/introduction/dictionaries";
import { isSeoLang } from "@/lib/seo/types";
import { notFound } from "next/navigation";

function routeHtmlLang(lang: string): string {
  if (isIntroLang(lang)) return introHtmlLang(lang as IntroLang);
  if (lang === "zh-cn") return "zh-Hans";
  if (lang === "zh") return "zh-Hant";
  if (lang === "en") return "en";
  return lang;
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isIntroLang(lang) && !isSeoLang(lang)) notFound();

  return (
    <>
      <SetHtmlLang lang={routeHtmlLang(lang)} />
      {children}
    </>
  );
}

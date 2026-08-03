import SetHtmlLang from "@/components/SetHtmlLang";
import {
  introHtmlLang,
  isIntroLang,
  type IntroLang,
} from "@/lib/introduction/dictionaries";
import { notFound } from "next/navigation";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isIntroLang(lang)) notFound();

  return (
    <>
      <SetHtmlLang lang={introHtmlLang(lang as IntroLang)} />
      {children}
    </>
  );
}

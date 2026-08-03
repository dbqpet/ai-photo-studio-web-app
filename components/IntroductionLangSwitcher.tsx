import Link from "next/link";
import {
  getAlternateIntroLang,
  type IntroLang,
  type IntroductionDictionary,
} from "@/lib/introduction/dictionaries";

interface IntroductionLangSwitcherProps {
  lang: IntroLang;
  dict: IntroductionDictionary;
  className?: string;
}

export default function IntroductionLangSwitcher({
  lang,
  dict,
  className = "",
}: IntroductionLangSwitcherProps) {
  const otherLang = getAlternateIntroLang(lang);

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ${className}`}
      role="navigation"
      aria-label={dict.langSwitcher.label}
    >
      <span className="text-slate-500">{dict.langSwitcher.label}:</span>
      <span aria-current="page" className="text-sky-700">
        {dict.langSwitcher.current}
      </span>
      <span className="text-slate-300" aria-hidden>
        |
      </span>
      <Link
        href={`/${otherLang}/introduction`}
        hrefLang={otherLang === "zh" ? "zh-HK" : "en"}
        className="text-slate-600 transition hover:text-sky-700 hover:underline"
      >
        {dict.langSwitcher.switchTo}
      </Link>
    </div>
  );
}

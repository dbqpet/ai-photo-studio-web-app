import zh from "@/dictionaries/zh.json";
import en from "@/dictionaries/en.json";

export const INTRO_LANGUAGES = ["zh", "en"] as const;
export type IntroLang = (typeof INTRO_LANGUAGES)[number];

export type IntroductionDictionary = typeof zh;

const dictionaries: Record<IntroLang, IntroductionDictionary> = {
  zh,
  en,
};

export function isIntroLang(value: string): value is IntroLang {
  return INTRO_LANGUAGES.includes(value as IntroLang);
}

export function getIntroductionDictionary(lang: IntroLang): IntroductionDictionary {
  return dictionaries[lang];
}

export function getAlternateIntroLang(lang: IntroLang): IntroLang {
  return lang === "zh" ? "en" : "zh";
}

export function introHtmlLang(lang: IntroLang): string {
  return dictionaries[lang].meta.htmlLang;
}

export function introOpenGraphLocale(lang: IntroLang): string {
  return dictionaries[lang].meta.locale;
}

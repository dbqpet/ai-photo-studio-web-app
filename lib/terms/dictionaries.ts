import {
  INTRO_LANGUAGES,
  type IntroLang,
  isIntroLang,
} from "@/lib/introduction/dictionaries";
import { termsEn } from "@/lib/terms/content/en";
import { termsZh } from "@/lib/terms/content/zh";
import type { TermsContent } from "@/lib/terms/types";

export { INTRO_LANGUAGES as TERMS_LANGUAGES };
export type TermsLang = IntroLang;

const dictionaries: Record<TermsLang, TermsContent> = {
  zh: termsZh,
  en: termsEn,
};

export function getTermsDictionary(lang: TermsLang): TermsContent {
  return dictionaries[lang];
}

export function getAlternateTermsLang(lang: TermsLang): TermsLang {
  return lang === "zh" ? "en" : "zh";
}

export function getTermsPath(lang: TermsLang): string {
  return `/${lang}/terms`;
}

/** Map runtime app locale to the closest terms page path. */
export function termsPathForAppLocale(locale: string): string {
  if (locale === "zh" || locale === "zh-CN") return "/zh/terms";
  return "/en/terms";
}

/** Existing Terms page privacy section — there is no separate privacy-policy route. */
export function privacyPolicyPathForAppLocale(locale: string): string {
  return `${termsPathForAppLocale(locale)}#privacy`;
}

export function isTermsLang(value: string): value is TermsLang {
  return isIntroLang(value);
}

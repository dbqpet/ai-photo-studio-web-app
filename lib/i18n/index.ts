import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import zh from "@/locales/zh.json";
import zhCN from "@/locales/zh-CN.json";
import ja from "@/locales/ja.json";
import ko from "@/locales/ko.json";

import { DEFAULT_LOCALE } from "./config";

const localeBundles = {
  en,
  zh,
  "zh-CN": zhCN,
  ja,
  ko,
} as const;

// All resources are bundled at build time (no async loading / Suspense),
// so the same i18n instance works identically on the server render pass
// and after client hydration — only the active `lng` differs, and that is
// switched client-side once we know the visitor's locale.
if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      "zh-CN": { translation: zhCN },
      ja: { translation: ja },
      ko: { translation: ko },
    },
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    // All locale JSON files use single-brace placeholders (e.g. "{count}"),
    // not i18next's default "{{count}}" — override the delimiters to match,
    // otherwise interpolation silently no-ops and placeholders render as the
    // literal "{count}" text (e.g. the header's Preview Tokens badge).
    interpolation: { escapeValue: false, prefix: "{", suffix: "}" },
    returnEmptyString: false,
  });
}

// Re-merge locale JSON on every module evaluation so newly added keys are
// picked up after HMR / Fast Refresh (init is skipped once the singleton exists).
for (const [lng, bundle] of Object.entries(localeBundles)) {
  i18n.addResourceBundle(lng, "translation", bundle, true, true);
}

export default i18n;

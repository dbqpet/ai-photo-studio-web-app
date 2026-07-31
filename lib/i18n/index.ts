import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import zh from "@/locales/zh.json";
import zhCN from "@/locales/zh-CN.json";
import ja from "@/locales/ja.json";
import ko from "@/locales/ko.json";

import { DEFAULT_LOCALE } from "./config";

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
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  });
}

export default i18n;

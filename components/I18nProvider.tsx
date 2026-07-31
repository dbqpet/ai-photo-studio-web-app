"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import i18n from "@/lib/i18n";
import {
  LOCALE_STORAGE_KEY,
  detectBrowserLocale,
  isSupportedLocale,
} from "@/lib/i18n/config";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let locale = detectBrowserLocale();
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isSupportedLocale(stored)) {
        locale = stored;
      }
    } catch {
      // localStorage can throw in private-browsing modes — browser detection above still applies.
    }

    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
    document.documentElement.lang = locale;
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

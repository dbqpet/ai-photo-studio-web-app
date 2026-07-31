"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  LOCALE_LABELS,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  type Locale,
  isSupportedLocale,
} from "@/lib/i18n/config";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const syncFromI18n = () => {
      if (isSupportedLocale(i18n.language)) setLocale(i18n.language);
    };
    syncFromI18n();
    i18n.on("languageChanged", syncFromI18n);
    return () => {
      i18n.off("languageChanged", syncFromI18n);
    };
  }, [i18n]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value;
    if (!isSupportedLocale(next)) return;
    void i18n.changeLanguage(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Ignore storage failures (e.g. private browsing) — the in-memory switch still works.
    }
    document.documentElement.lang = next;
  };

  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={handleChange}
        aria-label="Select language"
        className="cursor-pointer appearance-none rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-6 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
      >
        {SUPPORTED_LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code].flag} {LOCALE_LABELS[code].label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute right-1.5 h-3.5 w-3.5 text-slate-400"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </label>
  );
}

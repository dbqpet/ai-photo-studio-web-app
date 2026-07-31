export const SUPPORTED_LOCALES = ["en", "zh", "zh-CN", "ja", "ko"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "ai-images-studio-locale";

export const LOCALE_LABELS: Record<Locale, { label: string; flag: string }> = {
  en: { label: "English", flag: "🌐" },
  zh: { label: "繁體中文", flag: "🇭🇰" },
  "zh-CN": { label: "简体中文", flag: "🇨🇳" },
  ja: { label: "日本語", flag: "🇯🇵" },
  ko: { label: "한국어", flag: "🇰🇷" },
};

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  if (!value) return false;
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Maps a raw BCP-47 browser locale (e.g. "zh-TW", "zh-Hant-HK", "en-US") onto
 * one of our supported locale codes. Falls back to DEFAULT_LOCALE when no
 * variant matches.
 */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;

  const candidates =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

  for (const raw of candidates) {
    if (!raw) continue;
    const lower = raw.toLowerCase();

    if (lower === "zh-cn" || lower === "zh-sg" || lower.includes("hans")) {
      return "zh-CN";
    }
    if (lower.startsWith("zh")) {
      // zh-TW, zh-HK, zh-MO, or bare "zh" default to Traditional Chinese.
      return "zh";
    }
    if (lower.startsWith("ja")) return "ja";
    if (lower.startsWith("ko")) return "ko";
    if (lower.startsWith("en")) return "en";
  }

  return DEFAULT_LOCALE;
}

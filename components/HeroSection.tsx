"use client";

import { useTranslation } from "react-i18next";
import { track } from "@vercel/analytics";
import { trackGAEvent } from "@/lib/ga";

const BADGE_KEYS = ["hero.badge_ai", "hero.badge_print", "hero.badge_privacy"] as const;

interface HeroSectionProps {
  /** Element id to scroll to when the CTA is clicked. */
  uploadTargetId?: string;
}

export default function HeroSection({ uploadTargetId = "photo-upload" }: HeroSectionProps) {
  const { t } = useTranslation();

  const scrollToUpload = () => {
    track("click_upload");
    trackGAEvent("click_upload_hero");
    const target = document.getElementById(uploadTargetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.focus({ preventScroll: true });
    }
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-8 shadow-sm sm:px-8 sm:py-10"
    >
      {/* Subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl"
      />

      <div className="relative flex flex-col items-center text-center">
        <h2
          id="hero-title"
          className="max-w-2xl bg-gradient-to-r from-slate-900 via-sky-800 to-slate-900 bg-clip-text text-2xl font-extrabold leading-tight tracking-tight text-transparent sm:text-3xl md:text-4xl"
        >
          {t("hero.title")}
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {t("hero.subtitle")}
        </p>
        <p className="mt-1.5 max-w-xl text-xs text-slate-400">
          {t("hero.subtitle_savings")}
        </p>

        <ul className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
          {BADGE_KEYS.map((key) => (
            <li
              key={key}
              className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-xs font-medium text-slate-700 sm:text-sm"
            >
              {t(key)}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={scrollToUpload}
          className="mt-7 w-full max-w-sm rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-sky-600/25 transition hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-600/30 active:scale-[0.98] sm:w-auto sm:min-w-[240px]"
        >
          {t("hero.cta_button")}
        </button>
        <p className="mt-2 text-xs text-slate-500">{t("hero.cta_note")}</p>
      </div>
    </section>
  );
}

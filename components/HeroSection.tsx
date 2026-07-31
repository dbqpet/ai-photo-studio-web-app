"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { track } from "@vercel/analytics";

const BADGE_KEYS = ["hero.badge_ai", "hero.badge_print", "hero.badge_privacy"] as const;

const HERO_IMAGE_SRC = "/images/hero_kv_4r_mockup_001.png";

interface HeroSectionProps {
  /** Element id to scroll to when the CTA is clicked. */
  uploadTargetId?: string;
}

function HeroGraphic({ className = "" }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <figure
      className={`relative mx-auto w-full max-w-sm sm:max-w-md md:max-w-none ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 shadow-lg shadow-slate-200/60 ring-1 ring-slate-900/5">
        <Image
          src={HERO_IMAGE_SRC}
          alt={t("hero.imageAlt")}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-contain p-2 sm:p-3"
        />
      </div>
    </figure>
  );
}

export default function HeroSection({ uploadTargetId = "photo-upload" }: HeroSectionProps) {
  const { t } = useTranslation();

  const scrollToUpload = () => {
    track("click_upload");
    const target = document.getElementById(uploadTargetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.focus({ preventScroll: true });
    }
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-8 shadow-sm sm:px-8 sm:py-10 lg:px-10 lg:py-12"
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

      <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
        {/* Left column — copy, badges, CTA */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h2
            id="hero-title"
            className="max-w-xl bg-gradient-to-r from-slate-900 via-sky-800 to-slate-900 bg-clip-text text-2xl font-extrabold leading-tight tracking-tight text-transparent sm:text-3xl lg:text-4xl"
          >
            {t("hero.title")}
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">
            {t("hero.subtitle")}
          </p>

          <ul className="mt-6 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-3 md:grid-cols-1">
            {BADGE_KEYS.map((key) => (
              <li
                key={key}
                className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-xs font-medium text-slate-700 sm:text-sm"
              >
                {t(key)}
              </li>
            ))}
          </ul>

          {/* Mobile: visual proof before the CTA */}
          <HeroGraphic className="mt-6 md:hidden" />

          <button
            type="button"
            onClick={scrollToUpload}
            className="mt-6 w-full max-w-sm rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-sky-600/25 transition hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-600/30 active:scale-[0.98] md:mt-7 md:w-auto md:min-w-[240px]"
          >
            {t("hero.cta_button")}
          </button>
        </div>

        {/* Right column — desktop hero graphic */}
        <HeroGraphic className="hidden md:block" />
      </div>
    </section>
  );
}

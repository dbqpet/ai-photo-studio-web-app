"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { track } from "@vercel/analytics";
import { trackGAEvent } from "@/lib/ga";
import { PRICING, formatUsd } from "@/lib/pricing";

const BADGE_KEYS = ["badge_ai", "badge_print", "badge_privacy"] as const;

const TRUST_KEYS = ["stripe", "product_hunt", "techbase"] as const;

const HERO_SLIDES = [
  {
    src: "/images/kv/hero_banner_v1_43_text.png",
    alt: "AI passport photo generator showing before and after comparison of biometric ID photo creation",
  },
  {
    src: "/images/kv/hero_banner_2_0817.png",
    alt: "Smartphone app interface showing AI ID photo and a 4R print sheet with a 2x3 grid layout",
  },
] as const;

const CAROUSEL_INTERVAL_MS = 5000;

interface HeroSectionProps {
  /** Element id to scroll to when the CTA is clicked. */
  uploadTargetId?: string;
}

export default function HeroSection({ uploadTargetId = "photo-upload" }: HeroSectionProps) {
  const { t, i18n } = useTranslation(undefined, { keyPrefix: "hero" });
  const [trustReady, setTrustReady] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setTrustReady(true);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, CAROUSEL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  const scrollToUpload = () => {
    track("click_upload");
    trackGAEvent("click_upload_hero");
    const target = document.getElementById(uploadTargetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.focus({ preventScroll: true });
    }
  };

  const itemClass = "text-[11px] text-slate-500 sm:text-xs";

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-4 py-8 shadow-sm md:px-8 sm:py-10"
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

      <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
          <h2
            id="hero-title"
            className="max-w-2xl text-balance bg-gradient-to-r from-slate-900 via-sky-800 to-slate-900 bg-clip-text text-2xl font-extrabold leading-tight tracking-tight text-transparent sm:text-3xl md:text-4xl"
          >
            {t("title")}
          </h2>

          <p className="mt-3 max-w-xl text-balance text-sm leading-relaxed text-slate-600 sm:text-base">
            {t("subtitle")}
          </p>

          <div className="mt-4 max-w-xl text-pretty lg:text-left">
            <p className="text-sm leading-snug text-slate-600 sm:text-base">
              <span className="font-extrabold tabular-nums text-slate-900">
                {formatUsd(PRICING.saleUsd)}
              </span>
              <span className="text-slate-500"> — {t("pricing_reassurance")}</span>
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-[13px]">
              {t("pricing_note")}
            </p>
          </div>

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
            {t("cta_button")}
          </button>

          {trustReady && (
            <div
              key={i18n.language}
              className="mt-3 flex max-w-xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 lg:justify-start"
              aria-label="Trust indicators"
            >
              {TRUST_KEYS.map((key) => (
                <span key={key} className={itemClass}>
                  ✓ {t(`trust.${key}`)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg"
            aria-roledescription="carousel"
            aria-label="Hero showcase"
          >
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.src}
                aria-hidden={index !== activeSlide}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === activeSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={index === 0}
                  className="h-full w-full rounded-2xl object-cover object-center shadow-lg"
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === activeSlide ? "true" : undefined}
                onClick={() => setActiveSlide(index)}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  index === activeSlide ? "bg-sky-600" : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { track } from "@vercel/analytics";
import { trackGAEvent } from "@/lib/ga";
import { useUnlockPrice } from "@/hooks/useUnlockPrice";

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

function splitBadge(text: string) {
  const space = text.indexOf(" ");
  if (space <= 0) return { icon: "", label: text };
  return { icon: text.slice(0, space), label: text.slice(space + 1) };
}

export default function HeroSection({ uploadTargetId = "photo-upload" }: HeroSectionProps) {
  const { t, i18n } = useTranslation(undefined, { keyPrefix: "hero" });
  const unlockPrice = useUnlockPrice();
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

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-4 py-5 shadow-sm sm:px-6 sm:py-8 md:px-8"
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

      <div className="relative flex flex-col items-center gap-3 text-center lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:gap-y-2 lg:text-left">
        <h2
          id="hero-title"
          className="order-1 max-w-2xl text-balance bg-gradient-to-r from-slate-900 via-sky-800 to-slate-900 bg-clip-text text-2xl font-extrabold leading-tight tracking-tight text-transparent sm:text-3xl md:text-4xl lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:order-none"
        >
          {t("title")}
        </h2>

        <p className="order-2 max-w-xl text-balance text-sm leading-snug text-gray-500 sm:text-base lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:order-none">
          {t("subtitle")}
        </p>

        <div className="order-3 flex w-full max-w-sm flex-col items-center lg:col-span-6 lg:col-start-1 lg:row-start-4 lg:mt-2 lg:max-w-none lg:items-start lg:order-none">
          <button
            type="button"
            onClick={scrollToUpload}
            className="w-full rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-sky-600/25 transition hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-600/30 active:scale-[0.98] sm:w-auto sm:min-w-[240px]"
          >
            {t("cta_button")}
          </button>

          <p className="mt-2 text-xs text-gray-500">
            {unlockPrice} — {t("pricing_reassurance")}
          </p>
          <p className="text-xs text-gray-500">{t("pricing_note")}</p>

          {trustReady && (
            <p
              key={i18n.language}
              className="mt-1.5 text-[11px] leading-snug text-gray-400"
              aria-label="Trust indicators"
            >
              {TRUST_KEYS.map((key) => `✓ ${t(`trust.${key}`)}`).join(" · ")}
            </p>
          )}
        </div>

        <div className="order-4 w-full lg:col-span-6 lg:col-start-7 lg:row-span-4 lg:row-start-1 lg:order-none">
          <div
            className="relative aspect-[4/3] max-h-[240px] w-full overflow-hidden rounded-2xl shadow-lg sm:max-h-none"
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
                  className="h-full w-full rounded-2xl object-cover object-top shadow-lg sm:object-center"
                />
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-center gap-2">
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

        <ul className="order-5 mx-auto flex w-fit flex-col items-start gap-1.5 pt-1 lg:col-span-6 lg:col-start-1 lg:row-start-3 lg:mx-0 lg:pt-0 lg:order-none">
          {BADGE_KEYS.map((key) => {
            const { icon, label } = splitBadge(t(key));
            return (
              <li key={key} className="flex items-center gap-2 text-sm text-gray-700">
                {icon ? <span aria-hidden>{icon}</span> : null}
                <span>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

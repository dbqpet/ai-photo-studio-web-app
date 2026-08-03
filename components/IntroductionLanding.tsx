"use client";

import Link from "next/link";
import IntroductionLangSwitcher from "@/components/IntroductionLangSwitcher";
import { trackGAEvent } from "@/lib/ga";
import {
  type IntroLang,
  type IntroductionDictionary,
} from "@/lib/introduction/dictionaries";
import { SUPPORT_EMAIL } from "@/lib/site";

interface IntroductionLandingProps {
  lang: IntroLang;
  dict: IntroductionDictionary;
}

function scrollToFeatures() {
  document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function PrimaryCta({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <Link
      href="/"
      onClick={() => trackGAEvent("click_intro_cta", { label })}
      className={`inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-sky-600/25 transition hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-600/30 active:scale-[0.98] sm:px-8 sm:text-base ${className}`}
    >
      {label}
    </Link>
  );
}

export default function IntroductionLanding({ lang, dict }: IntroductionLandingProps) {
  return (
    <div lang={dict.meta.htmlLang} className="flex min-h-full flex-col bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link
            href="/"
            className="font-sans text-xl font-extrabold tracking-tighter text-slate-900"
          >
            AI Images Studio
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <IntroductionLangSwitcher lang={lang} dict={dict} />
            <PrimaryCta label={dict.nav.headerCta} className="px-5 py-2.5 text-sm" />
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section
          aria-labelledby="intro-hero-title"
          className="relative overflow-hidden border-b border-slate-200 bg-white"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl"
          />

          <div className="relative mx-auto max-w-5xl px-5 py-14 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <h1
                id="intro-hero-title"
                className="bg-gradient-to-r from-slate-900 via-sky-800 to-slate-900 bg-clip-text text-2xl font-extrabold leading-tight tracking-tight text-transparent sm:text-3xl md:text-4xl lg:text-5xl"
              >
                {dict.hero.title}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
                {dict.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <PrimaryCta label={dict.hero.primaryCta} />
                <button
                  type="button"
                  onClick={scrollToFeatures}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:px-8 sm:text-base"
                >
                  {dict.hero.secondaryCta}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          aria-labelledby="features-title"
          className="scroll-mt-6 border-b border-slate-200 py-14 sm:py-20"
        >
          <div className="mx-auto max-w-5xl px-5">
            <h2
              id="features-title"
              className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl"
            >
              {dict.features.title}
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {dict.features.items.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 text-3xl" aria-hidden>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {feature.title}{" "}
                    <span className="text-sm font-medium text-slate-500">
                      ({feature.subtitle})
                    </span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          aria-labelledby="steps-title"
          className="border-b border-slate-200 bg-white py-14 sm:py-20"
        >
          <div className="mx-auto max-w-5xl px-5">
            <h2
              id="steps-title"
              className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl"
            >
              {dict.steps.title}
            </h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {dict.steps.items.map((item) => (
                <li
                  key={item.step}
                  className="relative flex flex-col rounded-3xl border border-slate-200/80 bg-slate-50 p-6"
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {dict.steps.stepLabel} {item.step}: {item.title}{" "}
                    <span className="text-sm font-medium text-slate-500">
                      ({item.subtitle})
                    </span>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          aria-labelledby="faq-title"
          className="border-b border-slate-200 py-14 sm:py-20"
        >
          <div className="mx-auto max-w-3xl px-5">
            <h2
              id="faq-title"
              className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl"
            >
              {dict.faq.title}
            </h2>
            <div className="mt-10 space-y-4">
              {dict.faq.items.map((faq, index) => (
                <article
                  key={faq.question}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-base font-bold text-slate-900">
                    {dict.faq.questionPrefix}
                    {index + 1}: {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {dict.faq.answerPrefix}: {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section
          aria-labelledby="bottom-cta-title"
          className="bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-700 py-14 sm:py-20"
        >
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h2
              id="bottom-cta-title"
              className="text-2xl font-extrabold text-white sm:text-3xl"
            >
              {dict.bottomCta.title}
            </h2>
            <p className="mt-3 text-base text-sky-100 sm:text-lg">
              {dict.bottomCta.subtitle}
            </p>
            <div className="mt-8">
              <Link
                href="/"
                onClick={() =>
                  trackGAEvent("click_intro_cta", { label: "bottom_start" })
                }
                className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-3.5 text-base font-bold text-sky-700 shadow-lg transition hover:bg-sky-50 active:scale-[0.98]"
              >
                {dict.bottomCta.button}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5">
          <IntroductionLangSwitcher lang={lang} dict={dict} />
          <div className="text-center text-xs text-slate-400">
            <p>{dict.footer.privacy}</p>
            <p className="mt-1.5">
              {dict.footer.supportLabel}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-slate-600 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

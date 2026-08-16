"use client";

import Link from "next/link";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import ProductHuntBadge from "@/components/ProductHuntBadge";
import TechBaseDirectoryBadge from "@/components/TechBaseDirectoryBadge";
import {
  getAlternateTermsLang,
  getTermsPath,
  type TermsLang,
} from "@/lib/terms/dictionaries";
import type { TermsContent } from "@/lib/terms/types";
import { SUPPORT_EMAIL } from "@/lib/site";

interface TermsLandingProps {
  lang: TermsLang;
  content: TermsContent;
}

export default function TermsLanding({ lang, content }: TermsLandingProps) {
  const otherLang = getAlternateTermsLang(lang);

  return (
    <div lang={content.meta.htmlLang} className="flex min-h-full flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link
            href="/"
            className="font-sans text-xl font-extrabold tracking-tighter text-slate-900"
          >
            AI Images Studio
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-600/25 transition hover:bg-sky-700"
          >
            {content.nav.backToStudio}
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          <header className="mb-10 border-b border-slate-200 pb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {content.pageTitle}
            </h1>
            <p className="mt-3 text-sm text-slate-500">{content.lastUpdated}</p>
          </header>

          <aside
            aria-labelledby="terms-disclaimer-title"
            className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-5 sm:px-6"
          >
            <h2
              id="terms-disclaimer-title"
              className="text-base font-bold text-amber-900 sm:text-lg"
            >
              {content.disclaimer.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-amber-950/90 sm:text-base">
              {content.disclaimer.text}
            </p>
          </aside>

          <div className="space-y-10">
            {content.sections.map((section) => (
              <section key={section.id} aria-labelledby={`terms-${section.id}`}>
                <h2
                  id={`terms-${section.id}`}
                  className="text-lg font-bold text-slate-900 sm:text-xl"
                >
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                  {section.bullets && (
                    <ul className="list-disc space-y-2 pl-5">
                      {section.bullets.map((item) => (
                        <li key={item.slice(0, 40)}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
            role="navigation"
            aria-label={content.nav.switchLangLabel}
          >
            <span className="text-slate-500">{content.nav.switchLangLabel}:</span>
            <span aria-current="page" className="text-sky-700">
              {lang === "zh" ? "繁體中文" : "English"}
            </span>
            <span className="text-slate-300" aria-hidden>
              |
            </span>
            <Link
              href={getTermsPath(otherLang)}
              className="text-slate-600 transition hover:text-sky-700"
            >
              {content.nav.switchLang}
            </Link>
          </div>
          <SocialMediaLinks />
          <div className="flex flex-col items-center gap-3">
            <ProductHuntBadge />
            <TechBaseDirectoryBadge />
          </div>
          <div className="text-center text-xs text-slate-400">
            <p>{content.footer.privacy}</p>
            <p className="mt-1.5">
              {content.footer.supportLabel}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-slate-600 hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

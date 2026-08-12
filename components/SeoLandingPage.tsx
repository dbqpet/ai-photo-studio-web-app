"use client";

import Link from "next/link";
import ProductHuntBadge from "@/components/ProductHuntBadge";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import TechBaseDirectoryBadge from "@/components/TechBaseDirectoryBadge";
import { trackGAEvent } from "@/lib/ga";
import type { SeoLang, SeoPageContent, SeoSection } from "@/lib/seo/types";
import { SUPPORT_EMAIL } from "@/lib/site";

interface SeoLandingPageProps {
  lang: SeoLang;
  page: SeoPageContent;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function PrimaryCta({
  label,
  slug,
  className = "",
}: {
  label: string;
  slug: string;
  className?: string;
}) {
  return (
    <Link
      href="/"
      onClick={() => trackGAEvent("click_seo_cta", { label, page: slug })}
      className={`inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-sky-600/25 transition hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-600/30 active:scale-[0.98] sm:px-8 sm:text-base ${className}`}
    >
      {label}
    </Link>
  );
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function SeoSectionBlock({ section }: { section: SeoSection }) {
  const sectionId = section.id;

  if (section.type === "prose") {
    return (
      <section
        id={sectionId}
        className={`${sectionId ? "scroll-mt-6" : ""} border-b border-slate-200 py-14 sm:py-16`}
      >
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{section.title}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {paragraph}
            </p>
          ))}
          {section.bullets && section.bullets.length > 0 && (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 sm:text-base">
              {section.bullets.map((item) => (
                <li key={item.slice(0, 48)}>{item}</li>
              ))}
            </ul>
          )}
          {section.subsections?.map((sub) => (
            <div key={sub.title} className="mt-8">
              <h3 className="text-lg font-bold text-slate-900">{sub.title}</h3>
              {sub.paragraphs?.map((p) => (
                <p key={p.slice(0, 40)} className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {p}
                </p>
              ))}
              {sub.bullets && (
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {sub.bullets.map((item) => (
                    <li key={item.slice(0, 48)}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "features") {
    return (
      <section
        id={sectionId}
        className={`${sectionId ? "scroll-mt-6" : ""} border-b border-slate-200 py-14 sm:py-16`}
      >
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {section.title}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {section.items.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"
              >
                {item.icon && (
                  <div className="mb-3 text-3xl" aria-hidden>
                    {item.icon}
                  </div>
                )}
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "steps") {
    return (
      <section
        id={sectionId}
        className={`${sectionId ? "scroll-mt-6" : ""} border-b border-slate-200 bg-white py-14 sm:py-16`}
      >
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {section.title}
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-2">
            {section.items.map((item, index) => (
              <li
                key={item.title}
                className="flex flex-col rounded-3xl border border-slate-200/80 bg-slate-50 p-6"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  if (section.type === "beforeAfter") {
    return (
      <section
        id={sectionId}
        className={`${sectionId ? "scroll-mt-6" : ""} border-b border-slate-200 py-14 sm:py-16`}
      >
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {section.title}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-red-100 bg-red-50/50 p-6">
              <h3 className="text-lg font-bold text-slate-900">
                {section.beforeTitle ?? "Before"}
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
                {section.before.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6">
              <h3 className="text-lg font-bold text-slate-900">
                {section.afterTitle ?? "After"}
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
                {section.after.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "disclaimer") {
    return (
      <section
        id={sectionId}
        className={`${sectionId ? "scroll-mt-6" : ""} border-b border-slate-200 bg-amber-50/60 py-14 sm:py-16`}
      >
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
              {paragraph}
            </p>
          ))}
          {section.links && section.links.length > 0 && (
            <ul className="mt-4 space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  {isExternalHref(link.href) ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-sky-700 hover:underline"
                    >
                      {link.label} ↗
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-sky-700 hover:underline"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "solution") {
    return (
      <section
        id={sectionId}
        className={`${sectionId ? "scroll-mt-6" : ""} border-b border-slate-200 py-14 sm:py-16`}
      >
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{section.title}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {paragraph}
            </p>
          ))}
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 sm:text-base">
            {section.bullets.map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return null;
}

export default function SeoLandingPage({ lang, page }: SeoLandingPageProps) {
  return (
    <div lang={page.meta.htmlLang} className="flex min-h-full flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link
            href="/"
            className="font-sans text-xl font-extrabold tracking-tighter text-slate-900"
          >
            AI Images Studio
          </Link>
          <PrimaryCta label={page.nav.headerCta} slug={page.slug} className="px-5 py-2.5 text-sm" />
        </div>
      </header>

      <main>
        <section
          aria-labelledby="seo-hero-title"
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
                id="seo-hero-title"
                className="bg-gradient-to-r from-slate-900 via-sky-800 to-slate-900 bg-clip-text text-2xl font-extrabold leading-tight tracking-tight text-transparent sm:text-3xl md:text-4xl lg:text-[2.5rem]"
              >
                {page.hero.title}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
                {page.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <PrimaryCta label={page.hero.primaryCta} slug={page.slug} />
                {page.hero.secondaryCta && page.hero.secondaryTargetId && (
                  <button
                    type="button"
                    onClick={() => scrollToId(page.hero.secondaryTargetId!)}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:px-8 sm:text-base"
                  >
                    {page.hero.secondaryCta}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {page.sections.map((section) => (
          <SeoSectionBlock key={section.title} section={section} />
        ))}

        <section id="faq" aria-labelledby="faq-title" className="scroll-mt-6 border-b border-slate-200 py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-5">
            <h2 id="faq-title" className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {page.faq.title}
            </h2>
            <div className="mt-10 space-y-4">
              {page.faq.items.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-base font-bold text-slate-900">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {page.relatedPages.length > 0 && (
          <section aria-labelledby="related-title" className="border-b border-slate-200 bg-white py-12 sm:py-14">
            <div className="mx-auto max-w-3xl px-5">
              <h2 id="related-title" className="text-center text-xl font-extrabold text-slate-900 sm:text-2xl">
                Related guides
              </h2>
              <nav aria-label="Related guides" className="mt-6 flex flex-wrap justify-center gap-2">
                {page.relatedPages.map((link) => (
                  <Link
                    key={link.slug}
                    href={`/${lang}/${link.slug}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={`/${lang}/introduction`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                >
                  About AI Images Studio
                </Link>
              </nav>
            </div>
          </section>
        )}

        <section
          aria-labelledby="bottom-cta-title"
          className="bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-700 py-14 sm:py-20"
        >
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h2 id="bottom-cta-title" className="text-2xl font-extrabold text-white sm:text-3xl">
              {page.bottomCta.title}
            </h2>
            <p className="mt-3 text-base text-sky-100 sm:text-lg">{page.bottomCta.subtitle}</p>
            <div className="mt-8">
              <Link
                href="/"
                onClick={() =>
                  trackGAEvent("click_seo_cta", { label: "bottom", page: page.slug })
                }
                className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-3.5 text-base font-bold text-sky-700 shadow-lg transition hover:bg-sky-50 active:scale-[0.98]"
              >
                {page.bottomCta.button}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5">
          <SocialMediaLinks />
          <div className="flex flex-col items-center gap-3">
            <ProductHuntBadge />
            <TechBaseDirectoryBadge />
          </div>
          <div className="text-center text-xs text-slate-400">
            <p>{page.footer.privacy}</p>
            <p className="mt-1.5">
              {page.footer.supportLabel}
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

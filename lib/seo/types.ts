export const SEO_LANGS = ["en", "zh", "zh-cn"] as const;
export type SeoLang = (typeof SEO_LANGS)[number];

export function isSeoLang(value: string): value is SeoLang {
  return SEO_LANGS.includes(value as SeoLang);
}

export interface SeoPageMeta {
  title: string;
  description: string;
  keywords: string[];
  htmlLang: string;
  locale: string;
}

export interface SeoFeatureItem {
  icon?: string;
  title: string;
  description: string;
}

export interface SeoStepItem {
  title: string;
  description: string;
}

export interface SeoProseSubsection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface SeoExternalLink {
  href: string;
  label: string;
}

export type SeoSection =
  | {
      type: "prose";
      id?: string;
      title: string;
      paragraphs?: string[];
      bullets?: string[];
      subsections?: SeoProseSubsection[];
    }
  | {
      type: "features";
      id?: string;
      title: string;
      items: SeoFeatureItem[];
    }
  | {
      type: "steps";
      id?: string;
      title: string;
      items: SeoStepItem[];
    }
  | {
      type: "beforeAfter";
      id?: string;
      title: string;
      beforeTitle?: string;
      afterTitle?: string;
      before: string[];
      after: string[];
    }
  | {
      type: "disclaimer";
      id?: string;
      title: string;
      paragraphs: string[];
      links?: SeoExternalLink[];
    }
  | {
      type: "solution";
      id?: string;
      title: string;
      paragraphs?: string[];
      bullets: string[];
    };

export interface SeoRelatedLink {
  slug: string;
  label: string;
}

export interface SeoPageContent {
  slug: string;
  meta: SeoPageMeta;
  nav: { headerCta: string };
  hero: {
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta?: string;
    secondaryTargetId?: string;
  };
  sections: SeoSection[];
  faq: {
    title: string;
    items: { question: string; answer: string }[];
  };
  bottomCta: {
    title: string;
    subtitle: string;
    button: string;
  };
  relatedPages: SeoRelatedLink[];
  /** Localized heading for the related-pages nav; defaults to English. */
  relatedPagesTitle?: string;
  footer: {
    privacy: string;
    supportLabel: string;
  };
}

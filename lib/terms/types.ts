export interface TermsSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface TermsContent {
  meta: {
    title: string;
    description: string;
    htmlLang: string;
    locale: string;
  };
  nav: {
    backToStudio: string;
    switchLang: string;
    switchLangLabel: string;
  };
  pageTitle: string;
  lastUpdated: string;
  disclaimer: {
    title: string;
    text: string;
  };
  sections: TermsSection[];
  footer: {
    privacy: string;
    supportLabel: string;
    terms: string;
  };
}

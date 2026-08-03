"use client";

import { useEffect } from "react";

/** Syncs `<html lang="...">` for localized introduction routes. */
export default function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}

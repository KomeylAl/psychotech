"use client";

import { useEffect, useLayoutEffect } from "react";
import { localeDirection, localeHtmlLang, type Locale } from "@/lib/i18n/config";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// The root layout owns <html>, but it sits above the [locale] segment and is
// reused during client navigation. Keep lang/dir in sync on every locale change.
export function LocaleSync({ locale }: { locale: Locale }) {
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = localeHtmlLang[locale];
    root.dir = localeDirection[locale];
    root.dataset.locale = locale;
  }, [locale]);

  return null;
}

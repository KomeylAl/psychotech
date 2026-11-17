import { defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n/config";

/** Prefixes an internal path with the active locale. External links and hashes pass through. */
export function localizedHref(locale: Locale, path: string): string {
  if (!path.startsWith("/")) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

/** Removes a leading locale segment from a pathname. */
export function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/([^/?#]+)(.*)$/);
  if (!match) return pathname;
  const [, first, rest] = match;
  if (!isLocale(first)) return pathname;
  return rest || "/";
}

export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return isLocale(first) ? first : defaultLocale;
}

export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  const rest = stripLocale(pathname);
  return rest === "/" ? `/${nextLocale}` : `/${nextLocale}${rest}`;
}

export function isLocalizedPathname(pathname: string): boolean {
  return isLocale(pathname.split("/")[1]);
}

export const localeCookieName = "NEXT_LOCALE";

export function detectLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;

  const preferences = header
    .split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=");
      return { tag: tag.trim().toLowerCase(), quality: Number(quality ?? 1) };
    })
    .filter((item) => item.tag)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of preferences) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  return defaultLocale;
}

export function allLocalePaths(path: string): { locale: Locale; path: string }[] {
  return locales.map((locale) => ({ locale, path: localizedHref(locale, path) }));
}

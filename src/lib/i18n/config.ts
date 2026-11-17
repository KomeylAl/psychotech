export const locales = ["fa", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fa";

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  fa: "rtl",
  en: "ltr",
};

export const localeHtmlLang: Record<Locale, string> = {
  fa: "fa-IR",
  en: "en",
};

export const localeOgLocale: Record<Locale, string> = {
  fa: "fa_IR",
  en: "en_US",
};

export const localeSwitchLabel: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "fa" ? "en" : "fa";
}

export function numberLocale(locale: Locale): string {
  return locale === "fa" ? "fa-IR" : "en-US";
}

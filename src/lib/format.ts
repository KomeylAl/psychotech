import { numberLocale, type Locale } from "@/lib/i18n/config";

export function formatNumber(value: number, locale: Locale = "fa") {
  return new Intl.NumberFormat(numberLocale(locale)).format(value);
}

export function formatViewCount(count: number, locale: Locale = "fa") {
  return formatNumber(count, locale);
}

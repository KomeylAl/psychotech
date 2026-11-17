import Link from "next/link";
import { formatNumber } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/url";

export function BlogPagination({
  page,
  totalPages,
  q,
  category,
  tag,
  locale,
}: {
  page: number;
  totalPages: number;
  q?: string;
  category?: string;
  tag?: string;
  locale: Locale;
}) {
  if (totalPages <= 1) return null;

  const dict = getDictionary(locale);
  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  return (
    <nav className="mt-12 flex items-center justify-between gap-4" aria-label={dict.blog.pagination}>
      {prev ? (
        <Link href={hrefFor(locale, prev, { q, category, tag })} className="btn-ghost !py-2 text-sm">
          {dict.blog.previous}
        </Link>
      ) : (
        <span className="btn-ghost pointer-events-none !py-2 text-sm opacity-40">
          {dict.blog.previous}
        </span>
      )}
      <p className="text-sm text-muted">
        {dict.blog.pageOf(formatNumber(page, locale), formatNumber(totalPages, locale))}
      </p>
      {next ? (
        <Link href={hrefFor(locale, next, { q, category, tag })} className="btn-ghost !py-2 text-sm">
          {dict.blog.next}
        </Link>
      ) : (
        <span className="btn-ghost pointer-events-none !py-2 text-sm opacity-40">
          {dict.blog.next}
        </span>
      )}
    </nav>
  );
}

function hrefFor(
  locale: Locale,
  page: number,
  params: { q?: string; category?: string; tag?: string },
) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.tag) search.set("tag", params.tag);
  if (page > 1) search.set("page", String(page));
  const value = search.toString();
  return localizedHref(locale, value ? `/blog?${value}` : "/blog");
}

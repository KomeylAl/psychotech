import Link from "next/link";
import { formatNumber } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/url";

type BlogFiltersProps = {
  q?: string;
  category?: string;
  tag?: string;
  categories: { slug: string; name: string; count: number }[];
  tags: { slug: string; name: string; count: number }[];
  total: number;
  locale: Locale;
};

export function BlogFilters({
  q = "",
  category,
  tag,
  categories,
  tags,
  total,
  locale,
}: BlogFiltersProps) {
  const dict = getDictionary(locale);
  const blogHref = localizedHref(locale, "/blog");

  return (
    <div className="space-y-6">
      <form action={blogHref} method="get" className="glass rounded-[1.75rem] p-4 sm:p-5">
        <label className="block text-sm">
          <span className="mb-2 block text-muted">{dict.blog.searchLabel}</span>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder={dict.blog.searchPlaceholder}
              className="input"
            />
            {category ? <input type="hidden" name="category" value={category} /> : null}
            {tag ? <input type="hidden" name="tag" value={tag} /> : null}
            <button type="submit" className="btn-primary shrink-0 sm:px-6">
              {dict.blog.search}
            </button>
          </div>
        </label>
        <p className="mt-3 text-xs text-muted">
          {dict.blog.resultsFound(formatNumber(total, locale))}
        </p>
      </form>

      {categories.length > 0 ? (
        <div>
          <p className="mb-3 text-sm text-muted">{dict.blog.categories}</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              href={buildHref(locale, { q, tag })}
              active={!category}
              label={dict.blog.all}
            />
            {categories.map((item) => (
              <FilterChip
                key={item.slug}
                href={buildHref(locale, { q, tag, category: item.slug })}
                active={category === item.slug}
                label={`${item.name} (${formatNumber(item.count, locale)})`}
              />
            ))}
          </div>
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div>
          <p className="mb-3 text-sm text-muted">{dict.blog.tags}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((item) => (
              <FilterChip
                key={item.slug}
                href={buildHref(locale, { q, category, tag: item.slug })}
                active={tag === item.slug}
                label={`#${item.name}`}
              />
            ))}
          </div>
        </div>
      ) : null}

      {q || category || tag ? (
        <Link href={blogHref} className="inline-flex text-sm text-accent hover:underline">
          {dict.blog.clearFilters}
        </Link>
      ) : null}
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? "border-brand bg-brand text-on-brand"
          : "border-line text-muted hover:border-brand/40 hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

function buildHref(
  locale: Locale,
  params: { q?: string; category?: string; tag?: string },
) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.tag) search.set("tag", params.tag);
  const value = search.toString();
  return localizedHref(locale, value ? `/blog?${value}` : "/blog");
}

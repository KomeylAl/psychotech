import Link from "next/link";

type BlogFiltersProps = {
  q?: string;
  category?: string;
  tag?: string;
  categories: { slug: string; name: string; count: number }[];
  tags: { slug: string; name: string; count: number }[];
  total: number;
};

export function BlogFilters({
  q = "",
  category,
  tag,
  categories,
  tags,
  total,
}: BlogFiltersProps) {
  return (
    <div className="space-y-6">
      <form action="/blog" method="get" className="glass rounded-[1.75rem] p-4 sm:p-5">
        <label className="block text-sm">
          <span className="mb-2 block text-muted">جستجو در مطالب</span>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="عنوان، خلاصه یا متن…"
              className="input"
            />
            {category ? <input type="hidden" name="category" value={category} /> : null}
            {tag ? <input type="hidden" name="tag" value={tag} /> : null}
            <button type="submit" className="btn-primary shrink-0 sm:px-6">
              جستجو
            </button>
          </div>
        </label>
        <p className="mt-3 text-xs text-muted">{total.toLocaleString("fa-IR")} مطلب پیدا شد</p>
      </form>

      {categories.length > 0 ? (
        <div>
          <p className="mb-3 text-sm text-muted">دسته‌بندی‌ها</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip href={buildHref({ q, tag })} active={!category} label="همه" />
            {categories.map((item) => (
              <FilterChip
                key={item.slug}
                href={buildHref({ q, tag, category: item.slug })}
                active={category === item.slug}
                label={`${item.name} (${item.count.toLocaleString("fa-IR")})`}
              />
            ))}
          </div>
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div>
          <p className="mb-3 text-sm text-muted">برچسب‌ها</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((item) => (
              <FilterChip
                key={item.slug}
                href={buildHref({ q, category, tag: item.slug })}
                active={tag === item.slug}
                label={`#${item.name}`}
              />
            ))}
          </div>
        </div>
      ) : null}

      {q || category || tag ? (
        <Link href="/blog" className="inline-flex text-sm text-accent hover:underline">
          پاک کردن فیلترها
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

function buildHref(params: { q?: string; category?: string; tag?: string }) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.tag) search.set("tag", params.tag);
  const value = search.toString();
  return value ? `/blog?${value}` : "/blog";
}

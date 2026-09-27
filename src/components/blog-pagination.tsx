import Link from "next/link";

export function BlogPagination({
  page,
  totalPages,
  q,
  category,
  tag,
}: {
  page: number;
  totalPages: number;
  q?: string;
  category?: string;
  tag?: string;
}) {
  if (totalPages <= 1) return null;

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  return (
    <nav className="mt-12 flex items-center justify-between gap-4" aria-label="صفحه‌بندی">
      {prev ? (
        <Link href={hrefFor(prev, { q, category, tag })} className="btn-ghost !py-2 text-sm">
          صفحه قبل
        </Link>
      ) : (
        <span className="btn-ghost pointer-events-none !py-2 text-sm opacity-40">صفحه قبل</span>
      )}
      <p className="text-sm text-muted">
        صفحه {page.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
      </p>
      {next ? (
        <Link href={hrefFor(next, { q, category, tag })} className="btn-ghost !py-2 text-sm">
          صفحه بعد
        </Link>
      ) : (
        <span className="btn-ghost pointer-events-none !py-2 text-sm opacity-40">صفحه بعد</span>
      )}
    </nav>
  );
}

function hrefFor(
  page: number,
  params: { q?: string; category?: string; tag?: string },
) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.tag) search.set("tag", params.tag);
  if (page > 1) search.set("page", String(page));
  const value = search.toString();
  return value ? `/blog?${value}` : "/blog";
}

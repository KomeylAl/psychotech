import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogFilters } from "@/components/blog-filters";
import { BlogPagination } from "@/components/blog-pagination";
import { BlogPostCardView } from "@/components/blog-post-card";
import { SiteShell } from "@/components/site-shell";
import { getBlogTaxonomy, getPublishedPosts } from "@/lib/blog";
import { getSiteContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/i18n/seo";
import { localizedHref } from "@/lib/i18n/url";

export const dynamic = "force-dynamic";

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{
  q?: string;
  category?: string;
  tag?: string;
  page?: string;
}>;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const filters = await searchParams;
  const dict = getDictionary(locale);
  const content = await getSiteContent(locale);
  const settings = content?.settings;

  return buildPageMetadata({
    locale,
    path: "/blog",
    title: settings?.blogTitle ?? dict.blog.title,
    description: settings?.blogDescription ?? dict.blog.description,
    keywords: [dict.blog.title, ...dict.meta.keywords],
    siteName: settings?.name ?? "Psycho Tech",
    images: [settings?.ogImageUrl],
    noIndex: Boolean(filters.q || filters.category || filters.tag || filters.page),
  });
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const query = await searchParams;
  const q = query.q?.trim() || undefined;
  const category = query.category || undefined;
  const tag = query.tag || undefined;
  const page = Math.max(1, Number(query.page) || 1);

  const [{ posts, total, totalPages, page: currentPage }, taxonomy] = await Promise.all([
    getPublishedPosts({ q, category, tag, page }, locale),
    getBlogTaxonomy(locale),
  ]);
  const dict = getDictionary(locale);

  return (
    <SiteShell locale={locale}>
      <section className="relative overflow-hidden px-5 pt-10 pb-8 sm:px-8 sm:pt-14">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand/8 via-transparent to-transparent" />
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">{dict.blog.eyebrow}</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {dict.blog.title}
          </h1>
          <p className="mt-4 max-w-2xl text-muted leading-8">{dict.blog.description}</p>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BlogFilters
              q={q}
              category={category}
              tag={tag}
              total={total}
              locale={locale}
              categories={taxonomy.categories.map((item) => ({
                slug: item.slug,
                name: item.name,
                count: item._count.posts,
              }))}
              tags={taxonomy.tags.map((item) => ({
                slug: item.slug,
                name: item.name,
                count: item._count.posts,
              }))}
            />
          </aside>

          <div>
            {posts.length === 0 ? (
              <div className="glass rounded-[1.75rem] px-6 py-16 text-center">
                <h2 className="text-xl font-semibold">{dict.blog.notFoundTitle}</h2>
                <p className="mt-3 text-muted">{dict.blog.notFoundText}</p>
                <Link href={localizedHref(locale, "/blog")} className="btn-primary mt-6 inline-flex">
                  {dict.blog.backToAll}
                </Link>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  {posts.map((post, index) => (
                    <BlogPostCardView
                      key={post.id}
                      post={post}
                      locale={locale}
                      featured={index === 0 && currentPage === 1 && !q && !category && !tag}
                    />
                  ))}
                </div>
                <BlogPagination
                  page={currentPage}
                  totalPages={totalPages}
                  q={q}
                  category={category}
                  tag={tag}
                  locale={locale}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

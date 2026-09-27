import Link from "next/link";
import { BlogFilters } from "@/components/blog-filters";
import { BlogPagination } from "@/components/blog-pagination";
import { BlogPostCardView } from "@/components/blog-post-card";
import { SiteShell } from "@/components/site-shell";
import { getBlogTaxonomy, getPublishedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string;
  category?: string;
  tag?: string;
  page?: string;
}>;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const category = params.category || undefined;
  const tag = params.tag || undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const [{ posts, total, totalPages, page: currentPage }, taxonomy] = await Promise.all([
    getPublishedPosts({ q, category, tag, page }),
    getBlogTaxonomy(),
  ]);

  return (
    <SiteShell>
      <section className="relative overflow-hidden px-5 pt-10 pb-8 sm:px-8 sm:pt-14">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand/8 via-transparent to-transparent" />
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Blog</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            نوشته‌ها و بینش‌های سایکو تک
          </h1>
          <p className="mt-4 max-w-2xl text-muted leading-8">
            مقاله‌ها، یادداشت‌ها و روایت‌هایی از تقاطع روان‌شناسی و فناوری — برای مطالعه آرام و
            کاربردی.
          </p>
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
                <h2 className="text-xl font-semibold">مطلبی پیدا نشد</h2>
                <p className="mt-3 text-muted">فیلترها را تغییر دهید یا بعداً سر بزنید.</p>
                <Link href="/blog" className="btn-primary mt-6 inline-flex">
                  بازگشت به همه مطالب
                </Link>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  {posts.map((post, index) => (
                    <BlogPostCardView
                      key={post.id}
                      post={post}
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
                />
              </>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

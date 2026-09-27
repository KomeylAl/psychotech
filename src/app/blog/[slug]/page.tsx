import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostCardView } from "@/components/blog-post-card";
import { SiteShell } from "@/components/site-shell";
import {
  formatPostDate,
  getPublishedPostBySlug,
  getRelatedPosts,
} from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "مطلب پیدا نشد" };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.id, post.categoryId);
  const html = renderMarkdown(post.content);
  const date = formatPostDate(post.publishedAt);

  return (
    <SiteShell>
      <article className="px-5 pt-10 pb-20 sm:px-8 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm text-muted hover:text-brand">
            ← بازگشت به بلاگ
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
            {post.category ? (
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="rounded-full border border-line px-3 py-1 text-brand hover:bg-brand/10"
              >
                {post.category.name}
              </Link>
            ) : null}
            {date ? <time dateTime={post.publishedAt?.toISOString()}>{date}</time> : null}
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.2]">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-5 text-lg leading-8 text-muted">{post.excerpt}</p>
          ) : null}

          {post.coverImageUrl ? (
            <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImageUrl}
                alt=""
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          ) : null}

          <div
            className="prose-blog mt-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {post.tags.length > 0 ? (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
              {post.tags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/blog?tag=${tag.slug}`}
                  className="rounded-full bg-ink/5 px-3 py-1.5 text-sm text-muted hover:text-ink"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {related.length > 0 ? (
          <div className="mx-auto mt-20 max-w-6xl">
            <h2 className="mb-6 text-2xl font-semibold">مطالب مرتبط</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogPostCardView key={item.id} post={item} />
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </SiteShell>
  );
}

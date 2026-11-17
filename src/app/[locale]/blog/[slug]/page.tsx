import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostCardView } from "@/components/blog-post-card";
import { JsonLd } from "@/components/json-ld";
import { PostViews } from "@/components/post-views";
import { SiteShell } from "@/components/site-shell";
import {
  formatPostDate,
  getPublishedPostBySlug,
  getRelatedPosts,
} from "@/lib/blog";
import { getSiteContent } from "@/lib/content";
import {
  isLocale,
  localeDirection,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  absoluteUrl,
  blogPostingJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/i18n/seo";
import { localizedHref } from "@/lib/i18n/url";
import { renderPostContent } from "@/lib/markdown";

export const dynamic = "force-dynamic";

type Params = Promise<{ locale: string; slug: string }>;

async function resolvePost(params: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return null;
  const post = await getPublishedPostBySlug(slug, locale);
  if (!post) return null;
  const content = await getSiteContent(locale);
  const dict = getDictionary(locale);
  return { locale, post, settings: content?.settings, dict };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolved = await resolvePost(params);
  if (!resolved) return { title: "404", robots: { index: false, follow: false } };

  const { locale, post, settings, dict } = resolved;

  return buildPageMetadata({
    locale,
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt || dict.meta.brandDescription,
    keywords: [post.title, ...post.tags.map(({ tag }) => tag.name), ...dict.meta.keywords],
    siteName: settings?.name ?? "Psycho Tech",
    images: [post.coverImageUrl, settings?.ogImageUrl],
    imageAlt: post.title,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt?.toISOString(),
    authors: [settings?.name ?? "Psycho Tech"],
    section: post.category?.name,
  });
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const resolved = await resolvePost(params);
  if (!resolved) notFound();

  const { locale, post, settings, dict } = resolved;
  const related = await getRelatedPosts(post.id, post.categoryId, 3, locale);
  const html = renderPostContent(post.content);
  const date = formatPostDate(post.publishedAt, locale);
  const url = absoluteUrl(locale, `/blog/${post.slug}`);

  return (
    <SiteShell locale={locale}>
      <JsonLd
        data={[
          blogPostingJsonLd({
            locale,
            headline: post.title,
            description: post.excerpt || undefined,
            url,
            image: post.coverImageUrl,
            datePublished: post.publishedAt?.toISOString(),
            dateModified: post.updatedAt?.toISOString(),
            authorName: settings?.name ?? "Psycho Tech",
            siteName: settings?.name ?? "Psycho Tech",
            keywords: post.tags.map(({ tag }) => tag.name),
          }),
          breadcrumbJsonLd([
            { name: settings?.name ?? "Psycho Tech", url: absoluteUrl(locale, "/") },
            { name: dict.blog.eyebrow, url: absoluteUrl(locale, "/blog") },
            { name: post.title, url },
          ]),
        ]}
      />
      <article className="px-5 pt-10 pb-20 sm:px-8 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <Link
            href={localizedHref(locale, "/blog")}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand"
          >
            <span aria-hidden className="arrow-forward">←</span>
            {dict.blog.back}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
            {post.category ? (
              <Link
                href={localizedHref(locale, `/blog?category=${post.category.slug}`)}
                className="rounded-full border border-line px-3 py-1 text-brand hover:bg-brand/10"
              >
                {post.category.name}
              </Link>
            ) : null}
            {date ? <time dateTime={post.publishedAt?.toISOString()}>{date}</time> : null}
            <PostViews
              postId={post.id}
              initialCount={post.viewCount}
              track
              locale={locale}
            />
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
                alt={dict.blog.coverAlt(post.title)}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          ) : null}

          <div
            className="prose-blog mt-10"
            dir={localeDirection[locale as Locale]}
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {post.tags.length > 0 ? (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
              {post.tags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={localizedHref(locale, `/blog?tag=${tag.slug}`)}
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
            <h2 className="mb-6 text-2xl font-semibold">{dict.blog.related}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogPostCardView key={item.id} post={item} locale={locale} />
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </SiteShell>
  );
}

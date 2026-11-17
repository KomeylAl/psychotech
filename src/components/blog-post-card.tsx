import Link from "next/link";
import type { BlogPostCard } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog";
import { formatViewCount } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/url";

export function BlogPostCardView({
  post,
  locale = "fa",
  featured = false,
}: {
  post: BlogPostCard;
  locale?: Locale;
  featured?: boolean;
}) {
  const dict = getDictionary(locale);
  const href = localizedHref(locale, `/blog/${post.slug}`);
  const date = formatPostDate(post.publishedAt, locale);
  const views = formatViewCount(post.viewCount, locale);

  return (
    <article
      className={`group glass overflow-hidden rounded-[1.75rem] transition-transform duration-300 hover:-translate-y-1 ${
        featured ? "sm:col-span-2 lg:col-span-2 lg:grid lg:grid-cols-2" : ""
      }`}
    >
      <Link href={href} className="relative block overflow-hidden bg-canvas-soft">
        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImageUrl}
            alt={dict.blog.coverAlt(post.title)}
            className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
              featured ? "aspect-[16/10] lg:aspect-auto lg:h-full" : "aspect-[16/10]"
            }`}
          />
        ) : (
          <div
            className={`grid place-items-center bg-gradient-to-br from-brand/15 via-transparent to-accent/15 ${
              featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-full" : "aspect-[16/10]"
            }`}
          >
            <span className="font-display text-sm tracking-[0.2em] text-brand">BLOG</span>
          </div>
        )}
      </Link>
      <div className="flex flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          {post.category ? (
            <Link
              href={localizedHref(locale, `/blog?category=${post.category.slug}`)}
              className="rounded-full border border-line px-2.5 py-1 text-brand hover:bg-brand/10"
            >
              {post.category.name}
            </Link>
          ) : null}
          {date ? <time dateTime={post.publishedAt?.toISOString()}>{date}</time> : null}
          <span>{dict.viewCount(views)}</span>
        </div>
        <h2 className={`mt-3 font-semibold tracking-tight ${featured ? "text-2xl sm:text-3xl" : "text-xl"}`}>
          <Link href={href} className="hover:text-brand">
            {post.title}
          </Link>
        </h2>
        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">{post.excerpt}</p>
        ) : null}
        {post.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map(({ tag }) => (
              <Link
                key={tag.id}
                href={localizedHref(locale, `/blog?tag=${tag.slug}`)}
                className="rounded-full bg-ink/5 px-2.5 py-1 text-[0.7rem] text-muted hover:text-ink"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        ) : null}
        <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand">
          {dict.blog.readMore}
          <span aria-hidden className="arrow-forward">→</span>
        </Link>
      </div>
    </article>
  );
}

import Link from "next/link";
import { BlogPostCardView } from "@/components/blog-post-card";
import { Reveal } from "@/components/reveal";
import type { BlogPostCard } from "@/lib/blog";
import type { SiteSettings } from "@/generated/prisma/client";

type LatestBlogProps = {
  settings: SiteSettings;
  posts: BlogPostCard[];
};

export function LatestBlog({ settings, posts }: LatestBlogProps) {
  return (
    <section id="blog" className="scroll-mt-24 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">{settings.blogEyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {settings.blogTitle}
              </h2>
              <p className="mt-4 text-muted leading-8">{settings.blogDescription}</p>
            </div>
            <Link href="/blog" className="btn-ghost shrink-0 self-start sm:self-auto">
              {settings.blogCta}
              <span aria-hidden>←</span>
            </Link>
          </div>
        </Reveal>

        {posts.length > 0 ? (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.id} delay={index * 80}>
                <BlogPostCardView post={post} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={80}>
            <div className="mt-14 rounded-[1.75rem] border border-dashed border-line px-6 py-12 text-center">
              <p className="text-muted">هنوز مطلبی منتشر نشده است.</p>
              <Link href="/blog" className="btn-primary mt-5 inline-flex">
                {settings.blogCta}
              </Link>
            </div>
          </Reveal>
        )}

        {posts.length > 0 ? (
          <Reveal delay={240}>
            <div className="mt-10 flex justify-center sm:hidden">
              <Link href="/blog" className="btn-primary">
                {settings.blogCta}
                <span aria-hidden>←</span>
              </Link>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

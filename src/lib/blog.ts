import { prisma } from "@/lib/prisma";
import { pickText } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import type { Prisma } from "@/generated/prisma/client";

export const BLOG_PAGE_SIZE = 9;

export type BlogPostCard = Prisma.BlogPostGetPayload<{
  include: {
    category: true;
    tags: { include: { tag: true } };
  };
}>;

export type BlogFilters = {
  q?: string;
  category?: string;
  tag?: string;
  page?: number;
};

function publishedWhere(
  filters: BlogFilters = {},
): Prisma.BlogPostWhereInput {
  const where: Prisma.BlogPostWhereInput = {
    status: "published",
    publishedAt: { lte: new Date() },
  };

  const q = filters.q?.trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { titleEn: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
      { excerptEn: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
      { contentEn: { contains: q, mode: "insensitive" } },
    ];
  }

  if (filters.category) {
    where.category = { slug: filters.category };
  }

  if (filters.tag) {
    where.tags = { some: { tag: { slug: filters.tag } } };
  }

  return where;
}

function localizePost(post: BlogPostCard, locale: Locale): BlogPostCard {
  if (locale === "fa") return post;

  return {
    ...post,
    title: pickText(locale, post.title, post.titleEn),
    excerpt: pickText(locale, post.excerpt, post.excerptEn),
    content: pickText(locale, post.content, post.contentEn),
    category: post.category
      ? {
          ...post.category,
          name: pickText(locale, post.category.name, post.category.nameEn),
          description: pickText(locale, post.category.description, post.category.descriptionEn),
        }
      : null,
    tags: post.tags.map((entry) => ({
      ...entry,
      tag: {
        ...entry.tag,
        name: pickText(locale, entry.tag.name, entry.tag.nameEn),
      },
    })),
  };
}

export async function getPublishedPosts(filters: BlogFilters = {}, locale: Locale = "fa") {
  const page = Math.max(1, filters.page || 1);
  const where = publishedWhere(filters);

  const [total, posts] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * BLOG_PAGE_SIZE,
      take: BLOG_PAGE_SIZE,
    }),
  ]);

  return {
    posts: posts.map((post) => localizePost(post, locale)),
    total,
    page,
    pageSize: BLOG_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE)),
  };
}

export async function getLatestPosts(take = 3, locale: Locale = "fa") {
  const posts = await prisma.blogPost.findMany({
    where: publishedWhere(),
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take,
  });

  return posts.map((post) => localizePost(post, locale));
}

export async function getPublishedPostBySlug(
  slug: string,
  locale: Locale = "fa",
): Promise<BlogPostCard | null> {
  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      status: "published",
      publishedAt: { lte: new Date() },
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  return post ? localizePost(post, locale) : null;
}

export async function getBlogTaxonomy(locale: Locale = "fa") {
  const [categories, tags] = await Promise.all([
    prisma.blogCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: "published",
                publishedAt: { lte: new Date() },
              },
            },
          },
        },
      },
    }),
    prisma.blogTag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  status: "published",
                  publishedAt: { lte: new Date() },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    categories: categories
      .filter((item) => item._count.posts > 0)
      .map((item) => ({
        ...item,
        name: pickText(locale, item.name, item.nameEn),
      })),
    tags: tags
      .filter((item) => item._count.posts > 0)
      .map((item) => ({
        ...item,
        name: pickText(locale, item.name, item.nameEn),
      })),
  };
}

export async function getRelatedPosts(
  postId: string,
  categoryId: string | null | undefined,
  take = 3,
  locale: Locale = "fa",
) {
  const posts = await prisma.blogPost.findMany({
    where: {
      id: { not: postId },
      status: "published",
      publishedAt: { lte: new Date() },
      ...(categoryId ? { categoryId } : {}),
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: [{ publishedAt: "desc" }],
    take,
  });

  return posts.map((post) => localizePost(post, locale));
}

export function formatPostDate(
  date: Date | string | null | undefined,
  locale: Locale = "fa",
) {
  if (!date) return "";
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

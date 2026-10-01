import { prisma } from "@/lib/prisma";
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
      { excerpt: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
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

export async function getPublishedPosts(filters: BlogFilters = {}) {
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
    posts,
    total,
    page,
    pageSize: BLOG_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE)),
  };
}

export async function getLatestPosts(take = 3) {
  return prisma.blogPost.findMany({
    where: publishedWhere(),
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take,
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
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
}

export async function getBlogTaxonomy() {
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
    categories: categories.filter((item) => item._count.posts > 0),
    tags: tags.filter((item) => item._count.posts > 0),
  };
}

export async function getRelatedPosts(postId: string, categoryId?: string | null, take = 3) {
  return prisma.blogPost.findMany({
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
}

export function formatPostDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

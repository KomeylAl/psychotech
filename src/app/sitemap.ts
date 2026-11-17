import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales } from "@/lib/i18n/config";
import { absoluteUrl, languageAlternates } from "@/lib/i18n/seo";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/approach", priority: 0.8 },
  { path: "/products", priority: 0.9 },
  { path: "/team", priority: 0.7 },
  { path: "/blog", priority: 0.9 },
  { path: "/contact", priority: 0.7 },
] as const;

type DynamicEntry = {
  path: string;
  lastModified?: Date;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly";
};

async function getDynamicEntries(): Promise<DynamicEntry[]> {
  try {
    const [products, posts] = await Promise.all([
      prisma.product.findMany({ select: { slug: true, sortOrder: true } }),
      prisma.blogPost.findMany({
        where: { status: "published", publishedAt: { lte: new Date() } },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: "desc" },
        take: 1000,
      }),
    ]);

    return [
      ...products.map((product) => ({
        path: `/products/${product.slug}`,
        priority: 0.8,
        changeFrequency: "monthly" as const,
      })),
      ...posts.map((post) => ({
        path: `/blog/${post.slug}`,
        lastModified: post.updatedAt,
        priority: 0.7,
        changeFrequency: "weekly" as const,
      })),
    ];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicEntries = await getDynamicEntries();
  const entries: DynamicEntry[] = [
    ...STATIC_PATHS.map((item) => ({
      path: item.path,
      priority: item.priority,
      changeFrequency: "weekly" as const,
    })),
    ...dynamicEntries,
  ];

  return entries.flatMap((entry) =>
    locales.map((locale) => ({
      url: absoluteUrl(locale, entry.path),
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: { languages: languageAlternates(entry.path) },
    })),
  );
}

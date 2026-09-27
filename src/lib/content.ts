import { prisma } from "@/lib/prisma";
import type {
  ApproachStep,
  Keyword,
  NavItem,
  Product,
  ProductPoint,
  SiteSettings,
  TeamMember,
  ValueItem,
} from "@/generated/prisma/client";

export type ProductWithPoints = Product & { points: ProductPoint[] };

export type SiteContent = {
  settings: SiteSettings;
  nav: NavItem[];
  products: ProductWithPoints[];
  team: TeamMember[];
  values: ValueItem[];
  steps: ApproachStep[];
  keywords: Keyword[];
};

export async function getSiteContent(): Promise<SiteContent | null> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) return null;

  const [nav, products, team, values, steps, keywords] = await Promise.all([
    prisma.navItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      orderBy: { sortOrder: "asc" },
      include: { points: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.valueItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.approachStep.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.keyword.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const hasBlog = nav.some((item) => item.href === "/blog" || item.href.startsWith("/blog"));
  const navWithBlog = hasBlog
    ? nav
    : [
        ...nav.filter((item) => item.href !== "#contact"),
        {
          id: "blog-fallback",
          href: "/blog",
          label: "بلاگ",
          sortOrder: 40,
        },
        ...nav.filter((item) => item.href === "#contact"),
      ];

  return { settings, nav: navWithBlog, products, team, values, steps, keywords };
}

import { prisma } from "@/lib/prisma";
import { toPublicHref } from "@/lib/routes";
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

  return {
    settings,
    nav: toPublicNav(ensureBlogNav(nav)),
    products,
    team,
    values,
    steps,
    keywords,
  };
}

function ensureBlogNav(nav: NavItem[]): NavItem[] {
  const hasBlog = nav.some((item) => {
    const href = toPublicHref(item.href);
    return href === "/blog" || href.startsWith("/blog/");
  });
  if (hasBlog) return nav;

  const blogItem: NavItem = {
    id: "blog-fallback",
    href: "/blog",
    label: "بلاگ",
    sortOrder: 40,
  };
  const contactIndex = nav.findIndex((item) => toPublicHref(item.href) === "/contact");
  if (contactIndex === -1) return [...nav, blogItem];
  return [...nav.slice(0, contactIndex), blogItem, ...nav.slice(contactIndex)];
}

function toPublicNav(nav: NavItem[]): NavItem[] {
  return nav.map((item) => ({ ...item, href: toPublicHref(item.href) }));
}

export async function getProductBySlug(slug: string): Promise<ProductWithPoints | null> {
  return prisma.product.findUnique({
    where: { slug },
    include: { points: { orderBy: { sortOrder: "asc" } } },
  });
}

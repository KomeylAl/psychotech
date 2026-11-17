import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/hero";
import {
  HomeApproach,
  HomeContact,
  HomePathways,
  HomeProducts,
  HomeTeam,
} from "@/components/home-sections";
import { LatestBlog } from "@/components/latest-blog";
import { SideRail } from "@/components/side-rail";
import { SiteShell } from "@/components/site-shell";
import { getLatestPosts } from "@/lib/blog";
import { getSiteContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/i18n/seo";

export const dynamic = "force-dynamic";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const content = await getSiteContent(locale);
  const dict = getDictionary(locale);
  const settings = content?.settings;
  const title = settings
    ? locale === "fa"
      ? `${settings.nameFa} | ${settings.name}`
      : `${settings.name} — ${settings.tagline}`
    : `Psycho Tech | ${dict.meta.brandTagline}`;
  const description = settings ? settings.heroDescription : dict.meta.brandDescription;

  const metadata = buildPageMetadata({
    locale,
    path: "/",
    title,
    description,
    keywords: [settings?.name ?? "Psycho Tech", settings?.nameFa ?? "سایکو تک", ...dict.meta.keywords],
    siteName: settings?.name ?? "Psycho Tech",
    images: [settings?.ogImageUrl],
    imageAlt: title,
  });

  return { ...metadata, title: { absolute: title } };
}

export default async function Home({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [content, latestPosts] = await Promise.all([
    getSiteContent(locale),
    getLatestPosts(3, locale),
  ]);

  if (!content) {
    return <SiteShell locale={locale}>{null}</SiteShell>;
  }

  const { settings, products, team, values, steps, keywords } = content;
  const dict = getDictionary(locale);

  const homeRail = [
    { href: "#top", label: dict.home.rail.start },
    { href: "#focus", label: dict.home.rail.paths },
    { href: "#products", label: dict.home.rail.products },
    { href: "#approach", label: dict.home.rail.approach },
    { href: "#team", label: dict.home.rail.team },
    { href: "#blog", label: dict.home.rail.blog },
    { href: "#contact", label: dict.home.rail.contact },
  ];

  return (
    <SiteShell locale={locale}>
      <SideRail items={homeRail} locale={locale} />
      <Hero settings={settings} keywords={keywords} locale={locale} />
      <HomePathways settings={settings} values={values} locale={locale} />
      <HomeProducts settings={settings} products={products} locale={locale} />
      <HomeApproach settings={settings} steps={steps} locale={locale} />
      <HomeTeam settings={settings} team={team} locale={locale} />
      <LatestBlog settings={settings} posts={latestPosts} locale={locale} />
      <HomeContact settings={settings} locale={locale} />
    </SiteShell>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Products } from "@/components/products";
import { SiteShell } from "@/components/site-shell";
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

  return buildPageMetadata({
    locale,
    path: "/products",
    title: settings?.productsTitle ?? dict.nav.products,
    description: settings?.productsDescription,
    keywords: [settings?.productsTitle ?? dict.nav.products, ...dict.meta.keywords],
    siteName: settings?.name ?? "Psycho Tech",
    images: [settings?.ogImageUrl],
  });
}

export default async function ProductsPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = await getSiteContent(locale);
  if (!content) return <SiteShell locale={locale}>{null}</SiteShell>;

  return (
    <SiteShell locale={locale}>
      <Products
        settings={content.settings}
        products={content.products}
        locale={locale}
        asPage
      />
    </SiteShell>
  );
}

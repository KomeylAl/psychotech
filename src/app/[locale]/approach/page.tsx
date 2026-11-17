import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Approach } from "@/components/approach";
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
    path: "/approach",
    title: settings?.approachTitle ?? dict.nav.approach,
    description: settings?.approachDescription,
    keywords: [settings?.approachTitle ?? dict.nav.approach, ...dict.meta.keywords],
    siteName: settings?.name ?? "Psycho Tech",
    images: [settings?.ogImageUrl],
  });
}

export default async function ApproachPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = await getSiteContent(locale);
  if (!content) return <SiteShell locale={locale}>{null}</SiteShell>;

  return (
    <SiteShell locale={locale}>
      <Approach settings={content.settings} steps={content.steps} asPage />
    </SiteShell>
  );
}

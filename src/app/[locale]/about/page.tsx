import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { About } from "@/components/about";
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
    path: "/about",
    title: settings?.aboutTitle ?? dict.nav.about,
    description: settings?.aboutParagraph1,
    keywords: [settings?.aboutTitle ?? dict.nav.about, ...dict.meta.keywords],
    siteName: settings?.name ?? "Psycho Tech",
    images: [settings?.ogImageUrl],
  });
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = await getSiteContent(locale);
  if (!content) return <SiteShell locale={locale}>{null}</SiteShell>;

  return (
    <SiteShell locale={locale}>
      <About settings={content.settings} values={content.values} asPage />
    </SiteShell>
  );
}

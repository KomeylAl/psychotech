import type { Metadata } from "next";
import { About } from "@/components/about";
import { SiteShell } from "@/components/site-shell";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  if (!content) return { title: "شرکت" };
  return {
    title: content.settings.aboutTitle,
    description: content.settings.aboutParagraph1,
  };
}

export default async function AboutPage() {
  const content = await getSiteContent();
  if (!content) return <SiteShell>{null}</SiteShell>;

  return (
    <SiteShell>
      <About settings={content.settings} values={content.values} asPage />
    </SiteShell>
  );
}

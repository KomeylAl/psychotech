import type { Metadata } from "next";
import { Approach } from "@/components/approach";
import { SiteShell } from "@/components/site-shell";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  if (!content) return { title: "رویکرد" };
  return {
    title: content.settings.approachTitle,
    description: content.settings.approachDescription,
  };
}

export default async function ApproachPage() {
  const content = await getSiteContent();
  if (!content) return <SiteShell>{null}</SiteShell>;

  return (
    <SiteShell>
      <Approach settings={content.settings} steps={content.steps} asPage />
    </SiteShell>
  );
}

import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { Team } from "@/components/team";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  if (!content) return { title: "تیم" };
  return {
    title: content.settings.teamTitle,
    description: content.settings.teamDescription,
  };
}

export default async function TeamPage() {
  const content = await getSiteContent();
  if (!content) return <SiteShell>{null}</SiteShell>;

  return (
    <SiteShell>
      <Team settings={content.settings} team={content.team} asPage />
    </SiteShell>
  );
}

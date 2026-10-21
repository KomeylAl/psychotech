import type { Metadata } from "next";
import { Contact } from "@/components/contact";
import { SiteShell } from "@/components/site-shell";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  if (!content) return { title: "ارتباط" };
  return {
    title: content.settings.contactTitle,
    description: content.settings.contactDescription,
  };
}

export default async function ContactPage() {
  const content = await getSiteContent();
  if (!content) return <SiteShell>{null}</SiteShell>;

  return (
    <SiteShell>
      <Contact settings={content.settings} asPage />
    </SiteShell>
  );
}

import type { Metadata } from "next";
import { Products } from "@/components/products";
import { SiteShell } from "@/components/site-shell";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  if (!content) return { title: "محصولات" };
  return {
    title: content.settings.productsTitle,
    description: content.settings.productsDescription,
  };
}

export default async function ProductsPage() {
  const content = await getSiteContent();
  if (!content) return <SiteShell>{null}</SiteShell>;

  return (
    <SiteShell>
      <Products settings={content.settings} products={content.products} asPage />
    </SiteShell>
  );
}

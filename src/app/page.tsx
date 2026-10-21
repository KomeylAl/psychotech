import { Hero } from "@/components/hero";
import { HomeApproach, HomeContact, HomePathways, HomeProducts, HomeTeam } from "@/components/home-sections";
import { LatestBlog } from "@/components/latest-blog";
import { SideRail } from "@/components/side-rail";
import { SiteShell } from "@/components/site-shell";
import { getLatestPosts } from "@/lib/blog";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

const homeRail = [
  { href: "#top", label: "آغاز" },
  { href: "#focus", label: "مسیرها" },
  { href: "#products", label: "محصولات" },
  { href: "#approach", label: "رویکرد" },
  { href: "#team", label: "تیم" },
  { href: "#blog", label: "بلاگ" },
  { href: "#contact", label: "ارتباط" },
];

export default async function Home() {
  const [content, latestPosts] = await Promise.all([getSiteContent(), getLatestPosts(3)]);

  if (!content) {
    return <SiteShell>{null}</SiteShell>;
  }

  const { settings, products, team, values, steps, keywords } = content;

  return (
    <SiteShell>
      <SideRail items={homeRail} />
      <Hero settings={settings} keywords={keywords} />
      <HomePathways settings={settings} values={values} />
      <HomeProducts settings={settings} products={products} />
      <HomeApproach settings={settings} steps={steps} />
      <HomeTeam settings={settings} team={team} />
      <LatestBlog settings={settings} posts={latestPosts} />
      <HomeContact settings={settings} />
    </SiteShell>
  );
}

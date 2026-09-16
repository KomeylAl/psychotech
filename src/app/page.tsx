import { About } from "@/components/about";
import { Ambient } from "@/components/ambient";
import { Approach } from "@/components/approach";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Header, HeaderSpacer } from "@/components/header";
import { Hero } from "@/components/hero";
import { Products } from "@/components/products";
import { SideRail } from "@/components/side-rail";
import { Team } from "@/components/team";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();

  if (!content) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold">محتوا هنوز آماده نیست</h1>
          <p className="mt-3 text-muted">
            دیتابیس را seed کنید یا از پنل ادمین محتوا را بسازید.
          </p>
        </div>
      </div>
    );
  }

  const { settings, nav, products, team, values, steps, keywords } = content;

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <Ambient />
      <Header
        nav={nav}
        brand={{
          logoUrl: settings.logoUrl,
          name: settings.name,
          nameFa: settings.nameFa,
        }}
      />
      <HeaderSpacer />
      <SideRail nav={nav} />
      <main id="main" className="relative z-10 overflow-x-clip">
        <Hero settings={settings} keywords={keywords} />
        <About settings={settings} values={values} />
        <Approach settings={settings} steps={steps} />
        <Products settings={settings} products={products} />
        <Team settings={settings} team={team} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} nav={nav} />
    </div>
  );
}

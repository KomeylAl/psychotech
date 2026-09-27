import { Ambient } from "@/components/ambient";
import { Footer } from "@/components/footer";
import { Header, HeaderSpacer } from "@/components/header";
import { getSiteContent } from "@/lib/content";

export async function SiteShell({
  children,
  homeAnchors = false,
}: {
  children: React.ReactNode;
  homeAnchors?: boolean;
}) {
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

  const { settings, nav } = content;
  const links = homeAnchors
    ? nav
    : nav.map((item) =>
        item.href.startsWith("#")
          ? { ...item, href: `/${item.href}` }
          : item,
      );

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <Ambient />
      <Header
        nav={links}
        brand={{
          logoUrl: settings.logoUrl,
          name: settings.name,
          nameFa: settings.nameFa,
          href: "/",
        }}
      />
      <HeaderSpacer />
      <main id="main" className="relative z-10 overflow-x-clip">
        {children}
      </main>
      <Footer settings={settings} nav={links} />
    </div>
  );
}

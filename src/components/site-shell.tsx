import { Ambient } from "@/components/ambient";
import { Footer } from "@/components/footer";
import { Header, HeaderSpacer } from "@/components/header";
import { getSiteContent } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export async function SiteShell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const content = await getSiteContent(locale);
  const dict = getDictionary(locale);

  if (!content) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold">{dict.contentFallback.notReadyTitle}</h1>
          <p className="mt-3 text-muted">{dict.contentFallback.notReadyText}</p>
        </div>
      </div>
    );
  }

  const { settings, nav: links } = content;

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <Ambient />
      <Header
        nav={links}
        locale={locale}
        brand={{
          logoUrl: settings.logoUrl,
          name: settings.name,
          nameFa: settings.nameFa,
          href: `/${locale}`,
        }}
      />
      <HeaderSpacer />
      <main id="main" className="page-enter relative z-10 overflow-x-clip">
        {children}
      </main>
      <Footer settings={settings} nav={links} locale={locale} />
    </div>
  );
}

import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Outfit, Vazirmatn } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { themeInitScript } from "@/lib/theme-script";
import { buildThemeCss, DEFAULT_ACCENT, DEFAULT_BRAND } from "@/lib/theme-colors";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
  defaultLocale,
  isLocale,
  localeDirection,
  localeHtmlLang,
  localeOgLocale,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { organizationJsonLd, SITE_URL, websiteJsonLd } from "@/lib/i18n/seo";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

async function getSettingsSafe() {
  try {
    return await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
  } catch {
    return null;
  }
}

async function getRequestLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const value = requestHeaders.get("x-locale");
  return isLocale(value) ? value : defaultLocale;
}

function pick(locale: Locale, fa: string, en: string): string {
  if (locale === "en" && en?.trim()) return en;
  return fa;
}

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([getSettingsSafe(), getRequestLocale()]);
  const dict = getDictionary(locale);

  const defaultTitle = settings
    ? locale === "fa"
      ? `${settings.nameFa} | ${settings.name}`
      : `${settings.name} — ${pick(locale, settings.tagline, settings.taglineEn)}`
    : `Psycho Tech | ${dict.meta.brandTagline}`;

  const description = settings
    ? pick(locale, settings.heroDescription, settings.heroDescriptionEn)
    : dict.meta.brandDescription;

  const keywords = settings
    ? [settings.name, settings.nameFa, ...dict.meta.keywords]
    : dict.meta.keywords;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultTitle,
      template: `%s | ${settings?.name ?? "Psycho Tech"}`,
    },
    description,
    keywords,
    authors: [{ name: settings?.name ?? "Psycho Tech" }],
    creator: settings?.name ?? "Psycho Tech",
    publisher: settings?.name ?? "Psycho Tech",
    applicationName: settings?.name ?? "Psycho Tech",
    icons: settings?.faviconUrl
      ? {
          icon: [{ url: settings.faviconUrl }],
          shortcut: [settings.faviconUrl],
          apple: [{ url: settings.faviconUrl }],
        }
      : undefined,
    openGraph: {
      title: defaultTitle,
      description: settings
        ? `${pick(locale, settings.tagline, settings.taglineEn)}. ${description}`
        : dict.meta.ogDescription,
      locale: localeOgLocale[locale],
      type: "website",
      siteName: settings?.name ?? "Psycho Tech",
      url: `${SITE_URL}/${locale}`,
      images: settings?.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: settings?.ogImageUrl ? [settings.ogImageUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f0ea" },
    { media: "(prefers-color-scheme: dark)", color: "#12161c" },
  ],
  colorScheme: "light dark",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, locale] = await Promise.all([getSettingsSafe(), getRequestLocale()]);
  const dict = getDictionary(locale);
  const siteName = settings?.name ?? "Psycho Tech";

  const themeCss = buildThemeCss({
    brandColor: settings?.brandColor ?? DEFAULT_BRAND,
    accentColor: settings?.accentColor ?? DEFAULT_ACCENT,
    textColor: settings?.textColor,
    headingColor: settings?.headingColor,
    mutedColor: settings?.mutedColor,
    navColor: settings?.navColor,
    labelColor: settings?.labelColor,
    hintColor: settings?.hintColor,
    placeholderColor: settings?.placeholderColor,
    eyebrowColor: settings?.eyebrowColor,
    textColorDark: settings?.textColorDark,
    headingColorDark: settings?.headingColorDark,
    mutedColorDark: settings?.mutedColorDark,
    navColorDark: settings?.navColorDark,
    labelColorDark: settings?.labelColorDark,
    hintColorDark: settings?.hintColorDark,
    placeholderColorDark: settings?.placeholderColorDark,
    eyebrowColorDark: settings?.eyebrowColorDark,
  });

  const description = settings
    ? pick(locale, settings.footerBlurb, settings.footerBlurbEn) || dict.meta.organizationDescription
    : dict.meta.organizationDescription;

  return (
    <html
      lang={localeHtmlLang[locale]}
      dir={localeDirection[locale]}
      data-locale={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(vazirmatn.variable, outfit.variable, "h-full antialiased")}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <style id="site-theme" dangerouslySetInnerHTML={{ __html: themeCss }} />
        <JsonLd
          data={[
            organizationJsonLd({
              locale,
              siteName,
              description,
              logoUrl: settings?.logoUrl,
              email: settings?.email,
            }),
            websiteJsonLd({
              locale,
              siteName,
              description,
            }),
          ]}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-clip bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}

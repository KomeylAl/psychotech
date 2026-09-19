import type { Metadata, Viewport } from "next";
import { Outfit, Vazirmatn } from "next/font/google";
import { themeInitScript } from "@/lib/theme-script";
import { buildThemeCss, DEFAULT_ACCENT, DEFAULT_BRAND } from "@/lib/theme-colors";
import { prisma } from "@/lib/prisma";
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

const FALLBACK_METADATA: Metadata = {
  title: {
    default: "Psycho Tech | سایکو تک",
    template: "%s | Psycho Tech",
  },
  description:
    "سایکو تک در تقاطع روان‌شناسی و فناوری نرم‌افزار می‌سازد؛ ابزارهایی دقیق، اخلاق‌مدار و انسان‌محور برای درمان، سنجش و سازمان.",
  keywords: [
    "Psycho Tech",
    "سایکو تک",
    "روان‌شناسی",
    "فناوری",
    "سلامت روان",
    "نرم‌افزار بالینی",
  ],
  authors: [{ name: "Psycho Tech" }],
  openGraph: {
    title: "Psycho Tech | سایکو تک",
    description:
      "جایی که ذهن و ماشین یکدیگر را می‌فهمند. نرم‌افزار در تقاطع روان‌شناسی و فناوری.",
    locale: "fa_IR",
    type: "website",
    siteName: "Psycho Tech",
  },
};

async function getSettingsSafe() {
  try {
    return await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsSafe();
  if (!settings) return FALLBACK_METADATA;

  const title = `${settings.name} | ${settings.nameFa}`;
  const description = settings.heroDescription;

  return {
    title: {
      default: title,
      template: `%s | ${settings.name}`,
    },
    description,
    keywords: [
      settings.name,
      settings.nameFa,
      "روان‌شناسی",
      "فناوری",
      "سلامت روان",
      "نرم‌افزار بالینی",
    ],
    authors: [{ name: settings.name }],
    icons: settings.faviconUrl
      ? {
          icon: [{ url: settings.faviconUrl }],
          shortcut: [settings.faviconUrl],
          apple: [{ url: settings.faviconUrl }],
        }
      : undefined,
    openGraph: {
      title,
      description: settings.tagline
        ? `${settings.tagline}. ${description}`
        : description,
      locale: "fa_IR",
      type: "website",
      siteName: settings.name,
      images: settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
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
  const settings = await getSettingsSafe();
  const themeCss = buildThemeCss(
    settings?.brandColor ?? DEFAULT_BRAND,
    settings?.accentColor ?? DEFAULT_ACCENT,
  );

  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={`${vazirmatn.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <style id="site-theme" dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-clip bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Outfit, Vazirmatn } from "next/font/google";
import { themeInitScript } from "@/lib/theme-script";
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const title = settings
    ? `${settings.name} | ${settings.nameFa}`
    : "Psycho Tech | سایکو تک";
  const description =
    settings?.heroDescription ??
    "سایکو تک در تقاطع روان‌شناسی و فناوری نرم‌افزار می‌سازد؛ ابزارهایی دقیق، اخلاق‌مدار و انسان‌محور برای درمان، سنجش و سازمان.";

  return {
    title: {
      default: title,
      template: `%s | ${settings?.name ?? "Psycho Tech"}`,
    },
    description,
    keywords: [
      settings?.name ?? "Psycho Tech",
      settings?.nameFa ?? "سایکو تک",
      "روان‌شناسی",
      "فناوری",
      "سلامت روان",
      "نرم‌افزار بالینی",
    ],
    authors: [{ name: settings?.name ?? "Psycho Tech" }],
    icons: settings?.faviconUrl
      ? {
          icon: [{ url: settings.faviconUrl }],
          shortcut: [settings.faviconUrl],
          apple: [{ url: settings.faviconUrl }],
        }
      : undefined,
    openGraph: {
      title,
      description: settings?.tagline
        ? `${settings.tagline}. ${description}`
        : description,
      locale: "fa_IR",
      type: "website",
      siteName: settings?.name ?? "Psycho Tech",
      images: settings?.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={`${vazirmatn.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-clip bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}

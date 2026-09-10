import type { Metadata, Viewport } from "next";
import { Outfit, Vazirmatn } from "next/font/google";
import { themeInitScript } from "@/lib/theme-script";
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

export const metadata: Metadata = {
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

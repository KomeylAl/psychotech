import type { Metadata } from "next";
import { defaultLocale, localeOgLocale, locales, type Locale } from "@/lib/i18n/config";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://psychotech.ir";

export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");

function pathSuffix(path: string): string {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function absoluteUrl(locale: Locale, path = "/"): string {
  return `${SITE_URL}/${locale}${pathSuffix(path)}`;
}

export function languageAlternates(path = "/"): Record<string, string> {
  const suffix = pathSuffix(path);
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}/${locale}${suffix}`;
  }
  languages["x-default"] = `${SITE_URL}/${defaultLocale}${suffix}`;
  return languages;
}

export type PageMetadataInput = {
  locale: Locale;
  path?: string;
  title: string;
  description?: string;
  keywords?: string[];
  siteName: string;
  images?: (string | null | undefined)[];
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  noIndex?: boolean;
};

export function buildPageMetadata({
  locale,
  path = "/",
  title,
  description,
  keywords,
  siteName,
  images,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  noIndex,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(locale, path);
  const imageUrls = (images ?? []).filter(
    (url): url is string => typeof url === "string" && url.length > 0,
  );
  const ogImages = imageUrls.map((url) => ({ url, alt: imageAlt }));

  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          type: "article",
          title,
          description,
          url: canonical,
          siteName,
          locale: localeOgLocale[locale],
          alternateLocale: locales
            .filter((item) => item !== locale)
            .map((item) => localeOgLocale[item]),
          images: ogImages,
          publishedTime,
          modifiedTime,
          authors,
          section,
        }
      : {
          type: "website",
          title,
          description,
          url: canonical,
          siteName,
          locale: localeOgLocale[locale],
          alternateLocale: locales
            .filter((item) => item !== locale)
            .map((item) => localeOgLocale[item]),
          images: ogImages,
        };

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrls,
    },
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : {
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
        }),
  };
}

type JsonLdValue = Record<string, unknown>;

export function organizationJsonLd({
  locale,
  siteName,
  description,
  logoUrl,
  email,
}: {
  locale: Locale;
  siteName: string;
  description: string;
  logoUrl?: string | null;
  email?: string | null;
}): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: `${SITE_URL}/${locale}`,
    description,
    logo: logoUrl ? new URL(logoUrl, SITE_URL).toString() : undefined,
    email: email || undefined,
    sameAs: [],
  };
}

export function websiteJsonLd({
  locale,
  siteName,
  description,
}: {
  locale: Locale;
  siteName: string;
  description: string;
}): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: `${SITE_URL}/${locale}`,
    description,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/${locale}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function blogPostingJsonLd({
  locale,
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
  siteName,
  keywords,
}: {
  locale: Locale;
  headline: string;
  description?: string;
  url: string;
  image?: string | null;
  datePublished?: string;
  dateModified?: string;
  authorName: string;
  siteName: string;
  keywords?: string[];
}): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline,
    description: description || undefined,
    url,
    image: image ? new URL(image, SITE_URL).toString() : undefined,
    datePublished,
    dateModified: dateModified || datePublished,
    inLanguage: locale,
    author: { "@type": "Organization", name: authorName },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    keywords: keywords?.length ? keywords.join(", ") : undefined,
  };
}

export function productJsonLd({
  locale,
  name,
  description,
  url,
  image,
  brand,
}: {
  locale: Locale;
  name: string;
  description?: string;
  url: string;
  image?: string | null;
  brand: string;
}): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description || undefined,
    url,
    image: image ? new URL(image, SITE_URL).toString() : undefined,
    brand: { "@type": "Brand", name: brand },
    inLanguage: locale,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

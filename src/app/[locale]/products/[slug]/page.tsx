import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { ProductVisual } from "@/components/products";
import { SiteShell } from "@/components/site-shell";
import { getProductBySlug, getSiteContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  productJsonLd,
} from "@/lib/i18n/seo";
import { localizedHref } from "@/lib/i18n/url";

export const dynamic = "force-dynamic";

type Params = Promise<{ locale: string; slug: string }>;

async function resolveProduct(params: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return null;
  const [product, content] = await Promise.all([
    getProductBySlug(slug, locale),
    getSiteContent(locale),
  ]);
  if (!product) return null;
  return {
    locale,
    product,
    content,
    settings: content?.settings,
    dict: getDictionary(locale),
  };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolved = await resolveProduct(params);
  if (!resolved) return { title: "404", robots: { index: false, follow: false } };

  const { locale, product, settings, dict } = resolved;

  return buildPageMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: product.title,
    description: product.description,
    keywords: [product.name, product.title, ...dict.meta.keywords],
    siteName: settings?.name ?? "Psycho Tech",
    images: [product.imageUrl, settings?.ogImageUrl],
    imageAlt: product.name,
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const resolved = await resolveProduct(params);
  if (!resolved) notFound();

  const { locale, product, content, settings, dict } = resolved;
  const others = (content?.products ?? []).filter((item) => item.slug !== product.slug);
  const url = absoluteUrl(locale, `/products/${product.slug}`);
  const showEnglishName = Boolean(product.nameEn) && product.nameEn !== product.name;

  return (
    <SiteShell locale={locale}>
      <JsonLd
        data={[
          productJsonLd({
            locale,
            name: product.name,
            description: product.description,
            url,
            image: product.imageUrl,
            brand: settings?.name ?? "Psycho Tech",
          }),
          breadcrumbJsonLd([
            { name: settings?.name ?? "Psycho Tech", url: absoluteUrl(locale, "/") },
            { name: dict.nav.products, url: absoluteUrl(locale, "/products") },
            { name: product.name, url },
          ]),
        ]}
      />
      <article className="px-5 pt-10 pb-24 sm:px-8 sm:pt-16">
        <div className="mx-auto max-w-6xl">
          <Reveal variant="fade">
            <Link
              href={localizedHref(locale, "/products")}
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-brand"
            >
              <span aria-hidden className="arrow-forward">←</span>
              {dict.products.back}
            </Link>
          </Reveal>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
            <Reveal immediate>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-display text-xs tracking-[0.2em] text-brand">
                  {showEnglishName
                    ? `${product.indexLabel} / ${product.nameEn}`
                    : product.indexLabel}
                </span>
                <span className="rounded-full border border-line px-2.5 py-0.5 text-[0.7rem] text-muted">
                  {product.status}
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{product.name}</h1>
              <p className="mt-4 text-lg leading-8 text-ink/90">{product.title}</p>
              <p className="mt-4 leading-8 text-muted">{product.description}</p>
              <ul className="mt-8 space-y-3">
                {product.points.map((point) => (
                  <li key={point.id} className="flex gap-3 text-sm leading-7 text-muted">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                    {point.text}
                  </li>
                ))}
              </ul>
              <Link
                href={localizedHref(locale, "/contact")}
                className="btn-primary mt-10 inline-flex items-center gap-2"
              >
                {dict.products.discuss(product.name)}
                <span aria-hidden className="arrow-forward">→</span>
              </Link>
            </Reveal>
            <Reveal delay={120} variant="scale">
              <div className="rounded-[2rem] bg-gradient-to-b from-brand/10 to-transparent p-6 sm:p-8">
                <ProductVisual
                  slug={product.slug}
                  name={product.name}
                  imageUrl={product.imageUrl}
                  locale={locale}
                />
              </div>
            </Reveal>
          </div>

          {others.length > 0 ? (
            <div className="mt-20 border-t border-line pt-12">
              <h2 className="text-2xl font-semibold">{dict.products.others}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {others.map((item) => {
                  const itemHasEnglish = Boolean(item.nameEn) && item.nameEn !== item.name;
                  return (
                    <Link
                      key={item.id}
                      href={localizedHref(locale, `/products/${item.slug}`)}
                      className="lift glass rounded-[1.5rem] p-6"
                    >
                      <p className="font-display text-xs tracking-[0.16em] text-accent">
                        {itemHasEnglish
                          ? `${item.indexLabel} / ${item.nameEn}`
                          : item.indexLabel}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold">{item.name}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted">{item.title}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </SiteShell>
  );
}

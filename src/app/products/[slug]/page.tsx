import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ProductVisual } from "@/components/products";
import { SiteShell } from "@/components/site-shell";
import { getProductBySlug, getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "محصول پیدا نشد" };

  return {
    title: `${product.name} | ${product.nameEn}`,
    description: product.description,
    openGraph: {
      title: `${product.name} — ${product.title}`,
      description: product.description,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [product, content] = await Promise.all([getProductBySlug(slug), getSiteContent()]);
  if (!product) notFound();

  const others = (content?.products ?? []).filter((item) => item.slug !== product.slug);

  return (
    <SiteShell>
      <article className="px-5 pt-10 pb-24 sm:px-8 sm:pt-16">
        <div className="mx-auto max-w-6xl">
          <Reveal variant="fade">
            <Link href="/products" className="text-sm text-muted transition-colors hover:text-brand">
              ← بازگشت به محصولات
            </Link>
          </Reveal>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
            <Reveal immediate>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-display text-xs tracking-[0.2em] text-brand">
                  {product.indexLabel} / {product.nameEn}
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
              <Link href="/contact" className="btn-primary mt-10 inline-flex">
                گفت‌وگو درباره {product.name}
                <span aria-hidden>←</span>
              </Link>
            </Reveal>
            <Reveal delay={120} variant="scale">
              <div className="rounded-[2rem] bg-gradient-to-b from-brand/10 to-transparent p-6 sm:p-8">
                <ProductVisual slug={product.slug} name={product.name} imageUrl={product.imageUrl} />
              </div>
            </Reveal>
          </div>

          {others.length > 0 ? (
            <div className="mt-20 border-t border-line pt-12">
              <h2 className="text-2xl font-semibold">محصول‌های دیگر</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {others.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    className="lift glass rounded-[1.5rem] p-6"
                  >
                    <p className="font-display text-xs tracking-[0.16em] text-accent">
                      {item.indexLabel} / {item.nameEn}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold">{item.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{item.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </SiteShell>
  );
}

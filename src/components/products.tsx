import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { ProductWithPoints } from "@/lib/content";
import type { SiteSettings } from "@/generated/prisma/client";

function NuraMock() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-canvas p-4">
      <div className="mb-4 flex items-center justify-between text-[0.7rem] text-muted">
        <span>پروفایل ارزیابی</span>
        <span className="rounded-full bg-sage/15 px-2 py-0.5 text-sage">فعال</span>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div className="space-y-2">
          {["توجه", "تنظیم هیجان", "استرس ادراک‌شده", "کیفیت خواب"].map((label, i) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-[0.65rem] text-muted">
                <span>{label}</span>
                <span>{[72, 54, 38, 81][i]}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
                <div
                  className={`h-full rounded-full ${i % 2 === 0 ? "bg-brand" : "bg-accent"}`}
                  style={{ width: `${[72, 54, 38, 81][i]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="relative grid size-24 place-items-center">
          <svg viewBox="0 0 88 88" className="absolute inset-0" aria-hidden>
            <circle cx="44" cy="44" r="34" fill="none" stroke="var(--line)" strokeWidth="8" />
            <circle
              cx="44"
              cy="44"
              r="34"
              fill="none"
              stroke="var(--brand)"
              strokeWidth="8"
              strokeDasharray="160 54"
              strokeLinecap="round"
              transform="rotate(-90 44 44)"
            />
          </svg>
          <span className="font-display text-lg">74</span>
        </div>
      </div>
    </div>
  );
}

function TheraMock() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-canvas p-4">
      <div className="mb-4 flex items-center justify-between text-[0.7rem] text-muted">
        <span>جلسات امروز</span>
        <span>۴ نوبت</span>
      </div>
      <ul className="space-y-2">
        {[
          ["۰۹:۳۰", "جلسه پیگیری", "اتاق ۲"],
          ["۱۱:۰۰", "ارزیابی اولیه", "آنلاین"],
          ["۱۴:۱۵", "گروه درمانی", "سالن الف"],
        ].map(([time, title, place]) => (
          <li
            key={time}
            className="flex items-center justify-between rounded-xl bg-ink/5 px-3 py-2 text-xs"
          >
            <span className="font-display text-accent">{time}</span>
            <span>{title}</span>
            <span className="text-muted">{place}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductVisual({
  slug,
  name,
  imageUrl,
  index = 0,
}: {
  slug: string;
  name: string;
  imageUrl?: string | null;
  index?: number;
}) {
  if (imageUrl) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl border border-line bg-canvas">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={name} className="aspect-[4/3] w-full object-cover" />
      </div>
    );
  }

  if (slug === "nura") return <NuraMock />;
  if (slug === "theradesk") return <TheraMock />;
  if (index === 0) return <NuraMock />;
  if (index === 1) return <TheraMock />;

  return (
    <div className="grid aspect-[4/3] w-full place-items-center rounded-2xl border border-line bg-gradient-to-br from-brand/10 to-accent/10">
      <span className="font-display text-sm tracking-[0.18em] text-brand">{name}</span>
    </div>
  );
}

type ProductsProps = {
  settings: SiteSettings;
  products: ProductWithPoints[];
  asPage?: boolean;
};

export function Products({ settings, products, asPage = false }: ProductsProps) {
  const Heading = asPage ? "h1" : "h2";

  return (
    <section id="products" className={asPage ? "px-5 pt-10 pb-24 sm:px-8 sm:pt-16" : "scroll-mt-24 px-5 py-24 sm:px-8"}>
      <div className="mx-auto max-w-6xl">
        <Reveal immediate={asPage}>
          <p className="eyebrow">{settings.productsEyebrow}</p>
          <Heading className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {settings.productsTitle}
          </Heading>
          <p className="mt-4 max-w-2xl text-muted leading-8">
            {settings.productsDescription}
          </p>
        </Reveal>
        <div className="mt-14 space-y-8">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 90}>
              <article className="lift glass overflow-hidden rounded-[2rem] lg:grid lg:grid-cols-2">
                <div className={`p-8 sm:p-10 ${index === 1 ? "lg:order-2" : ""}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`font-display text-xs tracking-[0.2em] ${index === 0 ? "text-brand" : "text-accent"}`}
                    >
                      {product.indexLabel} / {product.nameEn}
                    </span>
                    <span className="rounded-full border border-line px-2.5 py-0.5 text-[0.7rem] text-muted">
                      {product.status}
                    </span>
                  </div>
                  <h3 className="mt-4 text-3xl font-semibold">
                    <Link href={`/products/${product.slug}`} className="transition-colors hover:text-brand">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-3 text-lg text-ink/90">{product.title}</p>
                  <p className="mt-4 leading-8 text-muted">{product.description}</p>
                  <ul className="mt-6 space-y-2 text-sm text-muted">
                    {product.points.map((point) => (
                      <li key={point.id} className="flex gap-2">
                        <span
                          className={`mt-2 size-1.5 shrink-0 rounded-full ${index === 0 ? "bg-brand" : "bg-accent"}`}
                        />
                        {point.text}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand"
                  >
                    صفحه {product.name}
                    <span aria-hidden>←</span>
                  </Link>
                </div>
                <div
                  className={`flex items-center bg-gradient-to-b to-transparent p-8 sm:p-10 ${index === 0 ? "from-brand/10" : "from-accent/10"}`}
                >
                  <ProductVisual
                    slug={product.slug}
                    name={product.name}
                    imageUrl={product.imageUrl}
                    index={index}
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

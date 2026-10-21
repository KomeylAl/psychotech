import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { ProductVisual } from "@/components/products";
import type { SiteContent } from "@/lib/content";

export function HomePathways({ settings, values }: Pick<SiteContent, "settings" | "values">) {
  const paths = [
    {
      href: "/about",
      eyebrow: settings.aboutEyebrow,
      title: settings.aboutTitle,
      text: settings.aboutParagraph1,
    },
    {
      href: "/approach",
      eyebrow: settings.approachEyebrow,
      title: settings.approachTitle,
      text: settings.approachDescription,
    },
    {
      href: "/products",
      eyebrow: settings.productsEyebrow,
      title: settings.productsTitle,
      text: settings.productsDescription,
    },
  ];

  return (
    <section id="focus" className="scroll-mt-24 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{settings.aboutEyebrow}</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            سه مسیر برای شناخت سایکو تک
          </h2>
          <p className="mt-4 max-w-2xl leading-8 text-muted">{settings.aboutParagraph2}</p>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {paths.map((path, index) => (
            <Reveal key={path.href} delay={index * 90} variant="scale">
              <Link href={path.href} className="lift glass group flex h-full flex-col rounded-[1.75rem] p-6">
                <span className="font-display text-xs tracking-[0.18em] text-accent">{path.eyebrow}</span>
                <h3 className="mt-4 text-xl font-semibold transition-colors group-hover:text-brand">
                  {path.title}
                </h3>
                <p className="mt-3 line-clamp-4 flex-1 text-sm leading-7 text-muted">{path.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand">
                  ادامه
                  <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        {values.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Reveal key={value.id} delay={index * 70} variant="fade">
                <article className="h-full rounded-3xl border border-line bg-canvas-soft/50 p-5">
                  <h3 className="text-base font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{value.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function HomeProducts({ settings, products }: Pick<SiteContent, "settings" | "products">) {
  return (
    <section id="products" className="scroll-mt-24 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">{settings.productsEyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {settings.productsTitle}
              </h2>
              <p className="mt-4 leading-8 text-muted">{settings.productsDescription}</p>
            </div>
            <Link href="/products" className="btn-ghost shrink-0 self-start sm:self-auto">
              همه محصولات
              <span aria-hidden>←</span>
            </Link>
          </div>
        </Reveal>
        {products.length > 0 ? (
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={index * 90}>
                <article className="lift glass grid h-full overflow-hidden rounded-[1.75rem] sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="flex flex-col p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={index % 2 === 0 ? "text-brand" : "text-accent"}>
                        {product.indexLabel} / {product.nameEn}
                      </span>
                      <span className="rounded-full border border-line px-2 py-0.5 text-muted">
                        {product.status}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold">
                      <Link href={`/products/${product.slug}`} className="hover:text-brand">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{product.title}</p>
                    <ul className="mt-4 space-y-2 text-sm text-muted">
                      {product.points.slice(0, 2).map((point) => (
                        <li key={point.id} className="flex gap-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                          {point.text}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-brand"
                    >
                      صفحه {product.name}
                      <span aria-hidden>←</span>
                    </Link>
                  </div>
                  <div className="flex items-center bg-gradient-to-b from-brand/10 to-transparent p-5">
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
        ) : (
          <p className="mt-10 text-muted">هنوز محصولی ثبت نشده است.</p>
        )}
      </div>
    </section>
  );
}

export function HomeApproach({ settings, steps }: Pick<SiteContent, "settings" | "steps">) {
  return (
    <section id="approach" className="scroll-mt-24 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{settings.approachEyebrow}</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {settings.approachTitle}
          </h2>
          <p className="mt-4 max-w-2xl leading-8 text-muted">{settings.approachDescription}</p>
        </Reveal>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.id}>
              <Reveal delay={index * 80}>
                <article className="lift h-full rounded-3xl border border-line p-5">
                  <span className="font-display text-sm tracking-[0.16em] text-accent">
                    {step.indexLabel}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{step.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal delay={120}>
          <Link href="/approach" className="btn-ghost mt-8 inline-flex">
            مسیر کامل رویکرد
            <span aria-hidden>←</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function HomeTeam({ settings, team }: Pick<SiteContent, "settings" | "team">) {
  return (
    <section id="team" className="scroll-mt-24 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">{settings.teamEyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{settings.teamTitle}</h2>
              <p className="mt-4 leading-8 text-muted">{settings.teamDescription}</p>
            </div>
            <Link href="/team" className="btn-ghost shrink-0 self-start sm:self-auto">
              آشنایی با تیم
              <span aria-hidden>←</span>
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <Reveal key={member.id} delay={index * 70} variant="scale">
              <article className="lift glass h-full rounded-3xl p-5">
                <p className={`font-display text-2xl ${index % 2 === 0 ? "text-brand" : "text-accent"}`}>
                  {member.initials}
                </p>
                <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm text-muted">{member.role}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeContact({ settings }: Pick<SiteContent, "settings">) {
  return (
    <section id="contact" className="scroll-mt-24 px-5 py-20 sm:px-8">
      <Reveal variant="scale">
        <div className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[2rem] border border-line bg-gradient-to-l from-brand/12 via-canvas-soft to-accent/10 px-6 py-10 sm:px-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <p className="eyebrow">{settings.contactEyebrow}</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {settings.contactTitle}
            </h2>
            <p className="mt-4 max-w-xl leading-8 text-muted">{settings.contactDescription}</p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <Link href="/contact" className="btn-primary">
              شروع گفت‌وگو
              <span aria-hidden>←</span>
            </Link>
            <a href={`mailto:${settings.email}`} dir="ltr" className="text-sm text-brand">
              {settings.email}
            </a>
            <p className="text-sm text-muted">{settings.location}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

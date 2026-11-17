import { headers } from "next/headers";
import Link from "next/link";
import { Ambient } from "@/components/ambient";
import { Logo } from "@/components/logo";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/url";

export default async function NotFound() {
  const requestHeaders = await headers();
  const value = requestHeaders.get("x-locale");
  const locale = isLocale(value) ? value : defaultLocale;
  const dict = getDictionary(locale);
  const homeHref = localizedHref(locale, "/");

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <Ambient />
      <header className="relative z-10 mx-auto flex h-[var(--header-h)] w-full max-w-6xl items-center px-5 sm:px-8">
        <Logo href={homeHref} locale={locale} />
      </header>
      <main id="main" className="relative z-10 px-5 py-24 text-center sm:px-8">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{dict.notFound.title}</h1>
        <p className="mx-auto mt-4 max-w-md leading-8 text-muted">{dict.notFound.description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href={homeHref} className="btn-primary">
            {dict.notFound.home}
          </Link>
          <Link href={localizedHref(locale, "/products")} className="btn-ghost">
            {dict.notFound.products}
          </Link>
          <Link href={localizedHref(locale, "/blog")} className="btn-ghost">
            {dict.notFound.blog}
          </Link>
        </div>
      </main>
    </div>
  );
}

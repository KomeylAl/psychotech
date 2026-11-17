"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { isNavActive } from "@/lib/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { otherLocale, type Locale } from "@/lib/i18n/config";
import { localizedHref, switchLocalePath } from "@/lib/i18n/url";

export type NavLink = {
  id?: string;
  href: string;
  label: string;
};

export type HeaderBrand = {
  logoUrl?: string | null;
  name?: string;
  nameFa?: string;
  href?: string;
};

function ItemLink({
  href,
  className,
  children,
  onClick,
  current,
}: {
  href: string;
  className: string;
  children: ReactNode;
  onClick?: () => void;
  current?: boolean;
}) {
  if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      onClick={onClick}
      aria-current={current ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

export function Header({
  nav,
  brand,
  locale,
}: {
  nav: NavLink[];
  brand?: HeaderBrand;
  locale: Locale;
}) {
  const pathname = usePathname();
  const dict = getDictionary(locale);
  const nextLocale = otherLocale(locale);
  const languageHref = switchLocalePath(pathname, nextLocale);
  const contactHref = localizedHref(locale, "/contact");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,border,backdrop-filter,box-shadow] duration-300 ${
        scrolled || open
          ? "border-b border-line bg-canvas/80 shadow-[0_10px_40px_color-mix(in_srgb,var(--ink)_6%,transparent)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <a href="#main" className="skip-link">
        {dict.header.skipToContent}
      </a>
      <div className="mx-auto flex h-[var(--header-h)] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo
          logoUrl={brand?.logoUrl}
          name={brand?.name}
          nameFa={brand?.nameFa}
          href={brand?.href ?? `/${locale}`}
          locale={locale}
        />
        <nav className="hidden items-center gap-1 lg:flex" aria-label={dict.header.mainNav}>
          {nav.map((item) => {
            const current = isNavActive(pathname, item.href);
            return (
              <ItemLink
                key={item.id ?? item.href}
                href={item.href}
                current={current}
                className={`rounded-full px-3.5 py-2 text-sm transition-colors duration-300 ${
                  current ? "bg-brand/10 text-ink" : "text-nav hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {item.label}
              </ItemLink>
            );
          })}
          <Link
            href={languageHref}
            hrefLang={nextLocale}
            lang={nextLocale}
            className="ms-2 rounded-full border border-line px-3 py-1.5 text-xs text-nav transition-colors hover:border-brand/40 hover:text-ink"
            aria-label={dict.header.languageLabel}
          >
            {dict.header.switchTo}
          </Link>
          <ThemeToggle className="ms-2" locale={locale} />
          <Link href={contactHref} className="btn-primary ms-1 !px-4 !py-2 text-sm">
            {dict.header.talkToUs}
          </Link>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href={languageHref}
            hrefLang={nextLocale}
            lang={nextLocale}
            className="rounded-full border border-line px-3 py-1.5 text-xs text-nav"
            aria-label={dict.header.languageLabel}
            onClick={() => setOpen(false)}
          >
            {dict.header.switchTo}
          </Link>
          <ThemeToggle locale={locale} />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? dict.header.closeMenu : dict.header.openMenu}</span>
            <span className="flex w-4 flex-col gap-1.5" aria-hidden>
              <span
                className={`h-px w-full bg-ink transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span className={`h-px w-full bg-ink transition ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-px w-full bg-ink transition ${open ? "-translate-y-[4.5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          className="mobile-nav-enter border-t border-line bg-canvas/95 px-5 py-6 lg:hidden"
          aria-label={dict.header.mobileNav}
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => {
              const current = isNavActive(pathname, item.href);
              return (
                <li key={item.id ?? item.href}>
                  <ItemLink
                    href={item.href}
                    current={current}
                    className={`block rounded-xl px-3 py-3 text-lg transition-colors ${
                      current ? "bg-brand/10 text-ink" : "text-nav hover:text-ink"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </ItemLink>
                </li>
              );
            })}
          </ul>
          <Link
            href={contactHref}
            className="btn-primary mt-4 w-full"
            onClick={() => setOpen(false)}
          >
            {dict.header.talkToUs}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}

export function HeaderSpacer() {
  return <div className="h-[var(--header-h)] shrink-0" aria-hidden />;
}

"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export type NavLink = {
  href: string;
  label: string;
};

export function Header({ nav }: { nav: NavLink[] }) {
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
      className={`fixed inset-x-0 top-0 z-50 transition-[background,border,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-b border-line bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <a href="#main" className="skip-link">
        پرش به محتوا
      </a>
      <div className="mx-auto flex h-[var(--header-h)] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="ناوبری اصلی">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <ThemeToggle className="ms-2" />
          <a href="#contact" className="btn-primary ms-1 !px-4 !py-2 text-sm">
            گفت‌وگو با ما
          </a>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "بستن منو" : "باز کردن منو"}</span>
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
          className="border-t border-line bg-canvas/95 px-5 py-6 lg:hidden"
          aria-label="منوی موبایل"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-xl px-3 py-3 text-lg"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="btn-primary mt-4 w-full"
            onClick={() => setOpen(false)}
          >
            گفت‌وگو با ما
          </a>
        </nav>
      ) : null}
    </header>
  );
}

export function HeaderSpacer() {
  return <div className="h-[var(--header-h)] shrink-0" aria-hidden />;
}

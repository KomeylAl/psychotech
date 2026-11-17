import Link from "next/link";

import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

type LogoProps = {
  logoUrl?: string | null;
  name?: string;
  nameFa?: string;
  href?: string;
  locale?: Locale;
};

export function Logo({
  logoUrl,
  name = "PSYCHO TECH",
  nameFa = "سایکو تک",
  href = "/",
  locale = "fa",
}: LogoProps) {
  const dict = getDictionary(locale);
  const label = locale === "fa" ? dict.logoHome(nameFa) : dict.logoHome(name);

  return (
    <Link
      href={href}
      className="group flex items-center gap-2.5 text-ink no-underline"
      aria-label={label}
    >
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl border border-line bg-canvas-soft">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="" className="size-full object-contain p-1" />
        ) : (
          <svg viewBox="0 0 32 32" className="size-6" aria-hidden>
            <path
              d="M16 6.5v12.2M10.6 9c0 4.8 2.4 7.8 5.4 7.8s5.4-3 5.4-7.8"
              fill="none"
              stroke="var(--brand)"
              strokeWidth="1.85"
              strokeLinecap="round"
            />
            <circle cx="10.8" cy="23.2" r="1.5" fill="var(--accent)" />
            <circle cx="21.2" cy="23.2" r="1.5" fill="var(--accent)" />
            <path
              d="M10.8 23.2h10.4"
              stroke="var(--accent)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <span className="leading-tight">
        <span className="font-display block text-[0.95rem] font-semibold tracking-[0.08em]">
          {name}
        </span>
        <span className="block text-[0.7rem] text-muted" lang="fa">
          {nameFa}
        </span>
      </span>
    </Link>
  );
}

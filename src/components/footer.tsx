import { Logo } from "@/components/logo";
import type { NavLink } from "@/components/header";
import type { SiteSettings } from "@/generated/prisma/client";

type FooterProps = {
  settings: SiteSettings;
  nav: NavLink[];
};

export function Footer({ settings, nav }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-line px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted">{settings.footerBlurb}</p>
        </div>
        <div className="flex flex-wrap gap-12 text-sm">
          <div>
            <p className="mb-3 text-muted">مسیر</p>
            <ul className="space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-brand">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-muted">ارتباط</p>
            <ul className="space-y-2">
              <li>
                <a href={`mailto:${settings.email}`} dir="ltr" className="hover:text-brand">
                  {settings.email}
                </a>
              </li>
              <li>{settings.location}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p className="font-display tracking-[0.12em]">
          © {new Date().getFullYear()} {settings.name}
        </p>
        <p>ساخته‌شده با دقت برای ذهن انسان.</p>
      </div>
    </footer>
  );
}

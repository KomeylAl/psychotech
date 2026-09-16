"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { adminLogoutAction } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "داشبورد" },
  { href: "/admin/settings", label: "تنظیمات و متن‌ها" },
  { href: "/admin/nav", label: "ناوبری" },
  { href: "/admin/products", label: "محصولات" },
  { href: "/admin/team", label: "تیم" },
  { href: "/admin/values", label: "ارزش‌ها" },
  { href: "/admin/approach", label: "رویکرد" },
  { href: "/admin/keywords", label: "کلمات کلیدی" },
  { href: "/admin/messages", label: "پیام‌ها" },
] as const;

function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="w-full rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-ink disabled:opacity-60"
      onClick={() => {
        startTransition(async () => {
          await adminLogoutAction();
          router.replace("/admin/login");
          router.refresh();
        });
      }}
    >
      {pending ? "در حال خروج…" : "خروج"}
    </button>
  );
}

export function AdminShell({
  children,
  username,
  title,
}: {
  children: React.ReactNode;
  username: string;
  title: string;
}) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr] lg:px-6">
        <aside className="glass h-fit rounded-3xl p-4 lg:sticky lg:top-6">
          <div className="mb-6 border-b border-line pb-4">
            <p className="font-display text-xs tracking-[0.18em] text-brand">PSYCHO TECH</p>
            <p className="mt-1 text-sm text-muted">پنل مدیریت</p>
            <p className="mt-2 text-xs text-muted">ورود: {username}</p>
          </div>
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-brand/10 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 space-y-2 border-t border-line pt-4">
            <Link href="/" className="btn-ghost w-full !py-2 text-sm">
              مشاهده سایت
            </Link>
            <LogoutButton />
          </div>
        </aside>
        <main>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminCard({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass mb-5 rounded-3xl p-5 sm:p-6">
      {title ? <h2 className="mb-4 text-lg font-semibold">{title}</h2> : null}
      {children}
    </section>
  );
}

export function Field({
  label,
  name,
  defaultValue = "",
  type = "text",
  required = false,
  rows,
  dir,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  rows?: number;
  dir?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-2 block text-muted">{label}</span>
      {rows ? (
        <textarea
          name={name}
          required={required}
          rows={rows}
          defaultValue={defaultValue}
          dir={dir}
          className="input min-h-24 resize-y"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue}
          dir={dir}
          className="input"
        />
      )}
    </label>
  );
}

export function SavedBanner({ saved }: { saved?: string | string[] }) {
  if (!saved) return null;
  return (
    <p className="mb-4 rounded-2xl border border-sage/30 bg-sage/10 px-4 py-3 text-sm text-sage">
      تغییرات ذخیره شد.
    </p>
  );
}

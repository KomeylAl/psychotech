"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useTransition, type ReactNode } from "react";
import { adminLogoutAction, type ActionResult } from "@/app/admin/actions";
import { useToast } from "@/components/toast";

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
  const { push } = useToast();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="w-full rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-ink disabled:opacity-60"
      onClick={() => {
        startTransition(async () => {
          try {
            await adminLogoutAction();
            push({ tone: "success", message: "با موفقیت خارج شدید." });
            router.replace("/admin/login");
            router.refresh();
          } catch {
            push({ tone: "error", message: "خروج انجام نشد." });
          }
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

export function ImageField({
  label,
  name,
  currentUrl,
  removeName,
  hint = "حداکثر ۲ مگابایت — PNG، JPG، WEBP، SVG یا ICO",
}: {
  label: string;
  name: string;
  currentUrl?: string | null;
  removeName?: string;
  hint?: string;
}) {
  return (
    <div className="text-sm">
      <span className="mb-2 block text-muted">{label}</span>
      {currentUrl ? (
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt=""
            className="size-16 rounded-xl border border-line object-cover bg-canvas-soft"
          />
          {removeName ? (
            <label className="flex items-center gap-2 text-muted">
              <input type="checkbox" name={removeName} value="1" />
              حذف تصویر فعلی
            </label>
          ) : null}
        </div>
      ) : null}
      <input
        type="file"
        name={name}
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico"
        className="input file:me-3 file:rounded-full file:border-0 file:bg-brand/15 file:px-3 file:py-1 file:text-brand"
      />
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

export function AdminForm({
  action,
  children,
  className,
  successMessage = "تغییرات ذخیره شد.",
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  children: ReactNode;
  className?: string;
  successMessage?: string;
}) {
  const { push } = useToast();
  const router = useRouter();
  const [, formAction, pending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData): Promise<ActionResult> => {
      try {
        const result = await action(formData);
        if (result.ok) {
          push({ tone: "success", message: result.message ?? successMessage });
          router.refresh();
        } else {
          push({ tone: "error", message: result.error });
        }
        return result;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "عملیات ناموفق بود. دوباره تلاش کنید.";
        push({ tone: "error", message });
        return { ok: false, error: message };
      }
    },
    null,
  );

  return (
    <form action={formAction} className={className}>
      <fieldset disabled={pending} className="min-w-0 contents">
        {children}
      </fieldset>
    </form>
  );
}

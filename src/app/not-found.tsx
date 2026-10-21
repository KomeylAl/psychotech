import Link from "next/link";
import { Ambient } from "@/components/ambient";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <Ambient />
      <header className="relative z-10 mx-auto flex h-[var(--header-h)] w-full max-w-6xl items-center px-5 sm:px-8">
        <Logo href="/" />
      </header>
      <main id="main" className="relative z-10 px-5 py-24 text-center sm:px-8">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">این صفحه پیدا نشد</h1>
        <p className="mx-auto mt-4 max-w-md leading-8 text-muted">
          آدرس را بررسی کنید، یا از صفحه اصلی و بخش‌های سایت ادامه دهید.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            صفحه اصلی
          </Link>
          <Link href="/products" className="btn-ghost">
            محصولات
          </Link>
          <Link href="/blog" className="btn-ghost">
            بلاگ
          </Link>
        </div>
      </main>
    </div>
  );
}

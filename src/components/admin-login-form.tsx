"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminLoginAction, type LoginActionState } from "@/app/admin/actions";

export function LoginForm({ alreadyAuthed = false }: { alreadyAuthed?: boolean }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    adminLoginAction,
    undefined as LoginActionState | undefined,
  );

  useEffect(() => {
    if (alreadyAuthed || state?.ok) {
      router.replace("/admin");
      router.refresh();
    }
  }, [alreadyAuthed, state, router]);

  if (alreadyAuthed) {
    return (
      <div className="glass w-full max-w-md rounded-3xl p-6 sm:p-8">
        <p className="text-sm text-muted">در حال انتقال به پنل…</p>
      </div>
    );
  }

  return (
    <form action={action} className="glass w-full max-w-md rounded-3xl p-6 sm:p-8">
      <p className="font-display text-xs tracking-[0.2em] text-brand">ADMIN</p>
      <h1 className="mt-2 text-2xl font-semibold">ورود به پنل مدیریت</h1>
      <p className="mt-2 text-sm text-muted">برای ویرایش محتوای سایت وارد شوید.</p>

      <label className="mt-6 block text-sm">
        <span className="mb-2 block text-muted">نام کاربری</span>
        <input name="username" required autoComplete="username" className="input" dir="ltr" />
      </label>
      <label className="mt-4 block text-sm">
        <span className="mb-2 block text-muted">رمز عبور</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="input"
          dir="ltr"
        />
      </label>

      {state?.error ? (
        <p className="mt-4 text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn-primary mt-6 w-full" disabled={pending}>
        {pending ? "در حال ورود…" : "ورود"}
      </button>
    </form>
  );
}

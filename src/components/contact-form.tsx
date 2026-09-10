"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions";

const initial: ContactState = { ok: false };

export function ContactForm({
  successTitle,
  successText,
}: {
  successTitle: string;
  successText: string;
}) {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.ok) {
    return (
      <div className="glass rounded-3xl p-8 sm:p-10">
        <p className="eyebrow">دریافت شد</p>
        <h3 className="mt-3 text-2xl font-semibold">{successTitle}</h3>
        <p className="mt-3 leading-8 text-muted">{successText}</p>
      </div>
    );
  }

  return (
    <form action={action} className="glass rounded-3xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block text-muted">نام</span>
          <input name="name" required autoComplete="name" className="input" />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-muted">ایمیل</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            dir="ltr"
            className="input text-start"
          />
        </label>
      </div>
      <label className="mt-4 block text-sm">
        <span className="mb-2 block text-muted">سازمان یا کلینیک (اختیاری)</span>
        <input name="organization" className="input" />
      </label>
      <label className="mt-4 block text-sm">
        <span className="mb-2 block text-muted">پیام</span>
        <textarea name="message" required rows={5} className="input min-h-32 resize-y" />
      </label>
      {state.error ? (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="btn-primary mt-6" disabled={pending}>
        {pending ? "در حال ارسال…" : "ارسال پیام"}
      </button>
    </form>
  );
}

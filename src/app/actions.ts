"use server";

import { prisma } from "@/lib/prisma";

export type ContactState = {
  ok: boolean;
  error?: string;
};

export async function submitContact(
  _prev: ContactState | undefined,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const organization = String(formData.get("organization") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) {
    return { ok: false, error: "نام را کامل بنویسید." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "ایمیل معتبر نیست." };
  }

  if (message.length < 10) {
    return { ok: false, error: "پیام کمی کوتاه است؛ کمی بیشتر توضیح دهید." };
  }

  await prisma.contactMessage.create({
    data: {
      name,
      email,
      organization: organization || null,
      message,
    },
  });

  return { ok: true };
}

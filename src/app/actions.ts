"use server";

import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";

export type ContactState = {
  ok: boolean;
  error?: string;
};

export async function submitContact(
  _prev: ContactState | undefined,
  formData: FormData,
): Promise<ContactState> {
  const localeValue = String(formData.get("locale") ?? "fa");
  const dict = getDictionary(isLocale(localeValue) ? localeValue : "fa");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const organization = String(formData.get("organization") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) {
    return { ok: false, error: dict.contact.errorName };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: dict.contact.errorEmail };
  }

  if (message.length < 10) {
    return { ok: false, error: dict.contact.errorMessage };
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

"use server";

import { revalidatePath } from "next/cache";
import { loginAdmin, logoutAdmin, requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function int(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

export type LoginActionState = {
  ok?: boolean;
  error?: string;
};

export async function adminLoginAction(
  _prev: LoginActionState | undefined,
  formData: FormData,
): Promise<LoginActionState> {
  const username = str(formData, "username");
  const password = str(formData, "password");

  if (!username || !password) {
    return { error: "نام کاربری و رمز عبور را وارد کنید." };
  }

  try {
    const user = await loginAdmin(username, password);
    if (!user) {
      return { error: "نام کاربری یا رمز عبور اشتباه است." };
    }
    return { ok: true };
  } catch (error) {
    console.error("admin login failed", error);
    return {
      error:
        "ورود انجام نشد. SESSION_SECRET را در محیط production بررسی کنید.",
    };
  }
}

export async function adminLogoutAction() {
  await logoutAdmin();
  // Avoid redirect() here: in Docker with HOSTNAME=0.0.0.0 it breaks.
  return { ok: true as const };
}

export async function updateSettingsAction(formData: FormData) {
  await requireAdminSession();

  await prisma.siteSettings.update({
    where: { id: "default" },
    data: {
      name: str(formData, "name"),
      nameFa: str(formData, "nameFa"),
      tagline: str(formData, "tagline"),
      email: str(formData, "email"),
      location: str(formData, "location"),
      heroTitleLine1: str(formData, "heroTitleLine1"),
      heroTitleHighlight: str(formData, "heroTitleHighlight"),
      heroDescription: str(formData, "heroDescription"),
      heroStat1Label: str(formData, "heroStat1Label"),
      heroStat1Value: str(formData, "heroStat1Value"),
      heroStat2Label: str(formData, "heroStat2Label"),
      heroStat2Value: str(formData, "heroStat2Value"),
      heroStat3Label: str(formData, "heroStat3Label"),
      heroStat3Value: str(formData, "heroStat3Value"),
      heroCtaPrimary: str(formData, "heroCtaPrimary"),
      heroCtaSecondary: str(formData, "heroCtaSecondary"),
      aboutEyebrow: str(formData, "aboutEyebrow"),
      aboutTitle: str(formData, "aboutTitle"),
      aboutParagraph1: str(formData, "aboutParagraph1"),
      aboutParagraph2: str(formData, "aboutParagraph2"),
      approachEyebrow: str(formData, "approachEyebrow"),
      approachTitle: str(formData, "approachTitle"),
      approachDescription: str(formData, "approachDescription"),
      productsEyebrow: str(formData, "productsEyebrow"),
      productsTitle: str(formData, "productsTitle"),
      productsDescription: str(formData, "productsDescription"),
      teamEyebrow: str(formData, "teamEyebrow"),
      teamTitle: str(formData, "teamTitle"),
      teamDescription: str(formData, "teamDescription"),
      contactEyebrow: str(formData, "contactEyebrow"),
      contactTitle: str(formData, "contactTitle"),
      contactDescription: str(formData, "contactDescription"),
      contactSuccessTitle: str(formData, "contactSuccessTitle"),
      contactSuccessText: str(formData, "contactSuccessText"),
      footerBlurb: str(formData, "footerBlurb"),
    },
  });

  revalidateSite();
}

export async function upsertNavItemAction(formData: FormData) {
  await requireAdminSession();
  const id = str(formData, "id");
  const data = {
    href: str(formData, "href"),
    label: str(formData, "label"),
    sortOrder: int(formData, "sortOrder"),
  };

  if (id) {
    await prisma.navItem.update({ where: { id }, data });
  } else {
    await prisma.navItem.create({ data });
  }

  revalidateSite();
}

export async function deleteNavItemAction(formData: FormData) {
  await requireAdminSession();
  await prisma.navItem.delete({ where: { id: str(formData, "id") } });
  revalidateSite();
}

export async function upsertProductAction(formData: FormData) {
  await requireAdminSession();
  const id = str(formData, "id");
  const pointsRaw = str(formData, "points");
  const points = pointsRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const data = {
    slug: str(formData, "slug"),
    indexLabel: str(formData, "indexLabel"),
    name: str(formData, "name"),
    nameEn: str(formData, "nameEn"),
    status: str(formData, "status"),
    title: str(formData, "title"),
    description: str(formData, "description"),
    sortOrder: int(formData, "sortOrder"),
  };

  if (id) {
    await prisma.productPoint.deleteMany({ where: { productId: id } });
    await prisma.product.update({
      where: { id },
      data: {
        ...data,
        points: {
          create: points.map((text, sortOrder) => ({ text, sortOrder })),
        },
      },
    });
  } else {
    await prisma.product.create({
      data: {
        ...data,
        points: {
          create: points.map((text, sortOrder) => ({ text, sortOrder })),
        },
      },
    });
  }

  revalidateSite();
}

export async function deleteProductAction(formData: FormData) {
  await requireAdminSession();
  await prisma.product.delete({ where: { id: str(formData, "id") } });
  revalidateSite();
}

export async function upsertTeamMemberAction(formData: FormData) {
  await requireAdminSession();
  const id = str(formData, "id");
  const data = {
    name: str(formData, "name"),
    role: str(formData, "role"),
    bio: str(formData, "bio"),
    initials: str(formData, "initials"),
    sortOrder: int(formData, "sortOrder"),
  };

  if (id) {
    await prisma.teamMember.update({ where: { id }, data });
  } else {
    await prisma.teamMember.create({ data });
  }

  revalidateSite();
}

export async function deleteTeamMemberAction(formData: FormData) {
  await requireAdminSession();
  await prisma.teamMember.delete({ where: { id: str(formData, "id") } });
  revalidateSite();
}

export async function upsertValueAction(formData: FormData) {
  await requireAdminSession();
  const id = str(formData, "id");
  const data = {
    title: str(formData, "title"),
    text: str(formData, "text"),
    sortOrder: int(formData, "sortOrder"),
  };

  if (id) {
    await prisma.valueItem.update({ where: { id }, data });
  } else {
    await prisma.valueItem.create({ data });
  }

  revalidateSite();
}

export async function deleteValueAction(formData: FormData) {
  await requireAdminSession();
  await prisma.valueItem.delete({ where: { id: str(formData, "id") } });
  revalidateSite();
}

export async function upsertStepAction(formData: FormData) {
  await requireAdminSession();
  const id = str(formData, "id");
  const data = {
    indexLabel: str(formData, "indexLabel"),
    title: str(formData, "title"),
    text: str(formData, "text"),
    sortOrder: int(formData, "sortOrder"),
  };

  if (id) {
    await prisma.approachStep.update({ where: { id }, data });
  } else {
    await prisma.approachStep.create({ data });
  }

  revalidateSite();
}

export async function deleteStepAction(formData: FormData) {
  await requireAdminSession();
  await prisma.approachStep.delete({ where: { id: str(formData, "id") } });
  revalidateSite();
}

export async function upsertKeywordAction(formData: FormData) {
  await requireAdminSession();
  const id = str(formData, "id");
  const data = {
    word: str(formData, "word"),
    sortOrder: int(formData, "sortOrder"),
  };

  if (id) {
    await prisma.keyword.update({ where: { id }, data });
  } else {
    await prisma.keyword.create({ data });
  }

  revalidateSite();
}

export async function deleteKeywordAction(formData: FormData) {
  await requireAdminSession();
  await prisma.keyword.delete({ where: { id: str(formData, "id") } });
  revalidateSite();
}

export async function markMessageReadAction(formData: FormData) {
  await requireAdminSession();
  await prisma.contactMessage.update({
    where: { id: str(formData, "id") },
    data: { read: true },
  });
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdminSession();
  await prisma.contactMessage.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/admin/messages");
}

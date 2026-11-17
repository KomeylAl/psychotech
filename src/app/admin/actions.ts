"use server";

import { revalidatePath } from "next/cache";
import { loginAdmin, logoutAdmin, requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveImageUpdate, deleteUpload } from "@/lib/uploads";

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

function ok(message?: string): ActionResult {
  return message ? { ok: true, message } : { ok: true };
}

function fail(error: unknown, fallback = "عملیات ناموفق بود."): ActionResult {
  if (error instanceof Error && error.message) {
    return { ok: false, error: error.message };
  }
  return { ok: false, error: fallback };
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function int(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function parseColor(value: string, label: string) {
  const withHash = value.startsWith("#") ? value : `#${value}`;
  if (!/^#[0-9A-Fa-f]{6}$/.test(withHash)) {
    throw new Error(`${label} باید یک کد رنگ معتبر مثل #2f7cc4 باشد.`);
  }
  return withHash.toLowerCase();
}

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/fa");
  revalidatePath("/en");
  revalidatePath("/fa/blog");
  revalidatePath("/en/blog");
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
  return { ok: true as const };
}

export async function updateSettingsAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const current = await prisma.siteSettings.findUniqueOrThrow({
      where: { id: "default" },
    });

    const [logoUrl, faviconUrl, ogImageUrl, heroVisualUrl] = await Promise.all([
      resolveImageUpdate({
        formData,
        fileKey: "logo",
        removeKey: "removeLogo",
        currentUrl: current.logoUrl,
        folder: "brand",
      }),
      resolveImageUpdate({
        formData,
        fileKey: "favicon",
        removeKey: "removeFavicon",
        currentUrl: current.faviconUrl,
        folder: "brand",
      }),
      resolveImageUpdate({
        formData,
        fileKey: "ogImage",
        removeKey: "removeOgImage",
        currentUrl: current.ogImageUrl,
        folder: "brand",
      }),
      resolveImageUpdate({
        formData,
        fileKey: "heroVisual",
        removeKey: "removeHeroVisual",
        currentUrl: current.heroVisualUrl,
        folder: "hero",
      }),
    ]);

    const brandColor = parseColor(str(formData, "brandColor"), "رنگ اصلی");
    const accentColor = parseColor(str(formData, "accentColor"), "رنگ فرعی");
    const textColor = parseColor(str(formData, "textColor"), "متن اصلی");
    const headingColor = parseColor(str(formData, "headingColor"), "تیترها");
    const mutedColor = parseColor(str(formData, "mutedColor"), "متن فرعی");
    const navColor = parseColor(str(formData, "navColor"), "لینک منو");
    const labelColor = parseColor(str(formData, "labelColor"), "برچسب فیلد");
    const hintColor = parseColor(str(formData, "hintColor"), "راهنماها");
    const placeholderColor = parseColor(str(formData, "placeholderColor"), "Placeholder");
    const eyebrowColor = parseColor(str(formData, "eyebrowColor"), "Eyebrow");
    const textColorDark = parseColor(str(formData, "textColorDark"), "متن اصلی (تاریک)");
    const headingColorDark = parseColor(str(formData, "headingColorDark"), "تیترها (تاریک)");
    const mutedColorDark = parseColor(str(formData, "mutedColorDark"), "متن فرعی (تاریک)");
    const navColorDark = parseColor(str(formData, "navColorDark"), "لینک منو (تاریک)");
    const labelColorDark = parseColor(str(formData, "labelColorDark"), "برچسب (تاریک)");
    const hintColorDark = parseColor(str(formData, "hintColorDark"), "راهنماها (تاریک)");
    const placeholderColorDark = parseColor(
      str(formData, "placeholderColorDark"),
      "Placeholder (تاریک)",
    );
    const eyebrowColorDark = parseColor(str(formData, "eyebrowColorDark"), "Eyebrow (تاریک)");
    const heroVisualMode = str(formData, "heroVisualMode") === "image" ? "image" : "motion";

    if (heroVisualMode === "image") {
      const nextHeroUrl =
        heroVisualUrl !== undefined ? heroVisualUrl : current.heroVisualUrl;
      if (!nextHeroUrl) {
        return fail(new Error("برای حالت تصویر/GIF ابتدا یک فایل آپلود کنید."));
      }
    }

    await prisma.siteSettings.update({
      where: { id: "default" },
      data: {
        name: str(formData, "name"),
        nameFa: str(formData, "nameFa"),
        tagline: str(formData, "tagline"),
        taglineEn: str(formData, "taglineEn"),
        email: str(formData, "email"),
        location: str(formData, "location"),
        locationEn: str(formData, "locationEn"),
        brandColor,
        accentColor,
        textColor,
        headingColor,
        mutedColor,
        navColor,
        labelColor,
        hintColor,
        placeholderColor,
        eyebrowColor,
        textColorDark,
        headingColorDark,
        mutedColorDark,
        navColorDark,
        labelColorDark,
        hintColorDark,
        placeholderColorDark,
        eyebrowColorDark,
        heroVisualMode,
        heroTitleLine1: str(formData, "heroTitleLine1"),
        heroTitleLine1En: str(formData, "heroTitleLine1En"),
        heroTitleHighlight: str(formData, "heroTitleHighlight"),
        heroTitleHighlightEn: str(formData, "heroTitleHighlightEn"),
        heroDescription: str(formData, "heroDescription"),
        heroDescriptionEn: str(formData, "heroDescriptionEn"),
        heroStat1Label: str(formData, "heroStat1Label"),
        heroStat1LabelEn: str(formData, "heroStat1LabelEn"),
        heroStat1Value: str(formData, "heroStat1Value"),
        heroStat1ValueEn: str(formData, "heroStat1ValueEn"),
        heroStat2Label: str(formData, "heroStat2Label"),
        heroStat2LabelEn: str(formData, "heroStat2LabelEn"),
        heroStat2Value: str(formData, "heroStat2Value"),
        heroStat2ValueEn: str(formData, "heroStat2ValueEn"),
        heroStat3Label: str(formData, "heroStat3Label"),
        heroStat3LabelEn: str(formData, "heroStat3LabelEn"),
        heroStat3Value: str(formData, "heroStat3Value"),
        heroStat3ValueEn: str(formData, "heroStat3ValueEn"),
        heroCtaPrimary: str(formData, "heroCtaPrimary"),
        heroCtaPrimaryEn: str(formData, "heroCtaPrimaryEn"),
        heroCtaSecondary: str(formData, "heroCtaSecondary"),
        heroCtaSecondaryEn: str(formData, "heroCtaSecondaryEn"),
        aboutEyebrow: str(formData, "aboutEyebrow"),
        aboutEyebrowEn: str(formData, "aboutEyebrowEn"),
        aboutTitle: str(formData, "aboutTitle"),
        aboutTitleEn: str(formData, "aboutTitleEn"),
        aboutParagraph1: str(formData, "aboutParagraph1"),
        aboutParagraph1En: str(formData, "aboutParagraph1En"),
        aboutParagraph2: str(formData, "aboutParagraph2"),
        aboutParagraph2En: str(formData, "aboutParagraph2En"),
        approachEyebrow: str(formData, "approachEyebrow"),
        approachEyebrowEn: str(formData, "approachEyebrowEn"),
        approachTitle: str(formData, "approachTitle"),
        approachTitleEn: str(formData, "approachTitleEn"),
        approachDescription: str(formData, "approachDescription"),
        approachDescriptionEn: str(formData, "approachDescriptionEn"),
        productsEyebrow: str(formData, "productsEyebrow"),
        productsEyebrowEn: str(formData, "productsEyebrowEn"),
        productsTitle: str(formData, "productsTitle"),
        productsTitleEn: str(formData, "productsTitleEn"),
        productsDescription: str(formData, "productsDescription"),
        productsDescriptionEn: str(formData, "productsDescriptionEn"),
        teamEyebrow: str(formData, "teamEyebrow"),
        teamEyebrowEn: str(formData, "teamEyebrowEn"),
        teamTitle: str(formData, "teamTitle"),
        teamTitleEn: str(formData, "teamTitleEn"),
        teamDescription: str(formData, "teamDescription"),
        teamDescriptionEn: str(formData, "teamDescriptionEn"),
        blogEyebrow: str(formData, "blogEyebrow"),
        blogEyebrowEn: str(formData, "blogEyebrowEn"),
        blogTitle: str(formData, "blogTitle"),
        blogTitleEn: str(formData, "blogTitleEn"),
        blogDescription: str(formData, "blogDescription"),
        blogDescriptionEn: str(formData, "blogDescriptionEn"),
        blogCta: str(formData, "blogCta"),
        blogCtaEn: str(formData, "blogCtaEn"),
        contactEyebrow: str(formData, "contactEyebrow"),
        contactEyebrowEn: str(formData, "contactEyebrowEn"),
        contactTitle: str(formData, "contactTitle"),
        contactTitleEn: str(formData, "contactTitleEn"),
        contactDescription: str(formData, "contactDescription"),
        contactDescriptionEn: str(formData, "contactDescriptionEn"),
        contactSuccessTitle: str(formData, "contactSuccessTitle"),
        contactSuccessTitleEn: str(formData, "contactSuccessTitleEn"),
        contactSuccessText: str(formData, "contactSuccessText"),
        contactSuccessTextEn: str(formData, "contactSuccessTextEn"),
        footerBlurb: str(formData, "footerBlurb"),
        footerBlurbEn: str(formData, "footerBlurbEn"),
        ...(logoUrl !== undefined ? { logoUrl } : {}),
        ...(faviconUrl !== undefined ? { faviconUrl } : {}),
        ...(ogImageUrl !== undefined ? { ogImageUrl } : {}),
        ...(heroVisualUrl !== undefined ? { heroVisualUrl } : {}),
      },
    });

    revalidateSite();
    return ok("تنظیمات ذخیره شد.");
  } catch (error) {
    console.error(error);
    return fail(error, "ذخیره تنظیمات انجام نشد.");
  }
}

export async function upsertNavItemAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const id = str(formData, "id");
    const data = {
      href: str(formData, "href"),
      label: str(formData, "label"),
      labelEn: str(formData, "labelEn"),
      sortOrder: int(formData, "sortOrder"),
    };

    if (id) {
      await prisma.navItem.update({ where: { id }, data });
    } else {
      await prisma.navItem.create({ data });
    }

    revalidateSite();
    return ok(id ? "آیتم ناوبری به‌روز شد." : "آیتم ناوبری اضافه شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function deleteNavItemAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    await prisma.navItem.delete({ where: { id: str(formData, "id") } });
    revalidateSite();
    return ok("آیتم ناوبری حذف شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function upsertProductAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const id = str(formData, "id");
    const pointsFa = str(formData, "points")
      .split("\n")
      .map((line) => line.trim());
    const pointsEn = str(formData, "pointsEn")
      .split("\n")
      .map((line) => line.trim());
    const pointCount = Math.max(pointsFa.length, pointsEn.length);
    const points = Array.from({ length: pointCount }, (_, sortOrder) => ({
      text: pointsFa[sortOrder] ?? "",
      textEn: pointsEn[sortOrder] ?? "",
      sortOrder,
    })).filter((point) => point.text || point.textEn);

    const current = id
      ? await prisma.product.findUnique({ where: { id } })
      : null;

    const imageUrl = await resolveImageUpdate({
      formData,
      fileKey: "image",
      removeKey: "removeImage",
      currentUrl: current?.imageUrl,
      folder: "products",
    });

    const data = {
      slug: str(formData, "slug"),
      indexLabel: str(formData, "indexLabel"),
      indexLabelEn: str(formData, "indexLabelEn"),
      name: str(formData, "name"),
      nameEn: str(formData, "nameEn"),
      status: str(formData, "status"),
      statusEn: str(formData, "statusEn"),
      title: str(formData, "title"),
      titleEn: str(formData, "titleEn"),
      description: str(formData, "description"),
      descriptionEn: str(formData, "descriptionEn"),
      sortOrder: int(formData, "sortOrder"),
      ...(imageUrl !== undefined ? { imageUrl } : {}),
    };

    if (id) {
      await prisma.productPoint.deleteMany({ where: { productId: id } });
      await prisma.product.update({
        where: { id },
        data: {
          ...data,
          points: { create: points },
        },
      });
    } else {
      await prisma.product.create({
        data: {
          ...data,
          points: { create: points },
        },
      });
    }

    revalidateSite();
    return ok(id ? "محصول به‌روز شد." : "محصول اضافه شد.");
  } catch (error) {
    return fail(error, "ذخیره محصول انجام نشد.");
  }
}

export async function deleteProductAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const id = str(formData, "id");
    const product = await prisma.product.findUnique({ where: { id } });
    await prisma.product.delete({ where: { id } });
    if (product?.imageUrl) {
      await deleteUpload(product.imageUrl);
    }
    revalidateSite();
    return ok("محصول حذف شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function upsertTeamMemberAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const id = str(formData, "id");
    const current = id
      ? await prisma.teamMember.findUnique({ where: { id } })
      : null;

    const imageUrl = await resolveImageUpdate({
      formData,
      fileKey: "image",
      removeKey: "removeImage",
      currentUrl: current?.imageUrl,
      folder: "team",
    });

    const data = {
      name: str(formData, "name"),
      nameEn: str(formData, "nameEn"),
      role: str(formData, "role"),
      roleEn: str(formData, "roleEn"),
      bio: str(formData, "bio"),
      bioEn: str(formData, "bioEn"),
      initials: str(formData, "initials"),
      initialsEn: str(formData, "initialsEn"),
      sortOrder: int(formData, "sortOrder"),
      ...(imageUrl !== undefined ? { imageUrl } : {}),
    };

    if (id) {
      await prisma.teamMember.update({ where: { id }, data });
    } else {
      await prisma.teamMember.create({ data });
    }

    revalidateSite();
    return ok(id ? "عضو تیم به‌روز شد." : "عضو تیم اضافه شد.");
  } catch (error) {
    return fail(error, "ذخیره عضو تیم انجام نشد.");
  }
}

export async function deleteTeamMemberAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const id = str(formData, "id");
    const member = await prisma.teamMember.findUnique({ where: { id } });
    await prisma.teamMember.delete({ where: { id } });
    if (member?.imageUrl) {
      await deleteUpload(member.imageUrl);
    }
    revalidateSite();
    return ok("عضو تیم حذف شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function upsertValueAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const id = str(formData, "id");
    const data = {
      title: str(formData, "title"),
      titleEn: str(formData, "titleEn"),
      text: str(formData, "text"),
      textEn: str(formData, "textEn"),
      sortOrder: int(formData, "sortOrder"),
    };

    if (id) {
      await prisma.valueItem.update({ where: { id }, data });
    } else {
      await prisma.valueItem.create({ data });
    }

    revalidateSite();
    return ok(id ? "ارزش به‌روز شد." : "ارزش اضافه شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function deleteValueAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    await prisma.valueItem.delete({ where: { id: str(formData, "id") } });
    revalidateSite();
    return ok("ارزش حذف شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function upsertStepAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const id = str(formData, "id");
    const data = {
      indexLabel: str(formData, "indexLabel"),
      indexLabelEn: str(formData, "indexLabelEn"),
      title: str(formData, "title"),
      titleEn: str(formData, "titleEn"),
      text: str(formData, "text"),
      textEn: str(formData, "textEn"),
      sortOrder: int(formData, "sortOrder"),
    };

    if (id) {
      await prisma.approachStep.update({ where: { id }, data });
    } else {
      await prisma.approachStep.create({ data });
    }

    revalidateSite();
    return ok(id ? "مرحله به‌روز شد." : "مرحله اضافه شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function deleteStepAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    await prisma.approachStep.delete({ where: { id: str(formData, "id") } });
    revalidateSite();
    return ok("مرحله حذف شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function upsertKeywordAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const id = str(formData, "id");
    const data = {
      word: str(formData, "word"),
      wordEn: str(formData, "wordEn"),
      sortOrder: int(formData, "sortOrder"),
    };

    if (id) {
      await prisma.keyword.update({ where: { id }, data });
    } else {
      await prisma.keyword.create({ data });
    }

    revalidateSite();
    return ok(id ? "کلمه کلیدی به‌روز شد." : "کلمه کلیدی اضافه شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function deleteKeywordAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    await prisma.keyword.delete({ where: { id: str(formData, "id") } });
    revalidateSite();
    return ok("کلمه کلیدی حذف شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function markMessageReadAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    await prisma.contactMessage.update({
      where: { id: str(formData, "id") },
      data: { read: true },
    });
    revalidatePath("/admin/messages");
    return ok("پیام به‌عنوان خوانده‌شده علامت خورد.");
  } catch (error) {
    return fail(error);
  }
}

export async function deleteMessageAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    await prisma.contactMessage.delete({ where: { id: str(formData, "id") } });
    revalidatePath("/admin/messages");
    return ok("پیام حذف شد.");
  } catch (error) {
    return fail(error);
  }
}

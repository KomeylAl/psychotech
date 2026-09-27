"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify, uniqueSlug } from "@/lib/slug";
import { deleteUpload, resolveImageUpdate } from "@/lib/uploads";
import type { ActionResult } from "@/app/admin/actions";

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

function revalidateBlog() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/blog/categories");
  revalidatePath("/admin/blog/tags");
}

async function ensureUniquePostSlug(desired: string, excludeId?: string) {
  const existing = await prisma.blogPost.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { slug: true },
  });
  return uniqueSlug(desired || "post", existing.map((item) => item.slug), "post");
}

async function ensureUniqueCategorySlug(desired: string, excludeId?: string) {
  const existing = await prisma.blogCategory.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { slug: true },
  });
  return uniqueSlug(desired || "category", existing.map((item) => item.slug), "category");
}

async function ensureUniqueTagSlug(desired: string, excludeId?: string) {
  const existing = await prisma.blogTag.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { slug: true },
  });
  return uniqueSlug(desired || "tag", existing.map((item) => item.slug), "tag");
}

export async function upsertBlogCategoryAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const id = str(formData, "id");
    const name = str(formData, "name");
    if (!name) return fail(new Error("نام دسته الزامی است."));

    const requestedSlug = str(formData, "slug") || slugify(name, "category");
    const slug = await ensureUniqueCategorySlug(requestedSlug, id || undefined);
    const data = {
      name,
      slug,
      description: str(formData, "description"),
      sortOrder: int(formData, "sortOrder"),
    };

    if (id) {
      await prisma.blogCategory.update({ where: { id }, data });
    } else {
      await prisma.blogCategory.create({ data });
    }

    revalidateBlog();
    return ok(id ? "دسته به‌روز شد." : "دسته اضافه شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function deleteBlogCategoryAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    await prisma.blogCategory.delete({ where: { id: str(formData, "id") } });
    revalidateBlog();
    return ok("دسته حذف شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function upsertBlogTagAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const id = str(formData, "id");
    const name = str(formData, "name");
    if (!name) return fail(new Error("نام برچسب الزامی است."));

    const requestedSlug = str(formData, "slug") || slugify(name, "tag");
    const slug = await ensureUniqueTagSlug(requestedSlug, id || undefined);

    if (id) {
      await prisma.blogTag.update({
        where: { id },
        data: { name, slug },
      });
    } else {
      await prisma.blogTag.create({ data: { name, slug } });
    }

    revalidateBlog();
    return ok(id ? "برچسب به‌روز شد." : "برچسب اضافه شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function deleteBlogTagAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    await prisma.blogTag.delete({ where: { id: str(formData, "id") } });
    revalidateBlog();
    return ok("برچسب حذف شد.");
  } catch (error) {
    return fail(error);
  }
}

export async function upsertBlogPostAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const id = str(formData, "id");
    const title = str(formData, "title");
    if (!title) return fail(new Error("عنوان مطلب الزامی است."));

    const current = id
      ? await prisma.blogPost.findUnique({ where: { id } })
      : null;

    const coverImageUrl = await resolveImageUpdate({
      formData,
      fileKey: "cover",
      removeKey: "removeCover",
      currentUrl: current?.coverImageUrl,
      folder: "blog",
    });

    const status = str(formData, "status") === "published" ? "published" : "draft";
    const requestedSlug = str(formData, "slug") || slugify(title, "post");
    const slug = await ensureUniquePostSlug(requestedSlug, id || undefined);
    const categoryId = str(formData, "categoryId") || null;
    const tagIds = formData.getAll("tagIds").map((value) => String(value)).filter(Boolean);

    let publishedAt: Date | null = current?.publishedAt ?? null;
    if (status === "published") {
      publishedAt = publishedAt ?? new Date();
    } else {
      publishedAt = null;
    }

    const publishedAtInput = str(formData, "publishedAt");
    if (status === "published" && publishedAtInput) {
      const parsed = new Date(publishedAtInput);
      if (!Number.isNaN(parsed.getTime())) publishedAt = parsed;
    }

    const data = {
      title,
      slug,
      excerpt: str(formData, "excerpt"),
      content: String(formData.get("content") ?? ""),
      status,
      publishedAt,
      categoryId,
      ...(coverImageUrl !== undefined ? { coverImageUrl } : {}),
    };

    if (id) {
      await prisma.$transaction([
        prisma.blogPostTag.deleteMany({ where: { postId: id } }),
        prisma.blogPost.update({
          where: { id },
          data: {
            ...data,
            tags: {
              create: tagIds.map((tagId) => ({ tagId })),
            },
          },
        }),
      ]);
    } else {
      const created = await prisma.blogPost.create({
        data: {
          ...data,
          tags: {
            create: tagIds.map((tagId) => ({ tagId })),
          },
        },
      });
      revalidateBlog();
      revalidatePath(`/blog/${created.slug}`);
      revalidatePath(`/admin/blog/${created.id}`);
      return ok("مطلب ایجاد شد.");
    }

    revalidateBlog();
    revalidatePath(`/blog/${slug}`);
    if (id) revalidatePath(`/admin/blog/${id}`);
    return ok("مطلب ذخیره شد.");
  } catch (error) {
    return fail(error, "ذخیره مطلب انجام نشد.");
  }
}

export async function deleteBlogPostAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const id = str(formData, "id");
    const post = await prisma.blogPost.findUnique({ where: { id } });
    await prisma.blogPost.delete({ where: { id } });
    if (post?.coverImageUrl) await deleteUpload(post.coverImageUrl);
    revalidateBlog();
    return ok("مطلب حذف شد.");
  } catch (error) {
    return fail(error);
  }
}

import { redirect } from "next/navigation";
import {
  deleteBlogCategoryAction,
  upsertBlogCategoryAction,
} from "@/app/admin/blog/actions";
import {
  AdminCard,
  AdminForm,
  AdminShell,
  ContentLanguageSection,
  Field,
} from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogCategoriesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const categories = await prisma.blogCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { posts: true } } },
  });

  return (
    <AdminShell username={session.username} title="بلاگ — دسته‌بندی‌ها">
      <AdminCard title="افزودن دسته">
        <AdminForm action={upsertBlogCategoryAction} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug" name="slug" dir="ltr" hint="اختیاری" />
            <Field label="ترتیب" name="sortOrder" type="number" defaultValue={categories.length} />
          </div>
          <ContentLanguageSection locale="fa">
            <div className="grid gap-4">
              <Field label="نام" name="name" required />
              <Field label="توضیح" name="description" rows={2} />
            </div>
          </ContentLanguageSection>
          <ContentLanguageSection locale="en">
            <div className="grid gap-4">
              <Field label="Name" name="nameEn" />
              <Field label="Description" name="descriptionEn" rows={2} />
            </div>
          </ContentLanguageSection>
          <button type="submit" className="btn-primary sm:w-fit">
            افزودن
          </button>
        </AdminForm>
      </AdminCard>

      {categories.map((category) => (
        <AdminCard
          key={category.id}
          title={`${category.name} (${category._count.posts.toLocaleString("fa-IR")} مطلب)`}
        >
          <AdminForm action={upsertBlogCategoryAction} className="grid gap-4">
            <input type="hidden" name="id" value={category.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Slug" name="slug" defaultValue={category.slug} dir="ltr" />
              <Field label="ترتیب" name="sortOrder" type="number" defaultValue={category.sortOrder} />
            </div>
            <ContentLanguageSection locale="fa">
              <div className="grid gap-4">
                <Field label="نام" name="name" defaultValue={category.name} required />
                <Field label="توضیح" name="description" defaultValue={category.description} rows={2} />
              </div>
            </ContentLanguageSection>
            <ContentLanguageSection locale="en">
              <div className="grid gap-4">
                <Field label="Name" name="nameEn" defaultValue={category.nameEn} />
                <Field label="Description" name="descriptionEn" defaultValue={category.descriptionEn} rows={2} />
              </div>
            </ContentLanguageSection>
            <button type="submit" className="btn-primary sm:w-fit">
              ذخیره
            </button>
          </AdminForm>
          <AdminForm action={deleteBlogCategoryAction} className="mt-3" successMessage="دسته حذف شد.">
            <input type="hidden" name="id" value={category.id} />
            <button type="submit" className="text-sm text-red-400 hover:underline">
              حذف
            </button>
          </AdminForm>
        </AdminCard>
      ))}
    </AdminShell>
  );
}

import { redirect } from "next/navigation";
import { deleteProductAction, upsertProductAction } from "@/app/admin/actions";
import {
  AdminCard,
  AdminForm,
  AdminShell,
  ContentLanguageSection,
  Field,
  ImageField,
} from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: { points: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <AdminShell username={session.username} title="محصولات">
      <AdminCard title="افزودن محصول">
        <AdminForm action={upsertProductAction} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug (انگلیسی یکتا)" name="slug" required dir="ltr" />
            <Field label="ترتیب" name="sortOrder" type="number" defaultValue={products.length} />
          </div>
          <ImageField label="تصویر محصول (مشترک)" name="image" />

          <ContentLanguageSection locale="fa">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="ایندکس نمایشی" name="indexLabel" required />
              <Field label="نام فارسی" name="name" required />
              <Field label="وضعیت" name="status" required />
              <Field label="عنوان کوتاه" name="title" required />
              <div className="sm:col-span-2">
                <Field label="توضیح" name="description" rows={4} required />
              </div>
              <div className="sm:col-span-2">
                <Field label="نکات (هر خط یک نکته)" name="points" rows={4} />
              </div>
            </div>
          </ContentLanguageSection>

          <ContentLanguageSection locale="en">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Index label" name="indexLabelEn" />
              <Field label="Name (English)" name="nameEn" />
              <Field label="Status" name="statusEn" />
              <Field label="Short title" name="titleEn" />
              <div className="sm:col-span-2">
                <Field label="Description" name="descriptionEn" rows={4} />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Bullet points (one per line, matched to Persian lines by order)"
                  name="pointsEn"
                  rows={4}
                />
              </div>
            </div>
          </ContentLanguageSection>

          <button type="submit" className="btn-primary sm:w-fit">
            افزودن محصول
          </button>
        </AdminForm>
      </AdminCard>

      {products.map((product) => (
        <AdminCard key={product.id} title={`${product.name} / ${product.nameEn || "—"}`}>
          <AdminForm action={upsertProductAction} className="grid gap-4">
            <input type="hidden" name="id" value={product.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Slug" name="slug" defaultValue={product.slug} required dir="ltr" />
              <Field label="ترتیب" name="sortOrder" type="number" defaultValue={product.sortOrder} />
            </div>
            <ImageField
              label="تصویر محصول (مشترک)"
              name="image"
              currentUrl={product.imageUrl}
              removeName="removeImage"
            />

            <ContentLanguageSection locale="fa">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="ایندکس" name="indexLabel" defaultValue={product.indexLabel} required />
                <Field label="نام فارسی" name="name" defaultValue={product.name} required />
                <Field label="وضعیت" name="status" defaultValue={product.status} required />
                <Field label="عنوان کوتاه" name="title" defaultValue={product.title} required />
                <div className="sm:col-span-2">
                  <Field label="توضیح" name="description" defaultValue={product.description} rows={4} required />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="نکات (هر خط یک نکته)"
                    name="points"
                    rows={4}
                    defaultValue={product.points.map((point) => point.text).join("\n")}
                  />
                </div>
              </div>
            </ContentLanguageSection>

            <ContentLanguageSection locale="en">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Index label" name="indexLabelEn" defaultValue={product.indexLabelEn} />
                <Field label="Name (English)" name="nameEn" defaultValue={product.nameEn} />
                <Field label="Status" name="statusEn" defaultValue={product.statusEn} />
                <Field label="Short title" name="titleEn" defaultValue={product.titleEn} />
                <div className="sm:col-span-2">
                  <Field label="Description" name="descriptionEn" defaultValue={product.descriptionEn} rows={4} />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Bullet points (one per line, matched to Persian lines by order)"
                    name="pointsEn"
                    rows={4}
                    defaultValue={product.points.map((point) => point.textEn).join("\n")}
                  />
                </div>
              </div>
            </ContentLanguageSection>

            <button type="submit" className="btn-primary sm:w-fit">
              ذخیره
            </button>
          </AdminForm>
          <AdminForm action={deleteProductAction} className="mt-3" successMessage="محصول حذف شد.">
            <input type="hidden" name="id" value={product.id} />
            <button type="submit" className="text-sm text-red-400 hover:underline">
              حذف محصول
            </button>
          </AdminForm>
        </AdminCard>
      ))}
    </AdminShell>
  );
}

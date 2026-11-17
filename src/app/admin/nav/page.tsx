import { redirect } from "next/navigation";
import { deleteNavItemAction, upsertNavItemAction } from "@/app/admin/actions";
import {
  AdminCard,
  AdminForm,
  AdminShell,
  ContentLanguageSection,
  Field,
} from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminNavPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const items = await prisma.navItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell username={session.username} title="ناوبری">
      <AdminCard title="افزودن آیتم">
        <AdminForm action={upsertNavItemAction} className="grid gap-4">
          <Field label="لینک (مثل /about)" name="href" required dir="ltr" />
          <Field label="ترتیب" name="sortOrder" type="number" defaultValue={items.length} />
          <ContentLanguageSection locale="fa">
            <Field label="برچسب فارسی" name="label" required />
          </ContentLanguageSection>
          <ContentLanguageSection locale="en">
            <Field label="English label" name="labelEn" />
          </ContentLanguageSection>
          <button type="submit" className="btn-primary sm:w-fit">
            افزودن
          </button>
        </AdminForm>
      </AdminCard>

      {items.map((item) => (
        <AdminCard key={item.id} title={item.label}>
          <AdminForm action={upsertNavItemAction} className="grid gap-4">
            <input type="hidden" name="id" value={item.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="لینک" name="href" defaultValue={item.href} required dir="ltr" />
              <Field label="ترتیب" name="sortOrder" type="number" defaultValue={item.sortOrder} />
            </div>
            <ContentLanguageSection locale="fa">
              <Field label="برچسب فارسی" name="label" defaultValue={item.label} required />
            </ContentLanguageSection>
            <ContentLanguageSection locale="en">
              <Field label="English label" name="labelEn" defaultValue={item.labelEn} />
            </ContentLanguageSection>
            <button type="submit" className="btn-primary sm:w-fit">
              ذخیره
            </button>
          </AdminForm>
          <AdminForm action={deleteNavItemAction} className="mt-3" successMessage="آیتم حذف شد.">
            <input type="hidden" name="id" value={item.id} />
            <button type="submit" className="text-sm text-red-400 hover:underline">
              حذف
            </button>
          </AdminForm>
        </AdminCard>
      ))}
    </AdminShell>
  );
}

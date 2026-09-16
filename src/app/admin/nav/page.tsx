import { redirect } from "next/navigation";
import { deleteNavItemAction, upsertNavItemAction } from "@/app/admin/actions";
import { AdminCard, AdminForm, AdminShell, Field } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminNavPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const items = await prisma.navItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell username={session.username} title="ناوبری">
      <AdminCard title="افزودن آیتم">
        <AdminForm action={upsertNavItemAction} className="grid gap-4 sm:grid-cols-3">
          <Field label="برچسب" name="label" required />
          <Field label="لینک (مثل #about)" name="href" required dir="ltr" />
          <Field label="ترتیب" name="sortOrder" type="number" defaultValue={items.length} />
          <button type="submit" className="btn-primary sm:col-span-3 sm:w-fit">
            افزودن
          </button>
        </AdminForm>
      </AdminCard>

      {items.map((item) => (
        <AdminCard key={item.id} title={item.label}>
          <AdminForm action={upsertNavItemAction} className="grid gap-4 sm:grid-cols-3">
            <input type="hidden" name="id" value={item.id} />
            <Field label="برچسب" name="label" defaultValue={item.label} required />
            <Field label="لینک" name="href" defaultValue={item.href} required dir="ltr" />
            <Field label="ترتیب" name="sortOrder" type="number" defaultValue={item.sortOrder} />
            <div className="flex gap-2 sm:col-span-3">
              <button type="submit" className="btn-primary !py-2 text-sm">
                ذخیره
              </button>
            </div>
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

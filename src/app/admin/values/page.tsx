import { redirect } from "next/navigation";
import { deleteValueAction, upsertValueAction } from "@/app/admin/actions";
import { AdminCard, AdminForm, AdminShell, Field } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminValuesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const values = await prisma.valueItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell username={session.username} title="ارزش‌ها">
      <AdminCard title="افزودن ارزش">
        <AdminForm action={upsertValueAction} className="grid gap-4">
          <Field label="عنوان" name="title" required />
          <Field label="متن" name="text" rows={3} required />
          <Field label="ترتیب" name="sortOrder" type="number" defaultValue={values.length} />
          <button type="submit" className="btn-primary w-fit">
            افزودن
          </button>
        </AdminForm>
      </AdminCard>

      {values.map((value) => (
        <AdminCard key={value.id} title={value.title}>
          <AdminForm action={upsertValueAction} className="grid gap-4">
            <input type="hidden" name="id" value={value.id} />
            <Field label="عنوان" name="title" defaultValue={value.title} required />
            <Field label="متن" name="text" defaultValue={value.text} rows={3} required />
            <Field label="ترتیب" name="sortOrder" type="number" defaultValue={value.sortOrder} />
            <button type="submit" className="btn-primary w-fit">
              ذخیره
            </button>
          </AdminForm>
          <AdminForm action={deleteValueAction} className="mt-3" successMessage="ارزش حذف شد.">
            <input type="hidden" name="id" value={value.id} />
            <button type="submit" className="text-sm text-red-400 hover:underline">
              حذف
            </button>
          </AdminForm>
        </AdminCard>
      ))}
    </AdminShell>
  );
}

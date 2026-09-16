import { redirect } from "next/navigation";
import { deleteStepAction, upsertStepAction } from "@/app/admin/actions";
import { AdminCard, AdminForm, AdminShell, Field } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminApproachPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const steps = await prisma.approachStep.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell username={session.username} title="رویکرد">
      <AdminCard title="افزودن مرحله">
        <AdminForm action={upsertStepAction} className="grid gap-4 sm:grid-cols-2">
          <Field label="ایندکس" name="indexLabel" required />
          <Field label="ترتیب" name="sortOrder" type="number" defaultValue={steps.length} />
          <Field label="عنوان" name="title" required />
          <div className="sm:col-span-2">
            <Field label="متن" name="text" rows={3} required />
          </div>
          <button type="submit" className="btn-primary sm:w-fit">
            افزودن
          </button>
        </AdminForm>
      </AdminCard>

      {steps.map((step) => (
        <AdminCard key={step.id} title={step.title}>
          <AdminForm action={upsertStepAction} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="id" value={step.id} />
            <Field label="ایندکس" name="indexLabel" defaultValue={step.indexLabel} required />
            <Field label="ترتیب" name="sortOrder" type="number" defaultValue={step.sortOrder} />
            <Field label="عنوان" name="title" defaultValue={step.title} required />
            <div className="sm:col-span-2">
              <Field label="متن" name="text" defaultValue={step.text} rows={3} required />
            </div>
            <button type="submit" className="btn-primary sm:w-fit">
              ذخیره
            </button>
          </AdminForm>
          <AdminForm action={deleteStepAction} className="mt-3" successMessage="مرحله حذف شد.">
            <input type="hidden" name="id" value={step.id} />
            <button type="submit" className="text-sm text-red-400 hover:underline">
              حذف
            </button>
          </AdminForm>
        </AdminCard>
      ))}
    </AdminShell>
  );
}

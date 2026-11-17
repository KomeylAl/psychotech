import { redirect } from "next/navigation";
import { deleteStepAction, upsertStepAction } from "@/app/admin/actions";
import {
  AdminCard,
  AdminForm,
  AdminShell,
  ContentLanguageSection,
  Field,
} from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminApproachPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const steps = await prisma.approachStep.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell username={session.username} title="رویکرد">
      <AdminCard title="افزودن مرحله">
        <AdminForm action={upsertStepAction} className="grid gap-4">
          <Field label="ترتیب (مشترک)" name="sortOrder" type="number" defaultValue={steps.length} />
          <ContentLanguageSection locale="fa">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="ایندکس" name="indexLabel" required />
              <Field label="عنوان" name="title" required />
              <div className="sm:col-span-2">
                <Field label="متن" name="text" rows={3} required />
              </div>
            </div>
          </ContentLanguageSection>
          <ContentLanguageSection locale="en">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Index label" name="indexLabelEn" />
              <Field label="Title" name="titleEn" />
              <div className="sm:col-span-2">
                <Field label="Text" name="textEn" rows={3} />
              </div>
            </div>
          </ContentLanguageSection>
          <button type="submit" className="btn-primary sm:w-fit">
            افزودن
          </button>
        </AdminForm>
      </AdminCard>

      {steps.map((step) => (
        <AdminCard key={step.id} title={step.title}>
          <AdminForm action={upsertStepAction} className="grid gap-4">
            <input type="hidden" name="id" value={step.id} />
            <Field label="ترتیب (مشترک)" name="sortOrder" type="number" defaultValue={step.sortOrder} />
            <ContentLanguageSection locale="fa">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="ایندکس" name="indexLabel" defaultValue={step.indexLabel} required />
                <Field label="عنوان" name="title" defaultValue={step.title} required />
                <div className="sm:col-span-2">
                  <Field label="متن" name="text" defaultValue={step.text} rows={3} required />
                </div>
              </div>
            </ContentLanguageSection>
            <ContentLanguageSection locale="en">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Index label" name="indexLabelEn" defaultValue={step.indexLabelEn} />
                <Field label="Title" name="titleEn" defaultValue={step.titleEn} />
                <div className="sm:col-span-2">
                  <Field label="Text" name="textEn" defaultValue={step.textEn} rows={3} />
                </div>
              </div>
            </ContentLanguageSection>
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

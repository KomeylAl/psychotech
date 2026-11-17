import { redirect } from "next/navigation";
import { deleteKeywordAction, upsertKeywordAction } from "@/app/admin/actions";
import {
  AdminCard,
  AdminForm,
  AdminShell,
  ContentLanguageSection,
  Field,
} from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminKeywordsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const keywords = await prisma.keyword.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell username={session.username} title="کلمات کلیدی">
      <AdminCard title="افزودن کلمه">
        <AdminForm action={upsertKeywordAction} className="grid gap-4">
          <Field label="ترتیب (مشترک)" name="sortOrder" type="number" defaultValue={keywords.length} />
          <ContentLanguageSection locale="fa">
            <Field label="کلمه فارسی" name="word" required />
          </ContentLanguageSection>
          <ContentLanguageSection locale="en">
            <Field label="English keyword" name="wordEn" />
          </ContentLanguageSection>
          <button type="submit" className="btn-primary w-fit">
            افزودن
          </button>
        </AdminForm>
      </AdminCard>

      <div className="grid gap-4 sm:grid-cols-2">
        {keywords.map((keyword) => (
          <AdminCard key={keyword.id} title={keyword.word}>
            <AdminForm action={upsertKeywordAction} className="grid gap-4">
              <input type="hidden" name="id" value={keyword.id} />
              <Field label="ترتیب (مشترک)" name="sortOrder" type="number" defaultValue={keyword.sortOrder} />
              <ContentLanguageSection locale="fa">
                <Field label="کلمه فارسی" name="word" defaultValue={keyword.word} required />
              </ContentLanguageSection>
              <ContentLanguageSection locale="en">
                <Field label="English keyword" name="wordEn" defaultValue={keyword.wordEn} />
              </ContentLanguageSection>
              <button type="submit" className="btn-primary w-fit">
                ذخیره
              </button>
            </AdminForm>
            <AdminForm action={deleteKeywordAction} className="mt-3" successMessage="کلمه حذف شد.">
              <input type="hidden" name="id" value={keyword.id} />
              <button type="submit" className="text-sm text-red-400 hover:underline">
                حذف
              </button>
            </AdminForm>
          </AdminCard>
        ))}
      </div>
    </AdminShell>
  );
}

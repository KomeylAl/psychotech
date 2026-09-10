import { redirect } from "next/navigation";
import { deleteKeywordAction, upsertKeywordAction } from "@/app/admin/actions";
import { AdminCard, AdminShell, Field, SavedBanner } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminKeywordsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const keywords = await prisma.keyword.findMany({ orderBy: { sortOrder: "asc" } });
  const params = await searchParams;

  return (
    <AdminShell username={session.username} title="کلمات کلیدی">
      <SavedBanner saved={params.saved} />

      <AdminCard title="افزودن کلمه">
        <form action={upsertKeywordAction} className="grid gap-4 sm:grid-cols-3">
          <Field label="کلمه" name="word" required />
          <Field label="ترتیب" name="sortOrder" type="number" defaultValue={keywords.length} />
          <button type="submit" className="btn-primary self-end">
            افزودن
          </button>
        </form>
      </AdminCard>

      <div className="grid gap-4 sm:grid-cols-2">
        {keywords.map((keyword) => (
          <AdminCard key={keyword.id} title={keyword.word}>
            <form action={upsertKeywordAction} className="grid gap-4">
              <input type="hidden" name="id" value={keyword.id} />
              <Field label="کلمه" name="word" defaultValue={keyword.word} required />
              <Field label="ترتیب" name="sortOrder" type="number" defaultValue={keyword.sortOrder} />
              <button type="submit" className="btn-primary w-fit">
                ذخیره
              </button>
            </form>
            <form action={deleteKeywordAction} className="mt-3">
              <input type="hidden" name="id" value={keyword.id} />
              <button type="submit" className="text-sm text-red-400 hover:underline">
                حذف
              </button>
            </form>
          </AdminCard>
        ))}
      </div>
    </AdminShell>
  );
}

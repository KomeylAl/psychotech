import { redirect } from "next/navigation";
import { deleteNavItemAction, upsertNavItemAction } from "@/app/admin/actions";
import { AdminCard, AdminShell, Field, SavedBanner } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminNavPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const items = await prisma.navItem.findMany({ orderBy: { sortOrder: "asc" } });
  const params = await searchParams;

  return (
    <AdminShell username={session.username} title="ناوبری">
      <SavedBanner saved={params.saved} />

      <AdminCard title="افزودن آیتم">
        <form action={upsertNavItemAction} className="grid gap-4 sm:grid-cols-3">
          <Field label="برچسب" name="label" required />
          <Field label="لینک (مثل #about)" name="href" required dir="ltr" />
          <Field label="ترتیب" name="sortOrder" type="number" defaultValue={items.length} />
          <button type="submit" className="btn-primary sm:col-span-3 sm:w-fit">
            افزودن
          </button>
        </form>
      </AdminCard>

      {items.map((item) => (
        <AdminCard key={item.id} title={item.label}>
          <form action={upsertNavItemAction} className="grid gap-4 sm:grid-cols-3">
            <input type="hidden" name="id" value={item.id} />
            <Field label="برچسب" name="label" defaultValue={item.label} required />
            <Field label="لینک" name="href" defaultValue={item.href} required dir="ltr" />
            <Field label="ترتیب" name="sortOrder" type="number" defaultValue={item.sortOrder} />
            <div className="flex gap-2 sm:col-span-3">
              <button type="submit" className="btn-primary !py-2 text-sm">
                ذخیره
              </button>
            </div>
          </form>
          <form action={deleteNavItemAction} className="mt-3">
            <input type="hidden" name="id" value={item.id} />
            <button type="submit" className="text-sm text-red-400 hover:underline">
              حذف
            </button>
          </form>
        </AdminCard>
      ))}
    </AdminShell>
  );
}

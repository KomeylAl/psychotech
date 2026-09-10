import { redirect } from "next/navigation";
import { deleteTeamMemberAction, upsertTeamMemberAction } from "@/app/admin/actions";
import { AdminCard, AdminShell, Field, SavedBanner } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const team = await prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } });
  const params = await searchParams;

  return (
    <AdminShell username={session.username} title="تیم">
      <SavedBanner saved={params.saved} />

      <AdminCard title="افزودن عضو">
        <form action={upsertTeamMemberAction} className="grid gap-4 sm:grid-cols-2">
          <Field label="نام" name="name" required />
          <Field label="نقش" name="role" required />
          <Field label="حروف اول" name="initials" required />
          <Field label="ترتیب" name="sortOrder" type="number" defaultValue={team.length} />
          <div className="sm:col-span-2">
            <Field label="بیو" name="bio" rows={3} required />
          </div>
          <button type="submit" className="btn-primary sm:w-fit">
            افزودن
          </button>
        </form>
      </AdminCard>

      {team.map((member) => (
        <AdminCard key={member.id} title={member.name}>
          <form action={upsertTeamMemberAction} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="id" value={member.id} />
            <Field label="نام" name="name" defaultValue={member.name} required />
            <Field label="نقش" name="role" defaultValue={member.role} required />
            <Field label="حروف اول" name="initials" defaultValue={member.initials} required />
            <Field label="ترتیب" name="sortOrder" type="number" defaultValue={member.sortOrder} />
            <div className="sm:col-span-2">
              <Field label="بیو" name="bio" defaultValue={member.bio} rows={3} required />
            </div>
            <button type="submit" className="btn-primary sm:w-fit">
              ذخیره
            </button>
          </form>
          <form action={deleteTeamMemberAction} className="mt-3">
            <input type="hidden" name="id" value={member.id} />
            <button type="submit" className="text-sm text-red-400 hover:underline">
              حذف
            </button>
          </form>
        </AdminCard>
      ))}
    </AdminShell>
  );
}

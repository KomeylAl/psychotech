import { redirect } from "next/navigation";
import { deleteBlogTagAction, upsertBlogTagAction } from "@/app/admin/blog/actions";
import { AdminCard, AdminForm, AdminShell, Field } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogTagsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const tags = await prisma.blogTag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <AdminShell username={session.username} title="بلاگ — برچسب‌ها">
      <AdminCard title="افزودن برچسب">
        <AdminForm action={upsertBlogTagAction} className="grid gap-4 sm:grid-cols-3">
          <Field label="نام" name="name" required />
          <Field label="Slug" name="slug" dir="ltr" hint="اختیاری" />
          <button type="submit" className="btn-primary self-end">
            افزودن
          </button>
        </AdminForm>
      </AdminCard>

      <div className="grid gap-4 sm:grid-cols-2">
        {tags.map((tag) => (
          <AdminCard
            key={tag.id}
            title={`${tag.name} (${tag._count.posts.toLocaleString("fa-IR")})`}
          >
            <AdminForm action={upsertBlogTagAction} className="grid gap-4">
              <input type="hidden" name="id" value={tag.id} />
              <Field label="نام" name="name" defaultValue={tag.name} required />
              <Field label="Slug" name="slug" defaultValue={tag.slug} dir="ltr" />
              <button type="submit" className="btn-primary w-fit">
                ذخیره
              </button>
            </AdminForm>
            <AdminForm action={deleteBlogTagAction} className="mt-3" successMessage="برچسب حذف شد.">
              <input type="hidden" name="id" value={tag.id} />
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

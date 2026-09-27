import { redirect } from "next/navigation";
import { upsertBlogPostAction } from "@/app/admin/blog/actions";
import { BlogPostFields } from "@/components/admin-blog-post-fields";
import { AdminForm, AdminShell } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminNewBlogPostPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [categories, tags] = await Promise.all([
    prisma.blogCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.blogTag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <AdminShell username={session.username} title="مطلب جدید">
      <AdminForm action={upsertBlogPostAction} className="space-y-5" successMessage="مطلب ایجاد شد.">
        <BlogPostFields categories={categories} tags={tags} />
        <button type="submit" className="btn-primary">
          ایجاد مطلب
        </button>
      </AdminForm>
    </AdminShell>
  );
}

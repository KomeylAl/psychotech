import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteBlogPostAction } from "@/app/admin/blog/actions";
import { AdminCard, AdminForm, AdminShell } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { formatPostDate } from "@/lib/blog";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const posts = await prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  return (
    <AdminShell username={session.username} title="بلاگ — مطالب">
      <div className="mb-5 flex flex-wrap gap-3">
        <Link href="/admin/blog/new" className="btn-primary">
          مطلب جدید
        </Link>
        <Link href="/admin/blog/categories" className="btn-ghost !py-2 text-sm">
          دسته‌بندی‌ها
        </Link>
        <Link href="/admin/blog/tags" className="btn-ghost !py-2 text-sm">
          برچسب‌ها
        </Link>
        <Link href="/blog" className="btn-ghost !py-2 text-sm">
          مشاهده بلاگ
        </Link>
      </div>

      {posts.length === 0 ? (
        <AdminCard>
          <p className="text-muted">هنوز مطلبی ثبت نشده است.</p>
        </AdminCard>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <AdminCard key={post.id} title={post.title}>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs ${
                    post.status === "published"
                      ? "bg-sage/15 text-sage"
                      : "bg-ink/5 text-muted"
                  }`}
                >
                  {post.status === "published" ? "منتشر شده" : "پیش‌نویس"}
                </span>
                {post.category ? <span>{post.category.name}</span> : null}
                <span dir="ltr">/{post.slug}</span>
                {post.publishedAt ? <span>{formatPostDate(post.publishedAt)}</span> : null}
              </div>
              {post.excerpt ? (
                <p className="mt-3 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/admin/blog/${post.id}`} className="btn-primary !py-2 text-sm">
                  ویرایش
                </Link>
                {post.status === "published" ? (
                  <Link href={`/blog/${post.slug}`} className="btn-ghost !py-2 text-sm">
                    مشاهده
                  </Link>
                ) : null}
                <AdminForm action={deleteBlogPostAction} successMessage="مطلب حذف شد.">
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="text-sm text-red-400 hover:underline">
                    حذف
                  </button>
                </AdminForm>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

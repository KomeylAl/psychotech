import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteBlogPostAction, upsertBlogPostAction } from "@/app/admin/blog/actions";
import { BlogPostFields } from "@/components/admin-blog-post-fields";
import { AdminForm, AdminShell } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

export default async function AdminEditBlogPostPage({ params }: { params: Params }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const [post, categories, tags] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { id },
      include: { tags: true },
    }),
    prisma.blogCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.blogTag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <AdminShell username={session.username} title={`ویرایش: ${post.title}`}>
      <div className="mb-5 flex flex-wrap gap-3">
        <Link href="/admin/blog" className="btn-ghost !py-2 text-sm">
          بازگشت به لیست
        </Link>
        {post.status === "published" ? (
          <Link href={`/blog/${post.slug}`} className="btn-ghost !py-2 text-sm">
            مشاهده در سایت
          </Link>
        ) : null}
      </div>

      <AdminForm action={upsertBlogPostAction} className="space-y-5">
        <BlogPostFields
          categories={categories}
          tags={tags}
          post={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            status: post.status,
            publishedAt: post.publishedAt,
            categoryId: post.categoryId,
            coverImageUrl: post.coverImageUrl,
            tagIds: post.tags.map((item) => item.tagId),
          }}
        />
        <button type="submit" className="btn-primary">
          ذخیره تغییرات
        </button>
      </AdminForm>

      <AdminForm action={deleteBlogPostAction} className="mt-6" successMessage="مطلب حذف شد.">
        <input type="hidden" name="id" value={post.id} />
        <button type="submit" className="text-sm text-red-400 hover:underline">
          حذف این مطلب
        </button>
      </AdminForm>
    </AdminShell>
  );
}

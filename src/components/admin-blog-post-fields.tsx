import { AdminCard, Field, ImageField } from "@/components/admin-ui";
import { RichTextField } from "@/components/rich-text-field";

export type BlogTaxonomyOption = { id: string; name: string };

export type BlogPostFormValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  publishedAt: Date | null;
  categoryId: string | null;
  coverImageUrl: string | null;
  tagIds: string[];
};

export function BlogPostFields({
  categories,
  tags,
  post,
}: {
  categories: BlogTaxonomyOption[];
  tags: BlogTaxonomyOption[];
  post?: BlogPostFormValues;
}) {
  const publishedValue = post?.publishedAt
    ? new Date(post.publishedAt.getTime() - post.publishedAt.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    : "";

  return (
    <>
      {post?.id ? <input type="hidden" name="id" value={post.id} /> : null}
      <AdminCard title="اطلاعات اصلی">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="عنوان" name="title" defaultValue={post?.title ?? ""} required />
          <Field
            label="Slug"
            name="slug"
            defaultValue={post?.slug ?? ""}
            dir="ltr"
            hint="اگر خالی باشد از عنوان ساخته می‌شود"
          />
          <div className="sm:col-span-2">
            <Field label="خلاصه" name="excerpt" defaultValue={post?.excerpt ?? ""} rows={3} />
          </div>
          <label className="block text-sm">
            <span className="mb-2 block text-muted">وضعیت</span>
            <select name="status" defaultValue={post?.status ?? "draft"} className="input">
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشر شده</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-muted">تاریخ انتشار</span>
            <input
              type="datetime-local"
              name="publishedAt"
              defaultValue={publishedValue}
              className="input"
              dir="ltr"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-muted">دسته</span>
            <select name="categoryId" defaultValue={post?.categoryId ?? ""} className="input">
              <option value="">بدون دسته</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <ImageField
            label="تصویر کاور"
            name="cover"
            currentUrl={post?.coverImageUrl}
            removeName="removeCover"
            hint="حداکثر ۵ مگابایت — JPG، PNG، WEBP یا GIF"
          />
        </div>
      </AdminCard>

      <AdminCard title="برچسب‌ها">
        {tags.length === 0 ? (
          <p className="text-sm text-muted">ابتدا از بخش برچسب‌ها موردی بسازید.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm"
              >
                <input
                  type="checkbox"
                  name="tagIds"
                  value={tag.id}
                  defaultChecked={post?.tagIds.includes(tag.id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        )}
      </AdminCard>

      <AdminCard title="متن مطلب">
        <RichTextField
          name="content"
          label="محتوا"
          defaultValue={post?.content ?? ""}
          hint="از نوار ابزار برای تیتر، لیست، تراز و هایلایت استفاده کنید"
        />
      </AdminCard>
    </>
  );
}

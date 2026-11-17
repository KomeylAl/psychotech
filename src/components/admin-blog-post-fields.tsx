import {
  AdminCard,
  ContentLanguageSection,
  Field,
  ImageField,
} from "@/components/admin-ui";
import { RichTextField } from "@/components/rich-text-field";

export type BlogTaxonomyOption = { id: string; name: string };

export type BlogPostFormValues = {
  id?: string;
  title: string;
  titleEn: string;
  slug: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  contentEn: string;
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

      <AdminCard title="تنظیمات مشترک">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Slug"
            name="slug"
            defaultValue={post?.slug ?? ""}
            dir="ltr"
            hint="برای هر دو زبان یکسان است؛ اگر خالی باشد از عنوان فارسی ساخته می‌شود"
          />
          <label className="block text-sm">
            <span className="mb-2 block text-label">وضعیت</span>
            <select name="status" defaultValue={post?.status ?? "draft"} className="input">
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشر شده</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-label">تاریخ انتشار</span>
            <input
              type="datetime-local"
              name="publishedAt"
              defaultValue={publishedValue}
              className="input"
              dir="ltr"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-label">دسته</span>
            <select name="categoryId" defaultValue={post?.categoryId ?? ""} className="input">
              <option value="">بدون دسته</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-2">
            <ImageField
              label="تصویر کاور (مشترک)"
              name="cover"
              currentUrl={post?.coverImageUrl}
              removeName="removeCover"
              hint="حداکثر ۵ مگابایت — JPG، PNG، WEBP یا GIF"
            />
          </div>
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

      <AdminCard title="محتوای مطلب">
        <div className="space-y-4">
          <ContentLanguageSection locale="fa">
            <div className="grid gap-4">
              <Field label="عنوان" name="title" defaultValue={post?.title ?? ""} required />
              <Field label="خلاصه" name="excerpt" defaultValue={post?.excerpt ?? ""} rows={3} />
              <RichTextField
                name="content"
                label="محتوا"
                defaultValue={post?.content ?? ""}
                hint="از نوار ابزار برای تیتر، لیست، تراز و هایلایت استفاده کنید"
              />
            </div>
          </ContentLanguageSection>

          <ContentLanguageSection locale="en">
            <div className="grid gap-4">
              <Field label="Title" name="titleEn" defaultValue={post?.titleEn ?? ""} />
              <Field label="Excerpt" name="excerptEn" defaultValue={post?.excerptEn ?? ""} rows={3} />
              <RichTextField
                name="contentEn"
                label="Content"
                defaultValue={post?.contentEn ?? ""}
                hint="Shown on the English version of the site"
              />
            </div>
          </ContentLanguageSection>
        </div>
      </AdminCard>
    </>
  );
}

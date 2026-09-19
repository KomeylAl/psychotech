import { redirect } from "next/navigation";
import { updateSettingsAction } from "@/app/admin/actions";
import {
  AdminCard,
  AdminForm,
  AdminShell,
  ColorField,
  Field,
  HeroVisualFields,
  ImageField,
} from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await prisma.siteSettings.findUniqueOrThrow({
    where: { id: "default" },
  });

  return (
    <AdminShell username={session.username} title="تنظیمات و متن‌ها">
      <AdminForm action={updateSettingsAction} className="space-y-5">
        <AdminCard title="هویت بصری">
          <div className="grid gap-6 sm:grid-cols-3">
            <ImageField
              label="لوگو"
              name="logo"
              currentUrl={settings.logoUrl}
              removeName="removeLogo"
              hint="برای هدر و فوتر — ترجیحاً مربع یا افقی کوچک"
            />
            <ImageField
              label="Favicon"
              name="favicon"
              currentUrl={settings.faviconUrl}
              removeName="removeFavicon"
              hint="آیکون تب مرورگر — ICO، PNG یا SVG"
            />
            <ImageField
              label="تصویر Open Graph"
              name="ogImage"
              currentUrl={settings.ogImageUrl}
              removeName="removeOgImage"
              hint="پیش‌نمایش اشتراک‌گذاری در شبکه‌های اجتماعی"
            />
          </div>
        </AdminCard>

        <AdminCard title="رنگ‌بندی">
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              label="رنگ اصلی (Brand)"
              name="brandColor"
              defaultValue={settings.brandColor}
              hint="دکمه‌ها، لینک‌ها و هایلایت‌های اصلی"
            />
            <ColorField
              label="رنگ فرعی (Accent)"
              name="accentColor"
              defaultValue={settings.accentColor}
              hint="تأکیدهای مکمل و جزئیات بصری"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5"
              style={{ background: settings.brandColor, color: "#fff" }}
            >
              پیش‌نمایش Brand
            </span>
            <span
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5"
              style={{ background: settings.accentColor, color: "#fff" }}
            >
              پیش‌نمایش Accent
            </span>
          </div>
        </AdminCard>

        <AdminCard title="اطلاعات پایه">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام انگلیسی" name="name" defaultValue={settings.name} required />
            <Field label="نام فارسی" name="nameFa" defaultValue={settings.nameFa} required />
            <Field label="تگ‌لاین" name="tagline" defaultValue={settings.tagline} required />
            <Field label="ایمیل" name="email" defaultValue={settings.email} required dir="ltr" />
            <Field label="موقعیت" name="location" defaultValue={settings.location} required />
          </div>
        </AdminCard>

        <AdminCard title="هیرو">
          <div className="grid gap-4">
            <HeroVisualFields
              mode={settings.heroVisualMode}
              currentUrl={settings.heroVisualUrl}
            />
            <Field label="خط اول تیتر" name="heroTitleLine1" defaultValue={settings.heroTitleLine1} required />
            <Field label="هایلایت تیتر" name="heroTitleHighlight" defaultValue={settings.heroTitleHighlight} required />
            <Field label="توضیح" name="heroDescription" defaultValue={settings.heroDescription} rows={4} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="CTA اصلی" name="heroCtaPrimary" defaultValue={settings.heroCtaPrimary} required />
              <Field label="CTA ثانویه" name="heroCtaSecondary" defaultValue={settings.heroCtaSecondary} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="آمار ۱ — برچسب" name="heroStat1Label" defaultValue={settings.heroStat1Label} required />
              <Field label="آمار ۱ — مقدار" name="heroStat1Value" defaultValue={settings.heroStat1Value} required />
              <div />
              <Field label="آمار ۲ — برچسب" name="heroStat2Label" defaultValue={settings.heroStat2Label} required />
              <Field label="آمار ۲ — مقدار" name="heroStat2Value" defaultValue={settings.heroStat2Value} required />
              <div />
              <Field label="آمار ۳ — برچسب" name="heroStat3Label" defaultValue={settings.heroStat3Label} required />
              <Field label="آمار ۳ — مقدار" name="heroStat3Value" defaultValue={settings.heroStat3Value} required />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="درباره شرکت">
          <div className="grid gap-4">
            <Field label="Eyebrow" name="aboutEyebrow" defaultValue={settings.aboutEyebrow} required />
            <Field label="عنوان" name="aboutTitle" defaultValue={settings.aboutTitle} required />
            <Field label="پاراگراف ۱" name="aboutParagraph1" defaultValue={settings.aboutParagraph1} rows={4} required />
            <Field label="پاراگراف ۲" name="aboutParagraph2" defaultValue={settings.aboutParagraph2} rows={4} required />
          </div>
        </AdminCard>

        <AdminCard title="رویکرد / محصولات / تیم / تماس / فوتر">
          <div className="grid gap-4">
            <Field label="رویکرد — eyebrow" name="approachEyebrow" defaultValue={settings.approachEyebrow} required />
            <Field label="رویکرد — عنوان" name="approachTitle" defaultValue={settings.approachTitle} required />
            <Field label="رویکرد — توضیح" name="approachDescription" defaultValue={settings.approachDescription} rows={3} required />
            <Field label="محصولات — eyebrow" name="productsEyebrow" defaultValue={settings.productsEyebrow} required />
            <Field label="محصولات — عنوان" name="productsTitle" defaultValue={settings.productsTitle} required />
            <Field label="محصولات — توضیح" name="productsDescription" defaultValue={settings.productsDescription} rows={3} required />
            <Field label="تیم — eyebrow" name="teamEyebrow" defaultValue={settings.teamEyebrow} required />
            <Field label="تیم — عنوان" name="teamTitle" defaultValue={settings.teamTitle} required />
            <Field label="تیم — توضیح" name="teamDescription" defaultValue={settings.teamDescription} rows={3} required />
            <Field label="تماس — eyebrow" name="contactEyebrow" defaultValue={settings.contactEyebrow} required />
            <Field label="تماس — عنوان" name="contactTitle" defaultValue={settings.contactTitle} required />
            <Field label="تماس — توضیح" name="contactDescription" defaultValue={settings.contactDescription} rows={3} required />
            <Field label="موفقیت فرم — عنوان" name="contactSuccessTitle" defaultValue={settings.contactSuccessTitle} required />
            <Field label="موفقیت فرم — متن" name="contactSuccessText" defaultValue={settings.contactSuccessText} rows={3} required />
            <Field label="متن فوتر" name="footerBlurb" defaultValue={settings.footerBlurb} rows={3} required />
          </div>
        </AdminCard>

        <button type="submit" className="btn-primary">
          ذخیره تنظیمات
        </button>
      </AdminForm>
    </AdminShell>
  );
}

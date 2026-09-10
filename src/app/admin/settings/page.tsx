import { redirect } from "next/navigation";
import { updateSettingsAction } from "@/app/admin/actions";
import { AdminCard, AdminShell, Field, SavedBanner } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await prisma.siteSettings.findUniqueOrThrow({
    where: { id: "default" },
  });
  const params = await searchParams;

  return (
    <AdminShell username={session.username} title="تنظیمات و متن‌ها">
      <SavedBanner saved={params.saved} />
      <form action={updateSettingsAction} className="space-y-5">
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
      </form>
    </AdminShell>
  );
}

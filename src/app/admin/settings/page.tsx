import { redirect } from "next/navigation";
import { updateSettingsAction } from "@/app/admin/actions";
import {
  AdminCard,
  AdminForm,
  AdminShell,
  ColorField,
  ContentLanguageSection,
  Field,
  HeroVisualFields,
  ImageField,
} from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function TextRoleGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-canvas-soft/40 p-4 sm:p-5">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-xs leading-6 text-hint">{description}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    </div>
  );
}

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await prisma.siteSettings.findUniqueOrThrow({
    where: { id: "default" },
  });

  return (
    <AdminShell username={session.username} title="تنظیمات و متن‌ها">
      <AdminForm
        action={updateSettingsAction}
        className="space-y-5"
        stickySubmitLabel="ذخیره تنظیمات"
      >
        <div className="glass rounded-2xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm leading-7 text-muted">
          هر بخش متنی دو قسمت دارد: <strong className="text-ink">فارسی</strong> و{" "}
          <strong className="text-ink">English</strong>. اگر فیلد انگلیسی خالی بماند، نسخه
          انگلیسی سایت همان متن فارسی را نمایش می‌دهد.
        </div>

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

        <AdminCard title="رنگ‌های برند">
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              label="رنگ اصلی (Brand)"
              name="brandColor"
              defaultValue={settings.brandColor}
              hint="دکمه‌ها، لینک‌های فعال، هایلایت‌ها"
            />
            <ColorField
              label="رنگ فرعی (Accent)"
              name="accentColor"
              defaultValue={settings.accentColor}
              hint="تأکیدهای مکمل و جزئیات بصری"
            />
          </div>
        </AdminCard>

        <AdminCard title="رنگ‌بندی متن‌ها — حالت روشن">
          <div className="space-y-5">
            <TextRoleGroup
              title="۱. بدنه و تیتر"
              description="متن اصلی پاراگراف‌ها و عنوان‌های صفحه"
            >
              <ColorField
                label="متن اصلی / بدنه"
                name="textColor"
                defaultValue={settings.textColor}
                hint="body, پاراگراف‌ها"
              />
              <ColorField
                label="تیترها"
                name="headingColor"
                defaultValue={settings.headingColor}
                hint="h1 تا h4"
              />
            </TextRoleGroup>

            <TextRoleGroup
              title="۲. متن فرعی و توضیحات"
              description="توضیح بخش‌ها، بیو، excerpt، کپشن‌ها"
            >
              <ColorField
                label="متن فرعی (Muted)"
                name="mutedColor"
                defaultValue={settings.mutedColor}
                hint="توضیحات و زیرنویس‌ها"
              />
            </TextRoleGroup>

            <TextRoleGroup
              title="۳. ناوبری و منو"
              description="آیتم‌های هدر، فوتر و منوی موبایل"
            >
              <ColorField
                label="لینک‌های منو"
                name="navColor"
                defaultValue={settings.navColor}
                hint="هدر، فوتر، سایدبار ادمین"
              />
            </TextRoleGroup>

            <TextRoleGroup
              title="۴. فرم‌ها"
              description="برچسب فیلد، راهنما و placeholder"
            >
              <ColorField
                label="برچسب فیلد (Label)"
                name="labelColor"
                defaultValue={settings.labelColor}
                hint="نام فیلد بالای input"
              />
              <ColorField
                label="راهنما (Hint)"
                name="hintColor"
                defaultValue={settings.hintColor}
                hint="نکته زیر فیلد"
              />
              <ColorField
                label="Placeholder"
                name="placeholderColor"
                defaultValue={settings.placeholderColor}
                hint="متن داخل فیلد خالی"
              />
            </TextRoleGroup>

            <TextRoleGroup
              title="۵. Eyebrow / برچسب بخش"
              description="متن‌های کوچک بالای تیتر بخش‌ها مثل ۰۱ — شرکت"
            >
              <ColorField
                label="Eyebrow"
                name="eyebrowColor"
                defaultValue={settings.eyebrowColor}
                hint="معمولاً نزدیک به Accent"
              />
            </TextRoleGroup>

            <div
              className="rounded-2xl border border-line p-5"
              style={{ background: "#f4f0ea", color: settings.textColor }}
            >
              <p className="text-[0.7rem] tracking-[0.18em] uppercase" style={{ color: settings.eyebrowColor }}>
                01 — Preview
              </p>
              <p className="mt-2 text-xl font-semibold" style={{ color: settings.headingColor }}>
                تیتر نمونه در حالت روشن
              </p>
              <p className="mt-2 text-sm">متن اصلی بدنه برای سنجش خوانایی.</p>
              <p className="mt-1 text-sm" style={{ color: settings.mutedColor }}>
                متن فرعی و توضیح کوتاه بخش.
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <span style={{ color: settings.navColor }}>لینک منو</span>
                <span style={{ color: settings.labelColor }}>برچسب فیلد</span>
                <span style={{ color: settings.hintColor }}>راهنما</span>
                <span style={{ color: settings.placeholderColor }}>placeholder…</span>
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="رنگ‌بندی متن‌ها — حالت تاریک">
          <div className="space-y-5">
            <TextRoleGroup title="۱. بدنه و تیتر" description="همان نقش‌ها برای تم تاریک">
              <ColorField label="متن اصلی / بدنه" name="textColorDark" defaultValue={settings.textColorDark} />
              <ColorField label="تیترها" name="headingColorDark" defaultValue={settings.headingColorDark} />
            </TextRoleGroup>
            <TextRoleGroup title="۲. متن فرعی و توضیحات" description="توضیحات و کپشن‌ها در تاریک">
              <ColorField label="متن فرعی (Muted)" name="mutedColorDark" defaultValue={settings.mutedColorDark} />
            </TextRoleGroup>
            <TextRoleGroup title="۳. ناوبری و منو" description="لینک‌های منو در تاریک">
              <ColorField label="لینک‌های منو" name="navColorDark" defaultValue={settings.navColorDark} />
            </TextRoleGroup>
            <TextRoleGroup title="۴. فرم‌ها" description="برچسب، راهنما و placeholder">
              <ColorField label="برچسب فیلد" name="labelColorDark" defaultValue={settings.labelColorDark} />
              <ColorField label="راهنما" name="hintColorDark" defaultValue={settings.hintColorDark} />
              <ColorField label="Placeholder" name="placeholderColorDark" defaultValue={settings.placeholderColorDark} />
            </TextRoleGroup>
            <TextRoleGroup title="۵. Eyebrow" description="برچسب بالای تیتر بخش‌ها">
              <ColorField label="Eyebrow" name="eyebrowColorDark" defaultValue={settings.eyebrowColorDark} />
            </TextRoleGroup>

            <div
              className="rounded-2xl border border-line p-5"
              style={{ background: "#12161c", color: settings.textColorDark }}
            >
              <p className="text-[0.7rem] tracking-[0.18em] uppercase" style={{ color: settings.eyebrowColorDark }}>
                01 — Preview
              </p>
              <p className="mt-2 text-xl font-semibold" style={{ color: settings.headingColorDark }}>
                تیتر نمونه در حالت تاریک
              </p>
              <p className="mt-2 text-sm">متن اصلی بدنه برای سنجش خوانایی.</p>
              <p className="mt-1 text-sm" style={{ color: settings.mutedColorDark }}>
                متن فرعی و توضیح کوتاه بخش.
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <span style={{ color: settings.navColorDark }}>لینک منو</span>
                <span style={{ color: settings.labelColorDark }}>برچسب فیلد</span>
                <span style={{ color: settings.hintColorDark }}>راهنما</span>
                <span style={{ color: settings.placeholderColorDark }}>placeholder…</span>
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="اطلاعات پایه">
          <div className="space-y-4">
            <Field label="ایمیل (مشترک)" name="email" defaultValue={settings.email} required dir="ltr" />
            <ContentLanguageSection locale="fa">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="نام فارسی" name="nameFa" defaultValue={settings.nameFa} required />
                <Field label="تگ‌لاین" name="tagline" defaultValue={settings.tagline} required />
                <Field label="موقعیت" name="location" defaultValue={settings.location} required />
              </div>
            </ContentLanguageSection>
            <ContentLanguageSection locale="en">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Brand name" name="name" defaultValue={settings.name} required />
                <Field label="Tagline" name="taglineEn" defaultValue={settings.taglineEn} />
                <Field label="Location" name="locationEn" defaultValue={settings.locationEn} />
              </div>
            </ContentLanguageSection>
          </div>
        </AdminCard>

        <AdminCard title="هیرو">
          <div className="space-y-4">
            <HeroVisualFields
              mode={settings.heroVisualMode}
              currentUrl={settings.heroVisualUrl}
            />
            <ContentLanguageSection locale="fa">
              <div className="grid gap-4">
                <Field label="خط اول تیتر" name="heroTitleLine1" defaultValue={settings.heroTitleLine1} required />
                <Field label="هایلایت تیتر" name="heroTitleHighlight" defaultValue={settings.heroTitleHighlight} required />
                <Field label="توضیح" name="heroDescription" defaultValue={settings.heroDescription} rows={4} required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="CTA اصلی" name="heroCtaPrimary" defaultValue={settings.heroCtaPrimary} required />
                  <Field label="CTA ثانویه" name="heroCtaSecondary" defaultValue={settings.heroCtaSecondary} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="آمار ۱ — برچسب" name="heroStat1Label" defaultValue={settings.heroStat1Label} required />
                  <Field label="آمار ۱ — مقدار" name="heroStat1Value" defaultValue={settings.heroStat1Value} required />
                  <Field label="آمار ۲ — برچسب" name="heroStat2Label" defaultValue={settings.heroStat2Label} required />
                  <Field label="آمار ۲ — مقدار" name="heroStat2Value" defaultValue={settings.heroStat2Value} required />
                  <Field label="آمار ۳ — برچسب" name="heroStat3Label" defaultValue={settings.heroStat3Label} required />
                  <Field label="آمار ۳ — مقدار" name="heroStat3Value" defaultValue={settings.heroStat3Value} required />
                </div>
              </div>
            </ContentLanguageSection>
            <ContentLanguageSection locale="en">
              <div className="grid gap-4">
                <Field label="First title line" name="heroTitleLine1En" defaultValue={settings.heroTitleLine1En} />
                <Field label="Title highlight" name="heroTitleHighlightEn" defaultValue={settings.heroTitleHighlightEn} />
                <Field label="Description" name="heroDescriptionEn" defaultValue={settings.heroDescriptionEn} rows={4} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Primary CTA" name="heroCtaPrimaryEn" defaultValue={settings.heroCtaPrimaryEn} />
                  <Field label="Secondary CTA" name="heroCtaSecondaryEn" defaultValue={settings.heroCtaSecondaryEn} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Stat 1 — label" name="heroStat1LabelEn" defaultValue={settings.heroStat1LabelEn} />
                  <Field label="Stat 1 — value" name="heroStat1ValueEn" defaultValue={settings.heroStat1ValueEn} />
                  <Field label="Stat 2 — label" name="heroStat2LabelEn" defaultValue={settings.heroStat2LabelEn} />
                  <Field label="Stat 2 — value" name="heroStat2ValueEn" defaultValue={settings.heroStat2ValueEn} />
                  <Field label="Stat 3 — label" name="heroStat3LabelEn" defaultValue={settings.heroStat3LabelEn} />
                  <Field label="Stat 3 — value" name="heroStat3ValueEn" defaultValue={settings.heroStat3ValueEn} />
                </div>
              </div>
            </ContentLanguageSection>
          </div>
        </AdminCard>

        <AdminCard title="درباره شرکت">
          <div className="space-y-4">
            <ContentLanguageSection locale="fa">
              <div className="grid gap-4">
                <Field label="Eyebrow" name="aboutEyebrow" defaultValue={settings.aboutEyebrow} required />
                <Field label="عنوان" name="aboutTitle" defaultValue={settings.aboutTitle} required />
                <Field label="پاراگراف ۱" name="aboutParagraph1" defaultValue={settings.aboutParagraph1} rows={4} required />
                <Field label="پاراگراف ۲" name="aboutParagraph2" defaultValue={settings.aboutParagraph2} rows={4} required />
              </div>
            </ContentLanguageSection>
            <ContentLanguageSection locale="en">
              <div className="grid gap-4">
                <Field label="Eyebrow" name="aboutEyebrowEn" defaultValue={settings.aboutEyebrowEn} />
                <Field label="Title" name="aboutTitleEn" defaultValue={settings.aboutTitleEn} />
                <Field label="Paragraph 1" name="aboutParagraph1En" defaultValue={settings.aboutParagraph1En} rows={4} />
                <Field label="Paragraph 2" name="aboutParagraph2En" defaultValue={settings.aboutParagraph2En} rows={4} />
              </div>
            </ContentLanguageSection>
          </div>
        </AdminCard>

        <AdminCard title="رویکرد">
          <div className="space-y-4">
            <ContentLanguageSection locale="fa">
              <div className="grid gap-4">
                <Field label="eyebrow" name="approachEyebrow" defaultValue={settings.approachEyebrow} required />
                <Field label="عنوان" name="approachTitle" defaultValue={settings.approachTitle} required />
                <Field label="توضیح" name="approachDescription" defaultValue={settings.approachDescription} rows={3} required />
              </div>
            </ContentLanguageSection>
            <ContentLanguageSection locale="en">
              <div className="grid gap-4">
                <Field label="Eyebrow" name="approachEyebrowEn" defaultValue={settings.approachEyebrowEn} />
                <Field label="Title" name="approachTitleEn" defaultValue={settings.approachTitleEn} />
                <Field label="Description" name="approachDescriptionEn" defaultValue={settings.approachDescriptionEn} rows={3} />
              </div>
            </ContentLanguageSection>
          </div>
        </AdminCard>

        <AdminCard title="محصولات">
          <div className="space-y-4">
            <ContentLanguageSection locale="fa">
              <div className="grid gap-4">
                <Field label="eyebrow" name="productsEyebrow" defaultValue={settings.productsEyebrow} required />
                <Field label="عنوان" name="productsTitle" defaultValue={settings.productsTitle} required />
                <Field label="توضیح" name="productsDescription" defaultValue={settings.productsDescription} rows={3} required />
              </div>
            </ContentLanguageSection>
            <ContentLanguageSection locale="en">
              <div className="grid gap-4">
                <Field label="Eyebrow" name="productsEyebrowEn" defaultValue={settings.productsEyebrowEn} />
                <Field label="Title" name="productsTitleEn" defaultValue={settings.productsTitleEn} />
                <Field label="Description" name="productsDescriptionEn" defaultValue={settings.productsDescriptionEn} rows={3} />
              </div>
            </ContentLanguageSection>
          </div>
        </AdminCard>

        <AdminCard title="تیم">
          <div className="space-y-4">
            <ContentLanguageSection locale="fa">
              <div className="grid gap-4">
                <Field label="eyebrow" name="teamEyebrow" defaultValue={settings.teamEyebrow} required />
                <Field label="عنوان" name="teamTitle" defaultValue={settings.teamTitle} required />
                <Field label="توضیح" name="teamDescription" defaultValue={settings.teamDescription} rows={3} required />
              </div>
            </ContentLanguageSection>
            <ContentLanguageSection locale="en">
              <div className="grid gap-4">
                <Field label="Eyebrow" name="teamEyebrowEn" defaultValue={settings.teamEyebrowEn} />
                <Field label="Title" name="teamTitleEn" defaultValue={settings.teamTitleEn} />
                <Field label="Description" name="teamDescriptionEn" defaultValue={settings.teamDescriptionEn} rows={3} />
              </div>
            </ContentLanguageSection>
          </div>
        </AdminCard>

        <AdminCard title="بلاگ">
          <div className="space-y-4">
            <ContentLanguageSection locale="fa">
              <div className="grid gap-4">
                <Field label="eyebrow" name="blogEyebrow" defaultValue={settings.blogEyebrow} required />
                <Field label="عنوان" name="blogTitle" defaultValue={settings.blogTitle} required />
                <Field label="توضیح" name="blogDescription" defaultValue={settings.blogDescription} rows={3} required />
                <Field label="دکمه مشاهده همه" name="blogCta" defaultValue={settings.blogCta} required />
              </div>
            </ContentLanguageSection>
            <ContentLanguageSection locale="en">
              <div className="grid gap-4">
                <Field label="Eyebrow" name="blogEyebrowEn" defaultValue={settings.blogEyebrowEn} />
                <Field label="Title" name="blogTitleEn" defaultValue={settings.blogTitleEn} />
                <Field label="Description" name="blogDescriptionEn" defaultValue={settings.blogDescriptionEn} rows={3} />
                <Field label="View-all CTA" name="blogCtaEn" defaultValue={settings.blogCtaEn} />
              </div>
            </ContentLanguageSection>
          </div>
        </AdminCard>

        <AdminCard title="تماس و فوتر">
          <div className="space-y-4">
            <ContentLanguageSection locale="fa">
              <div className="grid gap-4">
                <Field label="تماس — eyebrow" name="contactEyebrow" defaultValue={settings.contactEyebrow} required />
                <Field label="تماس — عنوان" name="contactTitle" defaultValue={settings.contactTitle} required />
                <Field label="تماس — توضیح" name="contactDescription" defaultValue={settings.contactDescription} rows={3} required />
                <Field label="موفقیت فرم — عنوان" name="contactSuccessTitle" defaultValue={settings.contactSuccessTitle} required />
                <Field label="موفقیت فرم — متن" name="contactSuccessText" defaultValue={settings.contactSuccessText} rows={3} required />
                <Field label="متن فوتر" name="footerBlurb" defaultValue={settings.footerBlurb} rows={3} required />
              </div>
            </ContentLanguageSection>
            <ContentLanguageSection locale="en">
              <div className="grid gap-4">
                <Field label="Contact — eyebrow" name="contactEyebrowEn" defaultValue={settings.contactEyebrowEn} />
                <Field label="Contact — title" name="contactTitleEn" defaultValue={settings.contactTitleEn} />
                <Field label="Contact — description" name="contactDescriptionEn" defaultValue={settings.contactDescriptionEn} rows={3} />
                <Field label="Form success — title" name="contactSuccessTitleEn" defaultValue={settings.contactSuccessTitleEn} />
                <Field label="Form success — text" name="contactSuccessTextEn" defaultValue={settings.contactSuccessTextEn} rows={3} />
                <Field label="Footer blurb" name="footerBlurbEn" defaultValue={settings.footerBlurbEn} rows={3} />
              </div>
            </ContentLanguageSection>
          </div>
        </AdminCard>
      </AdminForm>
    </AdminShell>
  );
}

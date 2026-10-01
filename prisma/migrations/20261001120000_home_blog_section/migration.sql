-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "blogEyebrow" TEXT NOT NULL DEFAULT '05 — بلاگ';
ALTER TABLE "SiteSettings" ADD COLUMN "blogTitle" TEXT NOT NULL DEFAULT 'آخرین نوشته‌ها';
ALTER TABLE "SiteSettings" ADD COLUMN "blogDescription" TEXT NOT NULL DEFAULT 'یادداشت‌هایی دربارهٔ روان‌شناسی، محصول و ساخت نرم‌افزار در تقاطع انسان و فناوری.';
ALTER TABLE "SiteSettings" ADD COLUMN "blogCta" TEXT NOT NULL DEFAULT 'مشاهده همه مقالات';

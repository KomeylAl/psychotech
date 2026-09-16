-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "logoUrl" TEXT,
ADD COLUMN "faviconUrl" TEXT,
ADD COLUMN "ogImageUrl" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "SiteSettings"
ADD COLUMN "brandColor" TEXT NOT NULL DEFAULT '#2f7cc4',
ADD COLUMN "accentColor" TEXT NOT NULL DEFAULT '#c96b32',
ADD COLUMN "heroVisualMode" TEXT NOT NULL DEFAULT 'motion',
ADD COLUMN "heroVisualUrl" TEXT;

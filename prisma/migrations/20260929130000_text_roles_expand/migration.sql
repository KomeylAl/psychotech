-- AlterTable
ALTER TABLE "SiteSettings"
ADD COLUMN "navColor" TEXT NOT NULL DEFAULT '#2a3440',
ADD COLUMN "labelColor" TEXT NOT NULL DEFAULT '#3a4552',
ADD COLUMN "eyebrowColor" TEXT NOT NULL DEFAULT '#c96b32',
ADD COLUMN "navColorDark" TEXT NOT NULL DEFAULT '#ddd6cd',
ADD COLUMN "labelColorDark" TEXT NOT NULL DEFAULT '#cfc8bf',
ADD COLUMN "eyebrowColorDark" TEXT NOT NULL DEFAULT '#e08a4a';

UPDATE "SiteSettings" SET
  "headingColor" = '#0f1419',
  "mutedColor" = '#2f3a46',
  "hintColor" = '#4a5563',
  "placeholderColor" = '#5c6775',
  "textColorDark" = '#f0ebe4',
  "headingColorDark" = '#faf7f2',
  "mutedColorDark" = '#d2cbc2',
  "hintColorDark" = '#c4bdb4',
  "placeholderColorDark" = '#b5aea4'
WHERE "id" = 'default';

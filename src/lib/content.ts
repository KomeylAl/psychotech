import { prisma } from "@/lib/prisma";
import { toPublicHref } from "@/lib/routes";
import { localizedHref } from "@/lib/i18n/url";
import type { Locale } from "@/lib/i18n/config";
import type {
  ApproachStep,
  Keyword,
  NavItem,
  Product,
  ProductPoint,
  SiteSettings,
  TeamMember,
  ValueItem,
} from "@/generated/prisma/client";

export type ProductWithPoints = Product & { points: ProductPoint[] };

export type SiteContent = {
  settings: SiteSettings;
  nav: NavItem[];
  products: ProductWithPoints[];
  team: TeamMember[];
  values: ValueItem[];
  steps: ApproachStep[];
  keywords: Keyword[];
};

/** English value when present, otherwise the Persian fallback. */
export function pickText(locale: Locale, fa: string, en: string): string {
  if (locale === "en") {
    const english = en?.trim();
    if (english) return english;
  }
  return fa ?? "";
}

function localizeSettings(settings: SiteSettings, locale: Locale): SiteSettings {
  if (locale === "fa") return settings;

  const t = (fa: string, en: string) => pickText(locale, fa, en);

  return {
    ...settings,
    tagline: t(settings.tagline, settings.taglineEn),
    location: t(settings.location, settings.locationEn),
    heroTitleLine1: t(settings.heroTitleLine1, settings.heroTitleLine1En),
    heroTitleHighlight: t(settings.heroTitleHighlight, settings.heroTitleHighlightEn),
    heroDescription: t(settings.heroDescription, settings.heroDescriptionEn),
    heroStat1Label: t(settings.heroStat1Label, settings.heroStat1LabelEn),
    heroStat1Value: t(settings.heroStat1Value, settings.heroStat1ValueEn),
    heroStat2Label: t(settings.heroStat2Label, settings.heroStat2LabelEn),
    heroStat2Value: t(settings.heroStat2Value, settings.heroStat2ValueEn),
    heroStat3Label: t(settings.heroStat3Label, settings.heroStat3LabelEn),
    heroStat3Value: t(settings.heroStat3Value, settings.heroStat3ValueEn),
    heroCtaPrimary: t(settings.heroCtaPrimary, settings.heroCtaPrimaryEn),
    heroCtaSecondary: t(settings.heroCtaSecondary, settings.heroCtaSecondaryEn),
    aboutEyebrow: t(settings.aboutEyebrow, settings.aboutEyebrowEn),
    aboutTitle: t(settings.aboutTitle, settings.aboutTitleEn),
    aboutParagraph1: t(settings.aboutParagraph1, settings.aboutParagraph1En),
    aboutParagraph2: t(settings.aboutParagraph2, settings.aboutParagraph2En),
    approachEyebrow: t(settings.approachEyebrow, settings.approachEyebrowEn),
    approachTitle: t(settings.approachTitle, settings.approachTitleEn),
    approachDescription: t(settings.approachDescription, settings.approachDescriptionEn),
    productsEyebrow: t(settings.productsEyebrow, settings.productsEyebrowEn),
    productsTitle: t(settings.productsTitle, settings.productsTitleEn),
    productsDescription: t(settings.productsDescription, settings.productsDescriptionEn),
    teamEyebrow: t(settings.teamEyebrow, settings.teamEyebrowEn),
    teamTitle: t(settings.teamTitle, settings.teamTitleEn),
    teamDescription: t(settings.teamDescription, settings.teamDescriptionEn),
    blogEyebrow: t(settings.blogEyebrow, settings.blogEyebrowEn),
    blogTitle: t(settings.blogTitle, settings.blogTitleEn),
    blogDescription: t(settings.blogDescription, settings.blogDescriptionEn),
    blogCta: t(settings.blogCta, settings.blogCtaEn),
    contactEyebrow: t(settings.contactEyebrow, settings.contactEyebrowEn),
    contactTitle: t(settings.contactTitle, settings.contactTitleEn),
    contactDescription: t(settings.contactDescription, settings.contactDescriptionEn),
    contactSuccessTitle: t(settings.contactSuccessTitle, settings.contactSuccessTitleEn),
    contactSuccessText: t(settings.contactSuccessText, settings.contactSuccessTextEn),
    footerBlurb: t(settings.footerBlurb, settings.footerBlurbEn),
  };
}

function localizeProduct(product: ProductWithPoints, locale: Locale): ProductWithPoints {
  if (locale === "fa") return product;

  return {
    ...product,
    indexLabel: pickText(locale, product.indexLabel, product.indexLabelEn),
    name: pickText(locale, product.name, product.nameEn),
    status: pickText(locale, product.status, product.statusEn),
    title: pickText(locale, product.title, product.titleEn),
    description: pickText(locale, product.description, product.descriptionEn),
    points: product.points.map((point) => ({
      ...point,
      text: pickText(locale, point.text, point.textEn),
    })),
  };
}

function localizeTeam(member: TeamMember, locale: Locale): TeamMember {
  if (locale === "fa") return member;

  return {
    ...member,
    name: pickText(locale, member.name, member.nameEn),
    role: pickText(locale, member.role, member.roleEn),
    bio: pickText(locale, member.bio, member.bioEn),
    initials: pickText(locale, member.initials, member.initialsEn),
  };
}

function localizeValue(value: ValueItem, locale: Locale): ValueItem {
  if (locale === "fa") return value;
  return {
    ...value,
    title: pickText(locale, value.title, value.titleEn),
    text: pickText(locale, value.text, value.textEn),
  };
}

function localizeStep(step: ApproachStep, locale: Locale): ApproachStep {
  if (locale === "fa") return step;
  return {
    ...step,
    indexLabel: pickText(locale, step.indexLabel, step.indexLabelEn),
    title: pickText(locale, step.title, step.titleEn),
    text: pickText(locale, step.text, step.textEn),
  };
}

function localizeKeyword(keyword: Keyword, locale: Locale): Keyword {
  if (locale === "fa") return keyword;
  return { ...keyword, word: pickText(locale, keyword.word, keyword.wordEn) };
}

function localizeNav(nav: NavItem[], locale: Locale): NavItem[] {
  return nav.map((item) => ({
    ...item,
    label: pickText(locale, item.label, item.labelEn),
    href: localizedHref(locale, item.href),
  }));
}

export async function getSiteContent(locale: Locale): Promise<SiteContent | null> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) return null;

  const [nav, products, team, values, steps, keywords] = await Promise.all([
    prisma.navItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      orderBy: { sortOrder: "asc" },
      include: { points: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.valueItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.approachStep.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.keyword.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return {
    settings: localizeSettings(settings, locale),
    nav: localizeNav(toPublicNav(ensureBlogNav(nav)), locale),
    products: products.map((product) => localizeProduct(product, locale)),
    team: team.map((member) => localizeTeam(member, locale)),
    values: values.map((value) => localizeValue(value, locale)),
    steps: steps.map((step) => localizeStep(step, locale)),
    keywords: keywords.map((keyword) => localizeKeyword(keyword, locale)),
  };
}

function ensureBlogNav(nav: NavItem[]): NavItem[] {
  const hasBlog = nav.some((item) => {
    const href = toPublicHref(item.href);
    return href === "/blog" || href.startsWith("/blog/");
  });
  if (hasBlog) return nav;

  const blogItem: NavItem = {
    id: "blog-fallback",
    href: "/blog",
    label: "بلاگ",
    labelEn: "Blog",
    sortOrder: 40,
  };
  const contactIndex = nav.findIndex((item) => toPublicHref(item.href) === "/contact");
  if (contactIndex === -1) return [...nav, blogItem];
  return [...nav.slice(0, contactIndex), blogItem, ...nav.slice(contactIndex)];
}

function toPublicNav(nav: NavItem[]): NavItem[] {
  return nav.map((item) => ({ ...item, href: toPublicHref(item.href) }));
}

export async function getProductBySlug(
  slug: string,
  locale: Locale,
): Promise<ProductWithPoints | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { points: { orderBy: { sortOrder: "asc" } } },
  });

  return product ? localizeProduct(product, locale) : null;
}

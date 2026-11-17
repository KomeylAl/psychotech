import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, type Prisma } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const settingsEnglish: Record<string, string> = {
  taglineEn: "Psychology × Technology",
  locationEn: "Tehran",
  heroTitleLine1En: "Where the mind and the machine",
  heroTitleHighlightEn: "understand each other",
  heroDescriptionEn:
    "Psycho Tech builds software at the intersection of psychology and technology — tools as precise as a scientific protocol and as human as a therapy session.",
  heroStat1LabelEn: "Field",
  heroStat1ValueEn: "Psychology + Software",
  heroStat2LabelEn: "Active products",
  heroStat2ValueEn: "Two clinical platforms",
  heroStat3LabelEn: "Principles",
  heroStat3ValueEn: "Evidence, ethics, precision",
  heroCtaPrimaryEn: "Explore products",
  heroCtaSecondaryEn: "Work with us",
  aboutEyebrowEn: "01 — Company",
  aboutTitleEn: "A product studio for the science of mind",
  aboutParagraph1En:
    "Psycho Tech builds software for people who work with the human mind: therapists, researchers, clinics and organizations that want to advance psychological decisions with data, good design and ethical responsibility.",
  aboutParagraph2En:
    "We do not treat psychology as decoration for technology, and we do not put technology in place of the expert. Our work is translation: turning protocol, assessment and care into a product that holds up in the real world — at the therapist's desk, in research, inside organizations.",
  approachEyebrowEn: "02 — Approach",
  approachTitleEn: "From clinical problem to dependable product",
  approachDescriptionEn:
    "Building at Psycho Tech is not a linear, theatrical process. Every stage must be defensible scientifically and calm and clear in the user experience.",
  productsEyebrowEn: "03 — Products",
  productsTitleEn: "Tools already on the clinical path",
  productsDescriptionEn:
    "Our two main products focus on two real problems: precise assessment and the calm operation of a clinic.",
  teamEyebrowEn: "04 — Team",
  teamTitleEn: "Clinical minds, engineering hands",
  teamDescriptionEn:
    "The Psycho Tech team combines psychology, product and software — because none of them alone is enough for this field.",
  blogEyebrowEn: "05 — Blog",
  blogTitleEn: "Latest writing",
  blogDescriptionEn:
    "Notes on psychology, product and building software at the intersection of people and technology.",
  blogCtaEn: "View all articles",
  contactEyebrowEn: "06 — Contact",
  contactTitleEn: "If there is something on your mind, let's start here",
  contactDescriptionEn:
    "For product collaboration, deploying in a clinic, or a conversation about research and organizations, fill in the form. We would rather listen well first.",
  contactSuccessTitleEn: "Your message has landed.",
  contactSuccessTextEn:
    "We usually reply within two working days. If it is urgent, write directly to our company email.",
  footerBlurbEn:
    "Software at the intersection of psychology and technology. Precise, ethical, human-centred.",
};

const navEnglish: Record<string, string> = {
  "/about": "About",
  "/approach": "Approach",
  "/products": "Products",
  "/team": "Team",
  "/blog": "Blog",
  "/contact": "Contact",
};

const productEnglish: Record<
  string,
  {
    indexLabelEn: string;
    statusEn: string;
    titleEn: string;
    descriptionEn: string;
    pointsEn: string[];
  }
> = {
  nura: {
    indexLabelEn: "01",
    statusEn: "Clinical release",
    titleEn: "Psychological assessment with instrument precision and human language",
    descriptionEn:
      "Nura brings a set of standardized assessments into one workspace, structures interpretation for the therapist and makes follow-up transparent — without replacing clinical judgement.",
    pointsEn: [
      "A bank of validated assessments with automatic scoring",
      "Readable reports for sessions and records",
      "Privacy-first design for sensitive data",
    ],
  },
  theradesk: {
    indexLabelEn: "02",
    statusEn: "Clinic release",
    titleEn: "A digital clinic desk; from appointment to session notes",
    descriptionEn:
      "TheraDesk simplifies the workflow of a psychology centre: scheduling, records, structured notes and care-team coordination — so the expert's energy goes to the client, not the software.",
    pointsEn: [
      "Session calendar and smart reminders",
      "Electronic records with role-based access",
      "Clinic performance reporting at a glance",
    ],
  },
};

const teamEnglish: Record<
  string,
  { nameEn: string; roleEn: string; bioEn: string; initialsEn: string }
> = {
  "آوا رضایی": {
    nameEn: "Ava Rezaei",
    roleEn: "Co-founder & CEO",
    bioEn:
      "A bridge between product, research and business. Focused on building tools that truly work inside the therapy room.",
    initialsEn: "AR",
  },
  "کیان مرادی": {
    nameEn: "Kian Moradi",
    roleEn: "Senior Clinical Psychologist",
    bioEn:
      "Responsible for the scientific validity of product paths, from assessment protocols to the ethics of working with psychological data.",
    initialsEn: "KM",
  },
  "سارا نعمتی": {
    nameEn: "Sara Nemati",
    roleEn: "Product Manager",
    bioEn:
      "Turns the experience of therapists and clients into simple flows — low friction, precise, dependable.",
    initialsEn: "SN",
  },
  "نیما افشار": {
    nameEn: "Nima Afshar",
    roleEn: "Senior Software Engineer",
    bioEn:
      "Secure architecture, scalable infrastructure and the quality that stays hidden behind a calm interface.",
    initialsEn: "NA",
  },
};

const valueEnglish: Record<string, { titleEn: string; textEn: string }> = {
  "مبتنی بر شواهد": {
    titleEn: "Evidence-based",
    textEn:
      "Every capability must connect to psychological literature or a real clinical need — not to a technology trend.",
  },
  "اخلاق و حریم خصوصی": {
    titleEn: "Ethics and privacy",
    textEn:
      "Mind data is sensitive data. Least access, encryption and informed consent are our red lines.",
  },
  "انسان در حلقه": {
    titleEn: "Human in the loop",
    textEn:
      "The algorithm suggests; the decision stays with the expert. Tools do not replace empathy.",
  },
  "دقت مهندسی": {
    titleEn: "Engineering precision",
    textEn:
      "We build software that is calm, fast and reliable — because in clinical work, friction means error.",
  },
};

const stepEnglish: Record<string, { indexLabelEn: string; titleEn: string; textEn: string }> = {
  "۰۱": {
    indexLabelEn: "01",
    titleEn: "Listening to the problem",
    textEn:
      "We start with a therapist, researcher or organization — not with a pre-packaged idea.",
  },
  "۰۲": {
    indexLabelEn: "02",
    titleEn: "Translating into product",
    textEn:
      "We turn the scientific protocol into a user flow: clear, measurable, ethical.",
  },
  "۰۳": {
    indexLabelEn: "03",
    titleEn: "Building and testing",
    textEn:
      "Small releases are tested in real environments and refined with data and clinical feedback.",
  },
  "۰۴": {
    indexLabelEn: "04",
    titleEn: "Care after launch",
    textEn:
      "A psychological product is not static; monitoring, security and updates are part of our commitment.",
  },
};

const keywordEnglish: Record<string, string> = {
  شناخت: "Cognition",
  داده: "Data",
  درمان: "Therapy",
  الگوریتم: "Algorithm",
  همدلی: "Empathy",
  دقت: "Precision",
  پژوهش: "Research",
  "حریم خصوصی": "Privacy",
  طراحی: "Design",
  سنجش: "Assessment",
};

async function backfillEnglish() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  if (settings) {
    const missing: Record<string, string> = {};
    for (const [key, value] of Object.entries(settingsEnglish)) {
      if (!(settings as Record<string, unknown>)[key]) missing[key] = value;
    }
    if (Object.keys(missing).length > 0) {
      await prisma.siteSettings.update({
        where: { id: "default" },
        data: missing as Prisma.SiteSettingsUpdateInput,
      });
    }
  }

  const navItems = await prisma.navItem.findMany();
  for (const item of navItems) {
    const label = navEnglish[item.href];
    if (label && !item.labelEn) {
      await prisma.navItem.update({ where: { id: item.id }, data: { labelEn: label } });
    }
  }

  const products = await prisma.product.findMany({
    include: { points: { orderBy: { sortOrder: "asc" } } },
  });
  for (const product of products) {
    const translation = productEnglish[product.slug];
    if (!translation) continue;

    const data: Prisma.ProductUpdateInput = {};
    if (!product.indexLabelEn) data.indexLabelEn = translation.indexLabelEn;
    if (!product.statusEn) data.statusEn = translation.statusEn;
    if (!product.titleEn) data.titleEn = translation.titleEn;
    if (!product.descriptionEn) data.descriptionEn = translation.descriptionEn;

    if (Object.keys(data).length > 0) {
      await prisma.product.update({ where: { id: product.id }, data });
    }

    for (const [index, point] of product.points.entries()) {
      const textEn = translation.pointsEn[index];
      if (textEn && !point.textEn) {
        await prisma.productPoint.update({ where: { id: point.id }, data: { textEn } });
      }
    }
  }

  const team = await prisma.teamMember.findMany();
  for (const member of team) {
    const translation = teamEnglish[member.name];
    if (!translation) continue;

    const data: Prisma.TeamMemberUpdateInput = {};
    if (!member.nameEn) data.nameEn = translation.nameEn;
    if (!member.roleEn) data.roleEn = translation.roleEn;
    if (!member.bioEn) data.bioEn = translation.bioEn;
    if (!member.initialsEn) data.initialsEn = translation.initialsEn;

    if (Object.keys(data).length > 0) {
      await prisma.teamMember.update({ where: { id: member.id }, data });
    }
  }

  const values = await prisma.valueItem.findMany();
  for (const value of values) {
    const translation = valueEnglish[value.title];
    if (!translation) continue;

    const data: Prisma.ValueItemUpdateInput = {};
    if (!value.titleEn) data.titleEn = translation.titleEn;
    if (!value.textEn) data.textEn = translation.textEn;

    if (Object.keys(data).length > 0) {
      await prisma.valueItem.update({ where: { id: value.id }, data });
    }
  }

  const steps = await prisma.approachStep.findMany();
  for (const step of steps) {
    const translation = stepEnglish[step.indexLabel];
    if (!translation) continue;

    const data: Prisma.ApproachStepUpdateInput = {};
    if (!step.indexLabelEn) data.indexLabelEn = translation.indexLabelEn;
    if (!step.titleEn) data.titleEn = translation.titleEn;
    if (!step.textEn) data.textEn = translation.textEn;

    if (Object.keys(data).length > 0) {
      await prisma.approachStep.update({ where: { id: step.id }, data });
    }
  }

  const keywords = await prisma.keyword.findMany();
  for (const keyword of keywords) {
    const wordEn = keywordEnglish[keyword.word];
    if (wordEn && !keyword.wordEn) {
      await prisma.keyword.update({ where: { id: keyword.id }, data: { wordEn } });
    }
  }
}

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Psycho Tech",
      nameFa: "سایکو تک",
      tagline: "روان‌شناسی × فناوری",
      email: "hello@psychotech.ir",
      location: "تهران",
      heroTitleLine1: "جایی که ذهن و ماشین",
      heroTitleHighlight: "یکدیگر را می‌فهمند",
      heroDescription:
        "سایکو تک نرم‌افزارهایی می‌سازد در تقاطع روان‌شناسی و فناوری — ابزارهایی که به اندازهٔ یک پروتکل علمی دقیق‌اند و به اندازهٔ یک جلسه درمان، انسانی.",
      heroStat1Label: "حوزه",
      heroStat1Value: "روان‌شناسی + نرم‌افزار",
      heroStat2Label: "محصول فعال",
      heroStat2Value: "دو پلتفرم بالینی",
      heroStat3Label: "اصول",
      heroStat3Value: "شواهد، اخلاق، دقت",
      heroCtaPrimary: "محصولات را ببینید",
      heroCtaSecondary: "همکاری با ما",
      aboutEyebrow: "01 — شرکت",
      aboutTitle: "استودیوی محصول برای علم ذهن",
      aboutParagraph1:
        "سایکو تک برای کسانی نرم‌افزار می‌سازد که با روان انسان سروکار دارند: درمانگران، پژوهشگران، کلینیک‌ها و سازمان‌هایی که می‌خواهند تصمیم روان‌شناختی را با داده، طراحی خوب و مسئولیت اخلاقی پیش ببرند.",
      aboutParagraph2:
        "ما روان‌شناسی را تزئین فناوری نمی‌دانیم و فناوری را جایگزین متخصص نمی‌گذاریم. کار ما ترجمه است: پروتکل، سنجش و مراقبت را به محصولی تبدیل می‌کنیم که در دنیای واقعی — پشت میز درمان، در پژوهش، در سازمان — دوام بیاورد.",
      approachEyebrow: "02 — رویکرد",
      approachTitle: "از مسئله بالینی تا محصول قابل اتکا",
      approachDescription:
        "مسیر ساخت در سایکو تک خطی و نمایشی نیست. هر مرحله باید هم از نظر علمی دفاع‌پذیر باشد، هم از نظر تجربه کاربری آرام و روشن.",
      productsEyebrow: "03 — محصولات",
      productsTitle: "ابزارهایی که الان در مسیر بالینی‌اند",
      productsDescription:
        "دو محصول اصلی سایکو تک روی دو مسئله واقعی تمرکز دارند: سنجش دقیق، و اداره آرام کلینیک.",
      teamEyebrow: "04 — تیم",
      teamTitle: "ذهن بالینی، دست مهندسی",
      teamDescription:
        "تیم سایکو تک ترکیبی از روان‌شناسی، محصول و نرم‌افزار است — چون هیچ‌کدام به‌تنهایی برای این حوزه کافی نیست.",
      blogEyebrow: "05 — بلاگ",
      blogTitle: "آخرین نوشته‌ها",
      blogDescription:
        "یادداشت‌هایی دربارهٔ روان‌شناسی، محصول و ساخت نرم‌افزار در تقاطع انسان و فناوری.",
      blogCta: "مشاهده همه مقالات",
      contactEyebrow: "06 — ارتباط",
      contactTitle: "اگر مسئله‌ای در ذهن دارید، از همین‌جا شروع کنیم",
      contactDescription:
        "برای همکاری محصولی، استقرار در کلینیک، یا گفت‌وگو دربارهٔ پژوهش و سازمان، فرم را پر کنید. ترجیح می‌دهیم اول خوب بشنویم.",
      contactSuccessTitle: "پیامتان نشست.",
      contactSuccessText:
        "معمولاً ظرف دو روز کاری برمی‌گردیم. اگر موضوع فوری است، مستقیم به ایمیل شرکت بنویسید.",
      footerBlurb:
        "نرم‌افزار در تقاطع روان‌شناسی و فناوری. دقیق، اخلاق‌مدار، انسان‌محور.",
    },
  });

  const navCount = await prisma.navItem.count();
  if (navCount === 0) {
    await prisma.navItem.createMany({
      data: [
        { href: "/about", label: "شرکت", sortOrder: 0 },
        { href: "/approach", label: "رویکرد", sortOrder: 1 },
        { href: "/products", label: "محصولات", sortOrder: 2 },
        { href: "/team", label: "تیم", sortOrder: 3 },
        { href: "/blog", label: "بلاگ", sortOrder: 4 },
        { href: "/contact", label: "ارتباط", sortOrder: 5 },
      ],
    });
  } else {
    const blogNav = await prisma.navItem.findFirst({ where: { href: "/blog" } });
    if (!blogNav) {
      await prisma.navItem.create({
        data: { href: "/blog", label: "بلاگ", sortOrder: 4 },
      });
    }
  }

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.create({
      data: {
        slug: "nura",
        indexLabel: "۰۱",
        name: "نورا",
        nameEn: "Nura",
        status: "نسخه بالینی",
        title: "ارزیابی روان‌شناختی، با دقت ابزار و زبان انسان",
        description:
          "نورا مجموعه‌ای از آزمون‌های استاندارد را روی یک میزکار واحد جمع می‌کند؛ تفسیر را برای درمانگر ساختار می‌دهد و روند پیگیری را شفاف می‌کند — بدون اینکه جای قضاوت بالینی را بگیرد.",
        sortOrder: 0,
        points: {
          create: [
            { text: "بانک آزمون‌های معتبر با نمره‌گذاری خودکار", sortOrder: 0 },
            { text: "گزارش‌های خوانا برای جلسه و پرونده", sortOrder: 1 },
            { text: "طراحی حریم‌خصوصی‌محور برای داده‌های حساس", sortOrder: 2 },
          ],
        },
      },
    });

    await prisma.product.create({
      data: {
        slug: "theradesk",
        indexLabel: "۰۲",
        name: "ترا‌دسک",
        nameEn: "TheraDesk",
        status: "نسخه کلینیک",
        title: "میزکار دیجیتال کلینیک؛ از نوبت تا یادداشت جلسه",
        description:
          "ترا‌دسک جریان کار یک مرکز روان‌شناسی را ساده می‌کند: زمان‌بندی، پرونده، یادداشت‌های ساختاریافته و هماهنگی تیم درمان — تا انرژی متخصص صرف مراجع شود، نه صرف نرم‌افزار.",
        sortOrder: 1,
        points: {
          create: [
            { text: "تقویم جلسات و یادآوری‌های هوشمند", sortOrder: 0 },
            { text: "پرونده الکترونیک با دسترسی نقش‌محور", sortOrder: 1 },
            { text: "گزارش عملکرد کلینیک در یک نگاه", sortOrder: 2 },
          ],
        },
      },
    });
  }

  const teamCount = await prisma.teamMember.count();
  if (teamCount === 0) {
    await prisma.teamMember.createMany({
      data: [
        {
          name: "آوا رضایی",
          role: "هم‌بنیان‌گذار و مدیرعامل",
          bio: "پل بین محصول، پژوهش و کسب‌وکار. تمرکز روی ساخت ابزارهایی که در اتاق درمان واقعاً کار کنند.",
          initials: "آر",
          sortOrder: 0,
        },
        {
          name: "کیان مرادی",
          role: "روان‌شناس بالینی ارشد",
          bio: "مسئول اعتبار علمی مسیرهای محصول؛ از پروتکل ارزیابی تا اخلاق کار با داده روان‌شناختی.",
          initials: "کم",
          sortOrder: 1,
        },
        {
          name: "سارا نعمتی",
          role: "مدیر محصول",
          bio: "تجربه درمانگر و مراجع را به جریان‌های ساده تبدیل می‌کند — کم‌اصطکاک، دقیق، قابل اعتماد.",
          initials: "سن",
          sortOrder: 2,
        },
        {
          name: "نیما افشار",
          role: "مهندس ارشد نرم‌افزار",
          bio: "معماری امن، زیرساخت مقیاس‌پذیر و کیفیتی که پشت رابط آرام صفحه پنهان می‌ماند.",
          initials: "نا",
          sortOrder: 3,
        },
      ],
    });
  }

  const valueCount = await prisma.valueItem.count();
  if (valueCount === 0) {
    await prisma.valueItem.createMany({
      data: [
        {
          title: "مبتنی بر شواهد",
          text: "هر قابلیت باید به ادبیات روان‌شناسی یا نیاز بالینی واقعی وصل باشد؛ نه به مد فناوری.",
          sortOrder: 0,
        },
        {
          title: "اخلاق و حریم خصوصی",
          text: "داده ذهن، داده حساس است. حداقل دسترسی، رمزنگاری و رضایت آگاهانه خط قرمز ماست.",
          sortOrder: 1,
        },
        {
          title: "انسان در حلقه",
          text: "الگوریتم پیشنهاد می‌دهد؛ تصمیم با متخصص می‌ماند. ابزار جای همدلی را نمی‌گیرد.",
          sortOrder: 2,
        },
        {
          title: "دقت مهندسی",
          text: "نرم‌افزار آرام، سریع و قابل اتکا می‌سازیم — چون در کار بالینی، اصطکاک یعنی خطا.",
          sortOrder: 3,
        },
      ],
    });
  }

  const stepCount = await prisma.approachStep.count();
  if (stepCount === 0) {
    await prisma.approachStep.createMany({
      data: [
        {
          indexLabel: "۰۱",
          title: "شنیدن مسئله",
          text: "با درمانگر، پژوهشگر یا سازمان شروع می‌کنیم؛ نه با یک ایده از پیش آماده.",
          sortOrder: 0,
        },
        {
          indexLabel: "۰۲",
          title: "ترجمه به محصول",
          text: "پروتکل علمی را به جریان کاربری تبدیل می‌کنیم: واضح، قابل اندازه‌گیری، اخلاق‌مدار.",
          sortOrder: 1,
        },
        {
          indexLabel: "۰۳",
          title: "ساخت و آزمودن",
          text: "نسخه‌های کوچک را در محیط واقعی می‌سنجیم و با داده و بازخورد بالینی اصلاح می‌کنیم.",
          sortOrder: 2,
        },
        {
          indexLabel: "۰۴",
          title: "مراقبت بعد از عرضه",
          text: "محصول روان‌شناختی ایستا نیست؛ پایش، امنیت و به‌روزرسانی بخشی از تعهد ماست.",
          sortOrder: 3,
        },
      ],
    });
  }

  const keywordCount = await prisma.keyword.count();
  if (keywordCount === 0) {
    await prisma.keyword.createMany({
      data: [
        "شناخت",
        "داده",
        "درمان",
        "الگوریتم",
        "همدلی",
        "دقت",
        "پژوهش",
        "حریم خصوصی",
        "طراحی",
        "سنجش",
      ].map((word, sortOrder) => ({ word, sortOrder })),
    });
  }

  await backfillEnglish();

  console.log("Seed complete.");
  console.log(`Admin login → username: ${username}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

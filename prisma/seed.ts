import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

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
      contactEyebrow: "05 — ارتباط",
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
        { href: "#about", label: "شرکت", sortOrder: 0 },
        { href: "#approach", label: "رویکرد", sortOrder: 1 },
        { href: "#products", label: "محصولات", sortOrder: 2 },
        { href: "#team", label: "تیم", sortOrder: 3 },
        { href: "#contact", label: "ارتباط", sortOrder: 4 },
      ],
    });
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

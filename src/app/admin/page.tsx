import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminCard, AdminShell } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [products, team, messages, unread] = await Promise.all([
    prisma.product.count(),
    prisma.teamMember.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  return (
    <AdminShell username={session.username} title="داشبورد">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "محصولات", value: products, href: "/admin/products" },
          { label: "اعضای تیم", value: team, href: "/admin/team" },
          { label: "پیام‌ها", value: messages, href: "/admin/messages" },
          { label: "خوانده‌نشده", value: unread, href: "/admin/messages" },
        ].map((item) => (
          <Link key={item.label} href={item.href} className="glass rounded-3xl p-5 hover:border-brand/40">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-2 font-display text-3xl">{item.value}</p>
          </Link>
        ))}
      </div>

      <AdminCard title="شروع سریع">
        <ul className="space-y-2 text-sm text-muted">
          <li>
            <Link href="/admin/settings" className="text-brand hover:underline">
              ویرایش متن‌های هیرو، درباره، تماس و فوتر
            </Link>
          </li>
          <li>
            <Link href="/admin/products" className="text-brand hover:underline">
              افزودن یا ویرایش محصولات
            </Link>
          </li>
          <li>
            <Link href="/admin/messages" className="text-brand hover:underline">
              بررسی پیام‌های فرم تماس
            </Link>
          </li>
        </ul>
      </AdminCard>
    </AdminShell>
  );
}

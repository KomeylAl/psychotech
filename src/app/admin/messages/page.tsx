import { redirect } from "next/navigation";
import { deleteMessageAction, markMessageReadAction } from "@/app/admin/actions";
import { AdminCard, AdminShell } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminMessagesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell username={session.username} title="پیام‌های تماس">
      {messages.length === 0 ? (
        <AdminCard>
          <p className="text-muted">هنوز پیامی دریافت نشده است.</p>
        </AdminCard>
      ) : (
        messages.map((message) => (
          <AdminCard
            key={message.id}
            title={`${message.name}${message.read ? "" : " • جدید"}`}
          >
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted">ایمیل: </span>
                <a href={`mailto:${message.email}`} className="text-brand" dir="ltr">
                  {message.email}
                </a>
              </p>
              {message.organization ? (
                <p>
                  <span className="text-muted">سازمان: </span>
                  {message.organization}
                </p>
              ) : null}
              <p className="text-muted">
                {new Intl.DateTimeFormat("fa-IR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(message.createdAt)}
              </p>
              <p className="leading-7 whitespace-pre-wrap">{message.message}</p>
            </div>
            <div className="mt-4 flex gap-3">
              {!message.read ? (
                <form action={markMessageReadAction}>
                  <input type="hidden" name="id" value={message.id} />
                  <button type="submit" className="btn-ghost !py-2 text-sm">
                    علامت به‌عنوان خوانده‌شده
                  </button>
                </form>
              ) : null}
              <form action={deleteMessageAction}>
                <input type="hidden" name="id" value={message.id} />
                <button type="submit" className="text-sm text-red-400 hover:underline">
                  حذف
                </button>
              </form>
            </div>
          </AdminCard>
        ))
      )}
    </AdminShell>
  );
}

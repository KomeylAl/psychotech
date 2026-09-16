import { LoginForm } from "@/components/admin-login-form";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-4 py-10">
      <LoginForm alreadyAuthed={Boolean(session)} />
    </div>
  );
}

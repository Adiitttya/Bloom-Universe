import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { checkIsAdmin, isAdminPasscodeVerified } from "@/lib/auth/admin-guard";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminSecurityCodeGate } from "@/components/admin/AdminSecurityCodeGate";
import { AdminTabGuard } from "@/components/admin/AdminTabGuard";
import type { UserSession } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // 1. Check Login
  if (!session?.user) {
    redirect("/?login=true");
  }

  // 2. Check Admin Role (If non-admin, render 404 Not Found directly without redirecting to /forbidden)
  const isAdmin = await checkIsAdmin(session.user);
  if (!isAdmin) {
    notFound();
  }

  // 3. Double-check Security Code Passkey
  const isPasscodeVerified = await isAdminPasscodeVerified();
  if (!isPasscodeVerified) {
    return (
      <AdminSecurityCodeGate user={session.user as unknown as UserSession} />
    );
  }

  // 4. Render Admin Layout with Per-Tab Session Guard
  return (
    <AdminTabGuard>
      <div className="flex min-h-screen flex-col bg-[#f8fbff] lg:h-screen lg:flex-row lg:overflow-hidden">
        <AdminSidebar user={session.user as unknown as UserSession} />
        <main className="flex-1 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] overflow-x-hidden p-4 sm:p-6 lg:h-full lg:overflow-y-auto lg:p-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
          <div className="mx-auto max-w-6xl pb-10">{children}</div>
        </main>
      </div>
    </AdminTabGuard>
  );
}


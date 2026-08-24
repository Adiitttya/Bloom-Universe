import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import type { UserSession } from "@/lib/types";

export const ADMIN_COOKIE_NAME = "bloom_admin_verified";

/**
 * Checks if a given user object has admin privileges.
 */
export function checkIsAdmin(
  user?: {
    isAdmin?: boolean;
    role?: string;
    guildRoles?: string[];
  } | null
): boolean {
  if (!user) return false;
  if (Boolean(user.isAdmin)) return true;
  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") return true;

  if (Array.isArray(user.guildRoles) && user.guildRoles.length > 0) {
    const adminRoleIds = (process.env.DISCORD_ADMIN_ROLE_IDS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    if (user.guildRoles.some((r) => adminRoleIds.includes(r))) {
      return true;
    }
  }

  return false;
}

/**
 * Ensures the caller is authenticated as an Admin.
 * Used inside Server Actions and Server Components.
 */
export async function requireAdminSession(): Promise<UserSession> {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized: Anda belum login.");
  }

  if (!checkIsAdmin(session.user)) {
    throw new Error("Forbidden: Akun Anda tidak memiliki role Admin.");
  }

  return session.user as unknown as UserSession;
}

/**
 * Checks whether the current admin has completed the 2FA double-check passcode in this browser session.
 */
export async function isAdminPasscodeVerified(): Promise<boolean> {
  const cookieStore = await cookies();
  const verifiedCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  return verifiedCookie?.value === "verified";
}

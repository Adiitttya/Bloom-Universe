import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { fetchDiscordGuildMember } from "@/lib/discord";
import { Role } from "@prisma/client";
import type { UserSession } from "@/lib/types";

export const ADMIN_COOKIE_NAME = "bloom_admin_verified";

/**
 * Checks if a given user object has admin privileges with real-time DB & Discord fallback.
 */
export async function checkIsAdmin(
  user?: {
    id?: string;
    discordId?: string;
    isAdmin?: boolean;
    role?: string;
    guildRoles?: string[];
  } | null
): Promise<boolean> {
  if (!user) return false;

  // 1. Direct session check
  if (Boolean(user.isAdmin)) return true;
  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") return true;

  const adminRoleIds = (process.env.DISCORD_ADMIN_ROLE_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (Array.isArray(user.guildRoles) && user.guildRoles.length > 0) {
    if (user.guildRoles.some((r) => adminRoleIds.includes(r))) {
      return true;
    }
  }

  // 2. Real-time Live Database check fallback (in case role was updated in DB directly)
  const discordId = user.discordId;
  if (discordId) {
    try {
      const dbUser = await db.user.findUnique({
        where: { discordId },
        select: { role: true, guildRoles: true },
      });

      if (dbUser) {
        if (dbUser.role === Role.ADMIN) return true;
        if (
          Array.isArray(dbUser.guildRoles) &&
          dbUser.guildRoles.some((r) => adminRoleIds.includes(r))
        ) {
          return true;
        }
      }

      // 3. Real-time Discord API verification fallback (in case user just received Discord role)
      const memberDetails = await fetchDiscordGuildMember(discordId);
      if (
        memberDetails.isInGuild &&
        memberDetails.roles.some((r) => adminRoleIds.includes(r))
      ) {
        // Sync to DB immediately
        await db.user.update({
          where: { discordId },
          data: {
            role: Role.ADMIN,
            guildRoles: memberDetails.roles,
            isInGuild: true,
          },
        }).catch(() => {});
        return true;
      }
    } catch (err) {
      console.error("Live admin check error:", err);
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

  const isAdmin = await checkIsAdmin(session.user);
  if (!isAdmin) {
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

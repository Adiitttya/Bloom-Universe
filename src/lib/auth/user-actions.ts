"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchDiscordGuildMember, getMemberHighestRole } from "@/lib/discord";
import { Role } from "@prisma/client";
import { getWIBDate } from "@/lib/utils";
import type { HighestRoleInfo } from "@/lib/types";

export interface SyncRoleResult {
  success: boolean;
  isInGuild: boolean;
  role: Role;
  isAdmin: boolean;
  highestRole: HighestRoleInfo | null;
  otherRolesCount: number;
  message?: string;
  error?: string;
}

/**
 * Server action to force-sync live Discord roles and Database permissions in real-time.
 */
export async function syncUserRoleAction(): Promise<SyncRoleResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        isInGuild: false,
        role: Role.GUEST,
        isAdmin: false,
        highestRole: null,
        otherRolesCount: 0,
        error: "Sesi login tidak ditemukan. Silakan login kembali.",
      };
    }

    const discordId = session.user.discordId;
    if (!discordId) {
      return {
        success: false,
        isInGuild: false,
        role: Role.GUEST,
        isAdmin: false,
        highestRole: null,
        otherRolesCount: 0,
        error: "Akun Discord ID tidak valid.",
      };
    }

    // 1. Fetch live member details from Discord API
    const memberDetails = await fetchDiscordGuildMember(discordId);
    const highestRole = memberDetails.isInGuild
      ? await getMemberHighestRole(memberDetails.roles)
      : null;
    const otherRolesCount = Math.max(0, memberDetails.roles.length - 1);

    // 2. Check Admin Role IDs configured in environment
    const adminRoleIds = (process.env.DISCORD_ADMIN_ROLE_IDS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    let hasAdminRole = memberDetails.roles.some((roleId) =>
      adminRoleIds.includes(roleId)
    );

    // Check if database has explicit ADMIN role
    const existingDbUser = await db.user.findUnique({
      where: { discordId },
      select: { role: true },
    });
    if (existingDbUser?.role === Role.ADMIN) {
      hasAdminRole = true;
    }

    let assignedRole: Role = Role.GUEST;
    if (hasAdminRole) {
      assignedRole = Role.ADMIN;
    } else if (memberDetails.isInGuild) {
      assignedRole = Role.MEMBER;
    } else {
      assignedRole = Role.GUEST;
    }

    const nowWIB = getWIBDate();

    // 3. Upsert user in Database with fresh role data
    await db.user.upsert({
      where: { discordId },
      create: {
        discordId,
        username: session.user.username || "user",
        displayName: session.user.displayName || session.user.name || "user",
        nickname: memberDetails.nickname || session.user.name || "user",
        email: session.user.email || undefined,
        image: session.user.image || undefined,
        isInGuild: memberDetails.isInGuild,
        guildRoles: memberDetails.roles,
        role: assignedRole,
        lastLoginAt: nowWIB,
        createdAt: nowWIB,
        updatedAt: nowWIB,
      },
      update: {
        nickname: memberDetails.nickname || undefined,
        isInGuild: memberDetails.isInGuild,
        guildRoles: memberDetails.roles,
        role: assignedRole,
        updatedAt: nowWIB,
      },
    });

    return {
      success: true,
      isInGuild: memberDetails.isInGuild,
      role: assignedRole,
      isAdmin: hasAdminRole,
      highestRole,
      otherRolesCount,
      message: memberDetails.isInGuild
        ? `Role Discord berhasil disinkronkan (${highestRole?.name || "Member"})`
        : "Status diperbarui: Anda belum bergabung di server Discord Bloom.",
    };
  } catch (err: any) {
    console.error("Error in syncUserRoleAction:", err);
    return {
      success: false,
      isInGuild: false,
      role: Role.GUEST,
      isAdmin: false,
      highestRole: null,
      otherRolesCount: 0,
      error: err?.message || "Gagal menyinkronkan role dari server.",
    };
  }
}

import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { authConfig } from "@/lib/auth.config";
import { db } from "@/lib/db";
import { fetchDiscordGuildMember, getMemberHighestRole } from "@/lib/discord";
import { Role } from "@prisma/client";
import type { HighestRoleInfo } from "@/lib/types";
import { getWIBDate } from "@/lib/utils";
import { logAdminActivity, logMemberActivity } from "@/lib/activity-logger";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
      authorization: {
        params: {
          scope: "identify email",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  events: {
    async signIn(message) {
      if (message.user) {
        const userId = message.user.id;
        const name =
          message.user.name || (message.user as any).username || "Member";
        const role = (message.user as any).role || "MEMBER";

        if (role === "ADMIN") {
          await logAdminActivity({
            userId,
            action: "ADMIN_LOGIN_DISCORD",
            details: `Admin berhasil login via Discord: @${name}`,
          });
        } else {
          await logMemberActivity({
            userId,
            action: "MEMBER_LOGIN",
            details: `Member berhasil login via Discord: @${name}`,
          });
        }
      }
    },
    async signOut(message) {
      if ("token" in message && message.token) {
        const userId =
          (message.token.id as string) ||
          (message.token.sub as string) ||
          undefined;
        const username =
          (message.token.username as string) ||
          (message.token.name as string) ||
          "user";
        const role = (message.token as any).role || "MEMBER";

        if (role === "ADMIN") {
          await logAdminActivity({
            userId,
            action: "ADMIN_LOGOUT",
            details: `Admin logout: @${username}`,
          });
        } else {
          await logMemberActivity({
            userId,
            action: "MEMBER_LOGOUT",
            details: `Member logout: @${username}`,
          });
        }
      }
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, profile, account, trigger }) {
      // 1. Initial OAuth Sign In
      if (account && profile) {
        const discordId = profile.id as string;
        const username = (profile.username as string) || "user";
        const displayName =
          (profile.global_name as string) ||
          (profile.name as string) ||
          username;
        const email = (profile.email as string) || null;
        const avatarUrl =
          (profile.image_url as string) ||
          (profile.avatar
            ? `https://cdn.discordapp.com/avatars/${discordId}/${profile.avatar}.png`
            : (profile.picture as string) || null);

        token.id = token.sub || discordId;
        token.discordId = discordId;
        token.username = username;
        token.displayName = displayName;
        token.email = email;
        token.image = avatarUrl;
      }

      // 2. Throttled Live Discord Role & Guild Sync (Every 10 minutes or on manual update trigger)
      const discordId = (token.discordId as string) || (token.sub as string);
      const shouldSync =
        trigger === "update" ||
        !token.lastRoleSyncAt ||
        Date.now() - ((token.lastRoleSyncAt as number) || 0) > 10 * 60 * 1000;

      if (discordId && shouldSync) {
        try {
          token.lastRoleSyncAt = Date.now();
          // Fetch live guild membership, server roles, and highest role directly from Discord API
          const memberDetails = await fetchDiscordGuildMember(discordId);
          const highestRole = memberDetails.isInGuild
            ? await getMemberHighestRole(memberDetails.roles)
            : null;
          const otherRolesCount = Math.max(0, memberDetails.roles.length - 1);

          // Verify Admin Role ID
          const adminRoleIds = (process.env.DISCORD_ADMIN_ROLE_IDS || "")
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean);

          const hasAdminRole = memberDetails.roles.some((roleId) =>
            adminRoleIds.includes(roleId)
          );

          let assignedRole: Role = Role.GUEST;
          if (hasAdminRole) {
            assignedRole = Role.ADMIN;
          } else if (memberDetails.isInGuild) {
            assignedRole = Role.MEMBER;
          } else {
            assignedRole = Role.GUEST;
          }

          const username = (token.username as string) || "user";
          const displayName = (token.displayName as string) || username;
          const effectiveNickname =
            memberDetails.nickname || displayName || username;
          const avatarUrl =
            (token.image as string) || (token.picture as string) || undefined;

          const nowWIB = getWIBDate();

          // Upsert/Update user in Neon PostgreSQL Database
          try {
            const dbUser = await db.user.upsert({
              where: { discordId },
              create: {
                discordId,
                username,
                displayName,
                nickname: effectiveNickname,
                email: (token.email as string) || undefined,
                image: avatarUrl,
                isInGuild: memberDetails.isInGuild,
                guildRoles: memberDetails.roles,
                role: assignedRole,
                lastLoginAt: nowWIB,
                createdAt: nowWIB,
                updatedAt: nowWIB,
              },
              update: {
                username,
                displayName,
                nickname: effectiveNickname,
                isInGuild: memberDetails.isInGuild,
                guildRoles: memberDetails.roles,
                role: assignedRole,
                updatedAt: nowWIB,
              },
            });

            token.id = dbUser.id;
            token.nickname =
              dbUser.customNickname || dbUser.nickname || effectiveNickname;
          } catch (dbErr) {
            console.error("DB upsert in jwt error:", dbErr);
            token.nickname = effectiveNickname;
          }

          token.discordId = discordId;
          token.isInGuild = memberDetails.isInGuild;
          token.role = assignedRole;
          token.isAdmin = hasAdminRole;
          token.guildRoles = memberDetails.roles;
          token.highestRole = highestRole;
          token.otherRolesCount = otherRolesCount;
        } catch (error) {
          console.error("Failed to refresh Discord roles during jwt:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string) || "";
        session.user.discordId = token.discordId as string | undefined;
        session.user.username = token.username as string | null | undefined;
        session.user.displayName = token.displayName as
          string | null | undefined;
        session.user.nickname = token.nickname as string | null | undefined;
        session.user.isInGuild = Boolean(token.isInGuild);
        session.user.role =
          (token.role as "GUEST" | "MEMBER" | "ADMIN" | "SUPER_ADMIN") ||
          "GUEST";
        session.user.isAdmin = Boolean(token.isAdmin);
        session.user.guildRoles = (token.guildRoles as string[]) || [];
        session.user.highestRole =
          (token.highestRole as HighestRoleInfo | null | undefined) || null;
        session.user.otherRolesCount =
          typeof token.otherRolesCount === "number" ? token.otherRolesCount : 0;
      }
      return session;
    },
  },
});

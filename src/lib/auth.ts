import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { db } from "@/lib/db";
import { fetchDiscordGuildMember, getMemberHighestRole } from "@/lib/discord";
import { Role } from "@prisma/client";
import type { HighestRoleInfo } from "@/lib/types";
import { getWIBDate } from "@/lib/utils";

export const { handlers, signIn, signOut, auth } = NextAuth({
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

        if (userId) {
          try {
            await db.activityLog.create({
              data: {
                userId,
                action: "USER_LOGOUT",
                details: `Logout: ${username}`,
                createdAt: getWIBDate(),
                updatedAt: getWIBDate(),
              },
            });
          } catch (error) {
            console.error("Failed to record logout in activityLog:", error);
          }
        }
      }
    },
  },
  callbacks: {
    async jwt({ token, profile, account }) {
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

        // Fetch guild membership, server roles, and highest role from Discord
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

        const effectiveNickname =
          memberDetails.nickname || displayName || username;

        const nowWIB = getWIBDate();

        // Upsert user in Neon PostgreSQL Database
        try {
          const dbUser = await db.user.upsert({
            where: { discordId },
            create: {
              discordId,
              username,
              displayName,
              nickname: effectiveNickname,
              email: email || undefined,
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
              email: email || undefined,
              image: avatarUrl,
              isInGuild: memberDetails.isInGuild,
              guildRoles: memberDetails.roles,
              role: assignedRole,
              lastLoginAt: nowWIB,
              updatedAt: nowWIB,
            },
          });

          // Record login audit log
          await db.activityLog.create({
            data: {
              userId: dbUser.id,
              action: "USER_LOGIN",
              details: `Login via Discord: ${username} (Role: ${assignedRole}, inGuild: ${memberDetails.isInGuild})`,
              createdAt: nowWIB,
              updatedAt: nowWIB,
            },
          });

          token.id = dbUser.id;
          token.discordId = discordId;
          token.username = username;
          token.displayName = displayName;
          token.nickname =
            dbUser.customNickname || dbUser.nickname || effectiveNickname;
          token.isInGuild = memberDetails.isInGuild;
          token.role = assignedRole;
          token.isAdmin = hasAdminRole;
          token.guildRoles = memberDetails.roles;
          token.highestRole = highestRole;
          token.otherRolesCount = otherRolesCount;
        } catch (error) {
          console.error(
            "Failed to upsert user to database during login:",
            error
          );
          token.discordId = discordId;
          token.username = username;
          token.displayName = displayName;
          token.nickname = effectiveNickname;
          token.isInGuild = memberDetails.isInGuild;
          token.role = assignedRole;
          token.isAdmin = hasAdminRole;
          token.guildRoles = memberDetails.roles;
          token.highestRole = highestRole;
          token.otherRolesCount = otherRolesCount;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const discordId = token.discordId as string | undefined;

        let isInGuild = Boolean(token.isInGuild);
        let guildRoles = (token.guildRoles as string[]) || [];
        let highestRole =
          (token.highestRole as HighestRoleInfo | null | undefined) || null;
        let otherRolesCount =
          typeof token.otherRolesCount === "number" ? token.otherRolesCount : 0;
        let role =
          (token.role as "GUEST" | "MEMBER" | "ADMIN" | "SUPER_ADMIN") ||
          "GUEST";
        let isAdmin = Boolean(token.isAdmin);

        // Fetch fresh member roles & highest role live from Discord
        if (discordId) {
          try {
            const freshMember = await fetchDiscordGuildMember(discordId);
            isInGuild = freshMember.isInGuild;
            guildRoles = freshMember.roles;

            if (isInGuild) {
              highestRole = await getMemberHighestRole(freshMember.roles);
              otherRolesCount = Math.max(0, freshMember.roles.length - 1);

              const adminRoleIds = (process.env.DISCORD_ADMIN_ROLE_IDS || "")
                .split(",")
                .map((id) => id.trim())
                .filter(Boolean);

              const hasAdminRole = freshMember.roles.some((roleId) =>
                adminRoleIds.includes(roleId)
              );

              isAdmin = hasAdminRole;
              role = hasAdminRole ? Role.ADMIN : Role.MEMBER;
            } else {
              highestRole = null;
              otherRolesCount = 0;
              isAdmin = false;
              role = Role.GUEST;
            }
          } catch {
            // Keep existing token values if network fails
          }
        }

        session.user.id = (token.id as string) || (token.sub as string) || "";
        session.user.discordId = discordId;
        session.user.username = token.username as string | null | undefined;
        session.user.displayName = token.displayName as
          string | null | undefined;
        session.user.nickname = token.nickname as string | null | undefined;
        session.user.isInGuild = isInGuild;
        session.user.role = role;
        session.user.isAdmin = isAdmin;
        session.user.guildRoles = guildRoles;
        session.user.highestRole = highestRole;
        session.user.otherRolesCount = otherRolesCount;
      }
      return session;
    },
  },
});

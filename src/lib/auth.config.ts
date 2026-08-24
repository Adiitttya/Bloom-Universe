import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        if ("isAdmin" in user) (token as any).isAdmin = user.isAdmin;
        if ("role" in user) (token as any).role = user.role;
        if ("discordId" in user) (token as any).discordId = user.discordId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id || token.sub || "";
        (session.user as any).discordId = token.discordId;
        (session.user as any).isAdmin = Boolean((token as any).isAdmin);
        (session.user as any).role =
          (token as any).role || ((token as any).isAdmin ? "ADMIN" : "GUEST");
        (session.user as any).guildRoles = (token as any).guildRoles || [];
        (session.user as any).highestRole = (token as any).highestRole || null;
        (session.user as any).otherRolesCount =
          (token as any).otherRolesCount || 0;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user as any;
      const isLoggedIn = !!user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnAdmin) {
        if (!isLoggedIn) {
          const loginUrl = new URL("/", nextUrl.origin);
          loginUrl.searchParams.set("login", "true");
          return Response.redirect(loginUrl);
        }
        return true;
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/forbidden",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = Boolean(auth?.user?.isAdmin);
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnAdmin) {
        if (!isLoggedIn) {
          const loginUrl = new URL("/", nextUrl.origin);
          loginUrl.searchParams.set("login", "true");
          return Response.redirect(loginUrl);
        }
        if (!isAdmin) {
          return Response.redirect(new URL("/forbidden", nextUrl.origin));
        }
        return true;
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

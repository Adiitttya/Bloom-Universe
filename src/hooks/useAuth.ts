"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user || null;
  const isAdmin = Boolean(user?.isAdmin);
  const isInGuild = Boolean(user?.isInGuild);

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isInGuild,
    signIn: () => signIn("discord"),
    signOut: () => signOut({ callbackUrl: "/" }),
  };
}

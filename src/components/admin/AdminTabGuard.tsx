"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { lockAdminAction } from "@/lib/auth/admin-actions";

const SESSION_KEY = "admin-tab-verified";

/**
 * Client-side guard that ensures admin verification is tied to the current tab.
 *
 * Uses sessionStorage (per-tab, cleared on tab close) to track whether
 * the admin passcode was verified in THIS specific tab. If the flag is missing
 * (new tab or tab was closed and reopened), the cookie is cleared server-side
 * and the user is redirected back to the passcode gate.
 */
export function AdminTabGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const tabFlag = sessionStorage.getItem(SESSION_KEY);
    if (tabFlag === "true") {
      setIsVerified(true);
    } else {
      // No tab-level flag → clear the server cookie and redirect to passcode gate
      lockAdminAction().catch(() => {
        // lockAdminAction calls redirect() internally, which throws in Next.js
        // This catch is expected behavior
      });
      setIsVerified(false);
    }
  }, [router]);

  // Show nothing while checking (prevents flash of content)
  if (isVerified === null || isVerified === false) {
    return null;
  }

  return <>{children}</>;
}

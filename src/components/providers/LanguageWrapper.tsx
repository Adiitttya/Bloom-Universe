"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AuthModalProvider } from "@/lib/auth/AuthModalContext";
import { ToastProvider } from "@/components/ui/Toast";
import { LoginModal } from "@/components/auth/LoginModal";
import { InteractionTracker } from "@/components/analytics/InteractionTracker";
import type { Locale } from "@/lib/i18n/dictionaries";

export function LanguageWrapper({
  children,
  session,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  session?: Session | null;
  initialLocale?: Locale;
}) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <LanguageProvider initialLocale={initialLocale}>
        <ToastProvider>
          <AuthModalProvider>
            {children}
            <LoginModal />
            <InteractionTracker />
          </AuthModalProvider>
        </ToastProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}

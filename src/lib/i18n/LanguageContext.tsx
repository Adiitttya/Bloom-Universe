"use client";

import * as React from "react";
import { dictionaries, type Locale } from "./dictionaries";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: typeof dictionaries.id;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(
  undefined
);

const STORAGE_KEY = "bloom_language";

export function LanguageProvider({
  children,
  initialLocale = "id",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);

  const setLocale = React.useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.cookie = `${STORAGE_KEY}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore storage errors
    }
  }, []);

  const dict = dictionaries[locale] || dictionaries.id;

  const value = React.useMemo(
    () => ({
      locale,
      setLocale,
      dict,
    }),
    [locale, setLocale, dict]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

"use client";

import * as React from "react";

interface AuthModalContextType {
  isOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthModalContext = React.createContext<AuthModalContextType | undefined>(
  undefined
);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  // Check URL query param "?login=true" only after mounting to prevent SSR hydration mismatch
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "true") {
        setIsOpen(true);
      }
    } catch {}
  }, []);

  const openLoginModal = React.useCallback(() => setIsOpen(true), []);
  const closeLoginModal = React.useCallback(() => setIsOpen(false), []);

  return (
    <AuthModalContext.Provider
      value={{ isOpen, openLoginModal, closeLoginModal }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = React.useContext(AuthModalContext);
  if (!context) {
    throw new Error("useLoginModal must be used within an AuthModalProvider");
  }
  return context;
}

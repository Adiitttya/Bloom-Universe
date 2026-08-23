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

function getInitialLoginModalOpen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("login") === "true";
  } catch {
    return false;
  }
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(getInitialLoginModalOpen);

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

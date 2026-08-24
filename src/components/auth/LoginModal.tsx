"use client";

import * as React from "react";
import { X } from "lucide-react";
import { signIn } from "next-auth/react";
import { DiscordIcon } from "@/components/ui/SocialIcons";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useLoginModal } from "@/lib/auth/AuthModalContext";

export function LoginModal() {
  const { isOpen, closeLoginModal } = useLoginModal();
  const { dict } = useLanguage();
  const [isLoading, setIsLoading] = React.useState(false);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeLoginModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeLoginModal]);

  if (!isOpen) return null;

  const handleDiscordLogin = async () => {
    try {
      setIsLoading(true);
      await signIn("discord", { callbackUrl: "/" });
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md transition-all duration-300 select-none"
      onClick={closeLoginModal}
    >
      <div
        className="animate-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-[2.5rem] border-4 border-white bg-white p-7 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Consistent Rounded-XL Close Button */}
        <button
          type="button"
          onClick={closeLoginModal}
          aria-label="Tutup"
          className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 active:scale-95 sm:top-6 sm:right-6"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 3D Headline */}
        <h2 className="font-heading mt-2 text-2xl font-black tracking-tight text-[#1e1b4b] sm:text-3xl">
          {dict.login.title}
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-sm leading-relaxed font-bold text-slate-600 sm:text-base">
          {dict.login.subtitle}
        </p>

        {/* 3D Discord Login Button */}
        <div className="mt-7 w-full">
          <Button
            variant="discord"
            size="lg"
            isLoading={isLoading}
            onClick={handleDiscordLogin}
            className="w-full gap-3 py-3.5 text-sm font-black tracking-wide shadow-xl sm:py-4 sm:text-base"
          >
            <DiscordIcon size={22} />
            <span>{dict.login.loginButton}</span>
          </Button>
        </div>

        {/* Small Footer Notice */}
        <div className="mt-6 border-t-2 border-slate-100 pt-4 text-xs font-bold text-slate-400">
          Bloom Universe &bull; Community Portal
        </div>
      </div>
    </div>
  );
}

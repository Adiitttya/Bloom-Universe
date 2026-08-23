"use client";

import * as React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="relative inline-flex h-8 w-[84px] items-center rounded-full border-2 border-slate-200 bg-slate-100 p-0.5 shadow-inner select-none">
      {/* Sliding Active Pill Background */}
      <div
        className={`absolute top-0.5 bottom-0.5 w-[38px] rounded-full bg-[#ffc700] shadow-[0_2px_0_#d9a300] transition-all duration-200 ease-out ${
          locale === "en" ? "left-0.5" : "left-[41px]"
        }`}
      />

      {/* EN Button */}
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-label="Switch to English"
        className={`font-heading relative z-10 flex h-full w-1/2 cursor-pointer items-center justify-center text-xs font-black transition-colors ${
          locale === "en"
            ? "text-[#452203]"
            : "text-slate-500 hover:text-[#1e1b4b]"
        }`}
      >
        EN
      </button>

      {/* ID Button */}
      <button
        type="button"
        onClick={() => setLocale("id")}
        aria-label="Ganti ke Bahasa Indonesia"
        className={`font-heading relative z-10 flex h-full w-1/2 cursor-pointer items-center justify-center text-xs font-black transition-colors ${
          locale === "id"
            ? "text-[#452203]"
            : "text-slate-500 hover:text-[#1e1b4b]"
        }`}
      >
        ID
      </button>
    </div>
  );
}

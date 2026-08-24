"use client";

import * as React from "react";
import { AlertTriangle, Trash2, LogOut, Info, X, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  icon?: "logout" | "trash" | "warning" | "info";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "danger",
  icon,
  loading = false,
}: ConfirmModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  // Determine icon dynamically or by prop
  const getIconConfig = () => {
    const lowerTitle = (title || "").toLowerCase();
    const isLogout =
      icon === "logout" ||
      lowerTitle.includes("logout") ||
      lowerTitle.includes("keluar");
    const isDelete =
      icon === "trash" ||
      lowerTitle.includes("hapus") ||
      lowerTitle.includes("delete");

    if (isLogout) {
      return {
        component: LogOut,
        badgeStyle:
          "border-rose-300 bg-rose-50 text-rose-600 shadow-[0_3px_0_#fca5a5]",
      };
    }

    if (isDelete || variant === "danger") {
      return {
        component: Trash2,
        badgeStyle:
          "border-red-300 bg-red-50 text-red-500 shadow-[0_3px_0_#fca5a5]",
      };
    }

    if (icon === "warning" || variant === "warning") {
      return {
        component: AlertTriangle,
        badgeStyle:
          "border-[#ffc700] bg-[#fff8d6] text-[#b38600] shadow-[0_3px_0_#ffc700]",
      };
    }

    return {
      component: Info,
      badgeStyle:
        "border-[#2baee2] bg-[#e0f4fc] text-[#2baee2] shadow-[0_3px_0_#2baee2]",
    };
  };

  const iconConfig = getIconConfig();
  const IconComponent = iconConfig.component;
  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => !loading && onClose()}
        className="animate-in fade-in fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      />

      {/* Modal Card with Cartoon 3D Aesthetics */}
      <div className="animate-in zoom-in-95 fade-in relative w-full max-w-md overflow-hidden rounded-[2.5rem] border-4 border-white bg-white p-6 shadow-[0_12px_0_#cbd5e1,0_25px_40px_rgba(0,0,0,0.18)] duration-200 sm:p-8">
        {/* Top Header Icon */}
        <div className="flex items-center justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 shadow-xs ${iconConfig.badgeStyle}`}
          >
            <IconComponent className="h-6 w-6" />
          </div>

          {/* Consistent Rounded-XL Close Button */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Tutup"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 active:scale-95 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4">
          <h3 className="font-heading text-lg font-black text-[#1e1b4b] sm:text-xl">
            {title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed font-bold text-slate-500 sm:text-sm">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="font-heading cursor-pointer rounded-2xl border-2 border-slate-200 bg-slate-100 px-5 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-200 active:scale-95 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`font-heading flex cursor-pointer items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-black text-white transition active:translate-y-0.5 disabled:opacity-50 ${
              isDanger
                ? "border-2 border-red-400 bg-red-500 shadow-[0_4px_0_#b91c1c] hover:bg-red-600"
                : "border-2 border-[#e6b400] bg-[#ffc700] text-[#1e1b4b] shadow-[0_4px_0_#cc9e00] hover:bg-[#ffcf1a]"
            }`}
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

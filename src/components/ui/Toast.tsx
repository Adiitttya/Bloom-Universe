"use client";

import * as React from "react";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  isExiting?: boolean;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, "id" | "isExiting">) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismissToast = React.useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );

    // Remove from array after animation finishes (300ms)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const showToast = React.useCallback(
    (toast: Omit<ToastItem, "id" | "isExiting">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { ...toast, id, isExiting: false };
      setToasts((prev) => [...prev, newToast]);

      const duration = toast.duration ?? 4000;
      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const success = React.useCallback(
    (message: string, title?: string) => {
      showToast({ type: "success", title: title || "Berhasil!", message });
    },
    [showToast]
  );

  const error = React.useCallback(
    (message: string, title?: string) => {
      showToast({ type: "error", title: title || "Gagal!", message });
    },
    [showToast]
  );

  const info = React.useCallback(
    (message: string, title?: string) => {
      showToast({ type: "info", title: title || "Info", message });
    },
    [showToast]
  );

  const warning = React.useCallback(
    (message: string, title?: string) => {
      showToast({ type: "warning", title: title || "Perhatian", message });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, success, error, info, warning, dismissToast }}
    >
      {children}

      {/* Floating Bottom-Right Toast Container */}
      <aside
        aria-label="Notifications"
        className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-3 px-2 sm:right-6 sm:bottom-6 sm:px-0"
      >
        {toasts.map((t) => (
          <ToastCard
            key={t.id}
            toast={t}
            onDismiss={() => dismissToast(t.id)}
          />
        ))}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          container:
            "border-emerald-300 bg-white text-[#1e1b4b] shadow-[0_10px_0_#10b981,0_20px_25px_rgba(0,0,0,0.12)]",
          iconBadge: "bg-emerald-100 text-emerald-600 border-emerald-300",
          icon: CheckCircle2,
        };
      case "error":
        return {
          container:
            "border-red-300 bg-white text-[#1e1b4b] shadow-[0_10px_0_#ef4444,0_20px_25px_rgba(0,0,0,0.12)]",
          iconBadge: "bg-red-100 text-red-600 border-red-300",
          icon: AlertCircle,
        };
      case "warning":
        return {
          container:
            "border-[#ffc700] bg-white text-[#1e1b4b] shadow-[0_10px_0_#d9a300,0_20px_25px_rgba(0,0,0,0.12)]",
          iconBadge: "bg-[#fff8d6] text-[#b38600] border-[#ffc700]",
          icon: AlertTriangle,
        };
      case "info":
      default:
        return {
          container:
            "border-[#2baee2] bg-white text-[#1e1b4b] shadow-[0_10px_0_#1b8ebc,0_20px_25px_rgba(0,0,0,0.12)]",
          iconBadge: "bg-[#e0f4fc] text-[#2baee2] border-[#2baee2]",
          icon: Info,
        };
    }
  };

  const styles = getStyles();
  const Icon = styles.icon;
  const isVisible = mounted && !toast.isExiting;

  return (
    <div
      className={`pointer-events-auto relative flex w-full transform items-start gap-3 overflow-hidden rounded-[1.75rem] border-3 p-4 transition-all duration-300 ease-out ${
        isVisible
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : "translate-x-12 translate-y-4 scale-90 opacity-0"
      } ${styles.container}`}
    >
      {/* Icon Badge */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 shadow-xs ${styles.iconBadge}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Message Info */}
      <div className="min-w-0 flex-1 pt-0.5">
        {toast.title && (
          <h4 className="font-heading text-sm font-black tracking-tight text-[#1e1b4b]">
            {toast.title}
          </h4>
        )}
        <p className="text-xs leading-relaxed font-bold text-slate-600">
          {toast.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  Lock,
} from "lucide-react";
import { verifyAdminPasscodeAction } from "@/lib/auth/admin-actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SITE_CONFIG } from "@/lib/constants";
import type { UserSession } from "@/lib/types";

export function AdminSecurityCodeGate({ user }: { user: UserSession }) {
  const router = useRouter();
  const [passcode, setPasscode] = React.useState("");
  const [showPasscode, setShowPasscode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("Masukkan kode keamanan admin.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await verifyAdminPasscodeAction(passcode);
      if (res.success) {
        // Per-tab session flag — cleared when tab is closed
        sessionStorage.setItem("admin-tab-verified", "true");
        router.refresh();
      } else {
        setError(res.error || "Kode keamanan salah.");
      }
    } catch {
      setError("Terjadi kesalahan saat memverifikasi kode.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#2baee2] px-4 py-12">
      {/* Background Decorative Cloud Circles */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-white/20 blur-2xl" />

      <Card className="relative w-full max-w-md rounded-[2.5rem] border-4 border-white bg-white p-8 text-center shadow-[0_14px_0_#1b8ebc,0_25px_40px_rgba(0,0,0,0.15)]">
        {/* Header Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border-2 border-[#ffc700] bg-[#fff8d6] text-[#b38600] shadow-[0_4px_0_#ffc700]">
          <KeyRound className="h-8 w-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Role Admin Terverifikasi</span>
        </div>

        <h1 className="font-heading mt-3 text-2xl font-black text-[#1e1b4b]">
          Verifikasi Keamanan Tambahan
        </h1>

        <p className="mt-2 text-xs leading-relaxed font-bold text-slate-500">
          Untuk keamanan ganda (Double-Check), masukkan PIN / Kode Keamanan
          Admin {SITE_CONFIG.shortName} untuk membuka dashboard.
        </p>

        {/* User Card */}
        <div className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-[#f8fbff] p-3 text-left">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.nickname || user.username || "Admin"}
              width={40}
              height={40}
              className="rounded-xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2baee2] font-black text-white">
              {user.nickname?.[0] || "A"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-black text-[#1e1b4b]">
              {user.nickname || user.displayName || user.username}
            </p>
            <p className="text-[11px] font-bold text-slate-400">
              @{user.username || "admin"}
            </p>
          </div>
          <span className="shrink-0 rounded-lg bg-[#2baee2]/10 px-2 py-0.5 text-[10px] font-black text-[#2baee2]">
            ADMIN
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          <div>
            <label className="font-heading block text-xs font-black text-[#1e1b4b]">
              Kode Keamanan / Admin Passcode
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPasscode ? "text" : "password"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Masukkan Passcode Admin..."
                className="w-full rounded-2xl border-2 border-slate-200 bg-[#f8fbff] px-4 py-3 pr-11 text-sm font-bold text-[#1e1b4b] placeholder-slate-400 transition focus:border-[#2baee2] focus:bg-white focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                aria-label="Toggle password visibility"
                className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
              >
                {showPasscode ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-center text-xs font-bold text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="yellow"
            size="md"
            disabled={loading}
            className="w-full gap-2 py-3 text-sm font-black shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Buka Admin Dashboard</span>
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#2baee2]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Halaman Utama</span>
          </Link>
        </div>
      </Card>
    </div>
  );
}

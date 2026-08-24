"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, Home } from "lucide-react";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Main page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border-2 border-red-200 bg-red-50 text-red-500 shadow-sm">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h1 className="font-heading text-2xl font-black text-[#1e1b4b] sm:text-3xl">
        Terjadi Sedikit Kendala
      </h1>

      <p className="mt-2 max-w-md text-sm font-bold text-slate-500">
        Halaman mengalami gangguan sementara saat memuat data. Silakan coba muat
        ulang atau kembali ke beranda.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="btn-3d-yellow font-heading flex cursor-pointer items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black"
        >
          <RotateCw className="h-4 w-4" />
          <span>Coba Lagi</span>
        </button>

        <Link
          href="/"
          className="btn-3d-white font-heading flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black"
        >
          <Home className="h-4 w-4" />
          <span>Ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}

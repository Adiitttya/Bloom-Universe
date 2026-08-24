"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutTemplate,
  Save,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Compass,
} from "lucide-react";
import { updateHeroContent, type HeroFormData } from "./actions";
import { Button } from "@/components/ui/Button";
import { DiscordIcon } from "@/components/ui/SocialIcons";

import { useToast } from "@/components/ui/Toast";

interface HeroFormProps {
  initialData: HeroFormData;
}

export function HeroForm({ initialData }: HeroFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = React.useState<HeroFormData>(initialData);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateHeroContent(formData);
      if (res.success) {
        toast.success("Konten Hero Section berhasil disimpan dan diperbarui!");
        router.refresh();
      } else {
        toast.error("Gagal menyimpan perubahan. Periksa koneksi Anda.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Form & Live Preview Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Form Editor (7 cols) */}
        <div className="rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#2baee2] bg-[#e0f4fc] text-[#2baee2]">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-black text-[#1e1b4b]">
                Form Pengaturan Teks Hero
              </h2>
              <p className="text-xs font-bold text-slate-500">
                Atur headline utama dan link tombol yang muncul di awal halaman.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="font-heading block text-xs font-black text-[#1e1b4b]">
                Headline / Judul Utama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: Bloom Universe"
                className="mt-1.5 w-full rounded-2xl border-2 border-slate-200 bg-[#f8fbff] px-4 py-2.5 text-sm font-bold text-[#1e1b4b] transition focus:border-[#2baee2] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="font-heading block text-xs font-black text-[#1e1b4b]">
                Subtitle / Deskripsi Pengantar{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="subtitle"
                required
                rows={3}
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Deskripsi singkat komunitas..."
                className="mt-1.5 w-full rounded-2xl border-2 border-slate-200 bg-[#f8fbff] px-4 py-2.5 text-sm font-bold text-[#1e1b4b] transition focus:border-[#2baee2] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Primary CTA (Discord) */}
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-4">
              <p className="font-heading text-xs font-black text-amber-900">
                Tombol Aksi Utama (Primary CTA)
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600">
                    Teks Tombol
                  </label>
                  <input
                    type="text"
                    name="primaryCtaText"
                    required
                    value={formData.primaryCtaText}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1e1b4b] focus:border-[#ffc700] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600">
                    URL Link Tujuan
                  </label>
                  <input
                    type="url"
                    name="primaryCtaUrl"
                    required
                    value={formData.primaryCtaUrl}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1e1b4b] focus:border-[#ffc700] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="rounded-2xl border-2 border-sky-100 bg-sky-50/50 p-4">
              <p className="font-heading text-xs font-black text-sky-900">
                Tombol Aksi Sekunder (Secondary CTA)
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600">
                    Teks Tombol
                  </label>
                  <input
                    type="text"
                    name="secondaryCtaText"
                    required
                    value={formData.secondaryCtaText}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1e1b4b] focus:border-[#2baee2] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600">
                    URL / Anchor Link
                  </label>
                  <input
                    type="text"
                    name="secondaryCtaUrl"
                    required
                    value={formData.secondaryCtaUrl}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1e1b4b] focus:border-[#2baee2] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="yellow"
                size="md"
                disabled={loading}
                className="w-full gap-2 py-3.5 text-sm font-black shadow-md sm:w-auto sm:px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyimpan Perubahan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Simpan Konten Hero</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Preview Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-black text-[#1e1b4b]">
                Live Preview Tampilan
              </h3>
              <span className="text-[11px] font-bold text-slate-400">
                Simulasi Hero
              </span>
            </div>

            <div className="relative overflow-hidden rounded-3xl border-4 border-white bg-[#2baee2] p-6 text-white shadow-[0_10px_0_#1b8ebc,0_20px_25px_rgba(0,0,0,0.15)]">
              {/* Fake Mascot badge */}
              <div className="font-heading inline-block rounded-full bg-[#ffc700] px-3 py-0.5 text-[10px] font-black text-[#452203]">
                BLOOMUN!
              </div>

              <h2 className="font-heading mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
                {formData.title || "Bloom Universe"}
              </h2>

              <p className="mt-3 text-xs leading-relaxed font-bold text-sky-100">
                {formData.subtitle || "Hangout server & friendly community..."}
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  className="btn-3d-yellow font-heading flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black"
                >
                  <DiscordIcon size={16} />
                  <span>{formData.primaryCtaText || "Join Our Discord"}</span>
                </button>

                <button
                  type="button"
                  className="btn-3d-white font-heading flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black text-[#1e1b4b]"
                >
                  <Compass className="h-4 w-4 text-[#2baee2]" />
                  <span>
                    {formData.secondaryCtaText || "Explore Ecosystem"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

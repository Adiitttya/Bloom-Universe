"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Info,
  Save,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";
import {
  updateAboutSection,
  type AboutSectionFormData,
  type AboutPillarData,
} from "./actions";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface AboutFormProps {
  initialData: AboutSectionFormData;
}

const COLOR_OPTIONS = [
  { label: "Sky Blue", value: "blue", bg: "bg-[#e0f4fc] text-[#2baee2]" },
  { label: "Bloom Yellow", value: "yellow", bg: "bg-[#fff8d6] text-[#b38600]" },
  { label: "Purple Vibe", value: "purple", bg: "bg-[#f3ebff] text-[#7952bd]" },
];

export function AboutForm({ initialData }: AboutFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] =
    React.useState<AboutSectionFormData>(initialData);
  const [loading, setLoading] = React.useState(false);

  const handleMainChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePillarChange = (
    index: number,
    field: keyof AboutPillarData,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      const newPillars = [...prev.pillars];
      newPillars[index] = { ...newPillars[index], [field]: value };
      return { ...prev, pillars: newPillars };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateAboutSection(formData);
      if (res.success) {
        toast.success("Konten About Section & 3 Pilar berhasil disimpan!");
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
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section Header Card */}
        <div className="rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#7952bd] bg-[#f3ebff] text-[#7952bd]">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-black text-[#1e1b4b]">
                Teks Utama About Section
              </h2>
              <p className="text-xs font-bold text-slate-500">
                Judul dan deskripsi besar pengantar bagian Tentang Komunitas.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="font-heading block text-xs font-black text-[#1e1b4b]">
                Judul Bagian About <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleMainChange}
                placeholder="Contoh: Bukan Sekadar Server Biasa"
                className="mt-1.5 w-full rounded-2xl border-2 border-slate-200 bg-[#f8fbff] px-4 py-2.5 text-sm font-bold text-[#1e1b4b] transition focus:border-[#7952bd] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-heading block text-xs font-black text-[#1e1b4b]">
                Deskripsi Utama <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleMainChange}
                placeholder="Deskripsi tentang Bloom Universe..."
                className="mt-1.5 w-full rounded-2xl border-2 border-slate-200 bg-[#f8fbff] px-4 py-2.5 text-sm font-bold text-[#1e1b4b] transition focus:border-[#7952bd] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3 Pillars Editor Cards */}
        <div className="rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b-2 border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <Layers className="h-5 w-5 text-[#7952bd]" />
              <h3 className="font-heading text-base font-black text-[#1e1b4b]">
                3 Kartu Nilai & Pilar Komunitas
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400">
              3 Pilar Standar
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {formData.pillars.map((pillar, idx) => (
              <div
                key={pillar.id}
                className="relative flex flex-col justify-between rounded-2xl border-2 border-slate-200 bg-[#f8fbff] p-5 shadow-xs transition hover:border-[#7952bd]"
              >
                <div className="space-y-4">
                  {/* Top Bar: Number & Color Selector */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pillar.number}
                        onChange={(e) =>
                          handlePillarChange(idx, "number", e.target.value)
                        }
                        className="font-heading w-12 rounded-xl border border-slate-300 bg-white px-2 py-1 text-center text-sm font-black text-[#1e1b4b] focus:border-[#7952bd] focus:outline-none"
                        placeholder="01"
                      />
                      <span className="text-xs font-bold text-slate-400">
                        Pilar #{idx + 1}
                      </span>
                    </div>

                    <select
                      value={pillar.color}
                      onChange={(e) =>
                        handlePillarChange(idx, "color", e.target.value)
                      }
                      aria-label="Pilih Warna Pilar"
                      className="rounded-xl border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-700 focus:border-[#7952bd] focus:outline-none"
                    >
                      {COLOR_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600">
                      Judul Kartu
                    </label>
                    <input
                      type="text"
                      required
                      value={pillar.title}
                      onChange={(e) =>
                        handlePillarChange(idx, "title", e.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1e1b4b] focus:border-[#7952bd] focus:outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600">
                      Deskripsi
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={pillar.description}
                      onChange={(e) =>
                        handlePillarChange(idx, "description", e.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1e1b4b] focus:border-[#7952bd] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Bottom Bar: Visibility Toggle */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-[11px] font-bold text-slate-500">
                    Status Visibilitas
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handlePillarChange(idx, "isVisible", !pillar.isVisible)
                    }
                    className={`font-heading flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      pillar.isVisible
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {pillar.isVisible ? (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span>Tampil</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Sembunyi</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
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
                <span>Simpan Konten About</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

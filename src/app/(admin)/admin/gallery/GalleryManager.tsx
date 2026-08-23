"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Edit2,
  Check,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing-components";
import {
  deleteGalleryImage,
  toggleGalleryVisibility,
  updateGalleryImageAlt,
} from "./actions";
import { formatWIB } from "@/lib/utils";
import type { GalleryImage } from "@prisma/client";

export function GalleryManager({
  initialImages,
}: {
  initialImages: GalleryImage[];
}) {
  const router = useRouter();
  const [images, setImages] = React.useState<GalleryImage[]>(initialImages);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus foto "${name}" dari galeri?`)) return;

    setLoadingId(id);
    try {
      const res = await deleteGalleryImage(id);
      if (res.success) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        setMessage({
          type: "success",
          text: "Foto berhasil dihapus dari galeri!",
        });
        router.refresh();
      } else {
        setMessage({
          type: "error",
          text: res.error || "Gagal menghapus foto.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat menghapus foto.",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleVisibility = async (id: string, current: boolean) => {
    setLoadingId(id);
    try {
      await toggleGalleryVisibility(id, !current);
      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, isVisible: !current } : img
        )
      );
      router.refresh();
    } catch {
      setMessage({
        type: "error",
        text: "Gagal memperbarui status visibilitas.",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleStartEdit = (id: string, currentAlt: string) => {
    setEditingId(id);
    setEditValue(currentAlt);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editValue.trim()) return;

    setLoadingId(id);
    try {
      await updateGalleryImageAlt(id, editValue.trim());
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, alt: editValue.trim(), caption: editValue.trim() }
            : img
        )
      );
      setEditingId(null);
      setMessage({
        type: "success",
        text: "Judul foto berhasil diperbarui!",
      });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Gagal memperbarui judul foto." });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Alert Notification */}
      {message && (
        <div
          className={`flex items-center justify-between rounded-2xl border-2 p-4 text-sm font-bold shadow-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="cursor-pointer font-black hover:opacity-75"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Zone Card */}
      <div className="rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#2baee2] bg-[#e0f4fc] text-[#2baee2]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-black text-[#1e1b4b]">
              Upload Foto Baru (Uploadthing)
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Format JPG, PNG, WebP (Maksimal 4MB per file foto).
            </p>
          </div>
        </div>

        <div className="mt-6">
          <UploadDropzone
            endpoint="galleryImage"
            onClientUploadComplete={() => {
              setMessage({
                type: "success",
                text: "Foto berhasil diunggah ke Uploadthing & database!",
              });
              router.refresh();
            }}
            onUploadError={(error: Error) => {
              setMessage({
                type: "error",
                text: `Gagal upload: ${error.message}`,
              });
            }}
            appearance={{
              container:
                "border-2 border-dashed border-[#2baee2]/40 bg-[#f8fbff] rounded-3xl py-10 hover:bg-[#eef8ff] transition-all cursor-pointer",
              label: "text-[#1e1b4b] font-heading font-black text-base",
              allowedContent: "text-slate-500 text-xs font-bold mt-1",
              button:
                "btn-3d-yellow font-heading font-black px-6 py-2.5 rounded-full text-xs cursor-pointer shadow-md mt-4",
            }}
          />
        </div>
      </div>

      {/* Uploaded Gallery Grid List */}
      <div className="rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="h-5 w-5 text-[#2baee2]" />
            <h3 className="font-heading text-base font-black text-[#1e1b4b]">
              Daftar Foto Galeri Komunitas ({images.length})
            </h3>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-heading text-base font-bold text-slate-400">
              Belum ada foto galeri yang diunggah.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <div
                key={img.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 bg-white p-4 shadow-sm transition-all ${
                  img.isVisible
                    ? "border-slate-100"
                    : "border-amber-200 bg-amber-50/30 opacity-75"
                }`}
              >
                {/* Photo Preview Thumbnail */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {!img.isVisible && (
                    <div className="font-heading absolute top-2 right-2 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-black text-white shadow">
                      DISEMBUNYIKAN
                    </div>
                  )}
                </div>

                {/* Info & Title Edit Area */}
                <div className="mt-4 flex-1">
                  {editingId === img.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full rounded-lg border-2 border-[#2baee2] px-2.5 py-1 text-xs font-bold text-[#1e1b4b] focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(img.id)}
                        disabled={loadingId === img.id}
                        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-emerald-500 text-white shadow hover:bg-emerald-600"
                      >
                        {loadingId === img.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-heading text-sm font-bold text-[#1e1b4b]">
                          {img.alt}
                        </h4>
                        <p className="mt-1 text-[11px] font-bold text-slate-400">
                          {formatWIB(img.createdAt, "datetime")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(img.id, img.alt)}
                        aria-label="Edit title"
                        className="cursor-pointer text-slate-400 hover:text-[#2baee2]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions Bottom Bar */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleVisibility(img.id, img.isVisible)
                    }
                    disabled={loadingId === img.id}
                    className={`font-heading flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      img.isVisible
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }`}
                  >
                    {img.isVisible ? (
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

                  <button
                    type="button"
                    onClick={() => handleDelete(img.id, img.alt)}
                    disabled={loadingId === img.id}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-500 hover:text-white"
                    aria-label="Delete image"
                  >
                    {loadingId === img.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

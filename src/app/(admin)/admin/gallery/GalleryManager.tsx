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
  Upload,
  Link as LinkIcon,
  Plus,
  ImagePlus,
} from "lucide-react";
import {
  createGalleryImage,
  deleteGalleryImage,
  toggleGalleryVisibility,
  updateGalleryImageAlt,
} from "./actions";
import { formatWIB } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { BloomImage } from "@/components/ui/BloomImage";
import type { GalleryImage } from "@prisma/client";

interface StagedFile {
  id: string;
  file: File;
  preview: string;
  title: string;
  sizeText: string;
}

export function GalleryManager({
  initialImages,
}: {
  initialImages: GalleryImage[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [images, setImages] = React.useState<GalleryImage[]>(initialImages);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  // Staged Upload Files Queue
  const [stagedFiles, setStagedFiles] = React.useState<StagedFile[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Manual URL form state
  const [showManualForm, setShowManualForm] = React.useState(false);
  const [manualUrl, setManualUrl] = React.useState("");
  const [manualAlt, setManualAlt] = React.useState("");
  const [isSubmittingManual, setIsSubmittingManual] = React.useState(false);

  // Custom Delete Confirm State
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Sync state if initialImages changes
  React.useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  // Clean up object URLs when stagedFiles changes or unmounts
  React.useEffect(() => {
    return () => {
      stagedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [stagedFiles]);

  // Helper format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Process chosen files into staging queue
  const handleAddFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newStaged: StagedFile[] = [];
    const maxFiles = 6;
    const currentCount = stagedFiles.length;

    for (let i = 0; i < files.length; i++) {
      if (currentCount + newStaged.length >= maxFiles) {
        toast.warning("Maksimal 6 gambar dalam satu kali upload antrean.");
        break;
      }

      const file = files[i];

      // Check file size (max 4MB)
      if (file.size > 4 * 1024 * 1024) {
        toast.error(`File "${file.name}" melebihi ukuran maksimal 4MB.`);
        continue;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error(`File "${file.name}" bukan format gambar yang didukung.`);
        continue;
      }

      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ");

      newStaged.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        title: cleanTitle,
        sizeText: formatFileSize(file.size),
      });
    }

    if (newStaged.length > 0) {
      setStagedFiles((prev) => [...prev, ...newStaged]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove single file from staging queue
  const handleRemoveStagedFile = (id: string) => {
    setStagedFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  // Clear all staged files
  const handleClearAllStaged = () => {
    stagedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    setStagedFiles([]);
    setUploadProgress(0);
    setIsUploading(false);
  };

  // Update title of single staged file
  const handleUpdateStagedTitle = (id: string, newTitle: string) => {
    setStagedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, title: newTitle } : f))
    );
  };

  // Cancel in-progress upload
  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    handleClearAllStaged();
    toast.info("Proses upload dibatalkan.");
  };

  // Execute Upload via Fast Internal API /api/upload
  const handleExecuteUpload = async () => {
    if (stagedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(15);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const formData = new FormData();
      stagedFiles.forEach((staged) => {
        formData.append("files", staged.file);
        formData.append("titles", staged.title);
      });

      // Progress animation ticker
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 150);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (result.success && Array.isArray(result.images)) {
        const newImages: GalleryImage[] = result.images;
        setImages((prev) => {
          const filteredNew = newImages.filter(
            (n) =>
              !prev.some(
                (existing) => existing.id === n.id || existing.url === n.url
              )
          );
          return [...filteredNew, ...prev];
        });

        toast.success(
          newImages.length > 1
            ? `${newImages.length} foto baru berhasil ditambahkan ke galeri!`
            : "Foto baru berhasil ditambahkan ke galeri!"
        );

        handleClearAllStaged();
        router.refresh();
      } else {
        toast.error(result.error || "Gagal mengunggah foto.");
        setIsUploading(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Upload aborted by user");
        return;
      }
      console.error("Upload error:", err);
      toast.error("Terjadi kendala saat mengunggah foto.");
      setIsUploading(false);
    }
  };

  // Handle manual URL submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) {
      toast.error("Silakan masukkan URL gambar.");
      return;
    }

    setIsSubmittingManual(true);
    try {
      const res = await createGalleryImage({
        url: manualUrl.trim(),
        alt: manualAlt.trim() || "Bloom Gallery Photo",
      });

      if (res.success && res.image) {
        setImages((prev) => [res.image!, ...prev]);
        setManualUrl("");
        setManualAlt("");
        setShowManualForm(false);
        toast.success("Foto baru berhasil ditambahkan ke galeri!");
        router.refresh();
      } else {
        toast.error(res.error || "Gagal menambahkan foto.");
      }
    } catch {
      toast.error("Terjadi kendala saat menyimpan foto.");
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await deleteGalleryImage(deleteTarget.id);
      if (res.success) {
        setImages((prev) => prev.filter((img) => img.id !== deleteTarget.id));
        toast.success(
          `Foto "${deleteTarget.name}" berhasil dihapus dari galeri.`
        );
        router.refresh();
      } else {
        toast.error(res.error || "Gagal menghapus foto.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menghapus foto.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
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
      toast.info(
        !current
          ? "Foto sekarang ditampilkan di web."
          : "Foto berhasil disembunyikan."
      );
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui status visibilitas.");
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
      toast.success("Judul foto berhasil diperbarui!");
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui judul foto.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload & Staging Zone Card */}
      <div className="rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#2baee2] bg-[#e0f4fc] text-[#2baee2]">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-black text-[#1e1b4b]">
                Upload Foto Galeri
              </h2>
              <p className="text-xs font-bold text-slate-500">
                Pilih satu atau beberapa foto (Format JPG, PNG, WebP — Maks. 4MB
                per file).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowManualForm(!showManualForm)}
            className="font-heading flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-100 active:scale-95"
          >
            <LinkIcon className="h-4 w-4 text-[#2baee2]" />
            <span>
              {showManualForm ? "Tutup Form Link" : "Tambah via Link / URL"}
            </span>
          </button>
        </div>

        {/* Optional Manual URL Input Drawer */}
        {showManualForm && (
          <form
            onSubmit={handleManualSubmit}
            className="animate-in fade-in mt-5 rounded-2xl border-2 border-dashed border-[#2baee2]/40 bg-[#f8fbff] p-4 duration-200 sm:p-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="font-heading block text-xs font-black text-[#1e1b4b]">
                  URL Gambar (Direct Image Link) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://... atau /uploads/..."
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-[#1e1b4b] focus:border-[#2baee2] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-heading block text-xs font-black text-[#1e1b4b]">
                  Judul / Caption Foto
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bloom Gathering 2026"
                  value={manualAlt}
                  onChange={(e) => setManualAlt(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-[#1e1b4b] focus:border-[#2baee2] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingManual}
                className="font-heading btn-3d-yellow flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-xs font-black"
              >
                {isSubmittingManual ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>Simpan Foto ke Galeri</span>
              </button>
            </div>
          </form>
        )}

        {/* File Picker & Drag-and-Drop Area */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple
          onChange={(e) => handleAddFiles(e.target.files)}
          className="hidden"
          id="gallery-file-input"
        />

        {stagedFiles.length === 0 ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleAddFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-4 py-12 text-center transition-all ${
              isDragOver
                ? "scale-[1.01] border-[#2baee2] bg-[#e0f4fc]/60"
                : "border-[#2baee2]/40 bg-[#f8fbff] hover:bg-[#eef8ff]"
            }`}
          >
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-3xl border-2 border-[#2baee2]/40 bg-white text-[#2baee2] shadow-xs">
              <ImagePlus className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-base font-black text-[#1e1b4b]">
              Pilih atau Tarik Foto ke Sini
            </h3>
            <p className="mt-1 text-xs font-bold text-slate-500">
              Bisa pilih beberapa foto sekaligus (Maksimal 6 foto, 4MB per
              file).
            </p>
            <button
              type="button"
              className="font-heading btn-3d-yellow mt-4 flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-black"
            >
              <Plus className="h-4 w-4" />
              <span>Pilih Gambar dari Perangkat</span>
            </button>
          </div>
        ) : (
          /* Staged Files Preview List (With Cancel and Confirm Upload) */
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-heading text-xs font-black text-[#1e1b4b]">
                  Antrean Upload ({stagedFiles.length} Foto Dipilih)
                </span>
                <span className="hidden text-[11px] font-bold text-slate-400 sm:inline">
                  — Periksa atau beri judul sebelum diunggah
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    {/* Upload Progress Indicator Badge */}
                    <div className="flex items-center gap-2 rounded-xl border-2 border-[#2baee2] bg-[#e0f4fc] px-3.5 py-1.5 shadow-2xs">
                      <Loader2 className="h-4 w-4 animate-spin text-[#2baee2]" />
                      <span className="font-heading text-xs font-black text-[#1e1b4b]">
                        Mengunggah... {uploadProgress}%
                      </span>
                      <div className="h-2 w-14 overflow-hidden rounded-full border border-[#2baee2]/30 bg-white">
                        <div
                          className="h-full bg-[#2baee2] transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Batal Unggah Button */}
                    <button
                      type="button"
                      onClick={handleCancelUpload}
                      className="font-heading flex cursor-pointer items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100 active:scale-95"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Batal Unggah</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="font-heading flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5 text-[#2baee2]" />
                      <span>Tambah Lagi</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleClearAllStaged}
                      className="font-heading flex items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Batal Semua</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExecuteUpload}
                      className="font-heading btn-3d-yellow flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-black shadow-sm transition active:scale-95"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Unggah {stagedFiles.length} Foto Sekarang</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Grid of staged file items */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stagedFiles.map((staged, idx) => (
                <div
                  key={staged.id}
                  className="relative flex items-start gap-3 rounded-2xl border-2 border-slate-100 bg-[#f8fbff] p-3 shadow-2xs transition hover:border-[#2baee2]/50"
                >
                  {/* Local Thumbnail Preview */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-200">
                    <Image
                      src={staged.preview}
                      alt={staged.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute right-0 bottom-0 left-0 bg-black/60 py-0.5 text-center text-[9px] font-bold text-white">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Info and Title Input */}
                  <div className="min-w-0 flex-1 pr-6">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-xs font-bold text-slate-400">
                        {staged.sizeText}
                      </p>
                    </div>
                    <label className="mt-1 block text-[10px] font-black tracking-wider text-slate-500 uppercase">
                      Judul / Alt Text:
                    </label>
                    <input
                      type="text"
                      value={staged.title}
                      disabled={isUploading}
                      onChange={(e) =>
                        handleUpdateStagedTitle(staged.id, e.target.value)
                      }
                      placeholder="Judul foto..."
                      className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-[#1e1b4b] focus:border-[#2baee2] focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  {/* Cancel / Remove single file button */}
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStagedFile(staged.id)}
                      aria-label="Batalkan foto ini"
                      title="Batalkan foto ini"
                      className="absolute top-2.5 right-2.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white active:scale-95"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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
                  <BloomImage
                    src={img.url}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    showShimmerIcon
                    quality={75}
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {!img.isVisible && (
                    <div className="font-heading absolute top-2 right-2 z-20 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-black text-white shadow">
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
                    onClick={() =>
                      setDeleteTarget({ id: img.id, name: img.alt })
                    }
                    disabled={loadingId === img.id}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-500 hover:text-white"
                    aria-label="Delete image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Playful Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Hapus Foto Galeri?"
        description={`Apakah Anda yakin ingin menghapus foto "${deleteTarget?.name}" dari galeri komunitas? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus Foto"
        cancelText="Batal"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}

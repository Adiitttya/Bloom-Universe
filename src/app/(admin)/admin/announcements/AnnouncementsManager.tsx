"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  Megaphone,
  Radio,
  ExternalLink,
} from "lucide-react";
import {
  createAnnouncement,
  toggleAnnouncementActive,
  updateAnnouncement,
  deleteAnnouncement,
} from "./actions";
import { Button } from "@/components/ui/Button";
import { formatWIB } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { Announcement } from "@prisma/client";

interface AnnouncementsManagerProps {
  initialAnnouncements: Announcement[];
}

export function AnnouncementsManager({
  initialAnnouncements,
}: AnnouncementsManagerProps) {
  const router = useRouter();
  const toast = useToast();
  const [announcements, setAnnouncements] =
    React.useState<Announcement[]>(initialAnnouncements);
  const [newMessage, setNewMessage] = React.useState("");
  const [newLinkText, setNewLinkText] = React.useState("");
  const [newLinkUrl, setNewLinkUrl] = React.useState("");
  const [newIsActive, setNewIsActive] = React.useState(true);
  const [creating, setCreating] = React.useState(false);

  // Edit State
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editMessage, setEditMessage] = React.useState("");
  const [editLinkText, setEditLinkText] = React.useState("");
  const [editLinkUrl, setEditLinkUrl] = React.useState("");

  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  // Custom Delete Confirm State
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    message: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await deleteAnnouncement(deleteTarget.id);
      if (res.success) {
        setAnnouncements((prev) =>
          prev.filter((a) => a.id !== deleteTarget.id)
        );
        toast.success("Pengumuman berhasil dihapus.");
        router.refresh();
      } else {
        toast.error(res.error || "Gagal menghapus.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menghapus data.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setCreating(true);

    try {
      const res = await createAnnouncement({
        message: newMessage,
        linkText: newLinkText || undefined,
        linkUrl: newLinkUrl || undefined,
        isActive: newIsActive,
      });

      if (res.success && res.announcement) {
        setAnnouncements((prev) => {
          const updated = newIsActive
            ? prev.map((a) => ({ ...a, isActive: false }))
            : prev;
          return [res.announcement, ...updated];
        });
        toast.success(
          newIsActive
            ? "Pengumuman berhasil dibuat dan dipasang di banner utama!"
            : "Pengumuman berhasil disimpan!"
        );
        setNewMessage("");
        setNewLinkText("");
        setNewLinkUrl("");
        router.refresh();
      } else {
        toast.error("Gagal membuat pengumuman.");
      }
    } catch {
      toast.error("Terjadi kendala saat menyimpan. Silakan coba lagi.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    setLoadingId(id);
    try {
      await toggleAnnouncementActive(id, !current);
      setAnnouncements((prev) =>
        prev.map((a) => {
          if (a.id === id) return { ...a, isActive: !current };
          // If turning this one on, turn others off
          if (!current) return { ...a, isActive: false };
          return a;
        })
      );
      toast.info(
        !current
          ? "Pengumuman diaktifkan di banner utama."
          : "Pengumuman telah dinonaktifkan."
      );
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui status pengumuman.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleStartEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setEditMessage(announcement.message);
    setEditLinkText(announcement.linkText || "");
    setEditLinkUrl(announcement.linkUrl || "");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editMessage.trim()) return;

    setLoadingId(id);
    try {
      await updateAnnouncement(id, {
        message: editMessage,
        linkText: editLinkText || undefined,
        linkUrl: editLinkUrl || undefined,
      });

      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                message: editMessage,
                linkText: editLinkText || null,
                linkUrl: editLinkUrl || null,
              }
            : a
        )
      );
      setEditingId(null);
      toast.success("Pengumuman berhasil diperbarui!");
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui teks pengumuman.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Announcement Card */}
      <div className="rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#ffc700] bg-[#fff8d6] text-[#b38600]">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-black text-[#1e1b4b]">
              Buat Banner Pengumuman Baru
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Pesan akan tampil di bagian paling atas halaman utama website.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="font-heading block text-xs font-black text-[#1e1b4b]">
              Pesan Pengumuman <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Contoh: 🎉 Event Tournament Valorant Weekend ini! Daftarkan squad-mu sekarang..."
              className="mt-1.5 w-full rounded-2xl border-2 border-slate-200 bg-[#f8fbff] px-4 py-2.5 text-sm font-bold text-[#1e1b4b] transition focus:border-[#ffc700] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600">
                Teks Link Tambahan (Opsional)
              </label>
              <input
                type="text"
                value={newLinkText}
                onChange={(e) => setNewLinkText(e.target.value)}
                placeholder="Contoh: Daftar Disini"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1e1b4b] focus:border-[#ffc700] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600">
                URL Link (Opsional)
              </label>
              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1e1b4b] focus:border-[#ffc700] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={newIsActive}
                onChange={(e) => setNewIsActive(e.target.checked)}
                className="h-4 w-4 rounded text-[#ffc700] focus:ring-[#ffc700]"
              />
              <span className="text-xs font-black text-[#1e1b4b]">
                Langsung Aktifkan Banner Ini di Website
              </span>
            </label>

            <Button
              type="submit"
              variant="yellow"
              size="md"
              disabled={creating}
              className="gap-2 py-3 text-xs font-black shadow-md"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Membuat...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Pasang Pengumuman</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Announcements List */}
      <div className="rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b-2 border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Bell className="h-5 w-5 text-[#2baee2]" />
            <h3 className="font-heading text-base font-black text-[#1e1b4b]">
              Riwayat & Daftar Banner Pengumuman ({announcements.length})
            </h3>
          </div>
        </div>

        {announcements.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-heading text-sm font-bold text-slate-400">
              Belum ada pengumuman yang dibuat.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border-2 p-5 transition-all ${
                  item.isActive
                    ? "border-amber-300 bg-[#fffdf0] shadow-sm"
                    : "border-slate-100 bg-white"
                }`}
              >
                {editingId === item.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      className="w-full rounded-xl border-2 border-[#ffc700] px-3 py-2 text-xs font-bold text-[#1e1b4b] focus:outline-none"
                      autoFocus
                    />
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Link Text"
                        value={editLinkText}
                        onChange={(e) => setEditLinkText(e.target.value)}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold"
                      />
                      <input
                        type="url"
                        placeholder="Link URL"
                        value={editLinkUrl}
                        onChange={(e) => setEditLinkUrl(e.target.value)}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(item.id)}
                        disabled={loadingId === item.id}
                        className="flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-600"
                      >
                        {loadingId === item.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        <span>Simpan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex cursor-pointer items-center gap-1 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-300"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Batal</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {item.isActive ? (
                          <span className="font-heading inline-flex items-center gap-1 rounded-full border border-amber-300 bg-[#ffc700] px-2.5 py-0.5 text-[10px] font-black text-[#452203]">
                            <Radio className="h-3 w-3 animate-pulse" />
                            SEDANG TAYANG (AKTIF)
                          </span>
                        ) : (
                          <span className="font-heading rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black text-slate-500">
                            NONAKTIF
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-slate-400">
                          {formatWIB(item.createdAt, "datetime")}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-[#1e1b4b]">
                        {item.message}
                      </p>

                      {item.linkUrl && (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-black text-[#2baee2] hover:underline"
                        >
                          <span>{item.linkText || item.linkUrl}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggle(item.id, item.isActive)}
                        disabled={loadingId === item.id}
                        className={`font-heading cursor-pointer rounded-xl px-3 py-2 text-xs font-black transition ${
                          item.isActive
                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            : "btn-3d-yellow text-[#452203]"
                        }`}
                      >
                        {item.isActive ? "Nonaktifkan" : "Aktifkan Banner"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        aria-label="Edit announcement"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            id: item.id,
                            message: item.message,
                          })
                        }
                        disabled={loadingId === item.id}
                        aria-label="Delete announcement"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
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
        title="Hapus Pengumuman?"
        description={`Apakah Anda yakin ingin menghapus banner pengumuman "${deleteTarget?.message}"? Pengumuman tidak akan ditayangkan lagi.`}
        confirmText="Ya, Hapus Pengumuman"
        cancelText="Batal"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}

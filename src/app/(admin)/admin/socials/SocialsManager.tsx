"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Share2,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";
import {
  updateSocialLink,
  createSocialLink,
  toggleSocialVisibility,
  deleteSocialLink,
} from "./actions";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  DiscordIcon,
  TikTokIcon,
  InstagramIcon,
  YouTubeIcon,
  XTwitterIcon,
  WhatsAppIcon,
  SpotifyIcon,
  TwitchIcon,
  GitHubIcon,
  FacebookIcon,
} from "@/components/ui/SocialIcons";
import type { SocialLink } from "@prisma/client";

interface SocialsManagerProps {
  initialSocials: SocialLink[];
}

const PLATFORM_OPTIONS = [
  { value: "unknown", label: "Unknown (Default Link)" },
  { value: "discord", label: "Discord" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter / X" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "spotify", label: "Spotify" },
  { value: "twitch", label: "Twitch" },
  { value: "github", label: "GitHub" },
  { value: "facebook", label: "Facebook" },
];

function getPlatformIcon(platform: string, size = 20) {
  const p = (platform || "").toLowerCase();
  switch (p) {
    case "discord":
      return <DiscordIcon size={size} className="text-[#5865F2]" />;
    case "tiktok":
      return <TikTokIcon size={size} className="text-[#010101]" />;
    case "instagram":
      return <InstagramIcon size={size} className="text-[#DD2A7B]" />;
    case "youtube":
      return <YouTubeIcon size={size} className="text-[#FF0000]" />;
    case "twitter":
    case "x":
      return <XTwitterIcon size={size} className="text-[#0f1419]" />;
    case "whatsapp":
      return <WhatsAppIcon size={size} className="text-[#25D366]" />;
    case "spotify":
      return <SpotifyIcon size={size} className="text-[#1DB954]" />;
    case "twitch":
      return <TwitchIcon size={size} className="text-[#9146FF]" />;
    case "github":
      return <GitHubIcon size={size} className="text-[#24292e]" />;
    case "facebook":
      return <FacebookIcon size={size} className="text-[#1877F2]" />;
    case "unknown":
    default:
      return <LinkIcon size={size} className="text-slate-500" />;
  }
}

function getPlatformBadgeColor(platform: string) {
  const p = (platform || "").toLowerCase();
  switch (p) {
    case "discord":
      return "bg-[#5865F2]/10 text-[#5865F2] border-[#5865F2]/30";
    case "tiktok":
      return "bg-slate-900/10 text-slate-900 border-slate-900/30";
    case "instagram":
      return "bg-pink-50 text-[#DD2A7B] border-pink-200";
    case "youtube":
      return "bg-red-50 text-[#FF0000] border-red-200";
    case "twitter":
    case "x":
      return "bg-slate-100 text-slate-800 border-slate-300";
    case "whatsapp":
      return "bg-emerald-50 text-[#25D366] border-emerald-200";
    case "spotify":
      return "bg-emerald-50 text-[#1DB954] border-emerald-200";
    case "twitch":
      return "bg-purple-50 text-[#9146FF] border-purple-200";
    case "github":
      return "bg-slate-100 text-slate-800 border-slate-300";
    case "facebook":
      return "bg-blue-50 text-[#1877F2] border-blue-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

export function SocialsManager({ initialSocials }: SocialsManagerProps) {
  const router = useRouter();
  const toast = useToast();
  const [socials, setSocials] = React.useState<SocialLink[]>(initialSocials);

  // New Link State (default unknown with icon link)
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newPlatform, setNewPlatform] = React.useState("unknown");
  const [newName, setNewName] = React.useState("");
  const [newUrl, setNewUrl] = React.useState("");
  const [newHandle, setNewHandle] = React.useState("");
  const [newIsVisible, setNewIsVisible] = React.useState(true);
  const [creating, setCreating] = React.useState(false);

  // Edit State
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editPlatform, setEditPlatform] = React.useState("unknown");
  const [editName, setEditName] = React.useState("");
  const [editUrl, setEditUrl] = React.useState("");
  const [editHandle, setEditHandle] = React.useState("");
  const [editIsVisible, setEditIsVisible] = React.useState(true);

  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  // Custom Delete Confirm State
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await deleteSocialLink(deleteTarget.id);
      if (res.success) {
        setSocials((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        toast.success(`Tautan "${deleteTarget.name}" berhasil dihapus.`);
        router.refresh();
      } else {
        toast.error(res.error || "Gagal menghapus data.");
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
    if (!newName.trim() || !newUrl.trim()) {
      toast.warning("Mohon isi nama dan URL media sosial.");
      return;
    }

    setCreating(true);

    try {
      const res = await createSocialLink({
        platform: newPlatform,
        name: newName,
        url: newUrl,
        handle: newHandle || undefined,
        isVisible: newIsVisible,
      });

      if (res.success && res.link) {
        setSocials((prev) => [...prev, res.link]);
        toast.success(`Tautan "${newName}" berhasil ditambahkan!`);
        setNewName("");
        setNewUrl("");
        setNewHandle("");
        setNewPlatform("unknown");
        setShowAddForm(false);
        router.refresh();
      } else {
        toast.error("Gagal menambahkan tautan media sosial.");
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
      await toggleSocialVisibility(id, !current);
      setSocials((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isVisible: !current } : s))
      );
      toast.info(
        !current
          ? "Tautan media sosial sekarang ditampilkan di web."
          : "Tautan media sosial berhasil disembunyikan."
      );
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui status visibilitas.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleStartEdit = (s: SocialLink) => {
    setEditingId(s.id);
    const plat = s.platform.toLowerCase();
    const isStandard = PLATFORM_OPTIONS.some((opt) => opt.value === plat);
    setEditPlatform(isStandard ? plat : "unknown");
    setEditName(s.name);
    setEditUrl(s.url);
    setEditHandle(s.handle || "");
    setEditIsVisible(s.isVisible);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim() || !editUrl.trim()) {
      toast.warning("Nama dan URL tidak boleh kosong.");
      return;
    }

    setLoadingId(id);
    try {
      await updateSocialLink(id, {
        platform: editPlatform,
        name: editName,
        url: editUrl,
        handle: editHandle || undefined,
        isVisible: editIsVisible,
      });

      setSocials((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                platform: editPlatform,
                name: editName,
                url: editUrl,
                handle: editHandle || null,
                isVisible: editIsVisible,
              }
            : s
        )
      );
      setEditingId(null);
      toast.success(`Tautan "${editName}" berhasil diperbarui!`);
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui data media sosial.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Add Platform Card */}
      <div className="rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-indigo-400 bg-indigo-50 text-indigo-600">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-black text-[#1e1b4b]">
                Daftar Media Sosial ({socials.length})
              </h2>
              <p className="text-xs font-bold text-slate-500">
                Tautan footer dan seksi sosial media resmi Bloom Universe.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-3d-yellow font-heading flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black"
          >
            <Plus className="h-4 w-4" />
            <span>{showAddForm ? "Tutup Form" : "Tambah Sosmed"}</span>
          </button>
        </div>

        {/* Add Form Drawer */}
        {showAddForm && (
          <form
            onSubmit={handleCreate}
            className="mt-6 space-y-4 rounded-2xl border-2 border-indigo-100 bg-[#f8fbff] p-5"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Platform Selector (default unknown) */}
              <div>
                <label className="font-heading block text-[11px] font-black text-slate-700">
                  Platform Sosmed <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-2xs">
                    {getPlatformIcon(newPlatform)}
                  </div>
                  <select
                    value={newPlatform}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewPlatform(val);
                      if (val !== "unknown" && !newName) {
                        setNewName(
                          val.charAt(0).toUpperCase() +
                            val.slice(1) +
                            " Official"
                        );
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1e1b4b] focus:border-indigo-400 focus:outline-none"
                  >
                    {PLATFORM_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="font-heading block text-[11px] font-black text-slate-700">
                  Nama Tampilan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Official Discord"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1e1b4b] focus:border-indigo-400 focus:outline-none"
                />
              </div>

              {/* Handle */}
              <div>
                <label className="font-heading block text-[11px] font-black text-slate-700">
                  Username / Handle
                </label>
                <input
                  type="text"
                  placeholder="Contoh: @bloom.unvrse"
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1e1b4b] focus:border-indigo-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-heading block text-[11px] font-black text-slate-700">
                URL Tautan <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1e1b4b] focus:border-indigo-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={newIsVisible}
                  onChange={(e) => setNewIsVisible(e.target.checked)}
                  className="h-4 w-4 rounded text-[#ffc700] focus:ring-[#ffc700]"
                />
                <span className="text-xs font-black text-[#1e1b4b]">
                  Tampilkan di Website Publik
                </span>
              </label>

              <Button
                type="submit"
                variant="yellow"
                size="md"
                disabled={creating}
                className="gap-2 py-2.5 text-xs font-black shadow-md"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Tambah Link</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Social Links Grid List */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {socials.map((item) => (
            <div
              key={item.id}
              className={`relative flex flex-col justify-between rounded-2xl border-2 p-5 shadow-xs transition-all ${
                item.isVisible
                  ? "border-slate-100 bg-white"
                  : "border-amber-200 bg-amber-50/40 opacity-75"
              }`}
            >
              {editingId === item.id ? (
                <div className="space-y-3">
                  {/* Edit Platform */}
                  <div>
                    <label className="font-heading block text-[10px] font-black text-slate-600">
                      Platform
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                        {getPlatformIcon(editPlatform)}
                      </div>
                      <select
                        value={editPlatform}
                        onChange={(e) => setEditPlatform(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold"
                      >
                        {PLATFORM_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-heading block text-[10px] font-black text-slate-600">
                      Nama Tampilan
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-heading block text-[10px] font-black text-slate-600">
                      Handle / Username
                    </label>
                    <input
                      type="text"
                      value={editHandle}
                      onChange={(e) => setEditHandle(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-heading block text-[10px] font-black text-slate-600">
                      URL Link
                    </label>
                    <input
                      type="url"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(item.id)}
                      disabled={loadingId === item.id}
                      className="flex cursor-pointer items-center gap-1 rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-black text-white shadow-xs hover:bg-emerald-600"
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
                      className="flex cursor-pointer items-center gap-1 rounded-xl bg-slate-200 px-3.5 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-300"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Batal</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-100 bg-[#f8fbff] shadow-xs">
                          {getPlatformIcon(item.platform, 22)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-heading text-sm font-black text-[#1e1b4b]">
                              {item.name}
                            </h4>
                            <span
                              className={`font-heading rounded-md border px-1.5 py-0.5 text-[9px] font-black uppercase ${getPlatformBadgeColor(
                                item.platform
                              )}`}
                            >
                              {item.platform}
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-slate-400">
                            {item.handle || "Tanpa Handle"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 truncate text-xs font-bold text-[#2baee2] hover:underline"
                    >
                      <span className="truncate">{item.url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => handleToggle(item.id, item.isVisible)}
                      disabled={loadingId === item.id}
                      className={`font-heading flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        item.isVisible
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.isVisible ? (
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

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        aria-label="Edit link"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({ id: item.id, name: item.name })
                        }
                        disabled={loadingId === item.id}
                        aria-label="Delete link"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Playful Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Hapus Media Sosial?"
        description={`Apakah Anda yakin ingin menghapus tautan media sosial "${deleteTarget?.name}"? Tautan ini tidak akan muncul lagi di website.`}
        confirmText="Ya, Hapus Tautan"
        cancelText="Batal"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}

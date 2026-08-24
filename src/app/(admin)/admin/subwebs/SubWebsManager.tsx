"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Layers,
  Edit2,
  Check,
  X,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  Camera,
  Gamepad2,
  Boxes,
  ShoppingBag,
  MessageCircle,
  Bot,
  Globe,
  Radio,
} from "lucide-react";
import {
  updateSubWebCard,
  toggleSubWebVisibility,
  toggleSubWebLive,
} from "./actions";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { SubWebCard } from "@prisma/client";

interface SubWebsManagerProps {
  initialSubWebs: SubWebCard[];
}

function getSubWebIcon(iconName: string) {
  switch (iconName.toLowerCase()) {
    case "camera":
      return <Camera className="h-6 w-6 text-[#2baee2]" />;
    case "gamepad2":
      return <Gamepad2 className="h-6 w-6 text-emerald-500" />;
    case "boxes":
      return <Boxes className="h-6 w-6 text-red-500" />;
    case "shoppingbag":
      return <ShoppingBag className="h-6 w-6 text-[#ffc700]" />;
    case "messagecircle":
      return <MessageCircle className="h-6 w-6 text-[#7952bd]" />;
    case "bot":
      return <Bot className="h-6 w-6 text-sky-500" />;
    default:
      return <Globe className="h-6 w-6 text-slate-500" />;
  }
}

export function SubWebsManager({ initialSubWebs }: SubWebsManagerProps) {
  const router = useRouter();
  const toast = useToast();
  const [subWebs, setSubWebs] = React.useState<SubWebCard[]>(initialSubWebs);

  // Edit State
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editDesc, setEditDesc] = React.useState("");
  const [editHref, setEditHref] = React.useState("");
  const [editBadge, setEditBadge] = React.useState("");
  const [editIsLive, setEditIsLive] = React.useState(false);
  const [editIsVisible, setEditIsVisible] = React.useState(true);

  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const handleToggleVisibility = async (id: string, current: boolean) => {
    setLoadingId(id);
    try {
      await toggleSubWebVisibility(id, !current);
      setSubWebs((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isVisible: !current } : s))
      );
      toast.info(
        !current
          ? "Kartu sub-web sekarang ditampilkan di web."
          : "Kartu sub-web berhasil disembunyikan."
      );
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui status visibilitas.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleLive = async (id: string, current: boolean) => {
    setLoadingId(id);
    try {
      await toggleSubWebLive(id, !current);
      setSubWebs((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                isLive: !current,
                badge: !current ? "Live" : "Coming Soon",
              }
            : s
        )
      );
      toast.info(
        !current
          ? "Status portal sekarang Aktif (Live)!"
          : "Status portal diubah menjadi Segera Hadir (Coming Soon)."
      );
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui status live.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleStartEdit = (card: SubWebCard) => {
    setEditingId(card.id);
    setEditTitle(card.title);
    setEditDesc(card.description);
    setEditHref(card.href);
    setEditBadge(card.badge || "");
    setEditIsLive(card.isLive);
    setEditIsVisible(card.isVisible);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim() || !editDesc.trim() || !editHref.trim()) return;

    setLoadingId(id);
    try {
      await updateSubWebCard(id, {
        title: editTitle,
        description: editDesc,
        href: editHref,
        badge: editBadge || undefined,
        isLive: editIsLive,
        isVisible: editIsVisible,
      });

      setSubWebs((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                title: editTitle,
                description: editDesc,
                href: editHref,
                badge: editBadge || null,
                isLive: editIsLive,
                isVisible: editIsVisible,
              }
            : s
        )
      );
      setEditingId(null);
      toast.success("Kartu Sub-Web berhasil diperbarui!");
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui kartu sub-web.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Cards List Grid */}
      <div className="rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b-2 border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-[#2baee2]" />
            <h2 className="font-heading text-base font-black text-[#1e1b4b]">
              Daftar Kartu Portal Ekosistem ({subWebs.length})
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Ekosistem Bloom Universe
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subWebs.map((card) => (
            <div
              key={card.id}
              className={`relative flex flex-col justify-between rounded-3xl border-2 p-6 shadow-xs transition-all ${
                card.isVisible
                  ? "border-slate-100 bg-white"
                  : "border-amber-200 bg-amber-50/40 opacity-75"
              }`}
            >
              {editingId === card.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">
                      Judul Kartu
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#1e1b4b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">
                      Deskripsi Singkat
                    </label>
                    <textarea
                      rows={3}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#1e1b4b]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">
                        Link URL / Path
                      </label>
                      <input
                        type="text"
                        value={editHref}
                        onChange={(e) => setEditHref(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#1e1b4b]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">
                        Label Badge
                      </label>
                      <input
                        type="text"
                        placeholder="Coming Soon"
                        value={editBadge}
                        onChange={(e) => setEditBadge(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#1e1b4b]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold">
                      <input
                        type="checkbox"
                        checked={editIsLive}
                        onChange={(e) => setEditIsLive(e.target.checked)}
                        className="rounded text-[#2baee2]"
                      />
                      <span>Status Live</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-[11px] font-bold">
                      <input
                        type="checkbox"
                        checked={editIsVisible}
                        onChange={(e) => setEditIsVisible(e.target.checked)}
                        className="rounded text-[#2baee2]"
                      />
                      <span>Tampil</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(card.id)}
                      disabled={loadingId === card.id}
                      className="flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-600"
                    >
                      {loadingId === card.id ? (
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
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-100 bg-[#f8fbff] shadow-xs">
                        {getSubWebIcon(card.icon)}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {card.isLive ? (
                          <span className="font-heading inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-700">
                            <Radio className="h-3 w-3 animate-pulse text-emerald-500" />
                            {card.badge || "Live"}
                          </span>
                        ) : (
                          <span className="font-heading rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-black text-amber-800">
                            {card.badge || "Coming Soon"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-heading text-base font-black text-[#1e1b4b]">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed font-bold text-slate-500">
                        {card.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate">{card.href}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleVisibility(card.id, card.isVisible)
                        }
                        disabled={loadingId === card.id}
                        className={`font-heading flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                          card.isVisible
                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {card.isVisible ? (
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
                        onClick={() => handleToggleLive(card.id, card.isLive)}
                        disabled={loadingId === card.id}
                        className={`font-heading cursor-pointer rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                          card.isLive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {card.isLive ? "Set Coming Soon" : "Set Live"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartEdit(card)}
                      aria-label="Edit subweb card"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

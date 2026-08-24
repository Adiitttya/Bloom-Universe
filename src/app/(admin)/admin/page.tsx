import Link from "next/link";
import {
  LayoutTemplate,
  Info,
  Image as ImageIcon,
  Bell,
  Share2,
  Layers,
  ArrowRight,
  Shield,
  Activity,
} from "lucide-react";
import { db } from "@/lib/db";
import { ActivityLogList } from "@/components/admin/ActivityLogList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOverviewPage() {
  const [
    galleryCount,
    visibleGalleryCount,
    announcementCount,
    activeAnnouncement,
    subWebCount,
    liveSubWebCount,
    socialCount,
    aboutPillarsCount,
    rawAdminLogs,
    rawMemberLogs,
  ] = await Promise.all([
    db.galleryImage.count().catch(() => 0),
    db.galleryImage.count({ where: { isVisible: true } }).catch(() => 0),
    db.announcement.count().catch(() => 0),
    db.announcement
      .findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      })
      .catch(() => null),
    db.subWebCard.count().catch(() => 0),
    db.subWebCard.count({ where: { isLive: true } }).catch(() => 0),
    db.socialLink.count().catch(() => 0),
    db.aboutCard.count().catch(() => 0),
    (db.adminLog
      ? db.adminLog.findMany({
          take: 100,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                username: true,
                displayName: true,
                image: true,
              },
            },
          },
        })
      : Promise.resolve([])
    ).catch(() => []),
    (db.memberLog
      ? db.memberLog.findMany({
          take: 100,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                username: true,
                displayName: true,
                image: true,
              },
            },
          },
        })
      : Promise.resolve([])
    ).catch(() => []),
  ]);

  // Strictly sort chronological: oldest of the 100 at top, newest at bottom (chat-like)
  const orderedAdminLogs = [...rawAdminLogs]
    .slice(0, 100)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const orderedMemberLogs = [...rawMemberLogs]
    .slice(0, 100)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const cards = [
    {
      title: "Banner Pengumuman",
      desc: "Pasang pesan banner berjalan di header website publik.",
      href: "/admin/announcements",
      icon: Bell,
      stat: activeAnnouncement ? "Aktif" : "Nonaktif",
      statColor: activeAnnouncement
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-slate-100 text-slate-600 border-slate-200",
      accent: "border-[#ffc700] bg-[#fff8d6] text-[#b38600]",
    },
    {
      title: "Hero Section",
      desc: "Kelola headline, deskripsi pengantar, dan tombol CTA utama.",
      href: "/admin/hero",
      icon: LayoutTemplate,
      stat: "Live",
      statColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "border-[#2baee2] bg-[#e0f4fc] text-[#2baee2]",
    },
    {
      title: "About Section",
      desc: "Ubah deskripsi komunitas dan 3 kartu pilar nilai.",
      href: "/admin/about",
      icon: Info,
      stat: `${aboutPillarsCount} Pilar`,
      statColor: "bg-purple-50 text-purple-700 border-purple-200",
      accent: "border-[#7952bd] bg-[#f3ebff] text-[#7952bd]",
    },
    {
      title: "Foto Galeri",
      desc: "Upload dan kelola foto kegiatan komunitas via Uploadthing.",
      href: "/admin/gallery",
      icon: ImageIcon,
      stat: `${visibleGalleryCount}/${galleryCount} Foto`,
      statColor: "bg-sky-50 text-sky-700 border-sky-200",
      accent: "border-[#2baee2] bg-[#e0f4fc] text-[#2baee2]",
    },
    {
      title: "Kartu Sub-Web",
      desc: "Kelola 6 kartu portal ekosistem (Photobooth, SMP, Bot, dll).",
      href: "/admin/subwebs",
      icon: Layers,
      stat: `${liveSubWebCount}/${subWebCount} Live`,
      statColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "border-emerald-400 bg-emerald-50 text-emerald-600",
    },
    {
      title: "Media Sosial",
      desc: "Atur link Discord, TikTok, Instagram, YouTube, dan lainnya.",
      href: "/admin/socials",
      icon: Share2,
      stat: `${socialCount} Platform`,
      statColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      accent: "border-indigo-400 bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-white bg-gradient-to-r from-[#2baee2] to-[#1b8ebc] p-6 text-white shadow-[0_10px_0_#157095,0_20px_25px_rgba(0,0,0,0.1)] sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-black text-white backdrop-blur-xs">
              <Shield className="h-3.5 w-3.5 text-[#ffc700]" />
              <span>Bloom Universe CMS Panel</span>
            </div>
            <h1 className="font-heading mt-2 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              Dashboard Ringkasan Admin
            </h1>
            <p className="mt-1 max-w-xl text-xs font-bold text-sky-100 sm:text-sm">
              Kelola seluruh konten landing page secara langsung. Setiap
              perubahan tersimpan di database dan sinkron dengan website publik.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-yellow font-heading flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black"
            >
              <span>Buka Web Publik</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Decorative background clouds */}
        <div className="pointer-events-none absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-white/10 blur-xl" />
      </div>

      {/* Module Shortcuts Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-black text-[#1e1b4b]">
            Modul Pengelolaan Konten
          </h2>
          <span className="text-xs font-bold text-slate-400">
            6 Modul Tersedia
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group relative flex flex-col justify-between rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#2baee2] hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 shadow-xs ${card.accent}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`font-heading rounded-full border px-2.5 py-0.5 text-[11px] font-black ${card.statColor}`}
                    >
                      {card.stat}
                    </span>
                  </div>

                  <h3 className="font-heading mt-4 text-base font-black text-[#1e1b4b] group-hover:text-[#2baee2]">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed font-bold text-slate-500">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1 text-xs font-black text-[#2baee2]">
                  <span>Buka Pengaturan</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Audit Log */}
      <div className="rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex items-center justify-between border-b-2 border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Activity className="h-5 w-5 text-[#2baee2]" />
            <h2 className="font-heading text-base font-black text-[#1e1b4b]">
              Log Aktivitas Website & Komunitas
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Realtime Audit & Interaksi
          </span>
        </div>

        {/* Scrollable List with Max 5 items visible & Auto-Scroll to bottom (Chat-like) */}
        <ActivityLogList
          adminLogs={orderedAdminLogs}
          memberLogs={orderedMemberLogs}
        />
      </div>
    </div>
  );
}

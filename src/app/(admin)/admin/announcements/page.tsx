import { db } from "@/lib/db";
import { AnnouncementsManager } from "./AnnouncementsManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAnnouncementsPage() {
  const announcements = await db.announcement
    .findMany({
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-black text-[#1e1b4b] sm:text-3xl">
          Kelola Banner Pengumuman
        </h1>
        <p className="mt-1 text-sm font-bold text-slate-500">
          Buat dan aktifkan pesan pengumuman penting di bagian atas website
          publik.
        </p>
      </div>

      <AnnouncementsManager initialAnnouncements={announcements} />
    </div>
  );
}

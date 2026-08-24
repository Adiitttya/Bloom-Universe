import { db } from "@/lib/db";
import { SubWebsManager } from "./SubWebsManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSubWebsPage() {
  const subWebs = await db.subWebCard
    .findMany({
      orderBy: { order: "asc" },
    })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-black text-[#1e1b4b] sm:text-3xl">
          Kelola Kartu Sub-Web Ekosistem
        </h1>
        <p className="mt-1 text-sm font-bold text-slate-500">
          Atur status live, badge, deskripsi, dan visibilitas 6 portal sub-web
          komunitas Bloom Universe.
        </p>
      </div>

      <SubWebsManager initialSubWebs={subWebs} />
    </div>
  );
}

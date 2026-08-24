import { db } from "@/lib/db";
import { SocialsManager } from "./SocialsManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSocialsPage() {
  const socials = await db.socialLink
    .findMany({
      orderBy: { order: "asc" },
    })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-black text-[#1e1b4b] sm:text-3xl">
          Kelola Link Media Sosial
        </h1>
        <p className="mt-1 text-sm font-bold text-slate-500">
          Atur link Discord, TikTok, Instagram, YouTube, dan platform resmi
          Bloom Universe lainnya.
        </p>
      </div>

      <SocialsManager initialSocials={socials} />
    </div>
  );
}

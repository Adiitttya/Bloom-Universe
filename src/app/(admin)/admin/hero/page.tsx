import { db } from "@/lib/db";
import { SOCIAL_LINKS } from "@/lib/constants";
import { HeroForm } from "./HeroForm";
import type { HeroFormData } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminHeroPage() {
  const records = await db.siteContent
    .findMany({
      where: { section: "hero" },
    })
    .catch(() => []);

  const titleRecord = records.find((r) => r.key === "title");
  const subtitleRecord = records.find((r) => r.key === "subtitle");
  const primaryCtaTextRecord = records.find((r) => r.key === "primaryCtaText");
  const primaryCtaUrlRecord = records.find((r) => r.key === "primaryCtaUrl");
  const secondaryCtaTextRecord = records.find(
    (r) => r.key === "secondaryCtaText"
  );
  const secondaryCtaUrlRecord = records.find(
    (r) => r.key === "secondaryCtaUrl"
  );

  const initialData: HeroFormData = {
    title: titleRecord?.value || "Hangout, Game, & Vibe Bersama",
    subtitle:
      subtitleRecord?.value ||
      "Komunitas Discord paling seru dan ramah untuk mabar Valorant, Roblox, Minecraft, nonton bareng anime, atau sekadar ngobrol santai tiap malam.",
    primaryCtaText: primaryCtaTextRecord?.value || "Join Discord Sekarang",
    primaryCtaUrl: primaryCtaUrlRecord?.value || SOCIAL_LINKS.discord,
    secondaryCtaText: secondaryCtaTextRecord?.value || "Jelajahi Ekosistem",
    secondaryCtaUrl: secondaryCtaUrlRecord?.value || "#subwebs",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-black text-[#1e1b4b] sm:text-3xl">
          Kelola Hero Section
        </h1>
        <p className="mt-1 text-sm font-bold text-slate-500">
          Ubah judul headline, subtitle, dan tautan tombol utama di landing
          page.
        </p>
      </div>

      <HeroForm initialData={initialData} />
    </div>
  );
}

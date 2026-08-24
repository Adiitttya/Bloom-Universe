import { db } from "@/lib/db";
import { AboutForm } from "./AboutForm";
import type { AboutSectionFormData } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAboutPage() {
  const [siteContents, dbAboutCards] = await Promise.all([
    db.siteContent
      .findMany({
        where: { section: "about" },
      })
      .catch(() => []),
    db.aboutCard
      .findMany({
        orderBy: { order: "asc" },
      })
      .catch(() => []),
  ]);

  const titleRecord = siteContents.find((r) => r.key === "title");
  const descRecord = siteContents.find((r) => r.key === "description");

  const defaultPillars = [
    {
      id: "pillar-1",
      number: "01",
      title: "Squad Up & Play",
      description:
        "Never game alone. Find teammates for Valorant, Mobile Legends, Roblox, Minecraft, or casual party games in seconds.",
      color: "blue",
      isVisible: true,
    },
    {
      id: "pillar-2",
      number: "02",
      title: "Watch & Chill Nights",
      description:
        "Cozy community movie streams, anime watch parties, music jamming sessions, and spontaneous voice lounge hangouts.",
      color: "yellow",
      isVisible: true,
    },
    {
      id: "pillar-3",
      number: "03",
      title: "Make Real Friends & Vibe",
      description:
        "A warm, welcoming, and wholesome environment to network, share passions, tell stories, and build genuine friendships.",
      color: "purple",
      isVisible: true,
    },
  ];

  const pillars =
    dbAboutCards.length > 0
      ? dbAboutCards.map((c) => ({
          id: c.id,
          number: c.number,
          title: c.title,
          description: c.description,
          color: c.color,
          isVisible: c.isVisible,
        }))
      : defaultPillars;

  const initialData: AboutSectionFormData = {
    title: titleRecord?.value || "Bukan Sekadar Server Biasa",
    description:
      descRecord?.value ||
      "Bloom Universe didirikan sebagai rumah kedua bagi gamer, kreator konten, wibu, dan siapa pun yang mencari teman seru dan komunitas yang positif.",
    pillars,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-black text-[#1e1b4b] sm:text-3xl">
          Kelola About Section
        </h1>
        <p className="mt-1 text-sm font-bold text-slate-500">
          Ubah deskripsi komunitas dan 3 pilar nilai utama di bagian About.
        </p>
      </div>

      <AboutForm initialData={initialData} />
    </div>
  );
}

import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { SubWebCards } from "@/components/sections/SubWebCards";
import { SocialLinks } from "@/components/sections/SocialLinks";
import { db } from "@/lib/db";
import { fetchDiscordGuildStats } from "@/lib/discord";
import { type GalleryItem, type SubWebItem } from "@/lib/types";

// Revalidate page content periodically or on-demand
export const revalidate = 60;

export default async function HomePage() {
  let galleryImages: GalleryItem[] = [];
  let subWebs: SubWebItem[] = [];

  // Fetch live Discord stats directly on the server to prevent initial dummy jump/flash
  const discordStats = await fetchDiscordGuildStats();

  try {
    // 1. Fetch gallery images
    const dbImages = await db.galleryImage.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
      take: 6,
    });
    if (dbImages.length > 0) {
      galleryImages = dbImages.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        order: img.order,
      }));
    }

    // 2. Fetch subweb cards
    const dbSubWebs = await db.subWebCard.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    });
    if (dbSubWebs.length > 0) {
      subWebs = dbSubWebs.map((sub) => ({
        id: sub.id,
        title: sub.title,
        description: sub.description,
        href: sub.href,
        icon: sub.icon,
        isLive: sub.isLive,
      }));
    }
  } catch {
    // Graceful fallback to default values
  }

  return (
    <>
      <HeroSection />
      <AboutSection initialStats={discordStats} />
      <GallerySection images={galleryImages} />
      <SubWebCards items={subWebs.length > 0 ? subWebs : undefined} />
      <SocialLinks />
    </>
  );
}

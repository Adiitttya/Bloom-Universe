import { HeroSection } from "@/components/sections/HeroSection";
import { ServerStats } from "@/components/sections/ServerStats";
import { AboutSection } from "@/components/sections/AboutSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { SubWebCards } from "@/components/sections/SubWebCards";
import { SocialLinks } from "@/components/sections/SocialLinks";
import { db } from "@/lib/db";
import { fetchDiscordGuildStats } from "@/lib/discord";
import {
  type GalleryItem,
  type SubWebItem,
  type SocialLinkItem,
  type AboutCardItem,
  type HeroContent,
  type AboutContent,
} from "@/lib/types";

// Force dynamic execution on every request to immediately reflect database updates
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let galleryImages: GalleryItem[] = [];
  let subWebs: SubWebItem[] = [];
  let socialLinks: SocialLinkItem[] = [];
  let aboutCards: AboutCardItem[] = [];
  let heroContent: Partial<HeroContent> | undefined = undefined;
  let aboutContent: Partial<AboutContent> | undefined = undefined;

  // Fetch live Discord stats directly on the server to prevent initial dummy jump/flash
  const discordStats = await fetchDiscordGuildStats();

  try {
    // 1. Fetch site content (Hero & About custom text if configured in DB)
    const siteContents = await db.siteContent.findMany();
    if (siteContents.length > 0) {
      const heroRecords = siteContents.filter((c) => c.section === "hero");
      const aboutRecords = siteContents.filter((c) => c.section === "about");

      if (heroRecords.length > 0) {
        heroContent = {
          title: heroRecords.find((r) => r.key === "title")?.value,
          subtitle: heroRecords.find((r) => r.key === "subtitle")?.value,
          primaryCtaText: heroRecords.find((r) => r.key === "primaryCtaText")
            ?.value,
          primaryCtaUrl: heroRecords.find((r) => r.key === "primaryCtaUrl")
            ?.value,
          secondaryCtaText: heroRecords.find(
            (r) => r.key === "secondaryCtaText"
          )?.value,
          secondaryCtaUrl: heroRecords.find((r) => r.key === "secondaryCtaUrl")
            ?.value,
        };
      }

      if (aboutRecords.length > 0) {
        aboutContent = {
          title: aboutRecords.find((r) => r.key === "title")?.value,
          description: aboutRecords.find((r) => r.key === "description")?.value,
        };
      }
    }

    // 2. Fetch gallery images
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

    // 3. Fetch subweb cards
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

    // 4. Fetch social links
    const dbSocials = await db.socialLink.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    });
    if (dbSocials.length > 0) {
      socialLinks = dbSocials.map((s) => ({
        id: s.id,
        platform: s.platform,
        name: s.name,
        url: s.url,
        icon: s.icon,
        handle: s.handle,
        order: s.order,
      }));
    }

    // 5. Fetch about pillar cards
    const dbAboutCards = await db.aboutCard.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    });
    if (dbAboutCards.length > 0) {
      aboutCards = dbAboutCards.map((c) => ({
        id: c.id,
        number: c.number,
        title: c.title,
        description: c.description,
        color: c.color,
        order: c.order,
      }));
    }
  } catch {
    // Graceful fallback to default values
  }

  return (
    <>
      <HeroSection content={heroContent} />
      <ServerStats initialStats={discordStats} />
      <AboutSection
        content={aboutContent}
        cards={aboutCards.length > 0 ? aboutCards : undefined}
      />
      <GallerySection images={galleryImages} />
      <SubWebCards items={subWebs.length > 0 ? subWebs : undefined} />
      <SocialLinks links={socialLinks.length > 0 ? socialLinks : undefined} />
    </>
  );
}

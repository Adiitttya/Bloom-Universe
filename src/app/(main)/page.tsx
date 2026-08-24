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

// Enable Incremental Static Regeneration (ISR) with 60s revalidation for blazing fast TTFB & instant LCP
export const revalidate = 60;

export default async function HomePage() {
  let galleryImages: GalleryItem[] = [];
  let subWebs: SubWebItem[] = [];
  let socialLinks: SocialLinkItem[] = [];
  let aboutCards: AboutCardItem[] = [];
  let heroContent: Partial<HeroContent> | undefined = undefined;
  let aboutContent: Partial<AboutContent> | undefined = undefined;

  try {
    // Execute all database queries & discord stats concurrently in parallel
    const [
      discordStats,
      siteContents,
      dbImages,
      dbSubWebs,
      dbSocials,
      dbAboutCards,
    ] = await Promise.all([
      fetchDiscordGuildStats(),
      db.siteContent.findMany().catch(() => []),
      db.galleryImage
        .findMany({
          where: { isVisible: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        })
        .catch(() => []),
      db.subWebCard
        .findMany({
          where: { isVisible: true },
          orderBy: { order: "asc" },
        })
        .catch(() => []),
      db.socialLink
        .findMany({
          where: { isVisible: true },
          orderBy: { order: "asc" },
        })
        .catch(() => []),
      db.aboutCard
        .findMany({
          where: { isVisible: true },
          orderBy: { order: "asc" },
        })
        .catch(() => []),
    ]);

    // 1. Process site content
    if (siteContents && siteContents.length > 0) {
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

    // 2. Process gallery images
    if (dbImages && dbImages.length > 0) {
      galleryImages = dbImages.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        order: img.order,
      }));
    }

    // 3. Process subwebs
    if (dbSubWebs && dbSubWebs.length > 0) {
      subWebs = dbSubWebs.map((sub) => ({
        id: sub.id,
        title: sub.title,
        description: sub.description,
        href: sub.href,
        icon: sub.icon,
        isLive: sub.isLive,
      }));
    }

    // 4. Process social links
    if (dbSocials && dbSocials.length > 0) {
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

    // 5. Process about cards
    if (dbAboutCards && dbAboutCards.length > 0) {
      aboutCards = dbAboutCards.map((c) => ({
        id: c.id,
        number: c.number,
        title: c.title,
        description: c.description,
        color: c.color,
        order: c.order,
      }));
    }

    return (
      <>
        {/* Hero & About use the i18n Dictionary for full multi-language translation (ID / EN) */}
        <HeroSection />
        <ServerStats initialStats={discordStats} />
        <AboutSection />
        <GallerySection images={galleryImages} />
        <SubWebCards items={subWebs.length > 0 ? subWebs : undefined} />
        <SocialLinks links={socialLinks.length > 0 ? socialLinks : undefined} />
      </>
    );
  } catch {
    // Graceful fallback to default values
    return (
      <>
        <HeroSection />
        <ServerStats />
        <AboutSection />
        <GallerySection images={galleryImages} />
        <SubWebCards />
        <SocialLinks />
      </>
    );
  }
}

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBanner } from "@/components/sections/AnnouncementBanner";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { db } from "@/lib/db";
import { type SubWebItem, type SocialLinkItem } from "@/lib/types";

// Enable Incremental Static Regeneration (ISR) with 60s revalidation for high performance & instant response
export const revalidate = 60;

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let announcementMessage: string | undefined = undefined;
  let isAnnouncementActive = false; // Disabled by default until configured in admin/DB
  let subWebs: SubWebItem[] = [];
  let socialLinks: SocialLinkItem[] = [];

  try {
    const [activeAnnouncement, dbSubWebs, dbSocials] = await Promise.all([
      db.announcement.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      }),
      db.subWebCard.findMany({
        where: { isVisible: true },
        orderBy: { order: "asc" },
      }),
      db.socialLink.findMany({
        where: { isVisible: true },
        orderBy: { order: "asc" },
      }),
    ]);

    if (activeAnnouncement) {
      announcementMessage = activeAnnouncement.message;
      isAnnouncementActive = activeAnnouncement.isActive;
    }

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
  } catch {
    // Database table not yet seeded or inactive
    isAnnouncementActive = false;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBanner
        message={announcementMessage}
        isActive={isAnnouncementActive}
      />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer
        subWebs={subWebs.length > 0 ? subWebs : undefined}
        socialLinks={socialLinks.length > 0 ? socialLinks : undefined}
      />
      <ScrollToTop />
    </div>
  );
}

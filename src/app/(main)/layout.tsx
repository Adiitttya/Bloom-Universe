import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBanner } from "@/components/sections/AnnouncementBanner";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { db } from "@/lib/db";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let announcementMessage: string | undefined = undefined;
  let isAnnouncementActive = false; // Disabled by default until configured in admin/DB

  try {
    const activeAnnouncement = await db.announcement.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    if (activeAnnouncement) {
      announcementMessage = activeAnnouncement.message;
      isAnnouncementActive = activeAnnouncement.isActive;
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
      <Footer />
      <ScrollToTop />
    </div>
  );
}

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function getWIBDate() {
  return new Date(Date.now() + 7 * 3600000);
}

async function main() {
  console.log(
    "🌱 Seeding Bloom Universe database on Neon PostgreSQL with WIB timestamps..."
  );
  const nowWIB = getWIBDate();

  // 1. Seed SubWebCards (Ecosystem - 6 Official Cards)
  console.log("🌐 Seeding SubWebCards...");
  await prisma.subWebCard.deleteMany({});

  const subWebs = [
    {
      id: "photobooth",
      title: "Bloom Photobooth",
      description:
        "Snap cute polaroids & custom aesthetic frames with your Discord besties.",
      href: "/photobooth",
      icon: "Camera",
      badge: "Coming Soon",
      isLive: false,
      isVisible: true,
      order: 0,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
    {
      id: "minecraft",
      title: "Bloom SMP Server",
      description:
        "Build, survive, and embark on epic quests in our official Minecraft world.",
      href: "/minecraft",
      icon: "Gamepad2",
      badge: "Coming Soon",
      isLive: false,
      isVisible: true,
      order: 1,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
    {
      id: "roblox",
      title: "Bloom Roblox World",
      description:
        "Hang out, play custom mini-games, and explore our community map on Roblox.",
      href: "/roblox",
      icon: "Boxes",
      badge: "Coming Soon",
      isLive: false,
      isVisible: true,
      order: 2,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
    {
      id: "store",
      title: "Bloom Store",
      description:
        "Exclusive community merch, collectible server badges, and special perks.",
      href: "/store",
      icon: "ShoppingBag",
      badge: "Coming Soon",
      isLive: false,
      isVisible: true,
      order: 3,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
    {
      id: "social",
      title: "Bloom Social",
      description:
        "A cozy feed to share memes, fanart, gaming clips, and daily community stories.",
      href: "/social",
      icon: "MessageCircle",
      badge: "Coming Soon",
      isLive: false,
      isVisible: true,
      order: 4,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
    {
      id: "bot",
      title: "Bloom Bot Dashboard",
      description:
        "Custom music player, leveling leaderboards, economy games, and automated server utilities.",
      href: "/bot",
      icon: "Bot",
      badge: "Coming Soon",
      isLive: false,
      isVisible: true,
      order: 5,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  ];

  for (const sub of subWebs) {
    await prisma.subWebCard.create({
      data: sub,
    });
  }

  // 2. Seed Gallery Images
  console.log("📸 Seeding GalleryImages...");
  const galleryImages = [
    {
      id: "gallery-1",
      url: "/Bloom.jpg",
      alt: "Official Bloom Universe Mascot",
      caption: "Maskot resmi Bloom Universe",
      order: 0,
      isVisible: true,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
    {
      id: "gallery-2",
      url: "/Bloom.jpg",
      alt: "Bloom Community Gathering",
      caption: "Keseruan kumpul bareng member komunitas",
      order: 1,
      isVisible: true,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
    {
      id: "gallery-3",
      url: "/Bloom.jpg",
      alt: "Bloom Gaming Night & Mabar",
      caption: "Turnamen mabar seru setiap weekend",
      order: 2,
      isVisible: true,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
    {
      id: "gallery-4",
      url: "/Bloom.jpg",
      alt: "Bloom Photobooth Showcase",
      caption: "Hasil foto cute dari photobooth virtual",
      order: 3,
      isVisible: true,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
    {
      id: "gallery-5",
      url: "/Bloom.jpg",
      alt: "Bloom Discord Voice Hangout",
      caption: "Ngobrol santai di voice channel malam hari",
      order: 4,
      isVisible: true,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
    {
      id: "gallery-6",
      url: "/Bloom.jpg",
      alt: "Bloom Universe Creator Corner",
      caption: "Karya fanart dan kreasi member",
      order: 5,
      isVisible: true,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  ];

  for (const img of galleryImages) {
    await prisma.galleryImage.upsert({
      where: { id: img.id },
      create: img,
      update: { ...img, updatedAt: nowWIB },
    });
  }

  // 3. Seed Social Links
  console.log("💬 Seeding SocialLinks...");
  const socialLinks = [
    {
      id: "social-discord",
      platform: "discord",
      name: "Discord Server",
      url: "https://discord.gg/D543xgzwRv",
      icon: "DiscordIcon",
      handle: "Bloom Universe",
      isVisible: true,
      order: 0,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
    {
      id: "social-tiktok",
      platform: "tiktok",
      name: "TikTok Official",
      url: "https://www.tiktok.com/@bloom.unvrse",
      icon: "TikTokIcon",
      handle: "@bloom.unvrse",
      isVisible: true,
      order: 1,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
    {
      id: "social-instagram",
      platform: "instagram",
      name: "Instagram Official",
      url: "https://www.instagram.com/bloom.unvrse",
      icon: "InstagramIcon",
      handle: "@bloom.unvrse",
      isVisible: true,
      order: 2,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  ];

  for (const social of socialLinks) {
    await prisma.socialLink.upsert({
      where: { id: social.id },
      create: social,
      update: { ...social, updatedAt: nowWIB },
    });
  }

  // 4. Seed Announcement
  console.log("📢 Seeding Announcement...");
  await prisma.announcement.upsert({
    where: { id: "announcement-welcome" },
    create: {
      id: "announcement-welcome",
      message:
        "🎉 Selamat datang di Official Website Bloom Universe! Join Discord komunitas kami untuk event seru tiap minggunya!",
      isActive: false, // Default inactive until turned on in admin
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
    update: {
      message:
        "🎉 Selamat datang di Official Website Bloom Universe! Join Discord komunitas kami untuk event seru tiap minggunya!",
      updatedAt: nowWIB,
    },
  });

  console.log(
    "✅ Database seeding completed successfully with WIB timestamps!"
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

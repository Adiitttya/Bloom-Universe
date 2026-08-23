/**
 * Global Constants for Bloom Universe (Bloomun)
 */

function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (
    envUrl &&
    (envUrl.startsWith("http://") || envUrl.startsWith("https://"))
  ) {
    return envUrl;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://bloom-universe.vercel.app";
}

export const SITE_CONFIG = {
  name: "Bloom Universe",
  shortName: "Bloomun",
  description:
    "The ultimate hangout community to make new friends, game together, host watch parties, and chill anytime.",
  url: getSiteUrl(),
  ogImage: "/Bloom.jpg",
  logo: "/Bloom.jpg",
} as const;

export const SOCIAL_LINKS = {
  discord: "https://discord.gg/D543xgzwRv",
  tiktok: "https://www.tiktok.com/@bloom.unvrse",
  instagram: "https://www.instagram.com/bloom.unvrse",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Ecosystem", href: "/#subwebs" },
] as const;

export const SUB_WEBS = [
  {
    id: "photobooth",
    title: "Bloom Photobooth",
    description:
      "Snap cute polaroids & custom aesthetic frames with your Discord besties.",
    href: "/photobooth",
    icon: "Camera",
    isLive: false,
  },
  {
    id: "minecraft",
    title: "Bloom SMP Server",
    description:
      "Build, survive, and embark on epic quests in our official Minecraft world.",
    href: "/minecraft",
    icon: "Gamepad2",
    isLive: false,
  },
  {
    id: "roblox",
    title: "Bloom Roblox World",
    description:
      "Hang out, play custom mini-games, and explore our community map on Roblox.",
    href: "/roblox",
    icon: "Boxes",
    isLive: false,
  },
  {
    id: "store",
    title: "Bloom Store",
    description:
      "Exclusive community merch, collectible server badges, and special perks.",
    href: "/store",
    icon: "ShoppingBag",
    isLive: false,
  },
  {
    id: "social",
    title: "Bloom Social",
    description:
      "A cozy feed to share memes, fanart, gaming clips, and daily community stories.",
    href: "/social",
    icon: "MessageCircle",
    isLive: false,
  },
  {
    id: "bot",
    title: "Bloom Bot Dashboard",
    description:
      "Custom music player, leveling leaderboards, economy games, and automated server utilities.",
    href: "/bot",
    icon: "Bot",
    isLive: false,
  },
] as const;

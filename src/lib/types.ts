import type { DefaultSession } from "next-auth";

export interface NavItem {
  label: string;
  href: string;
}

export interface SubWebItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  isLive: boolean;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  name: string;
  url: string;
  icon?: string | null;
  handle?: string | null;
  order: number;
}

export interface AboutCardItem {
  id: string;
  number: string;
  title: string;
  description: string;
  color?: string;
  order: number;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

export interface AboutContent {
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
}

export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface AnnouncementItem {
  id: string;
  message: string;
  isActive: boolean;
  expiresAt?: string | null;
}

export interface HighestRoleInfo {
  id: string;
  name: string;
  colorHex: string;
  iconUrl?: string | null;
  unicodeEmoji?: string | null;
}

export interface UserSession {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  discordId?: string;
  username?: string | null;
  displayName?: string | null;
  nickname?: string | null;
  isInGuild: boolean;
  role: "GUEST" | "MEMBER" | "ADMIN" | "SUPER_ADMIN";
  isAdmin: boolean;
  guildRoles: string[];
  highestRole?: HighestRoleInfo | null;
  otherRolesCount?: number;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      discordId?: string;
      username?: string | null;
      displayName?: string | null;
      nickname?: string | null;
      isInGuild: boolean;
      role: "GUEST" | "MEMBER" | "ADMIN" | "SUPER_ADMIN";
      isAdmin: boolean;
      guildRoles: string[];
      highestRole?: HighestRoleInfo | null;
      otherRolesCount?: number;
    } & DefaultSession["user"];
  }

  interface User {
    discordId?: string;
    username?: string | null;
    displayName?: string | null;
    nickname?: string | null;
    isInGuild?: boolean;
    role?: "GUEST" | "MEMBER" | "ADMIN" | "SUPER_ADMIN";
    isAdmin?: boolean;
    guildRoles?: string[];
    highestRole?: HighestRoleInfo | null;
    otherRolesCount?: number;
  }
}

"use client";

import * as React from "react";
import { SOCIAL_LINKS } from "@/lib/constants";
import { ArrowUpRight, Link as LinkIcon } from "lucide-react";
import {
  DiscordIcon,
  TikTokIcon,
  InstagramIcon,
  YouTubeIcon,
  XTwitterIcon,
  WhatsAppIcon,
  SpotifyIcon,
  TwitchIcon,
  GitHubIcon,
  FacebookIcon,
} from "@/components/ui/SocialIcons";
import { CloudDividerTop } from "@/components/ui/CloudDividers";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SkySectionDecorations } from "@/components/ui/PlayfulDecorations";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { type SocialLinkItem } from "@/lib/types";

interface SocialLinksProps {
  links?: SocialLinkItem[];
}

const DEFAULT_SOCIALS: SocialLinkItem[] = [
  {
    id: "social-discord",
    platform: "discord",
    name: "Discord Server",
    url: SOCIAL_LINKS.discord,
    handle: "Bloom Universe",
    order: 0,
  },
  {
    id: "social-tiktok",
    platform: "tiktok",
    name: "TikTok Official",
    url: SOCIAL_LINKS.tiktok,
    handle: "@bloom.unvrse",
    order: 1,
  },
  {
    id: "social-instagram",
    platform: "instagram",
    name: "Instagram Official",
    url: SOCIAL_LINKS.instagram,
    handle: "@bloom.unvrse",
    order: 2,
  },
];

function getPlatformConfig(platform: string) {
  const p = (platform || "").toLowerCase();
  if (p.includes("tiktok")) {
    return {
      icon: TikTokIcon,
      bg: "bg-[#010101]",
      shadow: "shadow-[0_8px_0_#222222]",
      key: "tiktok",
    };
  }
  if (p.includes("insta")) {
    return {
      icon: InstagramIcon,
      bg: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
      shadow: "shadow-[0_8px_0_#961860]",
      key: "instagram",
    };
  }
  if (p.includes("youtube")) {
    return {
      icon: YouTubeIcon,
      bg: "bg-[#FF0000]",
      shadow: "shadow-[0_8px_0_#b30000]",
      key: "youtube",
    };
  }
  if (p.includes("twitter") || p === "x") {
    return {
      icon: XTwitterIcon,
      bg: "bg-[#0f1419]",
      shadow: "shadow-[0_8px_0_#000000]",
      key: "twitter",
    };
  }
  if (p.includes("whatsapp") || p.includes("wa")) {
    return {
      icon: WhatsAppIcon,
      bg: "bg-[#25D366]",
      shadow: "shadow-[0_8px_0_#1a9648]",
      key: "whatsapp",
    };
  }
  if (p.includes("spotify")) {
    return {
      icon: SpotifyIcon,
      bg: "bg-[#1DB954]",
      shadow: "shadow-[0_8px_0_#13823a]",
      key: "spotify",
    };
  }
  if (p.includes("twitch")) {
    return {
      icon: TwitchIcon,
      bg: "bg-[#9146FF]",
      shadow: "shadow-[0_8px_0_#6224c2]",
      key: "twitch",
    };
  }
  if (p.includes("github")) {
    return {
      icon: GitHubIcon,
      bg: "bg-[#24292e]",
      shadow: "shadow-[0_8px_0_#14171a]",
      key: "github",
    };
  }
  if (p.includes("facebook") || p.includes("fb")) {
    return {
      icon: FacebookIcon,
      bg: "bg-[#1877F2]",
      shadow: "shadow-[0_8px_0_#0e4ea3]",
      key: "facebook",
    };
  }
  if (p.includes("discord")) {
    return {
      icon: DiscordIcon,
      bg: "bg-[#5865F2]",
      shadow: "shadow-[0_8px_0_#3c45a5]",
      key: "discord",
    };
  }

  // Default / Unknown Link
  return {
    icon: (props: { size?: number; className?: string }) => (
      <LinkIcon size={props.size || 28} className={props.className} />
    ),
    bg: "bg-[#2baee2]",
    shadow: "shadow-[0_8px_0_#1b8ebc]",
    key: "unknown",
  };
}

export function SocialLinks({ links }: SocialLinksProps) {
  const { dict } = useLanguage();
  const displayLinks = links && links.length > 0 ? links : DEFAULT_SOCIALS;

  return (
    <section className="relative overflow-hidden pt-6 pb-0 text-white sm:pt-10">
      {/* Playful Floating Stars & Cloudlets in Sky */}
      <SkySectionDecorations />

      <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal
          animation="fade-up"
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="font-heading text-shadow-cartoon-white text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {dict.socials.title}
          </h2>

          <p className="mt-4 text-base leading-relaxed font-bold text-white/90 sm:text-lg">
            {dict.socials.description}
          </p>
        </ScrollReveal>

        {/* 3D Social Buttons Grid */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 md:grid-cols-3">
          {displayLinks.map((s, idx) => {
            const config = getPlatformConfig(s.platform);
            const IconComponent = config.icon;

            // Translated name and handle from active dictionary if available
            const platformDict =
              dict.socials.platforms?.[
                config.key as "discord" | "tiktok" | "instagram"
              ];

            const name = platformDict?.name || s.name;
            const handle = platformDict?.handle || s.handle || s.name;

            return (
              <ScrollReveal
                key={s.id || s.platform || idx}
                animation="pop-in"
                delay={idx * 100}
              >
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex h-full flex-col justify-between rounded-3xl border-4 border-white p-6 text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-1 sm:p-8 ${config.bg} ${config.shadow}`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm sm:h-16 sm:w-16">
                        <IconComponent size={32} />
                      </div>
                      <ArrowUpRight className="h-6 w-6 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>

                    <h3 className="font-heading mt-6 text-2xl font-black">
                      {name}
                    </h3>
                    <p className="font-heading mt-1 truncate text-sm font-bold text-white/80">
                      {handle}
                    </p>
                  </div>

                  <div className="font-heading mt-8 border-t border-white/20 pt-4 text-xs font-black tracking-wider sm:text-sm">
                    {dict.socials.visit}
                  </div>
                </a>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Cloud Bottom Wave Transition into White Footer */}
      <div className="mt-16 sm:mt-24">
        <CloudDividerTop className="text-white" />
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import { SOCIAL_LINKS } from "@/lib/constants";
import { ArrowUpRight } from "lucide-react";
import {
  DiscordIcon,
  TikTokIcon,
  InstagramIcon,
} from "@/components/ui/SocialIcons";
import { CloudDividerTop } from "@/components/ui/CloudDividers";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function SocialLinks() {
  const { dict } = useLanguage();

  const socials = [
    {
      name: "Discord",
      handle: "Official Community",
      url: SOCIAL_LINKS.discord,
      icon: DiscordIcon,
      bg: "bg-[#5865F2]",
      shadow: "shadow-[0_8px_0_#3c45a5]",
    },
    {
      name: "TikTok",
      handle: "@bloom.unvrse",
      url: SOCIAL_LINKS.tiktok,
      icon: TikTokIcon,
      bg: "bg-[#010101]",
      shadow: "shadow-[0_8px_0_#333333]",
    },
    {
      name: "Instagram",
      handle: "@bloom.unvrse",
      url: SOCIAL_LINKS.instagram,
      icon: InstagramIcon,
      bg: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
      shadow: "shadow-[0_8px_0_#961860]",
    },
  ];

  return (
    <section className="relative pt-6 pb-0 text-white sm:pt-10">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-shadow-cartoon-white text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {dict.socials.title}
          </h2>

          <p className="mt-4 text-base leading-relaxed font-bold text-white/90 sm:text-lg">
            {dict.socials.description}
          </p>
        </div>

        {/* 3D Social Buttons Grid - 3 Columns */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-3">
          {socials.map((s) => {
            const IconComponent = s.icon;
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col justify-between rounded-3xl border-4 border-white p-6 text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-1 sm:p-8 ${s.bg} ${s.shadow}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm sm:h-16 sm:w-16">
                      <IconComponent size={32} />
                    </div>
                    <ArrowUpRight className="h-6 w-6 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>

                  <h3 className="font-heading mt-6 text-2xl font-black">
                    {s.name}
                  </h3>
                  <p className="font-heading mt-1 truncate text-sm font-bold text-white/80">
                    {s.handle}
                  </p>
                </div>

                <div className="font-heading mt-8 border-t border-white/20 pt-4 text-xs font-black tracking-wider sm:text-sm">
                  {dict.socials.visit}
                </div>
              </a>
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

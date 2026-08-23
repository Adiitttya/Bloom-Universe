"use client";

import * as React from "react";
import { Users, Headphones } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { type DiscordServerStats } from "@/lib/discord";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ServerStatsProps {
  initialStats?: DiscordServerStats;
}

export function ServerStats({ initialStats }: ServerStatsProps) {
  const { dict } = useLanguage();

  const stats = initialStats || {
    totalMembers: 0,
    onlineMembers: 0,
    voiceMembers: 0,
    guildName: "Bloom Universe",
    isLive: false,
  };

  return (
    <div className="relative bg-[#fffdf5] pt-8 pb-12 text-[#1e1b4b] sm:pt-12 sm:pb-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* 3D Cartoon Live Discord Server Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* 1. Total Members */}
          <ScrollReveal animation="fade-up" delay={0}>
            <Card className="flex flex-col items-center justify-between p-7 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#2baee2] bg-[#e0f4fc] text-[#2baee2] shadow-[0_4px_0_#2baee2]">
                <Users className="h-7 w-7" />
              </div>
              <div className="font-heading text-4xl font-black text-[#2baee2] sm:text-5xl lg:text-6xl">
                <AnimatedCounter
                  value={stats.totalMembers}
                  duration={950}
                  className="font-heading"
                />
              </div>
              <div className="font-heading mt-2 text-sm font-bold text-[#1e1b4b] sm:text-base">
                {dict.about.stats.totalMembers}
              </div>
            </Card>
          </ScrollReveal>

          {/* 2. Online Members */}
          <ScrollReveal animation="fade-up" delay={150}>
            <Card className="flex flex-col items-center justify-between p-7 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#10b981] bg-[#dcfce7] text-[#10b981] shadow-[0_4px_0_#10b981]">
                <span className="relative flex h-5 w-5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-5 w-5 rounded-full bg-emerald-500" />
                </span>
              </div>
              <div className="font-heading text-4xl font-black text-[#10b981] sm:text-5xl lg:text-6xl">
                <AnimatedCounter
                  value={stats.onlineMembers}
                  duration={950}
                  className="font-heading"
                />
              </div>
              <div className="font-heading mt-2 text-sm font-bold text-[#1e1b4b] sm:text-base">
                {dict.about.stats.onlineMembers}
              </div>
            </Card>
          </ScrollReveal>

          {/* 3. Voice Active Members */}
          <ScrollReveal animation="fade-up" delay={300}>
            <Card className="flex flex-col items-center justify-between p-7 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#7952bd] bg-[#f3ebff] text-[#7952bd] shadow-[0_4px_0_#7952bd]">
                <Headphones className="h-7 w-7" />
              </div>
              <div className="font-heading text-4xl font-black text-[#7952bd] sm:text-5xl lg:text-6xl">
                <AnimatedCounter
                  value={stats.voiceMembers}
                  duration={950}
                  className="font-heading"
                />
              </div>
              <div className="font-heading mt-2 text-sm font-bold text-[#1e1b4b] sm:text-base">
                {dict.about.stats.voiceMembers}
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

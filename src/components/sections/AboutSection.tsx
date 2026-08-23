"use client";

import * as React from "react";
import { Users, Headphones } from "lucide-react";
import { type AboutContent } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { type DiscordServerStats } from "@/lib/discord";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface AboutSectionProps {
  content?: Partial<AboutContent>;
  initialStats?: DiscordServerStats;
}

export function AboutSection({ content, initialStats }: AboutSectionProps) {
  const { dict } = useLanguage();

  const title = content?.title || dict.about.title;
  const description = content?.description || dict.about.description;

  const stats = initialStats || {
    totalMembers: 0,
    onlineMembers: 0,
    voiceMembers: 0,
    guildName: "Bloom Universe",
    isLive: false,
  };

  return (
    <section
      id="about"
      className="relative bg-[#fffdf5] pt-10 pb-16 text-[#1e1b4b] sm:pt-14 sm:pb-20"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-[#1e1b4b] sm:text-5xl lg:text-6xl">
            {title}
          </h2>

          <p className="mt-4 text-base leading-relaxed font-bold text-slate-600 sm:mt-6 sm:text-lg">
            {description}
          </p>
        </div>

        {/* 3D Cartoon Live Discord Server Stats Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-3">
          {/* 1. Total Members */}
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

          {/* 2. Online Members */}
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

          {/* 3. Voice Active Members */}
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
        </div>

        {/* 3 Pillars / Values in Colorful Cartoon Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3">
          <Card className="p-8">
            <div className="font-heading mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#2baee2] bg-[#e0f4fc] text-xl font-black text-[#2baee2] shadow-[0_4px_0_#2baee2]">
              {dict.about.pillars.p1.number}
            </div>
            <h3 className="font-heading text-xl font-bold text-[#1e1b4b]">
              {dict.about.pillars.p1.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed font-semibold text-slate-600">
              {dict.about.pillars.p1.description}
            </p>
          </Card>

          <Card className="p-8">
            <div className="font-heading mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#ffc700] bg-[#fff8d6] text-xl font-black text-[#b38600] shadow-[0_4px_0_#ffc700]">
              {dict.about.pillars.p2.number}
            </div>
            <h3 className="font-heading text-xl font-bold text-[#1e1b4b]">
              {dict.about.pillars.p2.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed font-semibold text-slate-600">
              {dict.about.pillars.p2.description}
            </p>
          </Card>

          <Card className="p-8">
            <div className="font-heading mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#7952bd] bg-[#f3ebff] text-xl font-black text-[#7952bd] shadow-[0_4px_0_#7952bd]">
              {dict.about.pillars.p3.number}
            </div>
            <h3 className="font-heading text-xl font-bold text-[#1e1b4b]">
              {dict.about.pillars.p3.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed font-semibold text-slate-600">
              {dict.about.pillars.p3.description}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import { type AboutContent, type AboutCardItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface AboutSectionProps {
  content?: Partial<AboutContent>;
  cards?: AboutCardItem[];
}

const DEFAULT_ABOUT_CARDS: AboutCardItem[] = [
  {
    id: "pillar-1",
    number: "01",
    title: "Squad Up & Play",
    description:
      "Never game alone. Find teammates for Valorant, Mobile Legends, Roblox, Minecraft, or casual party games in seconds.",
    color: "blue",
    order: 0,
  },
  {
    id: "pillar-2",
    number: "02",
    title: "Watch & Chill Nights",
    description:
      "Cozy community movie streams, anime watch parties, music jamming sessions, and spontaneous voice lounge hangouts.",
    color: "yellow",
    order: 1,
  },
  {
    id: "pillar-3",
    number: "03",
    title: "Make Real Friends & Vibe",
    description:
      "A warm, welcoming, and wholesome environment to network, share passions, tell stories, and build genuine friendships.",
    color: "purple",
    order: 2,
  },
];

const PILLAR_COLOR_STYLES: Record<
  string,
  {
    badgeClass: string;
  }
> = {
  blue: {
    badgeClass:
      "border-[#2baee2] bg-[#e0f4fc] text-[#2baee2] shadow-[0_4px_0_#2baee2]",
  },
  yellow: {
    badgeClass:
      "border-[#ffc700] bg-[#fff8d6] text-[#b38600] shadow-[0_4px_0_#ffc700]",
  },
  purple: {
    badgeClass:
      "border-[#7952bd] bg-[#f3ebff] text-[#7952bd] shadow-[0_4px_0_#7952bd]",
  },
};

export function AboutSection({ content, cards }: AboutSectionProps) {
  const { dict, locale } = useLanguage();

  const title = content?.title || dict.about.title;
  const description = content?.description || dict.about.description;
  const displayCards = cards && cards.length > 0 ? cards : DEFAULT_ABOUT_CARDS;

  return (
    <section
      id="about"
      className="relative bg-[#fffdf5] pt-8 pb-16 text-[#1e1b4b] sm:pt-10 sm:pb-20"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-[#1e1b4b] sm:text-5xl lg:text-6xl">
            {title}
          </h2>

          <p className="mt-4 text-base leading-relaxed font-bold text-slate-600 sm:mt-6 sm:text-lg">
            {description}
          </p>
        </ScrollReveal>

        {/* 3 Pillars / Values in Colorful Cartoon Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3">
          {displayCards.map((card, idx) => {
            const colorKey = (card.color || "blue").toLowerCase();
            const colorStyle =
              PILLAR_COLOR_STYLES[colorKey] || PILLAR_COLOR_STYLES.blue;

            // Translated title, description, and number if available in dictionary
            const pillarDict =
              dict.about.pillars?.[
                card.id as keyof typeof dict.about.pillars
              ] ||
              dict.about.pillars?.[
                `p${card.order + 1}` as keyof typeof dict.about.pillars
              ];

            // Prioritize dictionary translation for seamless multi-language support
            const cardTitle = pillarDict?.title || card.title;
            const cardDesc = pillarDict?.description || card.description;
            const cardNum = pillarDict?.number || card.number;

            return (
              <ScrollReveal
                key={card.id}
                animation="fade-up"
                delay={idx * 120}
              >
                <Card className="h-full p-8">
                  <div
                    className={`font-heading mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border-2 text-xl font-black ${colorStyle.badgeClass}`}
                  >
                    {cardNum}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#1e1b4b]">
                    {cardTitle}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed font-semibold text-slate-600">
                    {cardDesc}
                  </p>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { SOCIAL_LINKS, SITE_CONFIG } from "@/lib/constants";
import { type HeroContent } from "@/lib/types";
import { DiscordIcon } from "@/components/ui/SocialIcons";
import { CloudDividerTop } from "@/components/ui/CloudDividers";
import { Button } from "@/components/ui/Button";
import { BloomImage } from "@/components/ui/BloomImage";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface HeroSectionProps {
  content?: Partial<HeroContent>;
}

export function HeroSection({ content }: HeroSectionProps) {
  const { dict } = useLanguage();

  const title = content?.title || dict.hero.title;
  const subtitle = content?.subtitle || dict.hero.subtitle;
  const primaryCtaText = content?.primaryCtaText || dict.hero.primaryCta;
  const primaryCtaUrl = content?.primaryCtaUrl || SOCIAL_LINKS.discord;
  const secondaryCtaText = content?.secondaryCtaText || dict.hero.secondaryCta;
  const secondaryCtaUrl = content?.secondaryCtaUrl || "#subwebs";

  // Reusable Mascot Sticker Component with Cartoon Lazy Loading & Compression
  const MascotComponent = (
    <div className="group relative">
      {/* Cute Floating Mascot Card with Thick Sticker Border */}
      <div className="relative h-52 w-52 overflow-hidden rounded-full border-8 border-white shadow-[0_15px_0_rgba(0,0,0,0.15),0_25px_30px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-96 lg:w-96">
        <BloomImage
          src={SITE_CONFIG.logo}
          alt={SITE_CONFIG.name}
          fill
          quality={85}
          sizes="(max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
          className="object-cover"
          priority
        />
      </div>

      {/* Floating Badge Tag */}
      <div className="font-heading absolute -right-2 -bottom-2 rotate-6 rounded-full border-4 border-white bg-[#ffc700] px-4 py-1.5 text-xs font-black text-[#452203] shadow-lg sm:-right-3 sm:-bottom-3 sm:px-5 sm:py-2 sm:text-sm">
        {dict.hero.badge}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden pt-0 pb-0 text-white sm:pt-4 lg:pt-13">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout (lg screens and up: 2 Columns Side-by-Side) */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* Left Column: Title -> Description -> Buttons */}
          <div className="flex flex-col items-start text-left lg:col-span-7">
            <h1 className="font-heading text-shadow-cartoon-white text-6xl leading-[1.1] font-black tracking-tight xl:text-7xl">
              {title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed font-bold text-white xl:text-xl">
              {subtitle}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <a href={primaryCtaUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="yellow" size="lg" className="gap-3">
                  <DiscordIcon size={22} />
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </a>

              <Link href={secondaryCtaUrl}>
                <Button variant="white" size="lg" className="gap-2">
                  <Compass className="h-5 w-5 text-[#2baee2]" />
                  <span>{secondaryCtaText}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Mascot */}
          <div className="flex justify-center lg:col-span-5">
            {MascotComponent}
          </div>
        </div>

        {/* Mobile & Tablet Layout (< lg screens: Title -> Logo -> Description -> Buttons) */}
        <div className="flex flex-col items-center text-center lg:hidden">
          {/* 1. Title */}
          <h1 className="font-heading text-shadow-cartoon-white text-3xl leading-[1.15] font-black tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>

          {/* 2. Logo Mascot */}
          <div className="my-6 flex justify-center sm:my-8">
            {MascotComponent}
          </div>

          {/* 3. Description / Subtitle */}
          <p className="max-w-xl text-sm leading-relaxed font-bold text-white sm:text-base md:text-lg">
            {subtitle}
          </p>

          {/* 4. Action Buttons */}
          <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:gap-4">
            <a
              href={primaryCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="yellow"
                size="md"
                className="w-full gap-2.5 py-3 sm:w-auto sm:py-3.5 sm:text-base"
              >
                <DiscordIcon size={20} />
                <span>{primaryCtaText}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>

            <Link href={secondaryCtaUrl} className="w-full sm:w-auto">
              <Button
                variant="white"
                size="md"
                className="w-full gap-2 py-3 sm:w-auto sm:py-3.5 sm:text-base"
              >
                <Compass className="h-4 w-4 text-[#2baee2]" />
                <span>{secondaryCtaText}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Cloud Bottom Wave Transition into About Section */}
      <div className="mt-12 sm:mt-16 lg:mt-24">
        <CloudDividerTop className="text-[#fffdf5]" />
      </div>
    </section>
  );
}

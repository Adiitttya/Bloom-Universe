"use client";

import * as React from "react";
import Link from "next/link";
import { SITE_CONFIG, SOCIAL_LINKS, SUB_WEBS } from "@/lib/constants";
import { ArrowUpRight } from "lucide-react";
import {
  DiscordIcon,
  TikTokIcon,
  InstagramIcon,
} from "@/components/ui/SocialIcons";
import { Button } from "@/components/ui/Button";
import { BloomImage } from "@/components/ui/BloomImage";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { dict } = useLanguage();

  const navLinks = [
    { label: dict.nav.home, href: "/" },
    { label: dict.nav.about, href: "/#about" },
    { label: dict.nav.gallery, href: "/#gallery" },
    { label: dict.nav.ecosystem, href: "/#subwebs" },
  ];

  return (
    <footer className="relative bg-white text-[#1e1b4b]">
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4 sm:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#ffc700] shadow-sm">
                <BloomImage
                  src={SITE_CONFIG.logo}
                  alt={SITE_CONFIG.name}
                  fill
                  quality={80}
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <span className="font-heading text-2xl font-black tracking-tight text-[#1e1b4b]">
                {SITE_CONFIG.name}
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed font-bold text-slate-600">
              {dict.footer.description}
            </p>

            {/* Action Button: Join Discord Community */}
            <div className="pt-2">
              <a
                href={SOCIAL_LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="yellow"
                  size="sm"
                  className="gap-2 px-5 py-2.5 text-xs font-black"
                >
                  <DiscordIcon size={16} />
                  <span>{dict.footer.joinDiscord}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-black tracking-wider text-[#1e1b4b] uppercase">
              {dict.footer.navigation}
            </h4>
            <ul className="space-y-2 text-sm font-bold">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 transition-colors hover:text-[#2baee2]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sub-Webs Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-black tracking-wider text-[#1e1b4b] uppercase">
              {dict.footer.hubs}
            </h4>
            <ul className="space-y-2 text-sm font-bold">
              {SUB_WEBS.map((sub) => {
                const portalDict =
                  dict.ecosystem.portals[
                    sub.id as keyof typeof dict.ecosystem.portals
                  ];
                const title = portalDict?.title || sub.title;

                return (
                  <li key={sub.id}>
                    {sub.isLive ? (
                      <Link
                        href={sub.href}
                        className="text-slate-600 transition-colors hover:text-[#2baee2]"
                      >
                        {title}
                      </Link>
                    ) : (
                      <span className="flex items-center gap-2 text-slate-400">
                        <span>{title}</span>
                        <span className="font-heading text-[10px] font-black text-[#ffc700]">
                          ({dict.ecosystem.comingSoon})
                        </span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Social Icons & Copyright */}
        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-6 border-t-2 border-slate-100 pt-8 text-xs font-bold text-slate-500 sm:flex-row">
          <p>{dict.footer.copyright(currentYear)}</p>

          <div className="flex items-center gap-3">
            <a
              href={SOCIAL_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5865F2] text-white shadow-sm transition hover:scale-110"
            >
              <DiscordIcon size={18} />
            </a>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-sm transition hover:scale-110"
            >
              <TikTokIcon size={18} />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-sm transition hover:scale-110"
            >
              <InstagramIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

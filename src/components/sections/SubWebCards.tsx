"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Camera,
  Gamepad2,
  MessageCircle,
  Bot,
  Boxes,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { SUB_WEBS } from "@/lib/constants";
import { type SubWebItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const ICON_MAP = {
  ShoppingBag,
  Camera,
  Gamepad2,
  MessageCircle,
  Bot,
  Boxes,
};

interface SubWebCardsProps {
  items?: SubWebItem[];
}

export function SubWebCards({ items }: SubWebCardsProps) {
  const { dict } = useLanguage();
  const displayItems = items && items.length > 0 ? items : SUB_WEBS;

  return (
    <section
      id="subwebs"
      className="relative pt-6 pb-12 text-white sm:pt-10 sm:pb-16"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-shadow-cartoon-white text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {dict.ecosystem.title}
          </h2>

          <p className="mt-4 text-base leading-relaxed font-bold text-white/90 sm:text-lg">
            {dict.ecosystem.description}
          </p>
        </div>

        {/* 3D Game Portal Selector Grid - 6 Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((sub) => {
            const IconComponent =
              ICON_MAP[sub.icon as keyof typeof ICON_MAP] || ShoppingBag;

            // Retrieve translated portal info if available
            const portalDict =
              dict.ecosystem.portals[
                sub.id as keyof typeof dict.ecosystem.portals
              ];
            const title = portalDict?.title || sub.title;
            const description = portalDict?.description || sub.description;

            return (
              <Card
                key={sub.id}
                className="flex flex-col justify-between p-8 text-[#1e1b4b]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl border-2 border-[#2baee2] bg-[#e0f4fc] text-[#2baee2] shadow-[0_4px_0_#2baee2]">
                      <IconComponent className="h-8 w-8" />
                    </div>

                    {/* Only show badge if coming soon / in development */}
                    {!sub.isLive && (
                      <Badge variant="soon">{dict.ecosystem.comingSoon}</Badge>
                    )}
                  </div>

                  <h3 className="font-heading mt-6 text-2xl font-black text-[#1e1b4b]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed font-semibold text-slate-600">
                    {description}
                  </p>
                </div>

                <div className="mt-8 border-t-2 border-slate-100 pt-6">
                  {sub.isLive ? (
                    <Link href={sub.href} className="block w-full">
                      <Button
                        variant="yellow"
                        size="md"
                        className="w-full gap-2 py-3"
                      >
                        <span>{dict.ecosystem.openPortal}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="font-heading flex items-center justify-center gap-2 rounded-full bg-slate-100 py-3 text-xs font-bold text-slate-400">
                      <Clock className="h-4 w-4 text-[#ffc700]" />
                      <span>{dict.ecosystem.inDev}</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

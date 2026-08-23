"use client";

import * as React from "react";
import { Megaphone, X } from "lucide-react";

interface AnnouncementBannerProps {
  message?: string;
  isActive?: boolean;
}

export function AnnouncementBanner({
  message = "Welcome to the official Bloom Universe community portal! Explore our latest sub-webs & join the Discord.",
  isActive = true,
}: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = React.useState(false);

  if (!isActive || dismissed || !message) return null;

  return (
    <div className="relative z-50 w-full px-4 pt-2">
      <div className="container mx-auto flex max-w-4xl items-center justify-between rounded-full border-2 border-[#d9a300] bg-[#ffc700] px-4 py-2 text-[#452203] shadow-[0_4px_0_#d9a300]">
        <div className="font-heading mx-auto flex items-center justify-center gap-2 text-center text-xs font-bold sm:text-sm">
          <Megaphone className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="ml-2 cursor-pointer rounded-full p-1 transition hover:bg-[#d9a300]/30"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

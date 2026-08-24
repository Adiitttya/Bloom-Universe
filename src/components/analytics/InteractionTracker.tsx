"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export function trackEvent(
  action: string,
  details?: string,
  targetUrl?: string
) {
  try {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify({ action, details, targetUrl });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {}
}

export function InteractionTracker() {
  const pathname = usePathname();

  // Track page view once per path visit
  React.useEffect(() => {
    // Avoid tracking admin pages here (admin pages have dedicated audit logs)
    if (pathname.startsWith("/admin")) return;

    const key = `bloom_pv_${pathname}_${new Date().toISOString().slice(0, 13)}`; // 1-hour session debounce
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      trackEvent(
        "PAGE_VIEW",
        `Mengunjungi halaman: ${pathname}`,
        window.location.href
      );
    }
  }, [pathname]);

  // Global click listener for trackable links & buttons
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Never track clicks made within admin panel
      if (window.location.pathname.startsWith("/admin")) return;

      const target = (e.target as HTMLElement)?.closest(
        "[data-track-name], a[href^='http'], a[href^='https']"
      );
      if (!target) return;

      const trackName = target.getAttribute("data-track-name");
      const href = target.getAttribute("href");

      if (trackName) {
        trackEvent(
          "INTERACTION_CLICK",
          `Klik: ${trackName}`,
          href || undefined
        );
      } else if (href && !href.includes(window.location.host)) {
        let label = "Tautan Eksternal";
        if (href.includes("discord.gg") || href.includes("discord.com")) {
          label = "Undangan Discord";
        } else if (href.includes("instagram.com")) {
          label = "Instagram Bloom";
        } else if (href.includes("tiktok.com")) {
          label = "TikTok Bloom";
        } else if (href.includes("youtube.com")) {
          label = "YouTube Bloom";
        }
        trackEvent("CLICK_EXTERNAL_LINK", `Membuka ${label}: ${href}`, href);
      }
    };

    document.addEventListener("click", handleClick, { passive: true });
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

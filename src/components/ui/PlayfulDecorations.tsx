"use client";

import * as React from "react";

// Playful 4-Point Cartoon Sparkle SVG
export function SparkleIcon({
  className = "",
  size = 24,
  color = "#ffc700",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

// Playful 3D Cartoon Star SVG
export function CartoonStar({
  className = "",
  size = 24,
  color = "#ffc700",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

// Cute Fluffy Mini Cartoon Cloudlet SVG
export function FluffyCloudlet({
  className = "",
  size = 60,
  opacity = 0.4,
}: {
  className?: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 64 38"
      fill="#ffffff"
      fillOpacity={opacity}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 38C8.05887 38 0 29.9411 0 20C0 10.9856 6.63467 3.51869 15.3444 2.19307C18.2323 -0.731023 22.899 -0.731023 25.7869 2.19307C27.8732 0.812267 30.3475 0 33 0C41.2843 0 48 6.71573 48 15C48 15.3371 47.9888 15.6715 47.9668 16.0029C49.2608 15.3582 50.7291 15 52.2857 15C58.7551 15 64 20.2449 64 26.7143C64 32.9478 59.1352 38 53.1111 38H18Z" />
    </svg>
  );
}

// Background Playful Hero Floating Particles
export function HeroPlayfulDecorations() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Top Left Sparkle */}
      <div className="animate-float-gentle absolute top-6 left-6 hidden lg:block opacity-75">
        <SparkleIcon size={28} color="#ffc700" />
      </div>

      {/* Top Center-Left Star */}
      <div
        className="animate-float-gentle absolute top-20 left-[22%] hidden md:block opacity-60"
        style={{ animationDelay: "1s" }}
      >
        <CartoonStar size={22} color="#ffffff" />
      </div>

      {/* Left Bottom Mini Cloud */}
      <div
        className="animate-float-gentle absolute bottom-28 left-[4%] hidden sm:block"
        style={{ animationDelay: "2s" }}
      >
        <FluffyCloudlet size={85} opacity={0.35} />
      </div>

      {/* Center Top Floating Cloudlet */}
      <div
        className="animate-float-gentle absolute top-4 left-[48%] hidden xl:block"
        style={{ animationDelay: "1.5s" }}
      >
        <FluffyCloudlet size={70} opacity={0.25} />
      </div>

      {/* Top Right Cute Sparkle near Mascot */}
      <div
        className="animate-float-gentle absolute top-12 right-[8%] hidden sm:block opacity-85"
        style={{ animationDelay: "0.8s" }}
      >
        <SparkleIcon size={34} color="#ffc700" />
      </div>

      {/* Right Middle Star */}
      <div
        className="animate-float-gentle absolute top-1/2 right-[3%] hidden lg:block opacity-70"
        style={{ animationDelay: "2.5s" }}
      >
        <CartoonStar size={26} color="#ffffff" />
      </div>

      {/* Right Bottom Cloud */}
      <div
        className="animate-float-gentle absolute bottom-24 right-[12%] hidden md:block"
        style={{ animationDelay: "3s" }}
      >
        <FluffyCloudlet size={95} opacity={0.3} />
      </div>
    </div>
  );
}

// Background Playful Ecosystem & Socials Floating Particles
export function SkySectionDecorations() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Top Left Star */}
      <div className="animate-float-gentle absolute top-8 left-[6%] hidden sm:block opacity-65">
        <CartoonStar size={24} color="#ffc700" />
      </div>

      {/* Top Right Sparkle */}
      <div
        className="animate-float-gentle absolute top-12 right-[8%] hidden md:block opacity-80"
        style={{ animationDelay: "1.2s" }}
      >
        <SparkleIcon size={30} color="#ffc700" />
      </div>

      {/* Middle Floating Cloud */}
      <div
        className="animate-float-gentle absolute top-1/3 left-[2%] hidden xl:block"
        style={{ animationDelay: "2.2s" }}
      >
        <FluffyCloudlet size={75} opacity={0.25} />
      </div>

      {/* Bottom Right Floating Cloud */}
      <div
        className="animate-float-gentle absolute bottom-28 right-[3%] hidden lg:block"
        style={{ animationDelay: "1.7s" }}
      >
        <FluffyCloudlet size={90} opacity={0.3} />
      </div>

      {/* Floating Sparkle Bottom Left */}
      <div
        className="animate-float-gentle absolute bottom-20 left-[8%] hidden sm:block opacity-75"
        style={{ animationDelay: "0.5s" }}
      >
        <SparkleIcon size={22} color="#ffffff" />
      </div>
    </div>
  );
}

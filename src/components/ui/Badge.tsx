import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "live" | "soon" | "primary" | "purple" | "yellow" | "neutral";
}

export function Badge({
  className,
  variant = "primary",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    live: "bg-[#4ade80] text-[#14532d] shadow-sm",
    soon: "bg-[#ffc700] text-[#452203] shadow-sm",
    primary: "bg-[#e0f4fc] text-[#1b8ebc] border border-[#2baee2]",
    purple: "bg-[#f3ebff] text-[#7952bd] border border-[#7952bd]",
    yellow: "bg-[#fff8d6] text-[#b38600] border border-[#ffc700]",
    neutral: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={cn(
        "font-heading inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-black select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {variant === "live" && (
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#14532d]" />
      )}
      {children}
    </span>
  );
}

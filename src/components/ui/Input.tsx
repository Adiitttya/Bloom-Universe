import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "font-heading flex h-12 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#1e1b4b] shadow-sm transition placeholder:text-slate-400 focus:border-[#2baee2] focus:ring-4 focus:ring-[#2baee2]/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

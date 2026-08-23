import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "font-heading flex w-full rounded-2xl border-2 border-slate-200 bg-white p-4 text-sm font-bold text-[#1e1b4b] shadow-sm transition placeholder:text-slate-400 focus:border-[#2baee2] focus:ring-4 focus:ring-[#2baee2]/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

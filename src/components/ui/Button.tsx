import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "yellow" | "white" | "discord" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "yellow",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "font-heading inline-flex items-center justify-center font-black tracking-wide rounded-full transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:translate-y-1";

    const variantStyles = {
      yellow:
        "btn-3d-yellow bg-[#ffc700] text-[#452203] shadow-[0_6px_0_#d9a300,0_10px_15px_rgba(0,0,0,0.15)] hover:bg-[#ffd22e] hover:-translate-y-0.5",
      white:
        "btn-3d-white bg-white text-[#1e1b4b] border-2 border-slate-200 shadow-[0_5px_0_#cbd5e1,0_8px_12px_rgba(0,0,0,0.06)] hover:bg-[#f8fafc] hover:-translate-y-0.5",
      discord:
        "btn-3d-discord bg-[#5865f2] text-white shadow-[0_6px_0_#3c45a5,0_10px_15px_rgba(88,101,242,0.3)] hover:bg-[#6b77f5] hover:-translate-y-0.5",
      outline:
        "border-2 border-slate-300 bg-white text-[#1e1b4b] shadow-[0_4px_0_#cbd5e1] hover:bg-slate-50 hover:border-slate-400 hover:-translate-y-0.5",
      ghost:
        "bg-transparent text-[#1e1b4b] hover:bg-[#e0f4fc] hover:text-[#1b8ebc]",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-2.5 sm:py-3 text-xs sm:text-sm",
      lg: "px-8 py-3.5 sm:py-4 text-sm sm:text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="mr-2.5 inline-block aspect-square h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

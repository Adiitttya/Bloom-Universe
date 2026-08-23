import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "yellow" | "purple";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default:
        "card-cartoon bg-white border-4 border-white shadow-[0_10px_0_#d1e3ec,0_20px_25px_-5px_rgba(0,0,0,0.08)]",
      yellow:
        "card-cartoon-yellow bg-[#fff8d6] border-4 border-white shadow-[0_10px_0_#e6c860,0_20px_25px_-5px_rgba(0,0,0,0.08)]",
      purple:
        "card-cartoon-purple bg-[#f3ebff] border-4 border-white shadow-[0_10px_0_#c2a7f0,0_20px_25px_-5px_rgba(0,0,0,0.08)]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-[2rem] p-6 transition-all duration-200 sm:p-8",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-heading text-xl font-black tracking-tight text-[#1e1b4b] sm:text-2xl",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-xs leading-relaxed font-semibold text-slate-600 sm:text-sm",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center border-t-2 border-slate-100 pt-5 sm:pt-6",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

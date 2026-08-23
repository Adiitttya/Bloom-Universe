"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BloomImageProps extends Omit<ImageProps, "onLoad"> {
  containerClassName?: string;
  showShimmerIcon?: boolean;
}

export function BloomImage({
  src,
  alt,
  className,
  containerClassName,
  showShimmerIcon = false,
  quality = 80,
  priority = false,
  ...props
}: BloomImageProps) {
  const [isLoading, setIsLoading] = React.useState(!priority);

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        props.fill ? "h-full w-full" : "",
        containerClassName
      )}
    >
      {/* Loading Skeleton with Standard Rotating Circular Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex animate-pulse items-center justify-center bg-gradient-to-tr from-[#e0f4fc] via-[#fff8d6] to-[#f3ebff]">
          {showShimmerIcon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#2baee2] shadow-md backdrop-blur-xs">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Optimized Image with Smooth Fade-in Transition */}
      <Image
        src={src}
        alt={alt}
        quality={quality}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        className={cn(
          "transition-all duration-300 ease-out",
          isLoading
            ? "scale-102 opacity-0 blur-xs"
            : "scale-100 opacity-100 blur-none",
          className
        )}
        {...props}
      />
    </div>
  );
}

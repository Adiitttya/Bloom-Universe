"use client";

import * as React from "react";

export type AnimationType =
  "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "pop-in";

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  className?: string;
  as?: React.ElementType;
  initialVisible?: boolean;
}

const ANIMATION_INITIAL_STYLES: Record<AnimationType, React.CSSProperties> = {
  "fade-up": {
    opacity: 0,
    transform: "translate3d(0, 36px, 0)",
  },
  "fade-down": {
    opacity: 0,
    transform: "translate3d(0, -36px, 0)",
  },
  "fade-left": {
    opacity: 0,
    transform: "translate3d(-36px, 0, 0)",
  },
  "fade-right": {
    opacity: 0,
    transform: "translate3d(36px, 0, 0)",
  },
  "zoom-in": {
    opacity: 0,
    transform: "scale3d(0.88, 0.88, 1)",
  },
  "pop-in": {
    opacity: 0,
    transform: "scale3d(0.82, 0.82, 1) translate3d(0, 24px, 0)",
  },
};

const ANIMATION_EASINGS: Record<AnimationType, string> = {
  "fade-up": "cubic-bezier(0.16, 1, 0.3, 1)",
  "fade-down": "cubic-bezier(0.16, 1, 0.3, 1)",
  "fade-left": "cubic-bezier(0.16, 1, 0.3, 1)",
  "fade-right": "cubic-bezier(0.16, 1, 0.3, 1)",
  "zoom-in": "cubic-bezier(0.16, 1, 0.3, 1)",
  "pop-in": "cubic-bezier(0.34, 1.56, 0.64, 1)", // playful bouncy spring for cartoon theme
};

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 750,
  threshold = 0.1,
  rootMargin = "0px 0px -30px 0px",
  once = true,
  className = "",
  style,
  as: Component = "div",
  initialVisible = false,
  ...rest
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = React.useState(initialVisible);
  const elementRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (initialVisible && once) return;
    const node = elementRef.current;
    if (!node) return;

    // Check if user prefers reduced motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  const easing = ANIMATION_EASINGS[animation];
  const initialStyle = ANIMATION_INITIAL_STYLES[animation];

  const dynamicStyle: React.CSSProperties = {
    ...style,
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: easing,
    transitionDelay: `${delay}ms`,
    willChange: isVisible ? "auto" : "opacity, transform",
    ...(isVisible
      ? {
          opacity: 1,
          transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)",
        }
      : initialStyle),
  };

  return (
    <Component
      ref={elementRef}
      className={className}
      style={dynamicStyle}
      {...rest}
    >
      {children}
    </Component>
  );
}

"use client";

import * as React from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  formatter?: (val: number) => string;
}

export function AnimatedCounter({
  value,
  duration = 950,
  className,
  formatter = (val) => new Intl.NumberFormat("en-US").format(val),
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = React.useState<number>(0);
  const elementRef = React.useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = React.useRef<boolean>(false);
  const [isInView, setIsInView] = React.useState<boolean>(false);

  // Trigger once when element enters viewport
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.15 }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, []);

  React.useEffect(() => {
    // If element is not in view or value is 0, do not run animation loop
    if (!isInView || value === 0) return;

    // If initial animation has already completed, update via callback
    if (hasAnimatedRef.current) {
      const timer = setTimeout(() => setDisplayValue(value), 0);
      return () => clearTimeout(timer);
    }

    let startTimestamp: number | null = null;
    const startVal = 0;
    const targetVal = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Fast, snappy natural count-up (ease-out quadratic)
      const ease = 1 - Math.pow(1 - progress, 2);
      const current = Math.round(startVal + (targetVal - startVal) * ease);

      setDisplayValue(Math.max(0, current));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(targetVal);
        hasAnimatedRef.current = true;
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value, duration, isInView]);

  return (
    <span ref={elementRef} suppressHydrationWarning className={className}>
      {formatter(value === 0 ? 0 : displayValue)}
    </span>
  );
}

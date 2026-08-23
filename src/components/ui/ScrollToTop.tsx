"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      className={`btn-3d-yellow fixed right-5 bottom-5 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-white text-[#452203] shadow-lg transition-all duration-300 ease-out sm:right-8 sm:bottom-8 sm:h-14 sm:w-14 ${
        isVisible
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100 hover:scale-110 active:scale-95"
          : "pointer-events-none translate-y-6 scale-75 opacity-0"
      }`}
    >
      <ArrowUp className="h-6 w-6 stroke-[3]" />
    </button>
  );
}

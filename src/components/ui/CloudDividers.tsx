import * as React from "react";

/**
 * Playful Cartoon Cloud & Wave SVG Dividers
 * Used to seamlessly connect sections like in Nintendo / Overcooked webs
 */

export function CloudDividerTop({
  className = "text-white",
}: {
  className?: string;
}) {
  return (
    <div className="-mb-[1px] w-full overflow-hidden leading-none">
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-10 w-full sm:h-16 md:h-20 lg:h-24 ${className}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0,64 C120,20 240,90 360,45 C480,0 600,80 720,40 C840,0 960,75 1080,35 C1200,-5 1320,60 1440,30 L1440,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export function CloudDividerBottom({
  className = "text-white",
}: {
  className?: string;
}) {
  return (
    <div className="-mt-[1px] w-full overflow-hidden leading-none">
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-10 w-full sm:h-16 md:h-20 lg:h-24 ${className}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 L1440,0 L1440,30 C1320,60 1200,-5 1080,35 C960,75 840,0 720,40 C600,80 480,0 360,45 C240,90 120,20 0,64 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export function ScallopWave({
  className = "text-white",
}: {
  className?: string;
}) {
  return (
    <div className="-mb-[1px] w-full overflow-hidden leading-none">
      <svg
        viewBox="0 0 1200 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-full sm:h-10 ${className}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0 0 C 50 40, 100 40, 150 0 C 200 40, 250 40, 300 0 C 350 40, 400 40, 450 0 C 500 40, 550 40, 600 0 C 650 40, 700 40, 750 0 C 800 40, 850 40, 900 0 C 950 40, 1000 40, 1050 0 C 1100 40, 1150 40, 1200 0 L 1200 48 L 0 48 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

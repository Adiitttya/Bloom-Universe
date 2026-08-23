"use client";

import * as React from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { type GalleryItem } from "@/lib/types";
import { CloudDividerTop } from "@/components/ui/CloudDividers";
import { BloomImage } from "@/components/ui/BloomImage";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface GallerySectionProps {
  images?: GalleryItem[];
}

const ITEMS_PER_PAGE = 3;

const DEFAULT_GALLERY_IMAGES: GalleryItem[] = [
  {
    id: "1",
    url: "/Bloom.jpg",
    alt: "Official Bloom Universe Mascot",
    order: 0,
  },
  {
    id: "2",
    url: "/Bloom.jpg",
    alt: "Bloom Community Gathering",
    order: 1,
  },
  {
    id: "3",
    url: "/Bloom.jpg",
    alt: "Bloom Gaming Night & Mabar",
    order: 2,
  },
  {
    id: "4",
    url: "/Bloom.jpg",
    alt: "Bloom Photobooth Showcase",
    order: 3,
  },
  {
    id: "5",
    url: "/Bloom.jpg",
    alt: "Bloom Discord Voice Hangout",
    order: 4,
  },
  {
    id: "6",
    url: "/Bloom.jpg",
    alt: "Bloom Universe Creator Corner",
    order: 5,
  },
];

export function GallerySection({ images = [] }: GallerySectionProps) {
  const { dict } = useLanguage();

  const displayImages: GalleryItem[] =
    images.length > 0 ? images : DEFAULT_GALLERY_IMAGES;

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(displayImages.length / ITEMS_PER_PAGE);

  // Lightbox Modal State
  const [activeImageIndex, setActiveImageIndex] = React.useState<number | null>(
    null
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentImages = displayImages.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Lock body scroll when popup is active
  React.useEffect(() => {
    if (activeImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeImageIndex]);

  // Keyboard navigation for Lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;

      if (e.key === "Escape") {
        setActiveImageIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) =>
          prev !== null
            ? prev > 0
              ? prev - 1
              : displayImages.length - 1
            : null
        );
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) =>
          prev !== null
            ? prev < displayImages.length - 1
              ? prev + 1
              : 0
            : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, displayImages.length]);

  return (
    <section
      id="gallery"
      className="relative bg-[#fffdf5] pt-4 pb-0 text-[#1e1b4b]"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-[#1e1b4b] sm:text-5xl lg:text-6xl">
            {dict.gallery.title}
          </h2>

          <p className="mt-4 text-base leading-relaxed font-bold text-slate-600 sm:text-lg">
            {dict.gallery.description}
          </p>
        </div>

        {/* 3D Smooth Polaroid Gallery Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {currentImages.map((img, index) => {
            const actualIndex = startIndex + index;
            const rotationStyle =
              index % 3 === 0
                ? "rotate-[-2deg] hover:rotate-[-1deg]"
                : index % 3 === 1
                  ? "rotate-[2deg] hover:rotate-[1deg]"
                  : "rotate-[-1deg] hover:rotate-[0deg]";

            return (
              <div
                key={img.id}
                onClick={() => setActiveImageIndex(actualIndex)}
                className={`group relative cursor-pointer overflow-hidden rounded-[2rem] border-4 border-white bg-white p-4 pb-6 shadow-[0_10px_0_#d1e3ec,0_20px_25px_-5px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_14px_0_#d1e3ec,0_25px_30px_-5px_rgba(0,0,0,0.12)] ${rotationStyle}`}
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-100">
                  <BloomImage
                    src={img.url}
                    alt={img.alt || "Bloom Universe moment"}
                    fill
                    quality={75}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  {/* Hover Magnify Icon */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#2baee2] shadow-lg">
                      <Maximize2 className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="font-heading text-base font-bold text-[#1e1b4b]">
                    {img.alt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2 sm:gap-3">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="btn-3d-white font-heading flex h-11 w-11 cursor-pointer items-center justify-center rounded-full font-black disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`font-heading flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-base font-black transition-all ${
                    currentPage === pageNum
                      ? "btn-3d-yellow scale-105"
                      : "btn-3d-white"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

            {/* Next Button */}
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="btn-3d-white font-heading flex h-11 w-11 cursor-pointer items-center justify-center rounded-full font-black disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal Popup (High-Res Image with Shimmer Spinner) */}
      {activeImageIndex !== null && (
        <div
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md transition-all duration-300 sm:p-6"
          onClick={() => setActiveImageIndex(null)}
        >
          <div
            className="animate-in zoom-in-95 relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border-4 border-white bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 sm:rounded-[2.5rem] sm:p-6 lg:max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Title and Close Button */}
            <div className="mb-3 flex items-start justify-between gap-3 px-1">
              <div className="flex min-w-0 flex-col pr-2">
                <h3 className="font-heading line-clamp-2 text-base leading-tight font-black text-[#1e1b4b] sm:text-2xl">
                  {displayImages[activeImageIndex].alt || "Bloom Gallery Photo"}
                </h3>
                <span className="font-heading mt-0.5 text-[11px] font-bold text-slate-500 sm:text-xs">
                  {dict.gallery.photoOf(
                    activeImageIndex + 1,
                    displayImages.length
                  )}
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveImageIndex(null)}
                aria-label={dict.gallery.close}
                className="btn-3d-yellow flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full sm:h-11 sm:w-11"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Responsive Full-Quality Image Container with Loading Shimmer */}
            <div className="relative flex aspect-square h-auto max-h-[68vh] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-900/5 sm:aspect-video sm:h-[60vh] md:h-[68vh]">
              <BloomImage
                src={displayImages[activeImageIndex].url}
                alt={displayImages[activeImageIndex].alt || "Bloom Gallery"}
                fill
                quality={95}
                priority
                showShimmerIcon
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-contain p-1 sm:p-2"
              />

              {/* Left / Right Arrow Controls */}
              {displayImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev !== null
                          ? prev > 0
                            ? prev - 1
                            : displayImages.length - 1
                          : null
                      )
                    }
                    aria-label={dict.gallery.prev}
                    className="btn-3d-white absolute top-1/2 left-2 z-30 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full shadow-lg sm:left-3 sm:h-12 sm:w-12"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev !== null
                          ? prev < displayImages.length - 1
                            ? prev + 1
                            : 0
                          : null
                      )
                    }
                    aria-label={dict.gallery.next}
                    className="btn-3d-white absolute top-1/2 right-2 z-30 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full shadow-lg sm:right-3 sm:h-12 sm:w-12"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cloud Bottom Wave Transition into Blue Sub-Webs Section */}
      <div className="mt-16 sm:mt-24">
        <CloudDividerTop className="text-[#2baee2]" />
      </div>
    </section>
  );
}

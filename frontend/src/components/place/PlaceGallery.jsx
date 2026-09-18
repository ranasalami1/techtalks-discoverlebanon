"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function PlaceGallery({ images, placeName }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;
    function onKey(event) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((i) => (i + 1) % images.length);
      if (event.key === "ArrowLeft")
        setActiveIndex((i) => (i - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, images.length]);

  if (!images?.length) return null;

  return (
    <section>
      <SectionHeading eyebrow="Gallery" title="In pictures">
        <span className="text-sm text-ink-faint">{images.length} photos</span>
      </SectionHeading>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`group relative overflow-hidden rounded-xl bg-cream-soft ${
              index === 0 ? "col-span-2 aspect-[16/9] sm:col-span-2 sm:row-span-2 sm:aspect-auto" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${placeName} photo ${activeIndex + 1} of ${images.length}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 rounded-full bg-cream/10 p-2 text-cream hover:bg-cream/20"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i - 1 + images.length) % images.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-cream/10 p-2 text-cream hover:bg-cream/20"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i + 1) % images.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-cream/10 p-2 text-cream hover:bg-cream/20"
          >
            <ChevronRight size={22} />
          </button>

          <figure
            className="relative h-full max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
            <figcaption className="absolute inset-x-0 -bottom-8 text-center text-sm text-cream/70">
              {images[activeIndex].alt}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

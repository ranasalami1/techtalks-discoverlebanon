"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Footprints, MapPin, Plus, Undo2, Utensils, X } from "lucide-react";
import SavedPlaceCard from "@/components/SavedPlaceCard";
import SavedPlacesMap from "@/components/SavedPlacesMap";
import { savedFilters, savedPlaces } from "@/data/savedPlaces";

const filterIcons = {
  bookmark: Bookmark,
  "map-pin": MapPin,
  hiking: Footprints,
  utensils: Utensils,
};

const HERO_IMAGE = "https://picsum.photos/seed/lebanon-coast/1800/700";

export default function SavedPlacesPage() {
  const [places, setPlaces] = useState(savedPlaces);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lastRemoved, setLastRemoved] = useState(null);

  // Auto-dismiss the undo toast after a few seconds.
  useEffect(() => {
    if (!lastRemoved) return;
    const timer = setTimeout(() => setLastRemoved(null), 6000);
    return () => clearTimeout(timer);
  }, [lastRemoved]);

  const counts = useMemo(() => {
    const byType = { all: places.length };
    for (const p of places) byType[p.type] = (byType[p.type] ?? 0) + 1;
    return byType;
  }, [places]);

  const visiblePlaces =
    activeFilter === "all" ? places : places.filter((p) => p.type === activeFilter);

  const handleRemove = (id) => {
    const index = places.findIndex((p) => p.id === id);
    if (index === -1) return;
    setLastRemoved({ place: places[index], index });
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUndo = () => {
    if (!lastRemoved) return;
    setPlaces((prev) => {
      const next = [...prev];
      next.splice(lastRemoved.index, 0, lastRemoved.place);
      return next;
    });
    setLastRemoved(null);
  };

  return (
    <div className="bg-cream">
      {/* Hero banner */}
      <section className="relative h-[260px] overflow-hidden sm:h-[310px]">
        <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/25 to-transparent" />
        <div className="relative flex h-full items-center justify-between gap-8 px-6 sm:px-12">
          <div className="max-w-xl">
            <p className="mb-2 text-[12px] font-medium tracking-[0.3em] text-white/85">MY JOURNEY</p>
            <h1 className="font-serif text-5xl text-white sm:text-6xl">Saved Places</h1>
            <p className="mt-4 text-[17px] leading-snug text-white/90">
              Keep track of the places that inspire you.
              <br />
              Plan your next adventure, anytime.
            </p>
          </div>
          <p
            aria-hidden="true"
            className="hidden -rotate-6 font-script text-3xl leading-tight text-white/90 lg:block"
          >
            Same places,
            <br />
            <span className="ml-8">different stories.</span>
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 pt-6 sm:px-10">
        {/* Filter tabs + add button */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter saved items">
            {savedFilters.map((filter) => {
              const active = filter.id === activeFilter;
              const Icon = filterIcons[filter.icon];
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-[14px] font-medium transition-colors ${
                    active
                      ? "bg-olive text-white shadow-sm"
                      : "bg-cream-soft text-ink hover:bg-olive-soft"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.75} />
                  {filter.label} ({counts[filter.id] ?? 0})
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:border-olive hover:text-olive"
          >
            <Plus size={16} strokeWidth={2} />
            Add Place
          </button>
        </div>

        {/* Cards + side panel */}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            {visiblePlaces.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visiblePlaces.map((place) => (
                  <SavedPlaceCard key={place.id} place={place} onRemove={handleRemove} />
                ))}
              </div>
            ) : places.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-white/60 px-6 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-olive-soft text-olive">
                  <Bookmark size={24} strokeWidth={1.5} />
                </span>
                <h3 className="mt-4 font-serif text-xl font-semibold text-ink">No saved places yet</h3>
                <p className="mt-2 max-w-sm text-sm text-ink-soft">
                  Tap the bookmark on any place, activity or restaurant to keep it here for later.
                </p>
                <Link
                  href="/explore"
                  className="mt-6 rounded-full bg-olive px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink"
                >
                  Explore Lebanon
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white/60 px-6 py-16 text-center text-ink-soft">
                Nothing saved in this category yet.{" "}
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className="font-medium text-olive underline underline-offset-4 hover:text-ink"
                >
                  Show all
                </button>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-5">
            <SavedPlacesMap />
            <div className="flex items-center gap-4 rounded-xl border border-border bg-cream-soft px-5 py-8">
              <svg
                viewBox="0 0 48 64"
                className="h-16 w-12 shrink-0 text-olive"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M34 4 C20 20, 14 40, 12 60" />
                <path d="M30 14 C22 14, 16 18, 14 26 C22 26, 28 22, 30 14 Z" />
                <path d="M22 30 C14 30, 8 36, 8 44 C16 44, 22 38, 22 30 Z" />
                <path d="M33 18 C40 20, 44 26, 42 34 C36 32, 32 26, 33 18 Z" />
                <path d="M26 38 C32 40, 36 46, 34 54 C28 52, 24 46, 26 38 Z" />
              </svg>
              <p className="font-serif text-[19px] italic leading-snug text-ink">
                &ldquo;Collect places,
                <br />
                not things.&rdquo;
                <span className="mt-3 block h-px w-14 bg-gold" aria-hidden="true" />
              </p>
            </div>
          </aside>
        </div>
      </section>

      {lastRemoved && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 rounded-full bg-ink px-5 py-3 text-sm text-white shadow-lg"
        >
          <span>
            Removed <strong className="font-medium">{lastRemoved.place.title}</strong>
          </span>
          <button
            type="button"
            onClick={handleUndo}
            className="flex items-center gap-1 font-medium text-gold hover:text-white"
          >
            <Undo2 size={14} strokeWidth={1.75} />
            Undo
          </button>
          <button
            type="button"
            onClick={() => setLastRemoved(null)}
            aria-label="Dismiss"
            className="text-white/60 hover:text-white"
          >
            <X size={14} strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  );
}

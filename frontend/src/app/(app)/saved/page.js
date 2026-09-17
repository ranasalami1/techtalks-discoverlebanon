"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, ChevronDown, Search, Undo2, X } from "lucide-react";
import SavedPlaceCard from "@/components/SavedPlaceCard";
import { savedCategories, savedPlaces } from "@/data/savedPlaces";

const sortOptions = ["Recently Saved", "Oldest First", "Name (A-Z)", "Name (Z-A)"];

export default function SavedPlacesPage() {
  const [places, setPlaces] = useState(savedPlaces);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState(sortOptions[0]);
  const [sortOpen, setSortOpen] = useState(false);
  const [lastRemoved, setLastRemoved] = useState(null);

  // Auto-dismiss the undo toast after a few seconds.
  useEffect(() => {
    if (!lastRemoved) return;
    const timer = setTimeout(() => setLastRemoved(null), 6000);
    return () => clearTimeout(timer);
  }, [lastRemoved]);

  const visiblePlaces = useMemo(() => {
    let results = places;

    if (activeCategory !== "all") {
      results = results.filter((p) => p.category === activeCategory);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.badge.toLowerCase().includes(q)
      );
    }

    results = [...results];
    if (sort === "Recently Saved") {
      results.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
    } else if (sort === "Oldest First") {
      results.sort((a, b) => a.savedAt.localeCompare(b.savedAt));
    } else if (sort === "Name (A-Z)") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "Name (Z-A)") {
      results.sort((a, b) => b.title.localeCompare(a.title));
    }

    return results;
  }, [places, activeCategory, query, sort]);

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

  const isFiltering = query.trim() !== "" || activeCategory !== "all";

  return (
    <div>
      <section className="relative flex h-[280px] items-center overflow-hidden bg-gradient-to-br from-[#46512f] via-[#6b6b4a] to-[#b08d57] sm:h-[320px]">
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative w-full px-6 sm:px-10">
          <p className="mb-3 flex items-center gap-2 text-[13px] font-medium tracking-[0.12em] text-white/80">
            <Bookmark size={14} strokeWidth={1.75} />
            YOUR COLLECTION
          </p>
          <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">
            Saved Places
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-white/90">
            The places, activities and experiences you have bookmarked to
            revisit on your journey through Lebanon.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 pt-10 sm:px-10">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {savedCategories.map((category) => {
            const active = category.id === activeCategory;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  active
                    ? "border-olive-dark bg-olive-dark text-white"
                    : "border-border bg-white text-ink-soft hover:border-olive hover:text-ink"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              {places.length} Saved {places.length === 1 ? "Place" : "Places"}
            </h2>
            {isFiltering && (
              <span className="text-sm text-ink-faint">
                Showing {visiblePlaces.length}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink-soft focus-within:border-olive">
              <Search size={14} strokeWidth={1.75} className="text-ink-faint" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your saved places"
                className="w-44 bg-transparent text-ink outline-none placeholder:text-ink-faint sm:w-56"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="text-ink-faint hover:text-ink"
                >
                  <X size={14} strokeWidth={1.75} />
                </button>
              )}
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm text-ink-soft hover:text-ink"
              >
                {sort}
                <ChevronDown size={14} strokeWidth={1.75} />
              </button>
              {sortOpen && (
                <ul className="absolute right-0 top-10 z-10 w-44 overflow-hidden rounded-lg border border-border bg-white shadow-md">
                  {sortOptions.map((option) => (
                    <li key={option}>
                      <button
                        type="button"
                        onClick={() => {
                          setSort(option);
                          setSortOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-ink-soft hover:bg-cream-soft hover:text-ink"
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {visiblePlaces.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visiblePlaces.map((place) => (
              <SavedPlaceCard
                key={place.id}
                place={place}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : places.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-white/60 px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-olive-soft text-olive-dark">
              <Bookmark size={24} strokeWidth={1.5} />
            </span>
            <h3 className="mt-4 font-serif text-xl font-semibold text-ink">
              No saved places yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-ink-soft">
              Tap the bookmark on any place, activity or story to keep it here
              for later.
            </p>
            <Link
              href="/search"
              className="mt-6 rounded-full bg-olive-dark px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-olive"
            >
              Explore Lebanon
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white/60 px-6 py-16 text-center text-ink-soft">
            None of your saved places match this filter.{" "}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
              }}
              className="font-medium text-olive-dark underline underline-offset-4 hover:text-ink"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {lastRemoved && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 rounded-full border border-border bg-ink px-5 py-3 text-sm text-white shadow-lg"
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

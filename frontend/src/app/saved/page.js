"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Footprints,
  MapPin,
  Plus,
  Undo2,
  Utensils,
  X,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import SavedPlaceCard from "@/components/SavedPlaceCard";
import SavedPlacesMap from "@/components/SavedPlacesMap";
import { savedFilters, savedPlaces } from "@/data/savedPlaces";

/* =====================================================
   FILTER ICONS
===================================================== */

const filterIcons = {
  bookmark: Bookmark,
  "map-pin": MapPin,
  hiking: Footprints,
  utensils: Utensils,
};

const HERO_IMAGE =
  "https://picsum.photos/seed/lebanon-coast/1800/700";

const EMPTY_FORM = {
  title: "",
  location: "",
  type: "places",
  badge: "",
  note: "",
  image: "",
};

/* =====================================================
   PAGE
===================================================== */

export default function SavedPlacesPage() {
  const [places, setPlaces] = useState(savedPlaces);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lastRemoved, setLastRemoved] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlace, setNewPlace] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  /* =====================================================
     REMOVE TOAST TIMER
  ===================================================== */

  useEffect(() => {
    if (!lastRemoved) return;

    const timer = setTimeout(() => {
      setLastRemoved(null);
    }, 6000);

    return () => clearTimeout(timer);
  }, [lastRemoved]);

  /* =====================================================
     CLOSE MODAL WITH ESC
  ===================================================== */

  useEffect(() => {
    if (!showAddModal) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeAddModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showAddModal]);

  /* =====================================================
     COUNTS
  ===================================================== */

  const counts = useMemo(() => {
    const byType = {
      all: places.length,
    };

    for (const place of places) {
      byType[place.type] =
        (byType[place.type] ?? 0) + 1;
    }

    return byType;
  }, [places]);

  /* =====================================================
     FILTER
  ===================================================== */

  const visiblePlaces =
    activeFilter === "all"
      ? places
      : places.filter(
          (place) => place.type === activeFilter
        );

  /* =====================================================
     REMOVE
  ===================================================== */

  const handleRemove = (id) => {
    const index = places.findIndex(
      (place) => place.id === id
    );

    if (index === -1) return;

    setLastRemoved({
      place: places[index],
      index,
    });

    setPlaces((previousPlaces) =>
      previousPlaces.filter(
        (place) => place.id !== id
      )
    );
  };

  /* =====================================================
     UNDO
  ===================================================== */

  const handleUndo = () => {
    if (!lastRemoved) return;

    setPlaces((previousPlaces) => {
      const nextPlaces = [...previousPlaces];

      nextPlaces.splice(
        lastRemoved.index,
        0,
        lastRemoved.place
      );

      return nextPlaces;
    });

    setLastRemoved(null);
  };

  /* =====================================================
     ADD PLACE
  ===================================================== */

  const openAddModal = () => {
    setNewPlace(EMPTY_FORM);
    setFormError("");
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewPlace(EMPTY_FORM);
    setFormError("");
  };

  const handleNewPlaceChange = (event) => {
    const { name, value } = event.target;

    setNewPlace((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  const handleAddPlace = (event) => {
    event.preventDefault();

    if (
      !newPlace.title.trim() ||
      !newPlace.location.trim()
    ) {
      setFormError(
        "Please enter the place name and location."
      );
      return;
    }

    const generatedId = `${newPlace.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-${Date.now()}`;

    const placeToAdd = {
      id: generatedId,

      title: newPlace.title.trim(),

      location: newPlace.location.trim(),

      note:
        newPlace.note.trim() ||
        "Saved for a future adventure.",

      badge:
        newPlace.badge.trim() ||
        (newPlace.type === "restaurants"
          ? "Restaurant"
          : newPlace.type === "activities"
          ? "Activity"
          : "Place"),

      type: newPlace.type,

      image:
        newPlace.image.trim() ||
        `https://picsum.photos/seed/${generatedId}/800/500`,

      savedAt: new Date()
        .toISOString()
        .split("T")[0],
    };

    setPlaces((previousPlaces) => [
      placeToAdd,
      ...previousPlaces,
    ]);

    setActiveFilter("all");

    closeAddModal();
  };

  return (
    <AppShell>
      <main className="flex-1 bg-cream">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative h-[138px] overflow-hidden">

          <Image
            src={HERO_IMAGE}
            alt="Lebanon landscape"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent" />

          <div className="relative flex h-full items-center justify-between px-10">

            <div>
              <h1 className="font-serif text-[46px] leading-none text-white">
                Saved Places
              </h1>

              <p className="mt-2 text-[14px] text-white/90">
                Keep track of the places that inspire you
                and plan your next adventure.
              </p>
            </div>

            <p
              aria-hidden="true"
              className="mr-12 hidden -rotate-6 font-script text-[27px] leading-[1.15] text-white lg:block"
            >
              Same places,
              <br />

              <span className="ml-7">
                different stories.
              </span>
            </p>

          </div>

        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="px-5 pb-12 pt-4">

          {/* FILTERS */}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

            <div
              className="flex flex-wrap items-center gap-2"
              role="tablist"
              aria-label="Filter saved items"
            >

              {savedFilters.map((filter) => {
                const active =
                  filter.id === activeFilter;

                const FilterIcon =
                  filterIcons[filter.icon];

                return (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() =>
                      setActiveFilter(filter.id)
                    }
                    className={`
                      flex items-center gap-2
                      rounded-lg
                      px-4 py-2
                      text-[13px]
                      font-medium
                      transition-colors
                      ${
                        active
                          ? "bg-olive text-white shadow-sm"
                          : "bg-cream-soft text-ink hover:bg-olive-soft"
                      }
                    `}
                  >

                    {FilterIcon && (
                      <FilterIcon
                        size={16}
                        strokeWidth={1.75}
                      />
                    )}

                    <span>
                      {filter.label} (
                      {counts[filter.id] ?? 0})
                    </span>

                  </button>
                );
              })}

            </div>

            {/* ADD PLACE BUTTON */}

            <button
              type="button"
              onClick={openAddModal}
              className="
                flex items-center gap-2
                rounded-full
                border border-border
                bg-white
                px-5 py-2
                text-[13px]
                font-medium
                text-ink
                transition-colors
                hover:border-olive
                hover:text-olive
              "
            >
              <Plus
                size={15}
                strokeWidth={2}
              />

              Add Place
            </button>

          </div>

          {/* =================================================
              CARDS + MAP
          ================================================= */}

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">

            {/* CARDS */}

            <div>

              {visiblePlaces.length > 0 ? (

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {visiblePlaces.map((place) => (
                    <SavedPlaceCard
                      key={place.id}
                      place={place}
                      onRemove={handleRemove}
                    />
                  ))}

                </div>

              ) : places.length === 0 ? (

                /* NO SAVED PLACES */

                <div
                  className="
                    flex flex-col items-center
                    rounded-xl
                    border border-dashed border-border
                    bg-white/60
                    px-6 py-14
                    text-center
                  "
                >

                  <span
                    className="
                      flex h-12 w-12
                      items-center justify-center
                      rounded-full
                      bg-olive-soft
                      text-olive
                    "
                  >
                    <Bookmark
                      size={22}
                      strokeWidth={1.5}
                    />
                  </span>

                  <h3 className="mt-4 font-serif text-[19px] font-semibold text-ink">
                    No saved places yet
                  </h3>

                  <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-ink-soft">
                    Tap the bookmark on any place,
                    activity or restaurant to keep it
                    here for later.
                  </p>

                  <Link
                    href="/explore"
                    className="
                      mt-5
                      rounded-full
                      bg-olive
                      px-5 py-2.5
                      text-[13px]
                      font-medium
                      text-white
                      transition-colors
                      hover:bg-ink
                    "
                  >
                    Explore Lebanon
                  </Link>

                </div>

              ) : (

                /* EMPTY CATEGORY */

                <div
                  className="
                    rounded-xl
                    border border-dashed border-border
                    bg-white/60
                    px-6 py-14
                    text-center
                    text-[13px]
                    text-ink-soft
                  "
                >

                  Nothing saved in this category yet.{" "}

                  <button
                    type="button"
                    onClick={() =>
                      setActiveFilter("all")
                    }
                    className="
                      font-medium
                      text-olive
                      underline
                      underline-offset-4
                      hover:text-ink
                    "
                  >
                    Show all
                  </button>

                </div>

              )}

            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <aside className="flex flex-col gap-4">

              <SavedPlacesMap />

              {/* QUOTE */}

              <div
                className="
                  flex items-center gap-4
                  rounded-lg
                  border border-border
                  bg-cream-soft
                  px-5 py-6
                "
              >

                <svg
                  viewBox="0 0 48 64"
                  className="h-14 w-11 shrink-0 text-olive"
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

                <p className="font-serif text-[17px] italic leading-snug text-ink">
                  &ldquo;Collect places,
                  <br />
                  not things.&rdquo;

                  <span
                    className="mt-3 block h-px w-14 bg-gold"
                    aria-hidden="true"
                  />
                </p>

              </div>

            </aside>

          </div>

        </section>

        {/* =================================================
            ADD PLACE MODAL
        ================================================= */}

        {showAddModal && (

          <div
            className="
              fixed inset-0 z-50
              flex items-center justify-center
              bg-black/40
              px-4
            "
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeAddModal();
              }
            }}
          >

            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-place-title"
              className="
                relative
                w-full
                max-w-[560px]
                overflow-hidden
                rounded-[14px]
                border
                border-border
                bg-[#faf8f2]
                shadow-2xl
              "
            >

              {/* MODAL HEADER */}

              <div className="flex items-start justify-between border-b border-border px-7 py-5">

                <div>
                  <span className="text-[9px] font-semibold tracking-[0.2em] text-olive">
                    YOUR JOURNEY
                  </span>

                  <h2
                    id="add-place-title"
                    className="mt-1 font-serif text-[27px] font-normal text-ink"
                  >
                    Add a Place
                  </h2>

                  <p className="mt-1 text-[12px] text-ink-soft">
                    Save somewhere you would like to
                    remember or visit later.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeAddModal}
                  aria-label="Close"
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded-full
                    text-ink-soft
                    transition-colors
                    hover:bg-cream-soft
                    hover:text-ink
                  "
                >
                  <X size={18} />
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleAddPlace}
                className="px-7 py-6"
              >

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* PLACE NAME */}

                  <div className="sm:col-span-2">

                    <label
                      htmlFor="place-title"
                      className="mb-2 block text-[11px] font-medium text-ink"
                    >
                      Place name *
                    </label>

                    <input
                      id="place-title"
                      name="title"
                      type="text"
                      value={newPlace.title}
                      onChange={handleNewPlaceChange}
                      placeholder="Example: Jeita Grotto"
                      autoFocus
                      className="
                        w-full
                        rounded-lg
                        border
                        border-border
                        bg-white
                        px-4
                        py-3
                        text-[13px]
                        text-ink
                        outline-none
                        transition
                        placeholder:text-ink-faint
                        focus:border-olive
                        focus:ring-1
                        focus:ring-olive
                      "
                    />

                  </div>

                  {/* LOCATION */}

                  <div>

                    <label
                      htmlFor="place-location"
                      className="mb-2 block text-[11px] font-medium text-ink"
                    >
                      Location *
                    </label>

                    <input
                      id="place-location"
                      name="location"
                      type="text"
                      value={newPlace.location}
                      onChange={handleNewPlaceChange}
                      placeholder="Example: Jeita"
                      className="
                        w-full
                        rounded-lg
                        border
                        border-border
                        bg-white
                        px-4
                        py-3
                        text-[13px]
                        text-ink
                        outline-none
                        transition
                        placeholder:text-ink-faint
                        focus:border-olive
                        focus:ring-1
                        focus:ring-olive
                      "
                    />

                  </div>

                  {/* CATEGORY */}

                  <div>

                    <label
                      htmlFor="place-type"
                      className="mb-2 block text-[11px] font-medium text-ink"
                    >
                      Category
                    </label>

                    <select
                      id="place-type"
                      name="type"
                      value={newPlace.type}
                      onChange={handleNewPlaceChange}
                      className="
                        w-full
                        rounded-lg
                        border
                        border-border
                        bg-white
                        px-4
                        py-3
                        text-[13px]
                        text-ink
                        outline-none
                        focus:border-olive
                        focus:ring-1
                        focus:ring-olive
                      "
                    >
                      <option value="places">
                        Place
                      </option>

                      <option value="activities">
                        Activity
                      </option>

                      <option value="restaurants">
                        Restaurant
                      </option>
                    </select>

                  </div>

                  {/* BADGE */}

                  <div className="sm:col-span-2">

                    <label
                      htmlFor="place-badge"
                      className="mb-2 block text-[11px] font-medium text-ink"
                    >
                      Type / Badge
                    </label>

                    <input
                      id="place-badge"
                      name="badge"
                      type="text"
                      value={newPlace.badge}
                      onChange={handleNewPlaceChange}
                      placeholder="Example: Nature, Cultural Site, Hiking..."
                      className="
                        w-full
                        rounded-lg
                        border
                        border-border
                        bg-white
                        px-4
                        py-3
                        text-[13px]
                        text-ink
                        outline-none
                        transition
                        placeholder:text-ink-faint
                        focus:border-olive
                        focus:ring-1
                        focus:ring-olive
                      "
                    />

                  </div>

                  {/* NOTE */}

                  <div className="sm:col-span-2">

                    <label
                      htmlFor="place-note"
                      className="mb-2 block text-[11px] font-medium text-ink"
                    >
                      Personal note
                    </label>

                    <textarea
                      id="place-note"
                      name="note"
                      rows="3"
                      value={newPlace.note}
                      onChange={handleNewPlaceChange}
                      placeholder="Why do you want to save this place?"
                      className="
                        w-full
                        resize-none
                        rounded-lg
                        border
                        border-border
                        bg-white
                        px-4
                        py-3
                        text-[13px]
                        leading-relaxed
                        text-ink
                        outline-none
                        transition
                        placeholder:text-ink-faint
                        focus:border-olive
                        focus:ring-1
                        focus:ring-olive
                      "
                    />

                  </div>

                  {/* IMAGE */}

                  <div className="sm:col-span-2">

                    <label
                      htmlFor="place-image"
                      className="mb-2 block text-[11px] font-medium text-ink"
                    >
                      Image URL
                    </label>

                    <input
                      id="place-image"
                      name="image"
                      type="url"
                      value={newPlace.image}
                      onChange={handleNewPlaceChange}
                      placeholder="Optional — leave empty for a placeholder image"
                      className="
                        w-full
                        rounded-lg
                        border
                        border-border
                        bg-white
                        px-4
                        py-3
                        text-[13px]
                        text-ink
                        outline-none
                        transition
                        placeholder:text-ink-faint
                        focus:border-olive
                        focus:ring-1
                        focus:ring-olive
                      "
                    />

                  </div>

                </div>

                {/* ERROR */}

                {formError && (
                  <p className="mt-4 text-[11px] text-red-700">
                    {formError}
                  </p>
                )}

                {/* ACTIONS */}

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-5">

                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="
                      rounded-full
                      border
                      border-border
                      bg-white
                      px-5
                      py-2.5
                      text-[12px]
                      font-medium
                      text-ink
                      transition-colors
                      hover:border-ink-soft
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      bg-olive
                      px-5
                      py-2.5
                      text-[12px]
                      font-medium
                      text-white
                      transition-colors
                      hover:bg-ink
                    "
                  >
                    <Plus
                      size={14}
                      strokeWidth={2}
                    />

                    Save Place
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

        {/* =================================================
            UNDO TOAST
        ================================================= */}

        {lastRemoved && (

          <div
            role="status"
            className="
              fixed
              bottom-6
              left-1/2
              z-40
              flex
              -translate-x-1/2
              items-center
              gap-4
              rounded-full
              bg-ink
              px-5
              py-3
              text-sm
              text-white
              shadow-lg
            "
          >

            <span>
              Removed{" "}

              <strong className="font-medium">
                {lastRemoved.place.title}
              </strong>
            </span>

            <button
              type="button"
              onClick={handleUndo}
              className="
                flex
                items-center
                gap-1
                font-medium
                text-gold
                hover:text-white
              "
            >
              <Undo2
                size={14}
                strokeWidth={1.75}
              />

              Undo
            </button>

            <button
              type="button"
              onClick={() =>
                setLastRemoved(null)
              }
              aria-label="Dismiss"
              className="text-white/60 hover:text-white"
            >
              <X
                size={14}
                strokeWidth={1.75}
              />
            </button>

          </div>

        )}

      </main>
    </AppShell>
  );
}
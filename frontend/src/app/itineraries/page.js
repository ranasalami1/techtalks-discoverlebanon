"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

/* =====================================================
   CATEGORIES
===================================================== */

const categories = [
  ["All Itineraries", "⊞"],
  ["Cultural Heritage", "♜"],
  ["Nature & Outdoors", "♠"],
  ["Coastal Escapes", "≋"],
  ["Food & Gastronomy", "♜"],
  ["Family Friendly", "♧"],
];

/* =====================================================
   ITINERARIES DATA
===================================================== */

const itineraries = [
  [
    "Echoes of Empires",
    "Baalbek – Anjar – Ksara",
    "Cultural Heritage",
    "Historical Sites",
    "Moderate",
    "1 Day",
    "Explore Lebanon’s Roman legacy, from monumental temples to the vineyards of the Bekaa Valley.",
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85",
  ],
  [
    "Coastal Heritage",
    "Byblos – Batroun – Chekka",
    "Coastal Escapes",
    "Culture & Sea",
    "Easy",
    "1 Day",
    "Follow the northern coast through ancient ports, lively souks and clear Mediterranean water.",
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=85",
  ],
  [
    "Into the Cedars",
    "Bsharri – Cedars – Qadisha Valley",
    "Nature & Outdoors",
    "Nature & Hiking",
    "Moderate",
    "2 Days",
    "Walk among Lebanon’s ancient cedars and descend into the dramatic Qadisha Valley.",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
  ],
  [
    "Village Life",
    "Beit Mery – Deir el Qamar – Barouk",
    "Family Friendly",
    "Traditions & People",
    "Easy",
    "1 Day",
    "Meet the villages, kitchens and welcoming traditions that shape Lebanon’s mountain life.",
    "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=85",
  ],
  [
    "Lebanon by the Sea",
    "Beirut – Raouché – Jounieh",
    "Coastal Escapes",
    "Coastal Experience",
    "Easy",
    "1 Day",
    "A relaxed coastal day from Beirut’s shore to the blue horizons of Jounieh.",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
  ],
  [
    "Faith & Heritage",
    "Harissa – Bkerke – Ehden",
    "Cultural Heritage",
    "Religious & Cultural",
    "Moderate",
    "2 Days",
    "Discover sacred landmarks, mountain monasteries and stories of faith across Lebanon.",
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85",
  ],
  [
    "Hidden Villages",
    "Jezzine – Niha – Barouk",
    "Nature & Outdoors",
    "Nature & Tradition",
    "Moderate",
    "1 Day",
    "Take the quieter road through waterfalls, pine forests and stone villages in the south.",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85",
  ],
  [
    "A Taste of Lebanon",
    "Bekaa Valley – Wineries – Local Cuisine",
    "Food & Gastronomy",
    "Food & Wine",
    "Easy",
    "1 Day",
    "Taste the Bekaa through family-run wineries, generous tables and local recipes.",
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
  ],
];

/* =====================================================
   SMALL META ICON
===================================================== */

function MetaIcon({ children }) {
  return (
    <span className="mr-1 text-[0.75rem] text-[#74776e]">
      {children}
    </span>
  );
}

/* =====================================================
   PAGE
===================================================== */

export default function ItinerariesPage() {
  const [activeCategory, setActiveCategory] =
    useState("All Itineraries");

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  /* =====================================================
     FILTER + SEARCH LOGIC
  ===================================================== */

  const visibleItineraries = itineraries.filter((item) => {
    const matchesCategory =
      activeCategory === "All Itineraries" ||
      item[2] === activeCategory;

    const searchableText = item
      .slice(0, 5)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(
      searchTerm.toLowerCase()
    );

    return matchesCategory && matchesSearch;
  });

  const scrollTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AppShell>
      <main className="min-h-screen bg-[#f1eee9] text-[#272725]">

        <div className="w-full px-4 pb-5 sm:px-6 lg:px-8">

          {/* =====================================================
              HERO
          ===================================================== */}

          <section
            id="page-top"
            className="relative isolate h-[290px] overflow-hidden sm:h-[315px]"
          >
            <img
              src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85"
              alt="Lebanese mountains and coast at sunset"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-[rgba(21,35,43,0.32)]" />

            <div className="relative flex h-full items-center justify-between px-7 pb-2 sm:px-12 lg:px-14">

              {/* LEFT */}

              <div className="max-w-[620px] text-white">

                <p className="mb-3 text-[0.58rem] font-medium uppercase tracking-[0.45em] text-[#eee7dc] sm:text-[0.65rem]">
                  Journeys with meaning
                </p>

                <h1 className="brand-display text-[3.25rem] leading-[0.92] sm:text-[4.4rem]">
                  Curated Itineraries
                </h1>

                <p className="mt-4 max-w-[530px] text-[0.82rem] leading-[1.5] text-[#f6f2eb] sm:text-[0.98rem]">
                  Handpicked journeys to help you discover the real
                  Lebanon —
                  <br className="hidden sm:block" />
                  its history, nature, culture and people.
                </p>

              </div>

              {/* RIGHT */}

              <div className="hidden pb-3 pr-2 text-right text-[#f3ece2] sm:block">

                <p className="script-text text-[2.15rem] leading-[0.92]">
                  Same places,
                </p>

                <p className="script-text text-[2.15rem] leading-[0.92]">
                  different stories.
                </p>

                <div className="ml-auto mt-4 h-px w-14 bg-[#c5a774]" />

              </div>

            </div>
          </section>

          {/* =====================================================
              FILTER + SEARCH TOOLBAR
          ===================================================== */}

          <div className="flex items-center justify-between gap-3 py-3">

            {/* FILTERS */}

            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 sm:pb-0">

              {categories.map(([category, icon]) => {
                const isActive =
                  category === activeCategory;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setActiveCategory(category)
                    }
                    className={`
                      flex h-[38px]
                      shrink-0
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      border
                      px-4
                      text-[0.7rem]
                      font-medium
                      whitespace-nowrap
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? "border-[#626a55] bg-[#626a55] text-white shadow-[0_2px_6px_rgba(50,55,44,0.16)]"
                          : "border-[#e0dcd4] bg-[#faf9f6] text-[#45433e] hover:border-[#bdb8ae] hover:bg-white"
                      }
                    `}
                  >

                    <span
                      className={`text-[0.88rem] leading-none ${
                        isActive
                          ? "text-white"
                          : "text-[#777467]"
                      }`}
                    >
                      {icon}
                    </span>

                    {category}

                  </button>
                );
              })}

            </div>

            {/* SEARCH BUTTON */}

            <button
              type="button"
              onClick={() =>
                setIsSearchOpen((open) => !open)
              }
              className={`
                flex
                h-[38px]
                shrink-0
                items-center
                gap-2
                rounded-full
                border
                px-4
                text-[0.68rem]
                font-medium
                uppercase
                tracking-[0.08em]
                transition-all
                duration-200
                ${
                  isSearchOpen
                    ? "border-[#626a55] bg-[#626a55] text-white shadow-sm"
                    : "border-[#d8d3cb] bg-[#faf9f6] text-[#45433e] hover:border-[#bdb8ae] hover:bg-white"
                }
              `}
            >

              <span className="text-[0.95rem] leading-none">
                ⌕
              </span>

              <span className="hidden lg:inline">
                Search
              </span>

            </button>

          </div>

          {/* =====================================================
              SEARCH FIELD
          ===================================================== */}

          {isSearchOpen && (
            <div className="mb-3">

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#77746d]">
                  ⌕
                </span>

                <input
                  id="itinerary-search"
                  autoFocus
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search itineraries, places or themes..."
                  className="
                    h-[42px]
                    w-full
                    rounded-full
                    border
                    border-[#ddd8cf]
                    bg-[#faf9f6]
                    pl-11
                    pr-11
                    text-[0.78rem]
                    text-[#3d3c39]
                    outline-none
                    transition
                    placeholder:text-[#969189]
                    focus:border-[#737a65]
                    focus:bg-white
                    focus:shadow-[0_2px_8px_rgba(60,60,50,0.07)]
                  "
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-lg
                      text-[#858179]
                      transition
                      hover:text-[#44423d]
                    "
                  >
                    ×
                  </button>
                )}

              </div>

            </div>
          )}

          {/* =====================================================
              ITINERARY GRID
          ===================================================== */}

          <section
            id="itinerary-grid"
            className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
          >

            {visibleItineraries.map(
              ([
                title,
                location,
                category,
                label,
                difficulty,
                duration,
                description,
                image,
              ]) => (
                <article
                  key={title}
                  className="
                    overflow-hidden
                    rounded-[10px]
                    border
                    border-[#ddd9d2]
                    bg-[#f9f7f4]
                    shadow-[0_2px_5px_rgba(39,36,31,0.07)]
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:shadow-[0_8px_18px_rgba(39,36,31,0.11)]
                  "
                >

                  {/* IMAGE */}

                  <div className="relative h-[125px] overflow-hidden">

                    <img
                      src={image}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                    />

                    <span className="absolute right-2.5 top-2.5 rounded-full bg-[#f2eee7]/90 px-2.5 py-1 text-[0.62rem] font-medium text-[#343430] shadow-sm">
                      {duration}
                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="relative min-h-[92px] px-3 py-2.5">

                    <h2 className="brand-display text-[1.03rem] font-semibold leading-none text-[#2d2c29]">
                      {title}
                    </h2>

                    <p className="mt-1.5 truncate text-[0.63rem] text-[#74736e]">
                      {location}
                    </p>

                    <div className="mt-2 flex items-center gap-3 pr-8 text-[0.59rem] text-[#5e605b]">

                      <span className="truncate">
                        <MetaIcon>⌖</MetaIcon>
                        {label}
                      </span>

                      <span className="whitespace-nowrap">
                        <MetaIcon>♧</MetaIcon>
                        {difficulty}
                      </span>

                    </div>

                    {/* DETAILS BUTTON */}

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedItinerary({
                          title,
                          location,
                          category,
                          label,
                          difficulty,
                          duration,
                          description,
                          image,
                        })
                      }
                      aria-label={`View ${title}`}
                      className="
                        absolute
                        bottom-2.5
                        right-3
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-[#606653]
                        text-[1rem]
                        leading-none
                        text-white
                        transition-all
                        duration-200
                        hover:scale-105
                        hover:bg-[#4f5645]
                      "
                    >
                      →
                    </button>

                  </div>

                </article>
              )
            )}

          </section>

          {/* =====================================================
              NO RESULTS
          ===================================================== */}

          {visibleItineraries.length === 0 && (
            <div className="py-16 text-center">

              <h2 className="brand-display text-2xl text-[#34342f]">
                No itineraries found
              </h2>

              <p className="mt-2 text-sm text-[#74736e]">
                Try another category or search term.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All Itineraries");
                  setSearchTerm("");
                }}
                className="
                  mt-5
                  rounded-full
                  bg-[#606653]
                  px-5
                  py-2
                  text-xs
                  uppercase
                  tracking-[0.12em]
                  text-white
                  transition
                  hover:bg-[#4f5645]
                "
              >
                View All Itineraries
              </button>

            </div>
          )}

          {/* =====================================================
              BOTTOM QUOTE
          ===================================================== */}

          <footer
            id="heritage-stories"
            className="
              relative
              mt-4
              flex
              min-h-[76px]
              items-center
              justify-between
              overflow-hidden
              rounded-[10px]
              bg-[#e9e5dc]
              px-7
              py-4
              sm:px-10
            "
          >

            <div className="absolute right-1/4 top-0 h-full w-[310px] opacity-20 [background-image:repeating-radial-gradient(ellipse_at_center,_transparent_0,_transparent_18px,_#aca99f_19px,_transparent_20px)]" />

            <div className="relative hidden text-[#606653] sm:block">
              <span className="text-[2.8rem] leading-none">
                ⌁
              </span>
            </div>

            <div className="relative flex-1 text-center">

              <p className="script-text text-[1.35rem] leading-none text-[#5e5b55] sm:text-[1.55rem]">
                “More than a destination,
              </p>

              <p className="script-text text-[1.35rem] leading-none text-[#5e5b55] sm:text-[1.55rem]">
                a journey through time, people and places.”
              </p>

              <div className="mx-auto mt-2 h-px w-12 bg-[#b79662]" />

            </div>

            <div className="relative hidden w-[145px] text-right text-[0.48rem] uppercase tracking-[0.36em] text-[#777269] sm:block">

              <div>Lebanon</div>

              <div className="mt-1">
                Always a story
              </div>

              <div className="mt-1">
                To explore
              </div>

            </div>

          </footer>

        </div>

        {/* =====================================================
            DETAILS MODAL
        ===================================================== */}

        {selectedItinerary && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#24251f]/45 p-4"
            role="presentation"
            onClick={() =>
              setSelectedItinerary(null)
            }
          >

            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="itinerary-dialog-title"
              onClick={(event) =>
                event.stopPropagation()
              }
              className="
                w-full
                max-w-md
                overflow-hidden
                rounded-[12px]
                border
                border-[#d8d1c8]
                bg-[#fbf8f3]
                shadow-2xl
              "
            >

              {/* MODAL IMAGE */}

              <div className="relative h-[180px]">

                <img
                  src={selectedItinerary.image}
                  alt={selectedItinerary.title}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    setSelectedItinerary(null)
                  }
                  aria-label="Close itinerary details"
                  className="
                    absolute
                    right-3
                    top-3
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-white/90
                    text-xl
                    text-[#55554d]
                    shadow-sm
                    transition
                    hover:bg-white
                  "
                >
                  ×
                </button>

              </div>

              {/* MODAL BODY */}

              <div className="p-6">

                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#8e805f]">
                  {selectedItinerary.duration}
                </p>

                <h2
                  id="itinerary-dialog-title"
                  className="brand-display mt-1 text-3xl text-[#34342f]"
                >
                  {selectedItinerary.title}
                </h2>

                <p className="mt-3 text-sm text-[#6d6b64]">
                  {selectedItinerary.location}
                </p>

                {/* TAGS */}

                <div className="mt-3 flex flex-wrap gap-2">

                  <span className="rounded-full bg-[#ebe7df] px-3 py-1 text-[0.65rem] text-[#55554d]">
                    {selectedItinerary.category}
                  </span>

                  <span className="rounded-full bg-[#ebe7df] px-3 py-1 text-[0.65rem] text-[#55554d]">
                    {selectedItinerary.label}
                  </span>

                  <span className="rounded-full bg-[#ebe7df] px-3 py-1 text-[0.65rem] text-[#55554d]">
                    {selectedItinerary.difficulty}
                  </span>

                </div>

                <p className="mt-5 text-sm leading-6 text-[#45443f]">
                  {selectedItinerary.description}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedItinerary(null);
                    scrollTo("itinerary-grid");
                  }}
                  className="
                    mt-6
                    rounded-full
                    bg-[#606653]
                    px-4
                    py-2
                    text-xs
                    uppercase
                    tracking-[0.12em]
                    text-white
                    transition
                    hover:bg-[#4f5645]
                  "
                >
                  Back to itineraries
                </button>

              </div>

            </div>

          </div>
        )}

      </main>
    </AppShell>
  );
}
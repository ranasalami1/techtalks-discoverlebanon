"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AppShell from "@/components/AppShell";

import {
  ArrowRight,
  Castle,
  Grid2X2,
  Landmark,
  Search,
  Trees,
  UtensilsCrossed,
  PersonStanding,
  MapPin,
} from "lucide-react";

/* =====================================================
   DATA
===================================================== */

const categories = [
  {
    id: "all",
    label: "All",
    icon: Grid2X2,
  },
  {
    id: "historical",
    label: "Historical Sites",
    icon: Landmark,
  },
  {
    id: "nature",
    label: "Nature & Outdoors",
    icon: Trees,
  },
  {
    id: "activities",
    label: "Activities & Experiences",
    icon: PersonStanding,
  },
  {
    id: "food",
    label: "Food & Gastronomy",
    icon: UtensilsCrossed,
  },
];

const destinations = [
  {
    id: 1,
    name: "Byblos",
    subtitle: "A Journey Through Time",
    image: "/images/byblos-account.jpg",
    category: "historical",
    href: "/places/byblos",
  },
  {
    id: 2,
    name: "Baalbek",
    subtitle: "Monumental Heritage",
    image: "/images/heritage-hero.jpg",
    category: "historical",
    href: "/places/baalbek",
  },
  {
    id: 3,
    name: "Tyre",
    subtitle: "Where History Meets the Sea",
    image: "/images/raouche.jpg",
    category: "historical",
    href: "/places/tyre",
  },
  {
    id: 4,
    name: "Chouf",
    subtitle: "Nature, Villages & Traditions",
    image: "/images/chouf.jpg",
    category: "nature",
    href: "/places/chouf",
  },
];

const locations = [
  {
    name: "Tripoli",
    top: "14%",
    left: "56%",
    type: "historical",
  },
  {
    name: "Batroun",
    top: "27%",
    left: "47%",
    type: "historical",
  },
  {
    name: "Byblos",
    top: "37%",
    left: "51%",
    type: "historical",
  },
  {
    name: "Beirut",
    top: "49%",
    left: "43%",
    type: "city",
  },
  {
    name: "Zahle",
    top: "54%",
    left: "65%",
    type: "nature",
  },
  {
    name: "Baalbek",
    top: "43%",
    left: "72%",
    type: "historical",
  },
  {
    name: "Chouf",
    top: "62%",
    left: "53%",
    type: "nature",
  },
  {
    name: "Sidon",
    top: "70%",
    left: "35%",
    type: "historical",
  },
  {
    name: "Tyre",
    top: "83%",
    left: "31%",
    type: "historical",
  },
];

/* =====================================================
   MAP MARKER
===================================================== */

function MapMarker({ location }) {
  const Icon =
    location.type === "nature"
      ? Trees
      : location.type === "city"
        ? Castle
        : Landmark;

  return (
    <button
      type="button"
      className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center"
      style={{
        top: location.top,
        left: location.left,
      }}
    >
      <span
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border-[3px]
          border-white
          bg-[#66715b]
          text-white
          shadow-md
          transition
          group-hover:scale-110
        "
      >
        <Icon size={16} strokeWidth={1.8} />
      </span>

      <span
        className="
          -ml-1
          rounded-r-full
          bg-white/95
          py-1.5
          pl-3
          pr-3
          text-xs
          font-semibold
          text-[#33362f]
          shadow-sm
        "
      >
        {location.name}
      </span>
    </button>
  );
}

/* =====================================================
   DESTINATION CARD
===================================================== */

function DestinationCard({ destination }) {
  return (
    <Link
      href={destination.href}
      className="
        group
        relative
        block
        h-[138px]
        overflow-hidden
        rounded-xl
        bg-[#30342f]
      "
    >
      <Image
        src={destination.image}
        alt={destination.name}
        fill
        sizes="(max-width: 768px) 100vw, 260px"
        className="
          object-cover
          transition
          duration-500
          group-hover:scale-105
        "
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
        <div>
          <h3 className="font-serif text-lg font-medium text-white">
            {destination.name}
          </h3>

          <p className="mt-0.5 text-[10px] text-white/80">
            {destination.subtitle}
          </p>
        </div>

        <span
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-white
            text-[#30342f]
            transition
            group-hover:translate-x-0.5
          "
        >
          <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}

/* =====================================================
   PAGE
===================================================== */

export default function ExploreMapPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredDestinations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return destinations.filter((destination) => {
      const categoryMatches =
        activeCategory === "all" ||
        destination.category === activeCategory;

      const searchMatches =
        !normalizedQuery ||
        destination.name
          .toLowerCase()
          .includes(normalizedQuery) ||
        destination.subtitle
          .toLowerCase()
          .includes(normalizedQuery);

      return categoryMatches && searchMatches;
    });
  }, [query, activeCategory]);

  return (
    <AppShell>
      <div className="min-h-[calc(100vh-70px)] bg-[#f6f3ec]">
        <div className="grid min-h-[calc(100vh-70px)] xl:grid-cols-[1.15fr_0.85fr]">

          {/* =====================================================
              MAP SIDE
          ===================================================== */}

          <section
            className="
              relative
              min-h-[620px]
              overflow-hidden
              border-r
              border-[#ded9cd]
              bg-[#dce9e6]
              xl:min-h-[calc(100vh-70px)]
            "
          >
            <div
              className="
                absolute
                inset-y-0
                left-0
                w-[48%]
                bg-gradient-to-r
                from-[#78b8c5]
                to-[#9bcbd0]
              "
            />

            <div
              className="
                absolute
                inset-y-0
                right-0
                w-[57%]
                bg-[#eee8d9]
              "
            />

            <div
              className="
                absolute
                left-[31%]
                top-[4%]
                h-[91%]
                w-[39%]
                rotate-[5deg]
                rounded-[48%_38%_46%_42%/12%_18%_14%_12%]
                border
                border-[#a8a283]
                bg-gradient-to-br
                from-[#aeb38a]
                via-[#c8c59d]
                to-[#e1d7b8]
                shadow-[0_8px_30px_rgba(71,73,53,0.12)]
              "
            />

            <div className="absolute left-[7%] top-[40%] text-center text-[10px] uppercase tracking-[0.28em] text-[#43646a]">
              Mediterranean
              <br />
              Sea
            </div>

            <span className="absolute bottom-[8%] left-[48%] text-[10px] uppercase tracking-[0.22em] text-[#77766f]">
              Israel
            </span>

            <span className="absolute right-[5%] top-[70%] text-[10px] uppercase tracking-[0.22em] text-[#77766f]">
              Syria
            </span>

            <div className="absolute left-7 top-7 text-center text-[#3f5f5e]">
              <span className="block text-[10px] font-semibold">
                N
              </span>

              <div
                className="
                  mt-1
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#55716e]/50
                  text-xl
                "
              >
                ✦
              </div>
            </div>

            {locations.map((location) => (
              <MapMarker
                key={location.name}
                location={location}
              />
            ))}
          </section>

          {/* =====================================================
              RIGHT SIDE
          ===================================================== */}

          <section className="bg-[#f8f5ef] px-5 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-[680px]">

              {/* HEADER */}

              <div>
                <h1 className="font-serif text-[36px] font-medium leading-tight text-[#252821] sm:text-[42px]">
                  Explore Lebanon
                </h1>

                <p className="mt-2 max-w-md text-[14px] leading-6 text-[#73736c]">
                  Discover ancient cities, natural wonders,
                  local experiences and more.
                </p>
              </div>

              {/* SEARCH */}

              <div className="relative mt-6">
                <Search
                  size={18}
                  strokeWidth={1.8}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#32352f]
                  "
                />

                <input
                  type="search"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search for a place, activity or experience..."
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#dedbd2]
                    bg-white
                    pl-11
                    pr-4
                    text-xs
                    text-[#34362f]
                    shadow-sm
                    outline-none
                    transition
                    placeholder:text-[#9a9993]
                    focus:border-[#8d927d]
                  "
                />
              </div>

              {/* =====================================================
                  CATEGORY BUTTONS - FIXED
              ===================================================== */}

              <div className="mt-5 overflow-x-auto pb-1">
                <div
                  className="
                    grid
                    min-w-[600px]
                    grid-cols-[70px_repeat(4,minmax(105px,1fr))]
                    gap-2.5
                  "
                >
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive =
                      activeCategory === category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() =>
                          setActiveCategory(category.id)
                        }
                        className={`
                          flex
                          h-[82px]
                          min-w-0
                          flex-col
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          px-2
                          py-2
                          text-center
                          shadow-sm
                          transition

                          ${
                            isActive
                              ? "border-[#687058] bg-[#687058] text-white"
                              : "border-[#e1ddd3] bg-white text-[#30332d] hover:bg-[#f1eee6]"
                          }
                        `}
                      >
                        <Icon
                          size={20}
                          strokeWidth={1.6}
                          className="shrink-0"
                        />

                        <span
                          className="
                            block
                            max-w-full
                            text-[10px]
                            font-medium
                            leading-[1.25]
                            whitespace-normal
                          "
                        >
                          {category.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =====================================================
                  FEATURED DESTINATIONS
              ===================================================== */}

              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-semibold text-[#292c26]">
                    Featured Destinations
                  </h2>

                  <Link
                    href="/search"
                    className="
                      inline-flex
                      items-center
                      gap-1
                      text-xs
                      font-medium
                      text-[#45483f]
                      transition
                      hover:text-[#9a6e34]
                    "
                  >
                    View All
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {filteredDestinations.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {filteredDestinations.map(
                      (destination) => (
                        <DestinationCard
                          key={destination.id}
                          destination={destination}
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div
                    className="
                      rounded-xl
                      border
                      border-dashed
                      border-[#d5d0c6]
                      bg-white/50
                      px-6
                      py-12
                      text-center
                    "
                  >
                    <MapPin
                      size={25}
                      className="mx-auto text-[#8a8d7a]"
                    />

                    <p className="mt-3 text-sm text-[#72736b]">
                      No destinations match your search.
                    </p>
                  </div>
                )}
              </div>

              {/* =====================================================
                  QUOTE
              ===================================================== */}

              <div
                className="
                  relative
                  mt-8
                  overflow-hidden
                  border-t
                  border-[#ddd8cc]
                  py-8
                "
              >
                <div className="flex items-end justify-center gap-7">
                  <div
                    className="
                      hidden
                      h-24
                      w-20
                      items-end
                      justify-center
                      sm:flex
                    "
                    aria-hidden="true"
                  >
                    <Trees
                      size={68}
                      strokeWidth={0.7}
                      className="text-[#777d68]"
                    />
                  </div>

                  <div className="text-center">
                    <p className="font-serif text-[22px] italic leading-7 text-[#65675d]">
                      “Same places,
                      <br />
                      different stories.”
                    </p>

                    <div className="mx-auto mt-4 h-px w-10 bg-[#b19054]" />
                  </div>

                  <div
                    className="
                      hidden
                      h-24
                      w-20
                      items-end
                      justify-center
                      sm:flex
                    "
                    aria-hidden="true"
                  >
                    <Trees
                      size={72}
                      strokeWidth={0.5}
                      className="text-[#a6a99d]"
                    />
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>
    </AppShell>
  );
}
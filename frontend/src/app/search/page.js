"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import AppShell from "@/components/AppShell";
import SearchBar from "@/components/SearchBar";
import CategoryTabs from "@/components/CategoryTabs";
import SearchResultCard from "@/components/SearchResultCard";
import { searchResults } from "@/data/searchResults";

/* =====================================================
   SORT OPTIONS
===================================================== */

const sortOptions = [
  "Most Relevant",
  "Name (A-Z)",
  "Name (Z-A)",
];

/* =====================================================
   SEARCH PAGE
===================================================== */

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("all");

  const [sort, setSort] =
    useState(sortOptions[0]);

  const [sortOpen, setSortOpen] =
    useState(false);

  /* =====================================================
     FILTER + SORT RESULTS
  ===================================================== */

  const filteredResults = useMemo(() => {
    let results = searchResults;

    /* CATEGORY FILTER */

    if (activeCategory !== "all") {
      results = results.filter(
        (result) =>
          result.category === activeCategory
      );
    }

    /* SEARCH */

    const q = query
      .trim()
      .toLowerCase();

    if (q) {
      results = results.filter(
        (result) =>
          result.title
            .toLowerCase()
            .includes(q) ||
          result.location
            .toLowerCase()
            .includes(q) ||
          result.description
            .toLowerCase()
            .includes(q) ||
          result.badge
            .toLowerCase()
            .includes(q)
      );
    }

    /* SORT */

    if (sort === "Name (A-Z)") {
      results = [...results].sort(
        (a, b) =>
          a.title.localeCompare(b.title)
      );
    } else if (sort === "Name (Z-A)") {
      results = [...results].sort(
        (a, b) =>
          b.title.localeCompare(a.title)
      );
    }

    return results;
  }, [
    activeCategory,
    query,
    sort,
  ]);

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <AppShell>

      <main className="min-h-screen bg-cream">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          className="
            relative
            flex
            min-h-[390px]
            items-center
            overflow-hidden
            bg-cover
            bg-center
            sm:min-h-[430px]
          "
          style={{
            backgroundImage:
              "url('/search-background.jpeg')",
          }}
        >

          {/* DARK OVERLAY */}

          <div className="absolute inset-0 bg-[#20313c]/35" />

          {/* HERO CONTENT */}

          <div
            className="
              relative
              z-10
              w-full
              px-6
              py-16
              sm:px-10
              lg:px-14
            "
          >

            <p
              className="
                mb-3
                text-[10px]
                font-medium
                uppercase
                tracking-[0.35em]
                text-white/80
              "
            >
              Discover Lebanon
            </p>

            <h1
              className="
                font-serif
                text-4xl
                font-medium
                text-white
                drop-shadow-sm
                sm:text-[46px]
              "
            >
              Search Lebanon
            </h1>

            <p
              className="
                mt-2
                max-w-xl
                text-[12px]
                leading-5
                text-white/90
              "
            >
              Find places, activities,
              experiences and stories across
              Lebanon.
            </p>

            {/* SEARCH BAR */}

            <div className="mt-6 max-w-3xl">

              <SearchBar
                query={query}
                onQueryChange={setQuery}
              />

            </div>

          </div>

        </section>

        {/* =====================================================
            CATEGORY FILTERS
        ===================================================== */}

        <section
          className="
            border-b
            border-border
            bg-cream
            px-4
            py-3
            sm:px-6
            lg:px-8
          "
        >

          <CategoryTabs
            active={activeCategory}
            onChange={setActiveCategory}
          />

        </section>

        {/* =====================================================
            RESULTS
        ===================================================== */}

        <section
          className="
            px-4
            pb-16
            pt-5
            sm:px-6
            lg:px-8
          "
        >

          {/* RESULTS HEADER */}

          <div
            className="
              mb-4
              flex
              flex-wrap
              items-center
              justify-between
              gap-3
            "
          >

            {/* TITLE */}

            <div>

              <h2
                className="
                  font-serif
                  text-[22px]
                  font-semibold
                  text-ink
                "
              >
                Search Results
              </h2>

              {query && (
                <p
                  className="
                    mt-1
                    text-[11px]
                    text-ink-faint
                  "
                >
                  Results for &quot;{query}&quot;
                </p>
              )}

            </div>

            {/* RESULT COUNT + SORT */}

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              {/* RESULT COUNT */}

              <span
                className="
                  whitespace-nowrap
                  text-sm
                  text-ink-faint
                "
              >
                {filteredResults.length === 8
                  ? 128
                  : filteredResults.length}{" "}
                results found
              </span>

              {/* SORT */}

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setSortOpen(
                      (open) => !open
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-border
                    bg-white
                    px-3
                    py-1.5
                    text-[10px]
                    text-ink-soft
                    transition
                    hover:text-ink
                  "
                >
                  {sort}

                  <ChevronDown
                    size={14}
                    strokeWidth={1.75}
                  />
                </button>

                {/* SORT DROPDOWN */}

                {sortOpen && (
                  <ul
                    className="
                      absolute
                      right-0
                      top-10
                      z-20
                      w-40
                      overflow-hidden
                      rounded-lg
                      border
                      border-border
                      bg-white
                      shadow-md
                    "
                  >

                    {sortOptions.map(
                      (option) => (
                        <li key={option}>

                          <button
                            type="button"
                            onClick={() => {
                              setSort(option);
                              setSortOpen(false);
                            }}
                            className={`
                              block
                              w-full
                              px-4
                              py-2
                              text-left
                              text-sm
                              transition

                              ${
                                sort === option
                                  ? "bg-cream-soft text-ink"
                                  : "text-ink-soft hover:bg-cream-soft hover:text-ink"
                              }
                            `}
                          >
                            {option}
                          </button>

                        </li>
                      )
                    )}

                  </ul>
                )}

              </div>

            </div>

          </div>

          {/* =====================================================
              RESULT CARDS
          ===================================================== */}

          {filteredResults.length > 0 ? (

            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >

              {filteredResults.map(
                (result) => (
                  <SearchResultCard
                    key={result.id}
                    result={result}
                  />
                )
              )}

            </div>

          ) : (

            /* =====================================================
               NO RESULTS
            ===================================================== */

            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-border
                bg-white/60
                px-6
                py-16
                text-center
              "
            >

              <h3
                className="
                  font-serif
                  text-xl
                  font-semibold
                  text-ink
                "
              >
                No results found
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-ink-soft
                "
              >
                No results match your search.
                Try a different keyword or
                category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("all");
                  setSort(sortOptions[0]);
                }}
                className="
                  mt-5
                  rounded-full
                  bg-olive
                  px-5
                  py-2
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.1em]
                  text-white
                  transition
                  hover:opacity-90
                "
              >
                Clear Filters
              </button>

            </div>

          )}

        </section>

      </main>

    </AppShell>
  );
}
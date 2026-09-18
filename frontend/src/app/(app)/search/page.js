"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import TopBar from "@/components/TopBar";
import SearchBar from "@/components/SearchBar";
import CategoryTabs from "@/components/CategoryTabs";
import SearchResultCard from "@/components/SearchResultCard";
import { searchResults } from "@/data/searchResults";

const sortOptions = ["Most Relevant", "Name (A-Z)", "Name (Z-A)"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState(sortOptions[0]);
  const [sortOpen, setSortOpen] = useState(false);

  const filteredResults = useMemo(() => {
    let results = searchResults;

    if (activeCategory !== "all") {
      results = results.filter((r) => r.category === activeCategory);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.badge.toLowerCase().includes(q)
      );
    }

    if (sort === "Name (A-Z)") {
      results = [...results].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "Name (Z-A)") {
      results = [...results].sort((a, b) => b.title.localeCompare(a.title));
    }

    return results;
  }, [activeCategory, query, sort]);

  return (
    <div>
      <section
        className="relative flex min-h-[390px] items-center overflow-hidden bg-cover bg-center sm:min-h-[430px]"
        style={{ backgroundImage: "url('/search-background.jpeg')" }}
      >
        <div className="absolute inset-0 bg-[#20313c]/35" />
        <TopBar />
        <div className="relative w-full px-6 pb-16 pt-20 sm:px-10 sm:pt-24">
          <h1 className="font-serif text-4xl font-medium text-white drop-shadow-sm sm:text-[46px]">
            Search Lebanon
          </h1>
          <p className="mt-1 max-w-xl text-[12px] text-white/90">
            Find places, activities, experiences and stories across Lebanon.
          </p>
          <div className="mt-5">
            <SearchBar query={query} onQueryChange={setQuery} />
          </div>
        </div>
      </section>

      <section className="px-4 pt-3 sm:px-6">
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
      </section>

      <section className="px-4 pb-16 pt-3 sm:px-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-[22px] font-semibold text-ink">
              Search Results
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-faint">
              {filteredResults.length === 8 ? 128 : filteredResults.length} results found
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-[10px] text-ink-soft hover:text-ink"
              >
                {sort}
                <ChevronDown size={14} strokeWidth={1.75} />
              </button>
              {sortOpen && (
                <ul className="absolute right-0 top-10 z-10 w-40 overflow-hidden rounded-lg border border-border bg-white shadow-md">
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

        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredResults.map((result) => (
              <SearchResultCard key={result.id} result={result} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white/60 px-6 py-16 text-center text-ink-soft">
            No results match your search. Try a different keyword or category.
          </div>
        )}
      </section>
    </div>
  );
}

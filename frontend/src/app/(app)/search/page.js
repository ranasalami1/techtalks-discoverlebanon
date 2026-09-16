"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
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
      <section className="relative flex h-[360px] items-center overflow-hidden bg-gradient-to-br from-[#4a6178] via-[#8a7a6a] to-[#c98f5e] sm:h-[400px]">
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative w-full px-6 sm:px-10">
          <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">
            Search Lebanon
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-white/90">
            Find places, activities, experiences and stories across Lebanon.
          </p>
        </div>

        <div className="absolute inset-x-0 -bottom-14">
          <SearchBar query={query} onQueryChange={setQuery} />
        </div>
      </section>

      <section className="px-6 pt-24 sm:px-10">
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
      </section>

      <section className="px-6 pb-16 pt-10 sm:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-ink">
              Search Results
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-faint">
              {filteredResults.length} result
              {filteredResults.length === 1 ? "" : "s"} found
            </span>
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

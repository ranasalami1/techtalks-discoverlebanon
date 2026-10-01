"use client";

import { Search } from "lucide-react";
import { searchSuggestions } from "@/data/searchResults";

export default function SearchBar({ query, onQueryChange }) {
  return (
    <div className="mx-0 w-full max-w-[760px] px-0">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center gap-2 rounded-full bg-white/95 p-1.5 shadow-lg"
      >
        <Search size={20} strokeWidth={1.75} className="ml-3 text-ink-faint" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search for a place, activity, experience or keyword..."
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-[12px] text-ink placeholder:text-ink-faint focus:outline-none sm:text-[13px]"
        />
        <button
          type="submit"
          className="rounded-full bg-olive-dark px-7 py-2.5 text-[12px] font-medium text-white transition-colors hover:bg-olive"
        >
          Search
        </button>
      </form>

      <p className="mt-3 text-center text-[10px] text-white/90 sm:text-left">
        Try:{" "}
        {searchSuggestions.map((term, i) => (
          <span key={term}>
            <button
              type="button"
              onClick={() => onQueryChange(term)}
              className="underline decoration-dotted underline-offset-2 hover:text-olive-dark"
            >
              {term}
            </button>
            {i < searchSuggestions.length - 1 ? ", " : "…"}
          </span>
        ))}
      </p>
    </div>
  );
}

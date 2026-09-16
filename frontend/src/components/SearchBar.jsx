"use client";

import { Search } from "lucide-react";
import { searchSuggestions } from "@/data/searchResults";

export default function SearchBar({ query, onQueryChange }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 sm:px-10">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center gap-2 rounded-full bg-white p-2 shadow-lg"
      >
        <Search size={20} strokeWidth={1.75} className="ml-3 text-ink-faint" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search for a place, activity, experience or keyword..."
          className="flex-1 bg-transparent px-1 py-2 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-olive-dark px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-olive"
        >
          Search
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-soft sm:text-left">
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

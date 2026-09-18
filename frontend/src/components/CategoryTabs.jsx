"use client";

import {
  LayoutGrid,
  MapPin,
  Footprints,
  Landmark,
  UtensilsCrossed,
  Trees,
  BookOpen,
} from "lucide-react";
import { categories } from "@/data/searchResults";

const icons = {
  grid: LayoutGrid,
  "map-pin": MapPin,
  activity: Footprints,
  landmark: Landmark,
  utensils: UtensilsCrossed,
  trees: Trees,
  "book-open": BookOpen,
};

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const Icon = icons[category.icon];
        const isActive = active === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 text-[11px] font-medium transition-colors ${
              isActive
                ? "border-olive-dark bg-olive-dark text-white"
                : "border-border bg-white text-ink-soft hover:border-olive-dark/40 hover:text-ink"
            }`}
          >
            <Icon size={16} strokeWidth={1.75} />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}

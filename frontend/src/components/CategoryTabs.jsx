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
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const Icon = icons[category.icon];
        const isActive = active === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
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

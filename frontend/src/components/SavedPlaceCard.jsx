"use client";

import {
  Bookmark,
  Landmark,
  Trees,
  Waves,
  Home,
  UtensilsCrossed,
  Mountain,
  MapPin,
  CalendarDays,
} from "lucide-react";

const accentStyles = {
  olive: {
    image: "from-[#8a9a6b] to-[#3f4a2f]",
    badge: "bg-[#46512f]/90",
    icon: Landmark,
  },
  green: {
    image: "from-[#7fa06f] to-[#37472e]",
    badge: "bg-[#3e6a3f]/90",
    icon: Trees,
  },
  blue: {
    image: "from-[#82a9c9] to-[#2e4a63]",
    badge: "bg-[#2f5570]/90",
    icon: Waves,
  },
  brown: {
    image: "from-[#b3906a] to-[#5f4128]",
    badge: "bg-[#6b4a2c]/90",
    icon: Home,
  },
  red: {
    image: "from-[#c78d6c] to-[#6f3527]",
    badge: "bg-[#7a3324]/90",
    icon: UtensilsCrossed,
  },
  teal: {
    image: "from-[#74a99a] to-[#2c4f47]",
    badge: "bg-[#2f5a52]/90",
    icon: Mountain,
  },
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function SavedPlaceCard({ place, onRemove }) {
  const style = accentStyles[place.accent] ?? accentStyles.olive;
  const Icon = style.icon;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-white/60 shadow-sm transition-shadow hover:shadow-md">
      <div className={`relative h-40 bg-gradient-to-br ${style.image}`}>
        <Icon
          size={40}
          strokeWidth={1.25}
          className="absolute inset-0 m-auto text-white/50"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide text-white ${style.badge}`}
        >
          {place.badge}
        </span>
        <button
          type="button"
          onClick={() => onRemove(place.id)}
          aria-label={`Remove ${place.title} from saved places`}
          title="Remove from saved"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-olive-dark transition-colors hover:text-ink"
        >
          <Bookmark size={15} strokeWidth={1.75} fill="currentColor" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-ink">
          {place.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-[13px] text-ink-faint">
          <MapPin size={12} strokeWidth={1.75} />
          {place.location}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {place.description}
        </p>
        <p className="mt-3 flex items-center gap-1 border-t border-border pt-3 text-[12px] text-ink-faint">
          <CalendarDays size={12} strokeWidth={1.75} />
          Saved {dateFormatter.format(new Date(place.savedAt))}
        </p>
      </div>
    </article>
  );
}

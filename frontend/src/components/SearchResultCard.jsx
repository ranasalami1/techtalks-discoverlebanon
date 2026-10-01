"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bookmark,
  Landmark,
  Trees,
  Waves,
  Home,
  UtensilsCrossed,
  Mountain,
  MapPin,
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

export default function SearchResultCard({ result }) {
  const [saved, setSaved] = useState(false);
  const style = accentStyles[result.accent] ?? accentStyles.olive;
  const Icon = style.icon;

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-[#fffdf8] shadow-[0_2px_10px_rgba(70,55,35,0.06)] transition-shadow hover:shadow-md">
      <div className="relative h-[112px] overflow-hidden sm:h-[118px]">
        <Image
          src={result.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 210px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute bottom-2 left-2 rounded-full px-2.5 py-1 text-[9px] font-medium tracking-wide text-white ${style.badge}`}
        >
          {result.badge}
        </span>
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved places" : "Save this place"}
          className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-ink-soft transition-colors hover:text-olive-dark"
        >
          <Bookmark
            size={15}
            strokeWidth={1.75}
            fill={saved ? "currentColor" : "none"}
            className={saved ? "text-olive-dark" : ""}
          />
        </button>
      </div>

      <div className="p-2.5">
        <h3 className="font-serif text-[14px] font-semibold text-ink">
          {result.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-[10px] text-ink-faint">
          <MapPin size={12} strokeWidth={1.75} />
          {result.location}
        </p>
        <p className="mt-1 text-[10px] leading-[1.35] text-ink-soft">
          {result.description}
        </p>
      </div>
    </article>
  );
}

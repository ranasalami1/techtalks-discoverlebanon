"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bookmark, Ellipsis, MapPin } from "lucide-react";

export default function SavedPlaceCard({ place, onRemove }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const detailsHref = `/places/${place.placeId ?? place.id}`;
  const menuRef = useRef(null);

  // Close the "..." menu when clicking anywhere else.
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10]">
        <Image
          src={place.image}
          alt={place.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/60 px-3 py-1 text-[11.5px] font-medium text-white backdrop-blur-sm">
          {place.badge}
        </span>

        <div ref={menuRef} className="absolute right-3 top-3">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={`More options for ${place.title}`}
            aria-expanded={menuOpen}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm hover:bg-white"
          >
            <Ellipsis size={16} strokeWidth={2} />
          </button>
          {menuOpen && (
            <ul className="absolute right-0 top-9 z-10 w-40 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-md">
              <li>
                <Link
                  href={detailsHref}
                  className="block px-3 py-2 text-[13px] text-ink-soft hover:bg-cream-soft hover:text-ink"
                >
                  View details
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onRemove(place.id);
                  }}
                  className="block w-full px-3 py-2 text-left text-[13px] text-ink-soft hover:bg-cream-soft hover:text-ink"
                >
                  Remove from saved
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-serif text-[17px] font-semibold leading-tight text-ink">
              {place.title}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-[13px] text-ink-soft">
              <MapPin size={13} strokeWidth={1.75} />
              {place.location}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(place.id)}
            aria-label={`Remove ${place.title} from saved places`}
            title="Remove from saved"
            className="mt-0.5 shrink-0 text-olive transition-colors hover:text-ink"
          >
            <Bookmark size={18} strokeWidth={1.75} fill="currentColor" />
          </button>
        </div>

        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{place.note}</p>

        <Link
          href={detailsHref}
          className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[13px] text-ink hover:text-olive"
        >
          View <span className="underline underline-offset-4">Details</span>
          <ArrowRight size={14} strokeWidth={1.75} />
        </Link>
      </div>
    </article>
  );
}

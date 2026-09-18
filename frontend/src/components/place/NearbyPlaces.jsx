import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function NearbyPlaces({ places }) {
  if (!places.length) return null;

  return (
    <section>
      <SectionHeading eyebrow="Nearby" title="Also worth the detour">
        <Link
          href="/map"
          className="text-[13px] font-medium tracking-[0.1em] text-olive-dark hover:underline"
        >
          VIEW ON MAP
        </Link>
      </SectionHeading>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => (
          <Link
            key={place.id}
            href={`/places/${place.id}`}
            className="group overflow-hidden rounded-2xl border border-border bg-cream transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-cream-soft">
              <Image
                src={place.heroImage}
                alt={place.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-2.5 py-1 text-[10px] font-medium tracking-[0.15em] text-ink backdrop-blur">
                {place.category.toUpperCase()}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg font-semibold text-ink">
                  {place.name}
                </h3>
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.75}
                  className="shrink-0 text-ink-faint transition-colors group-hover:text-olive-dark"
                />
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-faint">
                <MapPin size={12} strokeWidth={1.75} />
                {place.region}
              </p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-soft">
                {place.tagline}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

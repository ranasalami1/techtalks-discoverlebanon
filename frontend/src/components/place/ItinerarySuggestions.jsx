import Link from "next/link";
import { Clock, ListChecks, ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function ItinerarySuggestions({ itineraries, placeName }) {
  if (!itineraries.length) return null;

  return (
    <section>
      <SectionHeading
        eyebrow="Itineraries"
        title={`Trips that include ${placeName}`}
      >
        <Link
          href="/itineraries"
          className="text-[13px] font-medium tracking-[0.1em] text-olive-dark hover:underline"
        >
          ALL ITINERARIES
        </Link>
      </SectionHeading>

      <div className="grid gap-5 md:grid-cols-2">
        {itineraries.map((itinerary) => (
          <Link
            key={itinerary.id}
            href={`/itineraries/${itinerary.id}`}
            className="group flex flex-col justify-between rounded-2xl bg-olive-dark p-6 text-cream transition-colors hover:bg-olive"
          >
            <div>
              <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.15em] text-cream/70">
                <Clock size={13} strokeWidth={1.75} />
                {itinerary.duration.toUpperCase()}
              </div>
              <h3 className="mt-2 font-serif text-2xl font-semibold">
                {itinerary.title}
              </h3>
              <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-cream/85">
                {itinerary.stops.map((stop, index) => (
                  <li key={stop} className="flex items-center gap-2">
                    <span
                      className={
                        stop === placeName ? "font-semibold text-gold" : ""
                      }
                    >
                      {stop}
                    </span>
                    {index < itinerary.stops.length - 1 && (
                      <span className="text-cream/40">→</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-6 flex items-center justify-between text-[13px] font-medium tracking-[0.1em]">
              <span className="flex items-center gap-2 text-cream/70">
                <ListChecks size={15} strokeWidth={1.75} />
                {itinerary.stops.length} STOPS
              </span>
              <span className="flex items-center gap-1.5 transition-transform group-hover:translate-x-1">
                VIEW TRIP
                <ArrowRight size={15} strokeWidth={1.75} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

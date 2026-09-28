import { MapPin, Navigation, Car } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function PlaceLocation({ location, placeName }) {
  const { lat, lng } = location;
  const delta = 0.03;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(",");
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section>
      <SectionHeading eyebrow="Location" title="Getting there">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-olive-dark px-5 py-2.5 text-[13px] font-medium tracking-[0.08em] text-cream hover:bg-olive"
        >
          <Navigation size={15} strokeWidth={1.75} />
          GET DIRECTIONS
        </a>
      </SectionHeading>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-cream-soft">
          <iframe
            title={`Map of ${placeName}`}
            src={embedUrl}
            className="h-[320px] w-full sm:h-[400px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="flex flex-col gap-5 rounded-2xl border border-border p-6">
          <div className="flex gap-3">
            <MapPin size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-olive" />
            <div>
              <p className="text-[11px] font-medium tracking-[0.15em] text-ink-faint">
                ADDRESS
              </p>
              <p className="mt-0.5 text-[15px] text-ink">{location.address}</p>
              <p className="mt-1 font-mono text-xs text-ink-faint">
                {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Car size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-olive" />
            <div>
              <p className="text-[11px] font-medium tracking-[0.15em] text-ink-faint">
                FROM BEIRUT
              </p>
              <p className="mt-0.5 text-[15px] text-ink">
                {location.distanceFromBeirut}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {location.directions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

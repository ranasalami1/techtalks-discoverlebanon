import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, MapPin } from "lucide-react";
import SaveButton from "./SaveButton";

export default function PlaceHero({ place }) {
  return (
    <section className="relative h-[60vh] min-h-[380px] w-full overflow-hidden sm:h-[68vh]">
      <Image
        src={place.heroImage}
        alt={place.name}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" />

      <div className="absolute left-4 top-4 sm:left-8 sm:top-6">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 rounded-full bg-cream/90 px-4 py-2 text-[12px] font-medium tracking-[0.1em] text-ink backdrop-blur hover:bg-cream"
        >
          <ChevronLeft size={15} strokeWidth={2} />
          BACK TO MAP
        </Link>
      </div>

      <div className="absolute right-4 top-4 sm:right-8 sm:top-6">
        <SaveButton placeId={place.id} />
      </div>

      <div className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:px-10 sm:pb-12">
        <div className="max-w-4xl">
          <span className="inline-block rounded-full border border-cream/50 px-3 py-1 text-[11px] font-medium tracking-[0.2em] text-cream/90">
            {place.category.toUpperCase()}
          </span>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <h1 className="font-serif text-4xl font-semibold leading-tight text-cream sm:text-5xl lg:text-6xl">
              {place.name}
            </h1>
            <span
              dir="rtl"
              className="text-3xl text-gold sm:text-4xl"
              style={{ fontFamily: "var(--font-arabic)" }}
            >
              {place.arabicName}
            </span>
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm text-cream/80">
            <MapPin size={15} strokeWidth={1.75} />
            {place.region}, Lebanon
          </p>
        </div>
      </div>
    </section>
  );
}

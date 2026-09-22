import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  MapPin,
  Tag,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import { savedPlaces } from "@/data/savedPlaces";

/* =====================================================
   PLACE DETAILS PAGE
===================================================== */

export default async function PlaceDetailsPage({ params }) {
  const { id } = await params;

  const place = savedPlaces.find(
    (item) => item.id === id
  );

  if (!place) {
    notFound();
  }

  const formattedDate = new Date(
    `${place.savedAt}T00:00:00`
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AppShell>
      <main className="min-h-screen flex-1 bg-cream">

        {/* =================================================
            HERO IMAGE
        ================================================= */}

        <section className="relative h-[300px] overflow-hidden">

          <Image
            src={place.image}
            alt={place.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />

          {/* BACK BUTTON */}

          <Link
            href="/saved"
            className="
              absolute
              left-8
              top-6
              z-10
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/30
              bg-black/20
              px-4
              py-2
              text-[12px]
              text-white
              backdrop-blur-sm
              transition
              hover:bg-black/35
            "
          >
            <ArrowLeft
              size={15}
              strokeWidth={1.7}
            />

            Back to Saved Places
          </Link>

          {/* HERO TEXT */}

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              px-8
              pb-8
              sm:px-10
            "
          >

            <span
              className="
                inline-flex
                rounded-full
                bg-white/15
                px-3
                py-1
                text-[10px]
                font-medium
                tracking-[0.08em]
                text-white
                backdrop-blur-sm
              "
            >
              {place.badge}
            </span>

            <h1
              className="
                mt-3
                font-serif
                text-[42px]
                font-normal
                leading-none
                text-white
                sm:text-[52px]
              "
            >
              {place.title}
            </h1>

            <p
              className="
                mt-3
                flex
                items-center
                gap-2
                text-[14px]
                text-white/90
              "
            >
              <MapPin
                size={15}
                strokeWidth={1.7}
              />

              {place.location}, Lebanon
            </p>

          </div>

        </section>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <section className="px-6 py-7 sm:px-10">

          <div
            className="
              grid
              gap-5
              lg:grid-cols-[minmax(0,1fr)_280px]
            "
          >

            {/* =================================================
                LEFT
            ================================================= */}

            <div className="space-y-5">

              {/* ABOUT */}

              <section
                className="
                  rounded-xl
                  border
                  border-border
                  bg-white
                  p-6
                "
              >

                <div className="mb-4 flex items-center justify-between gap-4">

                  <div>
                    <span
                      className="
                        text-[9px]
                        font-semibold
                        tracking-[0.2em]
                        text-olive
                      "
                    >
                      DISCOVER
                    </span>

                    <h2
                      className="
                        mt-1
                        font-serif
                        text-[25px]
                        font-normal
                        text-ink
                      "
                    >
                      About {place.title}
                    </h2>
                  </div>

                  <Bookmark
                    size={21}
                    strokeWidth={1.6}
                    fill="currentColor"
                    className="text-olive"
                  />

                </div>

                <p
                  className="
                    text-[13px]
                    leading-[1.8]
                    text-ink-soft
                  "
                >
                  {place.note}
                </p>

                <p
                  className="
                    mt-4
                    text-[13px]
                    leading-[1.8]
                    text-ink-soft
                  "
                >
                  Discover this destination and add it to
                  your journey through Lebanon. Explore its
                  surroundings, take your time, and create
                  your own story along the way.
                </p>

              </section>

              {/* JOURNEY NOTE */}

              <section
                className="
                  rounded-xl
                  border
                  border-border
                  bg-cream-soft
                  p-6
                "
              >

                <span
                  className="
                    text-[9px]
                    font-semibold
                    tracking-[0.2em]
                    text-olive
                  "
                >
                  YOUR NOTE
                </span>

                <h2
                  className="
                    mt-1
                    font-serif
                    text-[22px]
                    font-normal
                    text-ink
                  "
                >
                  Why you saved this place
                </h2>

                <p
                  className="
                    mt-3
                    font-serif
                    text-[17px]
                    italic
                    leading-relaxed
                    text-ink
                  "
                >
                  &ldquo;{place.note}&rdquo;
                </p>

              </section>

            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <aside className="space-y-4">

              {/* INFORMATION */}

              <section
                className="
                  rounded-xl
                  border
                  border-border
                  bg-white
                  p-5
                "
              >

                <h2
                  className="
                    mb-5
                    font-serif
                    text-[19px]
                    font-normal
                    text-ink
                  "
                >
                  Place Information
                </h2>

                {/* LOCATION */}

                <div
                  className="
                    flex
                    gap-3
                    border-b
                    border-border
                    pb-4
                  "
                >

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-olive-soft
                      text-olive
                    "
                  >
                    <MapPin
                      size={15}
                      strokeWidth={1.7}
                    />
                  </span>

                  <div>
                    <span
                      className="
                        block
                        text-[9px]
                        uppercase
                        tracking-[0.12em]
                        text-ink-soft
                      "
                    >
                      Location
                    </span>

                    <strong
                      className="
                        mt-1
                        block
                        font-serif
                        text-[13px]
                        font-normal
                        text-ink
                      "
                    >
                      {place.location}, Lebanon
                    </strong>
                  </div>

                </div>

                {/* CATEGORY */}

                <div
                  className="
                    flex
                    gap-3
                    border-b
                    border-border
                    py-4
                  "
                >

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-olive-soft
                      text-olive
                    "
                  >
                    <Tag
                      size={15}
                      strokeWidth={1.7}
                    />
                  </span>

                  <div>
                    <span
                      className="
                        block
                        text-[9px]
                        uppercase
                        tracking-[0.12em]
                        text-ink-soft
                      "
                    >
                      Category
                    </span>

                    <strong
                      className="
                        mt-1
                        block
                        font-serif
                        text-[13px]
                        font-normal
                        text-ink
                      "
                    >
                      {place.badge}
                    </strong>
                  </div>

                </div>

                {/* SAVED DATE */}

                <div className="flex gap-3 pt-4">

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-olive-soft
                      text-olive
                    "
                  >
                    <CalendarDays
                      size={15}
                      strokeWidth={1.7}
                    />
                  </span>

                  <div>
                    <span
                      className="
                        block
                        text-[9px]
                        uppercase
                        tracking-[0.12em]
                        text-ink-soft
                      "
                    >
                      Saved
                    </span>

                    <strong
                      className="
                        mt-1
                        block
                        font-serif
                        text-[13px]
                        font-normal
                        text-ink
                      "
                    >
                      {formattedDate}
                    </strong>
                  </div>

                </div>

              </section>

              {/* SAVED STATUS */}

              <section
                className="
                  rounded-xl
                  border
                  border-border
                  bg-cream-soft
                  p-5
                "
              >

                <div className="flex items-center gap-3">

                  <span
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-olive
                      text-white
                    "
                  >
                    <Bookmark
                      size={16}
                      strokeWidth={1.7}
                      fill="currentColor"
                    />
                  </span>

                  <div>
                    <strong
                      className="
                        block
                        font-serif
                        text-[15px]
                        font-normal
                        text-ink
                      "
                    >
                      Saved to your journey
                    </strong>

                    <span
                      className="
                        mt-0.5
                        block
                        text-[10px]
                        text-ink-soft
                      "
                    >
                      Find it anytime in Saved Places
                    </span>
                  </div>

                </div>

              </section>

              {/* BACK */}

              <Link
                href="/saved"
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-olive
                  px-5
                  py-2.5
                  text-[12px]
                  font-medium
                  text-olive
                  transition-colors
                  hover:bg-olive
                  hover:text-white
                "
              >
                <ArrowLeft
                  size={14}
                  strokeWidth={1.8}
                />

                Back to Saved Places
              </Link>

            </aside>

          </div>

        </section>

      </main>
    </AppShell>
  );
}
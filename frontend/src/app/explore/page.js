"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import dynamic from "next/dynamic";
import Image from "next/image";

import AppShell from "@/components/AppShell";
import { useSiteLanguage } from "@/components/SiteLanguage";

import {
  ArrowRight,
  Grid2X2,
  Landmark,
  Search,
  Trees,
  UtensilsCrossed,
  PersonStanding,
  MapPin,
  X,
} from "lucide-react";


/* =====================================================
   MAP
===================================================== */

const LebanonMap = dynamic(
  () => import("@/components/LebanonMap"),
  {
    ssr: false,

    loading: () => (
      <div
        className="h-full min-h-[620px] bg-[#dbe2d2]"
        aria-label="Loading map"
      />
    ),
  }
);


/* =====================================================
   API
===================================================== */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";


/* =====================================================
   REGIONS
===================================================== */

const regionNames = [
  "Tripoli",
  "Batroun",
  "Byblos",
  "Beirut",
  "Zahle",
  "Baalbek",
  "Chouf",
  "Nabatieh",
  "Sidon",
  "Tyre",
];


/* =====================================================
   FILTER BUTTONS
===================================================== */

const filters = [
  {
    id: "all",
    icon: Grid2X2,
  },
  {
    id: "historical",
    icon: Landmark,
  },
  {
    id: "nature",
    icon: Trees,
  },
  {
    id: "activities",
    icon: PersonStanding,
  },
  {
    id: "food",
    icon: UtensilsCrossed,
  },
];


/* =====================================================
   FEATURED DESTINATIONS
===================================================== */

const featured = [
  {
    id: "featured-byblos",
    name: "Byblos",
    region: "Byblos",
    subtitle: "A Journey Through Time",
    image: "/images/byblos-account.jpg",
    types: ["historical"],
  },

  {
    id: "featured-baalbek",
    name: "Baalbek",
    region: "Baalbek",
    subtitle: "Monumental Heritage",
    image: "/images/heritage-hero.jpg",
    types: ["historical"],
  },

  {
    id: "featured-tyre",
    name: "Tyre",
    region: "Tyre",
    subtitle: "Where History Meets the Sea",
    image: null,
    types: [
      "historical",
      "activities",
      "food",
    ],
  },

  {
    id: "featured-chouf",
    name: "Chouf",
    region: "Chouf",
    subtitle: "Nature, Villages & Traditions",
    image: "/images/chouf.jpg",
    types: [
      "nature",
      "activities",
    ],
  },
];


/* =====================================================
   READ API RESULTS
===================================================== */

function readPlaces(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (
    Array.isArray(
      payload?.data?.items
    )
  ) {
    return payload.data.items;
  }

  if (
    Array.isArray(
      payload?.data?.places
    )
  ) {
    return payload.data.places;
  }

  if (
    Array.isArray(
      payload?.data
    )
  ) {
    return payload.data;
  }

  if (
    Array.isArray(
      payload?.items
    )
  ) {
    return payload.items;
  }

  if (
    Array.isArray(
      payload?.places
    )
  ) {
    return payload.places;
  }

  return [];
}


/* =====================================================
   CATEGORY NAMES
===================================================== */

function categoryNames(place) {
  if (
    !Array.isArray(
      place?.categories
    )
  ) {
    return [];
  }

  return place.categories
    .map((category) => {
      if (
        typeof category ===
        "string"
      ) {
        return category;
      }

      return (
        category?.name ??
        category?.category_name ??
        ""
      );
    })

    .map((category) =>
      category
        .trim()
        .toLowerCase()
    )

    .filter(Boolean);
}


/* =====================================================
   CLASSIFY PLACE
===================================================== */

function typesFor(place) {
  const categories =
    categoryNames(place);

  const venueType =
    String(
      place?.venue_type ?? ""
    ).toLowerCase();

  const combined = [
    ...categories,
    venueType,
  ].join(" ");


  /* -------------------------
     HISTORICAL
  ------------------------- */

  const historical =
    combined.includes(
      "historical"
    ) ||
    combined.includes(
      "heritage"
    ) ||
    combined.includes(
      "archaeolog"
    ) ||
    combined.includes(
      "museum"
    ) ||
    combined.includes(
      "monument"
    ) ||
    combined.includes(
      "ruin"
    ) ||
    combined.includes(
      "temple"
    ) ||
    combined.includes(
      "castle"
    ) ||
    combined.includes(
      "citadel"
    );


  /* -------------------------
     NATURE
  ------------------------- */

  const nature =
    combined.includes(
      "nature"
    ) ||
    combined.includes(
      "outdoor"
    ) ||
    combined.includes(
      "eco-tourism"
    ) ||
    combined.includes(
      "eco tourism"
    ) ||
    combined.includes(
      "reserve"
    ) ||
    combined.includes(
      "forest"
    ) ||
    combined.includes(
      "beach"
    ) ||
    combined.includes(
      "park"
    ) ||
    combined.includes(
      "hiking"
    ) ||
    combined.includes(
      "waterfall"
    );


  /* -------------------------
     FOOD
  ------------------------- */

  const food =
    combined.includes(
      "restaurant"
    ) ||
    combined.includes(
      "coffee shop"
    ) ||
    combined.includes(
      "food"
    ) ||
    combined.includes(
      "gastronomy"
    ) ||
    combined.includes(
      "cafe"
    ) ||
    combined.includes(
      "café"
    ) ||
    combined.includes(
      "bakery"
    ) ||
    combined.includes(
      "patisserie"
    ) ||
    combined.includes(
      "pastry"
    );


  /* -------------------------
     ACTIVITIES
  ------------------------- */

  const activity =
    combined.includes(
      "activity"
    ) ||
    combined.includes(
      "activities"
    ) ||
    combined.includes(
      "experience"
    ) ||
    combined.includes(
      "workshop"
    ) ||
    combined.includes(
      "adventure"
    ) ||
    combined.includes(
      "tour"
    );


  const types = [];


  if (historical) {
    types.push(
      "historical"
    );
  }


  if (nature) {
    types.push(
      "nature"
    );
  }


  /*
    IMPORTANT:

    Some Historical and Nature records
    also contain the generic database
    category "Activity".

    We do NOT want them all appearing
    under Activities & Experiences.

    Activities should contain places
    that are primarily activities.
  */

  if (
    activity &&
    !historical &&
    !nature &&
    !food
  ) {
    types.push(
      "activities"
    );
  }


  if (food) {
    types.push(
      "food"
    );
  }


  return types;
}


/* =====================================================
   NORMALIZE DATABASE PLACE
===================================================== */

function normalizePlace(place) {
  const placeId =
    place?.place_id ??
    place?.id;

  const categories =
    categoryNames(place);

  const searchable = [
    place?.name,
    place?.venue_type,
    place?.city,
    place?.region,
    place?.address,
    place?.short_description,
    place?.description,
    ...categories,
  ]

    .filter(Boolean)

    .join(" ")

    .toLowerCase();


  return {
    id:
      placeId != null
        ? `place-${placeId}`
        : `place-${place?.name}-${place?.city}-${place?.region}`,

    name:
      place?.name ??
      "Unnamed place",

    region:
      place?.region ??
      "Lebanon",

    subtitle: [
      place?.venue_type,
      place?.city,
      place?.region,
    ]

      .filter(Boolean)

      .join(" · "),

    searchable,

    types:
      typesFor(place),

    place,

    image: null,
  };
}


/* =====================================================
   FETCH ALL PLACES FOR REGION
===================================================== */

async function fetchRegionPlaces(
  region,
  signal
) {
  const places = [];

  const seen =
    new Set();


  for (
    let page = 1;
    page <= 100;
    page += 1
  ) {
    const url =
      `${API_URL}/api/places` +
      `?region=${encodeURIComponent(
        region
      )}` +
      `&page=${page}` +
      `&per_page=50`;


    const response =
      await fetch(
        url,
        {
          signal,
        }
      );


    if (!response.ok) {
      throw new Error(
        `Could not load ${region} (${response.status})`
      );
    }


    const payload =
      await response.json();


    const rows =
      readPlaces(payload);


    for (
      const place of rows
    ) {
      const id =
        place?.place_id ??
        place?.id ??
        `${place?.name}-${place?.city}-${place?.region}`;


      if (
        !seen.has(id)
      ) {
        seen.add(id);

        places.push(place);
      }
    }


    if (
      rows.length < 50
    ) {
      break;
    }
  }


  return places;
}


/* =====================================================
   CARD
===================================================== */

function DestinationCard({
  destination,
  onSelect,
  t,
}) {
  let Icon =
    MapPin;


  if (
    destination.types?.includes(
      "food"
    )
  ) {
    Icon =
      UtensilsCrossed;
  }

  else if (
    destination.types?.includes(
      "historical"
    )
  ) {
    Icon =
      Landmark;
  }

  else if (
    destination.types?.includes(
      "nature"
    )
  ) {
    Icon =
      Trees;
  }

  else if (
    destination.types?.includes(
      "activities"
    )
  ) {
    Icon =
      PersonStanding;
  }


  return (
    <button
      type="button"

      onClick={() =>
        onSelect(
          destination
        )
      }

      aria-label={
        `${t.mapFocus}: ${destination.name}`
      }

      className="
        group
        relative
        block
        h-[138px]
        w-full
        overflow-hidden
        rounded-xl
        bg-[#596451]
        text-left
        shadow-sm
        transition
        hover:shadow-lg
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[#697358]
      "
    >

      {/* IMAGE */}

      {destination.image ? (

        <Image
          src={
            destination.image
          }

          alt={
            destination.name
          }

          fill

          sizes="
            (max-width: 768px)
            100vw,
            350px
          "

          className="
            object-cover
            transition
            duration-500
            group-hover:scale-105
          "
        />

      ) : (

        /* PLACE WITHOUT IMAGE */

        <div
          className="
            absolute
            inset-0
            flex
            items-start
            justify-end
            bg-gradient-to-br
            from-[#748568]
            via-[#61715a]
            to-[#354237]
            p-4
          "

          aria-hidden="true"
        >
          <Icon
            size={60}
            strokeWidth={0.8}

            className="
              text-white/30
            "
          />
        </div>

      )}


      {/* DARK OVERLAY */}

      <span
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/80
          via-black/20
          to-transparent
        "

        aria-hidden="true"
      />


      {/* TEXT */}

      <span
        className="
          absolute
          inset-x-0
          bottom-0
          flex
          items-end
          justify-between
          gap-3
          p-3
        "
      >

        <span
          className="
            min-w-0
          "
        >

          <span
            className="
              block
              truncate
              font-serif
              text-lg
              font-medium
              text-white
            "
          >
            {
              destination.name
            }
          </span>


          <span
            className="
              mt-0.5
              block
              line-clamp-2
              text-[10px]
              text-white/85
            "
          >
            {
              destination.subtitle
            }
          </span>

        </span>


        {/* ARROW */}

        <span
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-white
            text-[#30342f]
            transition
            group-hover:translate-x-0.5
          "
        >
          <ArrowRight
            size={16}
          />
        </span>

      </span>

    </button>
  );
}


/* =====================================================
   PAGE CONTENT
===================================================== */

function ExplorePageContent() {
  const {
    language,
    t,
  } =
    useSiteLanguage();


  /* =====================================================
     STATE
  ===================================================== */

  const [
    query,
    setQuery,
  ] =
    useState("");


  const [
    activeCategory,
    setActiveCategory,
  ] =
    useState(
      "all"
    );


  const [
    databasePlaces,
    setDatabasePlaces,
  ] =
    useState([]);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    showAll,
    setShowAll,
  ] =
    useState(false);


  const [
    visibleLimit,
    setVisibleLimit,
  ] =
    useState(36);


  const [
    focusRegion,
    setFocusRegion,
  ] =
    useState(null);


  const [
    focusPlace,
    setFocusPlace,
  ] =
    useState(null);


  const [
    focusRequestId,
    setFocusRequestId,
  ] =
    useState(0);


  const searchRef =
    useRef(null);


/* =====================================================
   NAVBAR SEARCH
===================================================== */

  useEffect(() => {

    const focusSearch = () => {

      if (
        window.location.hash ===
        "#explore-search"
      ) {
        searchRef.current?.focus();
      }

    };


    focusSearch();


    window.addEventListener(
      "hashchange",
      focusSearch
    );


    return () => {

      window.removeEventListener(
        "hashchange",
        focusSearch
      );

    };

  }, []);


/* =====================================================
   LOAD DATABASE
===================================================== */

  useEffect(() => {

    const controller =
      new AbortController();


    let mounted =
      true;


    async function loadPlaces() {

      setLoading(
        true
      );

      setError(
        ""
      );


      try {

        const requests =
          regionNames.map(
            (region) =>
              fetchRegionPlaces(
                region,
                controller.signal
              )
          );


        const settled =
          await Promise.allSettled(
            requests
          );


        if (
          !mounted
        ) {
          return;
        }


        /*
          Global deduplication
        */

        const uniquePlaces =
          new Map();


        const failures =
          [];


        settled.forEach(
          (
            result,
            index
          ) => {

            if (
              result.status ===
              "fulfilled"
            ) {

              result.value.forEach(
                (place) => {

                  const id =
                    place?.place_id ??
                    place?.id ??
                    `${place?.name}-${place?.city}-${place?.region}`;


                  if (
                    !uniquePlaces.has(
                      id
                    )
                  ) {

                    uniquePlaces.set(
                      id,
                      place
                    );

                  }

                }
              );

            }

            else if (
              result.reason?.name !==
              "AbortError"
            ) {

              failures.push(
                regionNames[index]
              );

            }

          }
        );


        const normalized =
          Array.from(
            uniquePlaces.values()
          ).map(
            normalizePlace
          );


        setDatabasePlaces(
          normalized
        );


        if (
          failures.length > 0
        ) {

          setError(
            failures.join(
              ", "
            )
          );

        }

      }

      finally {

        if (
          mounted
        ) {

          setLoading(
            false
          );

        }

      }

    }


    loadPlaces();


    return () => {

      mounted =
        false;

      controller.abort();

    };

  }, []);


/* =====================================================
   SEARCH TERM
===================================================== */

  const normalizedQuery =
    query
      .trim()
      .toLowerCase();


/* =====================================================
   ARE WE BROWSING DATABASE PLACES?
===================================================== */

  const browsingPlaces =
    showAll ||
    activeCategory !==
      "all" ||
    Boolean(
      normalizedQuery
    );


/* =====================================================
   FILTER DATABASE PLACES
===================================================== */

  const filteredDatabasePlaces =
    useMemo(() => {

      return databasePlaces.filter(
        (item) => {

          /* CATEGORY */

          const matchesCategory =
            activeCategory ===
              "all" ||
            item.types.includes(
              activeCategory
            );


          /* SEARCH */

          const matchesSearch =
            !normalizedQuery ||
            item.searchable.includes(
              normalizedQuery
            );


          return (
            matchesCategory &&
            matchesSearch
          );

        }
      );

    }, [
      databasePlaces,
      activeCategory,
      normalizedQuery,
    ]);


/* =====================================================
   DISPLAY
===================================================== */

  const displayedItems =
    useMemo(() => {

      /*
        NORMAL PAGE:

        Show only Featured Destinations.
      */

      if (
        !browsingPlaces
      ) {
        return featured;
      }


      /*
        FILTER / SEARCH / VIEW ALL:

        Show ONLY real PostgreSQL places.

        Featured destination cards are NOT mixed here.
      */

      return (
        filteredDatabasePlaces
      );

    }, [
      browsingPlaces,
      filteredDatabasePlaces,
    ]);


/* =====================================================
   LIMIT
===================================================== */

  const visibleResults =
    browsingPlaces

      ? displayedItems.slice(
          0,
          visibleLimit
        )

      : displayedItems;


/* =====================================================
   CATEGORY CLICK
===================================================== */

  function chooseCategory(
    id
  ) {

    setActiveCategory(
      id
    );


    /*
      Categories should NOT activate
      the Show Less / View All state.
    */

    setShowAll(
      false
    );


    setVisibleLimit(
      36
    );

  }


/* =====================================================
   OPEN CARD ON MAP
===================================================== */

  function openDestination(
    item
  ) {

    setFocusRegion(
      item.region
    );


    setFocusPlace(
      item.place ??
      null
    );


    setFocusRequestId(
      (value) =>
        value + 1
    );


    /*
      On phones / tablets,
      scroll back to map.
    */

    if (
      typeof window !==
        "undefined" &&
      window.innerWidth <
        1280
    ) {

      window.scrollTo({
        top: 0,
        behavior:
          "smooth",
      });

    }

  }


/* =====================================================
   VIEW ALL / SHOW LESS
===================================================== */

  function toggleViewAll() {

    setVisibleLimit(
      36
    );


    /*
      SHOW LESS
    */

    if (
      showAll
    ) {

      setShowAll(
        false
      );

      setActiveCategory(
        "all"
      );

      setQuery(
        ""
      );


      return;
    }


    /*
      VIEW ALL
    */

    setShowAll(
      true
    );

    setActiveCategory(
      "all"
    );

    setQuery(
      ""
    );

  }


/* =====================================================
   TITLE
===================================================== */

  const sectionTitle =
    browsingPlaces
      ? t.searchResults
      : t.featured;


/* =====================================================
   RENDER
===================================================== */

  return (

    <div
      className="
        min-h-[calc(100vh-70px)]
        bg-[#f6f3ec]
      "
    >

      <div
        className="
          grid
          min-h-[calc(100vh-70px)]
          grid-cols-1
          xl:grid-cols-[minmax(340px,38%)_minmax(0,1fr)]
        "
      >


        {/* =====================================================
            LEFT — MAP
        ===================================================== */}

        <section
          aria-label="Interactive map of Lebanon"

          className="
            relative
            h-[580px]
            min-h-[580px]
            overflow-hidden
            border-r
            border-[#ded9cd]

            xl:sticky
            xl:top-[70px]
            xl:h-[calc(100vh-70px)]
            xl:min-h-[620px]
          "
        >

          <LebanonMap
            focusRegion={
              focusRegion
            }

            focusPlace={
              focusPlace
            }

            focusRequestId={
              focusRequestId
            }
          />

        </section>


        {/* =====================================================
            RIGHT
        ===================================================== */}

        <section
          lang={
            language
          }

          dir={
            language ===
              "ar"
              ? "rtl"
              : "ltr"
          }

          className="
            min-w-0
            bg-[#f8f5ef]
            px-5
            py-8

            sm:px-8

            lg:px-10
          "
        >

          <div
            className="
              mx-auto
              max-w-[680px]
            "
          >


            {/* =====================================================
                HEADER
            ===================================================== */}

            <h1
              className="
                font-serif
                text-[36px]
                font-medium
                leading-tight
                text-[#252821]

                sm:text-[42px]
              "
            >
              {
                t.explore
              }
            </h1>


            <p
              className="
                mt-2
                max-w-lg
                text-[14px]
                leading-6
                text-[#73736c]
              "
            >
              {
                t.subtitle
              }
            </p>


            {/* =====================================================
                SEARCH
            ===================================================== */}

            <div
              className="
                relative
                mt-6
              "
            >

              <Search
                size={18}

                strokeWidth={
                  1.8
                }

                className={`
                  absolute
                  top-1/2
                  -translate-y-1/2
                  text-[#32352f]

                  ${
                    language ===
                    "ar"
                      ? "right-4"
                      : "left-4"
                  }
                `}
              />


              <input
                id="explore-search"

                ref={
                  searchRef
                }

                type="search"

                autoComplete="off"

                value={
                  query
                }

                placeholder={
                  t.searchPlaceholder
                }

                aria-label={
                  t.searchPlaceholder
                }

                onChange={(
                  event
                ) => {

                  setQuery(
                    event.target
                      .value
                  );


                  /*
                    Search automatically uses
                    databasePlaces because
                    normalizedQuery becomes true.
                  */

                  setShowAll(
                    false
                  );


                  setVisibleLimit(
                    36
                  );

                }}

                className={`
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#dedbd2]
                  bg-white
                  text-xs
                  text-[#34362f]
                  shadow-sm
                  outline-none
                  transition

                  placeholder:text-[#9a9993]

                  focus:border-[#8d927d]
                  focus:ring-2
                  focus:ring-[#8d927d]/30

                  ${
                    language ===
                    "ar"
                      ? "pr-11 pl-12"
                      : "pl-11 pr-12"
                  }
                `}
              />


              {/* CLEAR SEARCH */}

              {
                query && (

                  <button
                    type="button"

                    aria-label={
                      t.clearSearch
                    }

                    onClick={() => {

                      setQuery(
                        ""
                      );


                      setVisibleLimit(
                        36
                      );


                      searchRef
                        .current
                        ?.focus();

                    }}

                    className={`
                      absolute
                      top-1/2
                      -translate-y-1/2
                      rounded-full
                      p-1
                      text-[#666]
                      transition
                      hover:bg-[#eee]

                      ${
                        language ===
                        "ar"
                          ? "left-4"
                          : "right-4"
                      }
                    `}
                  >

                    <X
                      size={15}
                    />

                  </button>

                )
              }

            </div>


            {/* =====================================================
                CATEGORY BUTTONS
            ===================================================== */}

            <div
              className="
                mt-5
                overflow-x-auto
                pb-1
              "
            >

              <div
                className="
                  grid
                  min-w-[600px]
                  grid-cols-[70px_repeat(4,minmax(105px,1fr))]
                  gap-2.5
                "
              >

                {
                  filters.map(
                    ({
                      id,
                      icon: Icon,
                    }) => {

                      const active =
                        activeCategory ===
                        id;


                      return (

                        <button
                          key={
                            id
                          }

                          type="button"

                          aria-pressed={
                            active
                          }

                          onClick={() =>
                            chooseCategory(
                              id
                            )
                          }

                          className={`
                            flex
                            h-[82px]
                            min-w-0
                            flex-col
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            px-2
                            py-2
                            text-center
                            shadow-sm
                            transition

                            focus-visible:outline-2
                            focus-visible:outline-offset-2
                            focus-visible:outline-[#697358]

                            ${
                              active

                                ? `
                                  border-[#687058]
                                  bg-[#687058]
                                  text-white
                                `

                                : `
                                  border-[#e1ddd3]
                                  bg-white
                                  text-[#30332d]
                                  hover:bg-[#f1eee6]
                                `
                            }
                          `}
                        >

                          <Icon
                            size={20}

                            strokeWidth={
                              1.6
                            }

                            className="
                              shrink-0
                            "
                          />


                          <span
                            className="
                              block
                              max-w-full
                              text-[10px]
                              font-medium
                              leading-[1.25]
                              whitespace-normal
                            "
                          >
                            {
                              t[id]
                            }
                          </span>

                        </button>

                      );

                    }
                  )
                }

              </div>

            </div>


            {/* =====================================================
                FEATURED / EXPLORE PLACES
            ===================================================== */}

            <div
              className="
                mt-7
              "
            >


              {/* HEADER */}

              <div
                className="
                  mb-3
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-2
                "
              >

                <div>

                  <h2
                    className="
                      font-serif
                      text-xl
                      font-semibold
                      text-[#292c26]
                    "
                  >
                    {
                      sectionTitle
                    }
                  </h2>


                  {/* RESULTS COUNT */}

                  {
                    browsingPlaces &&
                    !loading && (

                      <span
                        role="status"

                        className="
                          text-xs
                          text-[#72736b]
                        "
                      >

                        {
                          filteredDatabasePlaces
                            .length
                        }

                        {" "}

                        {
                          t.found
                        }

                      </span>

                    )
                  }

                </div>


                {/* =====================================================
                    VIEW ALL

                    Only visible on normal ALL screen.
                ===================================================== */}

                {
                  activeCategory ===
                    "all" &&
                  !normalizedQuery && (

                    <button
                      type="button"

                      aria-expanded={
                        showAll
                      }

                      onClick={
                        toggleViewAll
                      }

                      className="
                        inline-flex
                        items-center
                        gap-1
                        rounded
                        text-xs
                        font-medium
                        text-[#45483f]
                        transition

                        hover:text-[#9a6e34]

                        focus-visible:outline-2
                        focus-visible:outline-[#687058]
                      "
                    >

                      {
                        showAll
                          ? t.showLess
                          : t.viewAll
                      }


                      <ArrowRight
                        size={14}
                      />

                    </button>

                  )
                }

              </div>


              {/* =====================================================
                  LOADING
              ===================================================== */}

              {
                loading &&
                browsingPlaces && (

                  <p
                    className="
                      pb-3
                      text-xs
                      text-[#777]
                    "

                    role="status"
                  >
                    {
                      t.loading
                    }
                  </p>

                )
              }


              {/* =====================================================
                  API ERROR
              ===================================================== */}

              {
                Boolean(
                  error
                ) && (

                  <p
                    className="
                      mb-3
                      rounded-lg
                      border
                      border-amber-200
                      bg-amber-50
                      px-3
                      py-2
                      text-xs
                      text-[#80612f]
                    "

                    role="status"
                  >

                    {
                      t.apiError
                    }

                    {" "}

                    (
                    {
                      error
                    }
                    )

                  </p>

                )
              }


              {/* =====================================================
                  RESULTS
              ===================================================== */}

              {
                visibleResults.length >
                0 ? (

                  <>

                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-3

                        sm:grid-cols-2
                      "
                    >

                      {
                        visibleResults.map(
                          (item) => (

                            <DestinationCard
                              key={
                                item.id
                              }

                              destination={
                                item
                              }

                              onSelect={
                                openDestination
                              }

                              t={
                                t
                              }
                            />

                          )
                        )
                      }

                    </div>


                    {/* =====================================================
                        LOAD MORE
                    ===================================================== */}

                    {
                      browsingPlaces &&
                      filteredDatabasePlaces
                        .length >
                        visibleResults
                          .length && (

                        <button
                          type="button"

                          onClick={() =>
                            setVisibleLimit(
                              (
                                current
                              ) =>
                                current +
                                36
                            )
                          }

                          className="
                            mt-4
                            w-full
                            rounded-lg
                            border
                            border-[#c6cabb]
                            bg-white
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-[#536149]
                            transition

                            hover:bg-[#e9eddf]
                          "
                        >

                          {
                            t.loadMore
                          }

                          {" "}

                          (

                          {
                            visibleResults
                              .length
                          }

                          {" / "}

                          {
                            filteredDatabasePlaces
                              .length
                          }

                          )

                        </button>

                      )
                    }

                  </>

                ) : (

                  !loading && (

                    <div
                      className="
                        rounded-xl
                        border
                        border-dashed
                        border-[#d5d0c6]
                        bg-white/50
                        px-6
                        py-12
                        text-center
                      "
                    >

                      <MapPin
                        size={25}

                        className="
                          mx-auto
                          text-[#8a8d7a]
                        "
                      />


                      <p
                        className="
                          mt-3
                          text-sm
                          text-[#72736b]
                        "
                      >
                        {
                          t.noResults
                        }
                      </p>

                    </div>

                  )

                )
              }

            </div>


            {/* =====================================================
                QUOTE
            ===================================================== */}

            <div
              className="
                mt-8
                border-t
                border-[#ddd8cc]
                py-8
                text-center
              "
            >

              <Trees
                size={44}

                strokeWidth={
                  0.8
                }

                className="
                  mx-auto
                  mb-3
                  text-[#858d79]
                "
              />


              <p
                className="
                  font-serif
                  text-[22px]
                  italic
                  leading-7
                  text-[#65675d]
                "
              >

                “
                {
                  t.quote
                }
                ”

              </p>


              <span
                className="
                  mx-auto
                  mt-4
                  block
                  h-px
                  w-10
                  bg-[#b19054]
                "
              />

            </div>

          </div>

        </section>

      </div>

    </div>

  );
}


/* =====================================================
   PAGE
===================================================== */

export default function ExploreMapPage() {

  return (

    <AppShell>

      <ExplorePageContent />

    </AppShell>

  );

}
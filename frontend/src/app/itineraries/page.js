"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import AppShell from "@/components/AppShell";
import { useSiteLanguage } from "@/components/SiteLanguage";

import {
  ArrowRight,
  CalendarDays,
  Gauge,
  Grid2X2,
  Landmark,
  LoaderCircle,
  MapPin,
  Search,
  Trees,
  UsersRound,
  UtensilsCrossed,
  Waves,
  X,
} from "lucide-react";


/* =====================================================
   API
===================================================== */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";


/* =====================================================
   TRANSLATIONS
===================================================== */

const pageCopy = {
  en: {
    eyebrow: "JOURNEYS WITH MEANING",

    title: "Curated Itineraries",

    subtitle:
      "Handpicked journeys to help you discover the real Lebanon — its history, nature, culture and people.",

    quoteTop1: "Same places,",
    quoteTop2: "different stories.",

    all: "All Itineraries",
    cultural: "Cultural Heritage",
    nature: "Nature & Outdoors",
    coastal: "Coastal Escapes",
    food: "Food & Gastronomy",
    family: "Family Friendly",

    search: "Search",

    searchPlaceholder:
      "Search itineraries, places or themes...",

    loading: "Loading itineraries...",

    error:
      "Unable to load itineraries from the server.",

    noResults:
      "No itineraries match your search or selected category.",

    day: "Day",
    days: "Days",

    route: "Route",

    difficulty: "Difficulty",

    easy: "Easy",
    moderate: "Moderate",
    hard: "Hard",

    viewDetails: "View itinerary",

    itineraryDetails:
      "Itinerary Details",

    stops: "Stops",
    stop: "Stop",

    dayLabel: "Day",

    back: "Back to itineraries",

    close: "Close",

    noStops:
      "No itinerary stops are available yet.",

    quoteBottom1:
      "More than a destination,",

    quoteBottom2:
      "a journey through time, people and places.",

    resultOne: "itinerary",
    results: "itineraries",
  },


  fr: {
    eyebrow:
      "DES VOYAGES QUI ONT DU SENS",

    title:
      "Itinéraires sélectionnés",

    subtitle:
      "Des voyages soigneusement conçus pour découvrir le vrai Liban — son histoire, sa nature, sa culture et ses habitants.",

    quoteTop1:
      "Mêmes lieux,",

    quoteTop2:
      "histoires différentes.",

    all:
      "Tous les itinéraires",

    cultural:
      "Patrimoine culturel",

    nature:
      "Nature et plein air",

    coastal:
      "Escapades côtières",

    food:
      "Cuisine et gastronomie",

    family:
      "En famille",

    search:
      "Rechercher",

    searchPlaceholder:
      "Rechercher un itinéraire, un lieu ou un thème...",

    loading:
      "Chargement des itinéraires...",

    error:
      "Impossible de charger les itinéraires depuis le serveur.",

    noResults:
      "Aucun itinéraire ne correspond à votre recherche ou catégorie.",

    day:
      "Jour",

    days:
      "Jours",

    route:
      "Parcours",

    difficulty:
      "Difficulté",

    easy:
      "Facile",

    moderate:
      "Modéré",

    hard:
      "Difficile",

    viewDetails:
      "Voir l’itinéraire",

    itineraryDetails:
      "Détails de l’itinéraire",

    stops:
      "Étapes",

    stop:
      "Étape",

    dayLabel:
      "Jour",

    back:
      "Retour aux itinéraires",

    close:
      "Fermer",

    noStops:
      "Aucune étape n’est encore disponible pour cet itinéraire.",

    quoteBottom1:
      "Plus qu’une destination,",

    quoteBottom2:
      "un voyage à travers le temps, les personnes et les lieux.",

    resultOne:
      "itinéraire",

    results:
      "itinéraires",
  },


  ar: {
    eyebrow:
      "رحلات تحمل معنى",

    title:
      "مسارات مختارة",

    subtitle:
      "رحلات مختارة بعناية لاكتشاف لبنان الحقيقي — تاريخه وطبيعته وثقافته وأهله.",

    quoteTop1:
      "الأماكن نفسها،",

    quoteTop2:
      "حكايات مختلفة.",

    all:
      "كل المسارات",

    cultural:
      "التراث الثقافي",

    nature:
      "الطبيعة والهواء الطلق",

    coastal:
      "رحلات ساحلية",

    food:
      "الطعام والمأكولات",

    family:
      "مناسب للعائلة",

    search:
      "بحث",

    searchPlaceholder:
      "ابحث عن مسار أو مكان أو موضوع...",

    loading:
      "جارٍ تحميل المسارات...",

    error:
      "تعذر تحميل المسارات من الخادم.",

    noResults:
      "لا توجد مسارات مطابقة للبحث أو الفئة المختارة.",

    day:
      "يوم",

    days:
      "أيام",

    route:
      "المسار",

    difficulty:
      "الصعوبة",

    easy:
      "سهل",

    moderate:
      "متوسط",

    hard:
      "صعب",

    viewDetails:
      "عرض المسار",

    itineraryDetails:
      "تفاصيل المسار",

    stops:
      "المحطات",

    stop:
      "محطة",

    dayLabel:
      "اليوم",

    back:
      "العودة إلى المسارات",

    close:
      "إغلاق",

    noStops:
      "لا توجد محطات متاحة لهذا المسار حالياً.",

    quoteBottom1:
      "أكثر من مجرد وجهة،",

    quoteBottom2:
      "رحلة عبر الزمن والناس والأماكن.",

    resultOne:
      "مسار",

    results:
      "مسارات",
  },
};


/* =====================================================
   FILTERS
===================================================== */

const filters = [
  {
    id: "all",
    icon: Grid2X2,
  },

  {
    id: "cultural",
    icon: Landmark,
  },

  {
    id: "nature",
    icon: Trees,
  },

  {
    id: "coastal",
    icon: Waves,
  },

  {
    id: "food",
    icon: UtensilsCrossed,
  },

  {
    id: "family",
    icon: UsersRound,
  },
];


/* =====================================================
   EXACT ITINERARY CATEGORIES
===================================================== */

const itineraryCategories = {
  "echoes of empires": [
    "cultural",
  ],

  "into the cedars": [
    "nature",
  ],

  "batroun by the sea": [
    "coastal",
  ],

  "a taste of chouf": [
    "food",
  ],

  "family day in chouf": [
    "family",
  ],

  "stories of old sidon": [
    "cultural",
  ],

  "tyre through time": [
    "cultural",
    "coastal",
  ],
};


function getThemes(
  itinerary
) {
  const title =
    String(
      itinerary?.title ?? ""
    )
      .trim()
      .toLowerCase();

  return (
    itineraryCategories[
      title
    ] ?? []
  );
}


/* =====================================================
   API RESPONSE HELPERS
===================================================== */

function readItineraries(
  payload
) {
  if (
    Array.isArray(payload)
  ) {
    return payload;
  }

  if (
    Array.isArray(
      payload?.data
        ?.itineraries
    )
  ) {
    return (
      payload.data
        .itineraries
    );
  }

  if (
    Array.isArray(
      payload?.data?.items
    )
  ) {
    return (
      payload.data.items
    );
  }

  if (
    Array.isArray(
      payload?.itineraries
    )
  ) {
    return payload.itineraries;
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
      payload?.data
    )
  ) {
    return payload.data;
  }

  return [];
}


function readItinerary(
  payload
) {
  if (
    payload?.data
      ?.itinerary
  ) {
    return (
      payload.data
        .itinerary
    );
  }

  if (
    payload?.itinerary
  ) {
    return payload.itinerary;
  }

  if (
    payload?.data
  ) {
    return payload.data;
  }

  return payload;
}


/* =====================================================
   CATEGORY NAMES
===================================================== */

function getCategoryNames(
  place
) {
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

    .filter(Boolean);
}


/* =====================================================
   ROUTE
===================================================== */

function rawRoute(
  itinerary
) {

  /*
    Detail API:
    itinerary.stops contains
    complete place objects.
  */

  if (
    Array.isArray(
      itinerary?.stops
    ) &&
    itinerary.stops.length >
      0
  ) {
    return itinerary.stops;
  }


  if (
    Array.isArray(
      itinerary?.places
    ) &&
    itinerary.places.length >
      0
  ) {
    return itinerary.places;
  }


  /*
    List API:
    route is an array of
    place-name strings.
  */

  if (
    Array.isArray(
      itinerary?.route
    )
  ) {
    return itinerary.route;
  }


  return [];
}


/* =====================================================
   NORMALIZE STOPS
===================================================== */

function normalizeStops(
  itinerary
) {
  return rawRoute(
    itinerary
  )

    .map(
      (
        stop,
        index
      ) => {

        /*
          LIST API:

          route:
          [
            "Place A",
            "Place B"
          ]
        */

        if (
          typeof stop ===
          "string"
        ) {
          return {
            id:
              `route-${index}-${stop}`,

            placeId:
              null,

            name:
              stop,

            city:
              "",

            region:
              "",

            categories:
              [],

            visitOrder:
              index + 1,

            dayNumber:
              null,

            notes:
              "",
          };
        }


        /*
          DETAIL API:

          {
            day_number: 1,
            notes: "...",
            place: {...},
            visit_order: 1
          }
        */

        const place =
          stop?.place ??
          stop;


        return {
          id:
            place?.place_id ??
            place?.id ??
            `stop-${index}`,

          placeId:
            place?.place_id ??
            place?.id ??
            null,

          name:
            place?.name ??
            `Stop ${
              index + 1
            }`,

          city:
            place?.city ??
            "",

          region:
            place?.region ??
            "",

          categories:
            getCategoryNames(
              place
            ),

          visitOrder:
            stop?.visit_order ??
            stop?.visitOrder ??
            index + 1,

          dayNumber:
            stop?.day_number ??
            stop?.dayNumber ??
            null,

          notes:
            stop?.notes ??
            "",
        };
      }
    )

    .sort(
      (a, b) =>
        Number(
          a.visitOrder
        ) -
        Number(
          b.visitOrder
        )
    );
}


/* =====================================================
   IMAGE
===================================================== */

function resolveImage(
  value
) {
  if (!value) {
    return (
      "/images/heritage-hero.jpg"
    );
  }

  if (
    value.startsWith(
      "http://"
    ) ||
    value.startsWith(
      "https://"
    ) ||
    value.startsWith(
      "/"
    )
  ) {
    return value;
  }

  return (
    `${API_URL}/${value}`
  );
}


/* =====================================================
   NORMALIZE ITINERARY
===================================================== */

function normalizeItinerary(
  itinerary
) {
  const id =
    itinerary?.itinerary_id ??
    itinerary?.id;

  const stops =
    normalizeStops(
      itinerary
    );


  const routeLabel =
    stops
      .map(
        (stop) =>
          stop.name
      )
      .filter(Boolean)
      .join(" – ");


  const searchText = [
    itinerary?.title,
    itinerary?.description,
    itinerary?.difficulty,
    routeLabel,

    ...stops.flatMap(
      (stop) => [
        stop.name,
        stop.city,
        stop.region,
        stop.notes,
        ...stop.categories,
      ]
    ),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();


  return {
    id,

    title:
      itinerary?.title ??
      "Untitled itinerary",

    description:
      itinerary
        ?.description ??
      "",

    durationDays:
      itinerary
        ?.duration_days ??
      itinerary
        ?.durationDays ??
      null,

    difficulty:
      itinerary
        ?.difficulty ??
      "",

    image:
      resolveImage(
        itinerary
          ?.cover_image ??
        itinerary
          ?.coverImage
      ),

    stops,

    routeLabel,

    themes:
      getThemes(
        itinerary
      ),

    searchText,

    raw:
      itinerary,
  };
}


/* =====================================================
   FETCH ALL ITINERARIES
===================================================== */

async function fetchAllItineraries(
  signal
) {
  const all = [];

  const seen =
    new Set();


  for (
    let page = 1;
    page <= 100;
    page += 1
  ) {

    const response =
      await fetch(
        `${API_URL}/api/itineraries?page=${page}&per_page=50`,
        {
          signal,
        }
      );


    if (
      !response.ok
    ) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }


    const payload =
      await response.json();


    const rows =
      readItineraries(
        payload
      );


    for (
      const itinerary
      of rows
    ) {

      const id =
        itinerary
          ?.itinerary_id ??
        itinerary?.id ??
        itinerary?.title;


      if (
        !seen.has(id)
      ) {
        seen.add(id);

        all.push(
          itinerary
        );
      }
    }


    if (
      rows.length < 50
    ) {
      break;
    }
  }


  return all;
}


/* =====================================================
   DURATION
===================================================== */

function durationText(
  days,
  t
) {
  const number =
    Number(days);


  if (
    !Number.isFinite(
      number
    ) ||
    number <= 0
  ) {
    return "";
  }


  return (
    `${number} ${
      number === 1
        ? t.day
        : t.days
    }`
  );
}


/* =====================================================
   DIFFICULTY
===================================================== */

function translatedDifficulty(
  difficulty,
  t
) {
  const value =
    String(
      difficulty ?? ""
    )
      .trim()
      .toLowerCase();


  if (
    value === "easy"
  ) {
    return t.easy;
  }


  if (
    value ===
    "moderate"
  ) {
    return t.moderate;
  }


  if (
    value === "hard" ||
    value ===
      "difficult"
  ) {
    return t.hard;
  }


  return difficulty;
}


/* =====================================================
   ITINERARY CARD
===================================================== */

function ItineraryCard({
  itinerary,
  onOpen,
  t,
}) {
  const [
    imageError,
    setImageError,
  ] =
    useState(false);


  const imageSource =
    imageError
      ? "/images/heritage-hero.jpg"
      : itinerary.image;


  return (

    <article
      className="
        group
        flex
        h-full
        min-h-[300px]
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-[#ddd9d2]
        bg-[#fbf9f6]
        shadow-[0_2px_7px_rgba(39,36,31,0.07)]
        transition
        duration-300

        hover:-translate-y-1
        hover:shadow-xl
      "
    >

      {/* IMAGE */}

      <div
        className="
          relative
          h-[155px]
          shrink-0
          overflow-hidden
          bg-[#e5e0d7]
        "
      >

        <img
          src={
            imageSource
          }

          alt={
            itinerary.title
          }

          onError={() =>
            setImageError(
              true
            )
          }

          className="
            h-full
            w-full
            object-cover
            transition
            duration-500

            group-hover:scale-105
          "
        />


        {
          itinerary
            .durationDays !=
          null && (

            <span
              className="
                absolute
                right-3
                top-3
                rounded-full
                bg-[#f7f4ed]/95
                px-3
                py-1.5
                text-[0.65rem]
                font-medium
                text-[#343430]
                shadow-sm
                backdrop-blur-sm
              "
            >
              {
                durationText(
                  itinerary
                    .durationDays,
                  t
                )
              }
            </span>

          )
        }

      </div>


      {/* BODY */}

      <div
        className="
          relative
          flex
          flex-1
          flex-col
          p-4
        "
      >

        <h2
          className="
            font-serif
            text-[1.15rem]
            font-semibold
            leading-tight
            text-[#2d2c29]
          "
        >
          {
            itinerary.title
          }
        </h2>


        {
          itinerary
            .routeLabel && (

            <p
              title={
                itinerary
                  .routeLabel
              }

              className="
                mt-2
                line-clamp-2
                min-h-[34px]
                text-[0.67rem]
                leading-4
                text-[#74736e]
              "
            >
              {
                itinerary
                  .routeLabel
              }
            </p>

          )
        }


        <div
          className="
            mt-auto
            flex
            flex-wrap
            items-center
            gap-x-3
            gap-y-2
            pt-4
            pr-9
            text-[0.63rem]
            text-[#5e605b]
          "
        >

          {
            itinerary
              .stops.length >
              0 && (

              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                "
              >
                <MapPin
                  size={12}
                  strokeWidth={
                    1.7
                  }
                />

                {
                  itinerary
                    .stops
                    .length
                }

                {" "}

                {
                  itinerary
                    .stops
                    .length ===
                  1
                    ? t.stop
                    : t.stops
                }
              </span>

            )
          }


          {
            itinerary
              .difficulty && (

              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                "
              >
                <Gauge
                  size={12}
                  strokeWidth={
                    1.7
                  }
                />

                {
                  translatedDifficulty(
                    itinerary
                      .difficulty,
                    t
                  )
                }
              </span>

            )
          }

        </div>


        {/* OPEN */}

        <button
          type="button"

          aria-label={
            `${t.viewDetails}: ${itinerary.title}`
          }

          onClick={() =>
            onOpen(
              itinerary
            )
          }

          className="
            absolute
            bottom-3
            right-3
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-[#606653]
            text-white
            shadow-sm
            transition

            hover:scale-105
            hover:bg-[#4e5444]

            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-[#606653]
          "
        >
          <ArrowRight
            size={16}
          />
        </button>

      </div>

    </article>
  );
}


/* =====================================================
   PAGE
===================================================== */

function ItinerariesContent() {
  const {
    language,
  } =
    useSiteLanguage();


  const t =
    pageCopy[
      language
    ] ??
    pageCopy.en;


  const [
    itineraries,
    setItineraries,
  ] =
    useState([]);


  const [
    activeCategory,
    setActiveCategory,
  ] =
    useState(
      "all"
    );


  const [
    query,
    setQuery,
  ] =
    useState("");


  const [
    searchOpen,
    setSearchOpen,
  ] =
    useState(false);


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
    selectedItinerary,
    setSelectedItinerary,
  ] =
    useState(null);


  const [
    loadingDetails,
    setLoadingDetails,
  ] =
    useState(false);


  const searchRef =
    useRef(null);


  /* =====================================================
     LOAD DATABASE ITINERARIES
  ===================================================== */

  useEffect(() => {

    const controller =
      new AbortController();


    let mounted =
      true;


    async function load() {

      setLoading(
        true
      );

      setError(
        ""
      );


      try {

        const rows =
          await fetchAllItineraries(
            controller.signal
          );


        if (
          !mounted
        ) {
          return;
        }


        setItineraries(
          rows.map(
            normalizeItinerary
          )
        );

      }

      catch (err) {

        if (
          err?.name ===
          "AbortError"
        ) {
          return;
        }


        if (
          mounted
        ) {
          setError(
            err?.message ??
            "Unable to load."
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


    load();


    return () => {

      mounted =
        false;

      controller.abort();

    };

  }, []);


  /* =====================================================
     SEARCH FOCUS
  ===================================================== */

  useEffect(() => {

    if (
      searchOpen
    ) {

      requestAnimationFrame(
        () =>
          searchRef
            .current
            ?.focus()
      );

    }

  }, [
    searchOpen,
  ]);


  /* =====================================================
     ESCAPE CLOSE MODAL
  ===================================================== */

  useEffect(() => {

    if (
      !selectedItinerary
    ) {
      return;
    }


    const keyDown =
      (event) => {

        if (
          event.key ===
          "Escape"
        ) {
          setSelectedItinerary(
            null
          );
        }

      };


    document.addEventListener(
      "keydown",
      keyDown
    );


    return () => {

      document.removeEventListener(
        "keydown",
        keyDown
      );

    };

  }, [
    selectedItinerary,
  ]);


  /* =====================================================
     FILTER
  ===================================================== */

  const normalizedQuery =
    query
      .trim()
      .toLowerCase();


  const visibleItineraries =
    useMemo(() => {

      return itineraries.filter(
        (itinerary) => {

          const categoryMatches =
            activeCategory ===
              "all" ||
            itinerary
              .themes
              .includes(
                activeCategory
              );


          const searchMatches =
            !normalizedQuery ||
            itinerary
              .searchText
              .includes(
                normalizedQuery
              );


          return (
            categoryMatches &&
            searchMatches
          );

        }
      );

    }, [
      itineraries,
      activeCategory,
      normalizedQuery,
    ]);


  /* =====================================================
     OPEN DETAILS
  ===================================================== */

  async function openDetails(
    itinerary
  ) {

    setSelectedItinerary(
      itinerary
    );


    if (
      !itinerary.id
    ) {
      return;
    }


    setLoadingDetails(
      true
    );


    try {

      const response =
        await fetch(
          `${API_URL}/api/itineraries/${itinerary.id}`
        );


      if (
        !response.ok
      ) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }


      const payload =
        await response.json();


      const details =
        normalizeItinerary(
          readItinerary(
            payload
          )
        );


      setSelectedItinerary(
        details
      );

    }

    catch {

      /*
        Keep card data visible
        if detail request fails.
      */

    }

    finally {

      setLoadingDetails(
        false
      );

    }

  }


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <main
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
        min-h-screen
        bg-[#f3f0eb]
        text-[#272725]
      "
    >

      <div
        className="
          mx-auto
          max-w-[1440px]
          px-4
          pb-7

          sm:px-6
          lg:px-8
        "
      >


        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          className="
            relative
            isolate
            h-[285px]
            overflow-hidden
            rounded-b-sm

            sm:h-[315px]
          "
        >

          <img
            src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85"

            alt="Lebanese landscape"

            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
            "
          />


          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#17272e]/70
              via-[#17272e]/35
              to-[#4e291b]/20
            "
          />


          <div
            className="
              relative
              flex
              h-full
              items-center
              justify-between
              px-7

              sm:px-12
              lg:px-14
            "
          >

            <div
              className="
                max-w-[650px]
                text-white
              "
            >

              <p
                className="
                  mb-3
                  text-[0.58rem]
                  font-semibold
                  uppercase
                  tracking-[0.42em]
                  text-[#eee7dc]

                  sm:text-[0.65rem]
                "
              >
                {
                  t.eyebrow
                }
              </p>


              <h1
                className="
                  font-serif
                  text-[3.1rem]
                  leading-[0.95]

                  sm:text-[4.25rem]
                "
              >
                {
                  t.title
                }
              </h1>


              <p
                className="
                  mt-4
                  max-w-[570px]
                  text-[0.83rem]
                  leading-[1.6]
                  text-[#f6f2eb]

                  sm:text-[0.96rem]
                "
              >
                {
                  t.subtitle
                }
              </p>

            </div>


            <div
              className="
                hidden
                max-w-[300px]
                text-right
                text-[#f3ece2]

                md:block
              "
            >

              <p
                className="
                  font-serif
                  text-[2rem]
                  italic
                  leading-[0.95]
                "
              >
                {
                  t.quoteTop1
                }
              </p>

              <p
                className="
                  font-serif
                  text-[2rem]
                  italic
                  leading-[0.95]
                "
              >
                {
                  t.quoteTop2
                }
              </p>


              <div
                className="
                  ml-auto
                  mt-4
                  h-px
                  w-14
                  bg-[#c5a774]
                "
              />

            </div>

          </div>

        </section>


        {/* =====================================================
            FILTERS
        ===================================================== */}

        <section
          className="
            mt-4
            rounded-xl
            border
            border-[#dfdad1]
            bg-[#f8f6f2]
            p-2
            shadow-sm
          "
        >

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
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
                        setActiveCategory(
                          id
                        )
                      }

                      className={`
                        inline-flex
                        min-h-[40px]
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        border
                        px-4
                        text-[0.7rem]
                        font-medium
                        whitespace-nowrap
                        transition

                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-[#626955]

                        ${
                          active

                            ? `
                              border-[#626955]
                              bg-[#626955]
                              text-white
                              shadow-sm
                            `

                            : `
                              border-[#ddd8cf]
                              bg-white
                              text-[#3d3c39]

                              hover:border-[#c8c1b6]
                              hover:bg-[#eeeae3]
                            `
                        }
                      `}
                    >

                      <Icon
                        size={14}
                        strokeWidth={
                          1.7
                        }
                      />

                      {
                        t[id]
                      }

                    </button>

                  );

                }
              )
            }


            {/* SEARCH */}

            <button
              type="button"

              aria-expanded={
                searchOpen
              }

              onClick={() =>
                setSearchOpen(
                  (open) =>
                    !open
                )
              }

              className="
                inline-flex
                min-h-[40px]
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-[#ddd8cf]
                bg-white
                px-4
                text-[0.7rem]
                font-medium
                uppercase
                tracking-[0.12em]
                text-[#3d3c39]
                transition

                hover:bg-[#eeeae3]
              "
            >

              {
                searchOpen
                  ? (
                    <X
                      size={14}
                    />
                  )
                  : (
                    <Search
                      size={14}
                    />
                  )
              }

              {
                t.search
              }

            </button>

          </div>


          {/* SEARCH INPUT */}

          {
            searchOpen && (

              <div
                className="
                  relative
                  mt-2
                "
              >

                <Search
                  size={17}

                  className={`
                    absolute
                    top-1/2
                    -translate-y-1/2
                    text-[#77766f]

                    ${
                      language ===
                      "ar"
                        ? "right-4"
                        : "left-4"
                    }
                  `}
                />


                <input
                  ref={
                    searchRef
                  }

                  value={
                    query
                  }

                  onChange={(
                    event
                  ) =>
                    setQuery(
                      event
                        .target
                        .value
                    )
                  }

                  placeholder={
                    t.searchPlaceholder
                  }

                  className={`
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-[#cfc8be]
                    bg-white
                    text-sm
                    outline-none
                    transition

                    focus:border-[#8e896f]
                    focus:ring-2
                    focus:ring-[#8e896f]/20

                    ${
                      language ===
                      "ar"
                        ? "pr-11 pl-11"
                        : "pl-11 pr-11"
                    }
                  `}
                />


                {
                  query && (

                    <button
                      type="button"

                      onClick={() =>
                        setQuery("")
                      }

                      aria-label={
                        t.close
                      }

                      className={`
                        absolute
                        top-1/2
                        -translate-y-1/2
                        rounded-full
                        p-1
                        text-[#77766f]

                        hover:bg-[#eeeae3]

                        ${
                          language ===
                          "ar"
                            ? "left-4"
                            : "right-4"
                        }
                      `}
                    >
                      <X
                        size={14}
                      />
                    </button>

                  )
                }

              </div>

            )
          }

        </section>


        {/* =====================================================
            RESULTS NUMBER
        ===================================================== */}

        {
          !loading &&
          !error && (

            <div
              className="
                mb-3
                mt-3
                flex
                items-center
                justify-between
              "
            >

              <p
                className="
                  text-xs
                  text-[#74736e]
                "
              >
                {
                  visibleItineraries
                    .length
                }

                {" "}

                {
                  visibleItineraries
                    .length ===
                  1

                    ? t.resultOne

                    : t.results
                }
              </p>

            </div>

          )
        }


        {/* =====================================================
            LOADING
        ===================================================== */}

        {
          loading && (

            <div
              className="
                flex
                min-h-[320px]
                items-center
                justify-center
              "
            >

              <div
                className="
                  text-center
                  text-[#65675d]
                "
              >

                <LoaderCircle
                  size={32}

                  className="
                    mx-auto
                    animate-spin
                  "
                />


                <p
                  className="
                    mt-3
                    text-sm
                  "
                >
                  {
                    t.loading
                  }
                </p>

              </div>

            </div>

          )
        }


        {/* =====================================================
            ERROR
        ===================================================== */}

        {
          !loading &&
          error && (

            <div
              className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-5
                py-10
                text-center
                text-sm
                text-red-700
              "
            >

              {
                t.error
              }


              <div
                className="
                  mt-2
                  text-xs
                  opacity-70
                "
              >
                {
                  error
                }
              </div>

            </div>

          )
        }


        {/* =====================================================
            CARDS
        ===================================================== */}

        {
          !loading &&
          !error &&
          visibleItineraries
            .length >
            0 && (

            <section
              className="
                grid
                items-stretch
                gap-4

                sm:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-4
              "
            >

              {
                visibleItineraries
                  .map(
                    (
                      itinerary
                    ) => (

                      <ItineraryCard
                        key={
                          itinerary.id ??
                          itinerary.title
                        }

                        itinerary={
                          itinerary
                        }

                        onOpen={
                          openDetails
                        }

                        t={
                          t
                        }
                      />

                    )
                  )
              }

            </section>

          )
        }


        {/* =====================================================
            EMPTY
        ===================================================== */}

        {
          !loading &&
          !error &&
          visibleItineraries
            .length ===
            0 && (

            <div
              className="
                rounded-xl
                border
                border-dashed
                border-[#cec8bd]
                bg-[#faf8f5]
                px-6
                py-16
                text-center
              "
            >

              <Search
                size={28}

                className="
                  mx-auto
                  text-[#858779]
                "
              />


              <p
                className="
                  mt-3
                  text-sm
                  text-[#686860]
                "
              >
                {
                  t.noResults
                }
              </p>

            </div>

          )
        }


        {/* =====================================================
            BOTTOM QUOTE
        ===================================================== */}

        <footer
          className="
            mt-6
            flex
            min-h-[105px]
            items-center
            justify-center
            rounded-xl
            bg-[#e9e5dc]
            px-6
            py-6
            text-center
          "
        >

          <div>

            <p
              className="
                font-serif
                text-[1.35rem]
                italic
                leading-tight
                text-[#5e5b55]

                sm:text-[1.55rem]
              "
            >
              “
              {
                t.quoteBottom1
              }
            </p>


            <p
              className="
                font-serif
                text-[1.35rem]
                italic
                leading-tight
                text-[#5e5b55]

                sm:text-[1.55rem]
              "
            >
              {
                t.quoteBottom2
              }
              ”
            </p>


            <div
              className="
                mx-auto
                mt-3
                h-px
                w-12
                bg-[#b79662]
              "
            />

          </div>

        </footer>

      </div>


      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {
        selectedItinerary && (

          <div
            className="
              fixed
              inset-0
              z-[2000]
              flex
              items-center
              justify-center
              bg-[#24251f]/55
              p-3
              backdrop-blur-[2px]

              sm:p-5
            "

            onClick={() =>
              setSelectedItinerary(
                null
              )
            }
          >

            <div
              role="dialog"

              aria-modal="true"

              aria-labelledby="itinerary-dialog-title"

              onClick={(
                event
              ) =>
                event.stopPropagation()
              }

              className="
                flex
                max-h-[92vh]
                w-full
                max-w-[660px]
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-[#d8d1c8]
                bg-[#fbf8f3]
                shadow-2xl
              "
            >

              {/* HEADER */}

              <div
                className="
                  flex
                  shrink-0
                  items-start
                  justify-between
                  gap-4
                  border-b
                  border-[#e4dfd6]
                  bg-[#fbf8f3]
                  p-5
                "
              >

                <div>

                  <p
                    className="
                      text-[0.62rem]
                      uppercase
                      tracking-[0.2em]
                      text-[#8e805f]
                    "
                  >
                    {
                      t.itineraryDetails
                    }
                  </p>


                  <h2
                    id="itinerary-dialog-title"

                    className="
                      mt-1
                      font-serif
                      text-3xl
                      leading-tight
                      text-[#34342f]
                    "
                  >
                    {
                      selectedItinerary
                        .title
                    }
                  </h2>

                </div>


                <button
                  type="button"

                  onClick={() =>
                    setSelectedItinerary(
                      null
                    )
                  }

                  aria-label={
                    t.close
                  }

                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#ece7de]
                    text-[#55554d]
                    transition

                    hover:bg-[#ddd7cd]
                  "
                >
                  <X
                    size={17}
                  />
                </button>

              </div>


              {/* SCROLLABLE CONTENT */}

              <div
                className="
                  min-h-0
                  flex-1
                  overflow-y-auto
                  p-5
                "
              >

                {
                  loadingDetails && (

                    <div
                      className="
                        mb-4
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-[#77736b]
                      "
                    >

                      <LoaderCircle
                        size={15}

                        className="
                          animate-spin
                        "
                      />

                      {
                        t.loading
                      }

                    </div>

                  )
                }


                {/* META */}

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  {
                    selectedItinerary
                      .durationDays !=
                    null && (

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-[#e7eadf]
                          px-3
                          py-1.5
                          text-xs
                          text-[#566047]
                        "
                      >

                        <CalendarDays
                          size={13}
                        />

                        {
                          durationText(
                            selectedItinerary
                              .durationDays,
                            t
                          )
                        }

                      </span>

                    )
                  }


                  {
                    selectedItinerary
                      .difficulty && (

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-[#eee9df]
                          px-3
                          py-1.5
                          text-xs
                          text-[#60594e]
                        "
                      >

                        <Gauge
                          size={13}
                        />

                        {
                          translatedDifficulty(
                            selectedItinerary
                              .difficulty,
                            t
                          )
                        }

                      </span>

                    )
                  }

                </div>


                {/* DESCRIPTION */}

                {
                  selectedItinerary
                    .description && (

                    <p
                      className="
                        mt-5
                        text-sm
                        leading-6
                        text-[#55544e]
                      "
                    >
                      {
                        selectedItinerary
                          .description
                      }
                    </p>

                  )
                }


                {/* ROUTE */}

                <div
                  className="
                    mt-6
                    border-t
                    border-[#e4dfd6]
                    pt-5
                  "
                >

                  <h3
                    className="
                      font-serif
                      text-xl
                      font-semibold
                      text-[#34342f]
                    "
                  >
                    {
                      t.route
                    }
                  </h3>


                  {
                    selectedItinerary
                      .stops.length >
                    0 ? (

                    <div
                      className="
                        mt-4
                        space-y-3
                      "
                    >

                      {
                        selectedItinerary
                          .stops
                          .map(
                            (
                              stop,
                              index
                            ) => (

                              <article
                                key={
                                  stop.id
                                }

                                className="
                                  flex
                                  gap-3
                                  rounded-xl
                                  border
                                  border-[#e2ddd4]
                                  bg-white
                                  p-4
                                  shadow-sm
                                "
                              >

                                {/* NUMBER */}

                                <div
                                  className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#626955]
                                    text-xs
                                    font-semibold
                                    text-white
                                  "
                                >
                                  {
                                    index +
                                    1
                                  }
                                </div>


                                <div
                                  className="
                                    min-w-0
                                    flex-1
                                  "
                                >

                                  <div
                                    className="
                                      flex
                                      flex-wrap
                                      items-start
                                      justify-between
                                      gap-2
                                    "
                                  >

                                    <h4
                                      className="
                                        font-medium
                                        leading-5
                                        text-[#34342f]
                                      "
                                    >
                                      {
                                        stop.name
                                      }
                                    </h4>


                                    {
                                      stop.dayNumber !=
                                      null && (

                                        <span
                                          className="
                                            shrink-0
                                            rounded-full
                                            bg-[#f1eee8]
                                            px-2
                                            py-1
                                            text-[10px]
                                            text-[#68665f]
                                          "
                                        >
                                          {
                                            t.dayLabel
                                          }

                                          {" "}

                                          {
                                            stop.dayNumber
                                          }
                                        </span>

                                      )
                                    }

                                  </div>


                                  {
                                    (
                                      stop.city ||
                                      stop.region
                                    ) && (

                                    <p
                                      className="
                                        mt-1
                                        text-xs
                                        text-[#77736b]
                                      "
                                    >
                                      {
                                        [
                                          stop.city,
                                          stop.region,
                                        ]

                                          .filter(
                                            Boolean
                                          )

                                          .join(
                                            ", "
                                          )
                                      }
                                    </p>

                                  )
                                  }


                                  {
                                    stop.notes && (

                                      <p
                                        className="
                                          mt-2
                                          text-xs
                                          leading-5
                                          text-[#66645d]
                                        "
                                      >
                                        {
                                          stop.notes
                                        }
                                      </p>

                                    )
                                  }

                                </div>

                              </article>

                            )
                          )
                      }

                    </div>

                  ) : (

                    <p
                      className="
                        mt-3
                        text-sm
                        text-[#77736b]
                      "
                    >
                      {
                        t.noStops
                      }
                    </p>

                  )
                  }

                </div>


                {/* BACK */}

                <button
                  type="button"

                  onClick={() =>
                    setSelectedItinerary(
                      null
                    )
                  }

                  className="
                    mt-6
                    rounded-full
                    bg-[#606653]
                    px-5
                    py-2.5
                    text-xs
                    font-medium
                    text-white
                    transition

                    hover:bg-[#505644]
                  "
                >
                  {
                    t.back
                  }
                </button>

              </div>

            </div>

          </div>

        )
      }

    </main>
  );
}


/* =====================================================
   EXPORT PAGE
===================================================== */

export default function ItinerariesPage() {
  return (
    <AppShell>
      <ItinerariesContent />
    </AppShell>
  );
}
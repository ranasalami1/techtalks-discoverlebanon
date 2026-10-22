"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import {
  Bookmark,
  Footprints,
  LoaderCircle,
  LogIn,
  MapPin,
  Plus,
  Search,
  Undo2,
  Utensils,
  X,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import SavedPlaceCard from "@/components/SavedPlaceCard";

import {
  SiteLanguageProvider,
  useSiteLanguage,
} from "@/components/SiteLanguage";


/* =====================================================
   REAL MAP
===================================================== */

const SavedPlacesMap = dynamic(
  () => import("@/components/SavedPlacesMap"),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[3/4] animate-pulse rounded-xl border border-border bg-[#e3e5dc]" />
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
   TRANSLATIONS
===================================================== */

const pageCopy = {
  en: {
    title: "Saved Places",
    subtitle:
      "Keep track of the places that inspire you and plan your next adventure.",
    script1: "Same places,",
    script2: "different stories.",

    all: "All Saved",
    places: "Places",
    activities: "Activities",
    restaurants: "Restaurants",

    addPlace: "Add Place",

    loading: "Loading your saved places...",
    loadError: "Unable to load your saved places.",
    retry: "Try Again",

    loginTitle: "Sign in to see your saved places",
    loginDescription:
      "Saved Places belongs to your account, so you need to be signed in.",
    login: "Sign In",

    noSaved: "No saved places yet",
    noSavedDescription:
      "Explore Lebanon and use the bookmark button to save places for later.",
    explore: "Explore Lebanon",

    emptyCategory:
      "Nothing saved in this category yet.",
    showAll: "Show all",

    quote1: "Collect places,",
    quote2: "not things.",

    removed: "Removed",
    undo: "Undo",
    dismiss: "Dismiss",

    addEyebrow: "YOUR JOURNEY",
    addTitle: "Add a Place",
    addDescription:
      "Search the Discover Lebanon database and save a real place to your collection.",

    searchPlaceholder:
      "Search places, cities, restaurants, activities...",
    searchHint:
      "Type at least 2 characters to search.",
    searching: "Searching...",
    noResults: "No matching places found.",

    save: "Save",
    saved: "Saved",
    saving: "Saving...",
    alreadySaved: "Already saved",
    savedSuccess: "Place saved successfully.",

    searchError:
      "Unable to search places right now.",

    close: "Close",
    viewDetails: "View Details",
    remove: "Remove from saved",
    more: "More options",

    removeError:
      "Unable to remove this place.",
    undoError:
      "Unable to restore this place.",

    approximate:
      "Approximate location",
  },

  fr: {
    title: "Lieux enregistrés",
    subtitle:
      "Gardez les lieux qui vous inspirent et préparez votre prochaine aventure.",
    script1: "Les mêmes lieux,",
    script2: "d'autres histoires.",

    all: "Tous",
    places: "Lieux",
    activities: "Activités",
    restaurants: "Restaurants",

    addPlace: "Ajouter un lieu",

    loading:
      "Chargement de vos lieux enregistrés...",
    loadError:
      "Impossible de charger vos lieux enregistrés.",
    retry: "Réessayer",

    loginTitle:
      "Connectez-vous pour voir vos lieux enregistrés",
    loginDescription:
      "Les lieux enregistrés sont liés à votre compte.",
    login: "Se connecter",

    noSaved: "Aucun lieu enregistré",
    noSavedDescription:
      "Explorez le Liban et utilisez le signet pour conserver un lieu.",
    explore: "Explorer le Liban",

    emptyCategory:
      "Aucun lieu enregistré dans cette catégorie.",
    showAll: "Tout afficher",

    quote1: "Collectionnez les lieux,",
    quote2: "pas les choses.",

    removed: "Supprimé",
    undo: "Annuler",
    dismiss: "Fermer",

    addEyebrow: "VOTRE VOYAGE",
    addTitle: "Ajouter un lieu",
    addDescription:
      "Recherchez dans la base Discover Lebanon et enregistrez un vrai lieu.",

    searchPlaceholder:
      "Rechercher un lieu, une ville, un restaurant...",
    searchHint:
      "Saisissez au moins 2 caractères.",
    searching: "Recherche...",
    noResults: "Aucun lieu correspondant.",

    save: "Enregistrer",
    saved: "Enregistré",
    saving: "Enregistrement...",
    alreadySaved: "Déjà enregistré",
    savedSuccess:
      "Lieu enregistré avec succès.",

    searchError:
      "Impossible d'effectuer la recherche.",

    close: "Fermer",
    viewDetails: "Voir les détails",
    remove: "Retirer des favoris",
    more: "Plus d'options",

    removeError:
      "Impossible de supprimer ce lieu.",
    undoError:
      "Impossible de restaurer ce lieu.",

    approximate:
      "Position approximative",
  },

  ar: {
    title: "الأماكن المحفوظة",
    subtitle:
      "احتفظ بالأماكن التي تلهمك وخطط لمغامرتك القادمة.",
    script1: "الأماكن نفسها،",
    script2: "حكايات مختلفة.",

    all: "الكل",
    places: "الأماكن",
    activities: "الأنشطة",
    restaurants: "المطاعم",

    addPlace: "إضافة مكان",

    loading:
      "جارٍ تحميل الأماكن المحفوظة...",
    loadError:
      "تعذر تحميل الأماكن المحفوظة.",
    retry: "إعادة المحاولة",

    loginTitle:
      "سجّل الدخول لرؤية الأماكن المحفوظة",
    loginDescription:
      "الأماكن المحفوظة مرتبطة بحسابك.",
    login: "تسجيل الدخول",

    noSaved: "لا توجد أماكن محفوظة",
    noSavedDescription:
      "استكشف لبنان واستخدم زر الحفظ للاحتفاظ بالأماكن.",
    explore: "استكشف لبنان",

    emptyCategory:
      "لا توجد أماكن محفوظة في هذه الفئة.",
    showAll: "عرض الكل",

    quote1: "اجمع الأماكن،",
    quote2: "لا الأشياء.",

    removed: "تمت الإزالة",
    undo: "تراجع",
    dismiss: "إغلاق",

    addEyebrow: "رحلتك",
    addTitle: "إضافة مكان",
    addDescription:
      "ابحث في قاعدة بيانات Discover Lebanon واحفظ مكانًا حقيقيًا.",

    searchPlaceholder:
      "ابحث عن مكان أو مدينة أو مطعم...",
    searchHint:
      "اكتب حرفين على الأقل للبحث.",
    searching: "جارٍ البحث...",
    noResults: "لم يتم العثور على نتائج.",

    save: "حفظ",
    saved: "محفوظ",
    saving: "جارٍ الحفظ...",
    alreadySaved: "محفوظ مسبقًا",
    savedSuccess:
      "تم حفظ المكان بنجاح.",

    searchError:
      "تعذر البحث عن الأماكن.",

    close: "إغلاق",
    viewDetails: "عرض التفاصيل",
    remove: "إزالة من المحفوظات",
    more: "المزيد من الخيارات",

    removeError:
      "تعذر إزالة المكان.",
    undoError:
      "تعذر استعادة المكان.",

    approximate:
      "موقع تقريبي",
  },
};


/* =====================================================
   FILTERS
===================================================== */

const filterConfig = [
  {
    id: "all",
    icon: Bookmark,
    translation: "all",
  },
  {
    id: "places",
    icon: MapPin,
    translation: "places",
  },
  {
    id: "activities",
    icon: Footprints,
    translation: "activities",
  },
  {
    id: "restaurants",
    icon: Utensils,
    translation: "restaurants",
  },
];


/* =====================================================
   AUTH
===================================================== */

function getAccessToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    ""
  );
}


async function authFetch(path, options = {}) {
  const token = getAccessToken();

  if (!token) {
    const error = new Error("AUTH_REQUIRED");
    error.code = "AUTH_REQUIRED";
    throw error;
  }

  return fetch(`${API_URL}${path}`, {
    ...options,

    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}


/* =====================================================
   API RESPONSE HELPERS
===================================================== */

function readSavedItems(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.saved_places)) {
    return payload.data.saved_places;
  }

  if (Array.isArray(payload?.data?.items)) {
    return payload.data.items;
  }

  return [];
}


function readPlaces(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data?.items)) {
    return payload.data.items;
  }

  if (Array.isArray(payload?.data?.places)) {
    return payload.data.places;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.places)) {
    return payload.places;
  }

  return [];
}


function readPlace(payload) {
  if (payload?.data?.place) {
    return payload.data.place;
  }

  if (payload?.place) {
    return payload.place;
  }

  if (payload?.data) {
    return payload.data;
  }

  return payload;
}


/* =====================================================
   PLACE HELPERS
===================================================== */

function getPlaceId(place) {
  return (
    place?.id ??
    place?.place_id ??
    null
  );
}


function categoryNames(place) {
  if (!Array.isArray(place?.categories)) {
    return [];
  }

  return place.categories
    .map((category) => {
      if (typeof category === "string") {
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


function classifyPlace(place) {
  const text = [
    ...categoryNames(place),
    place?.venue_type,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    text.includes("restaurant") ||
    text.includes("coffee") ||
    text.includes("cafe") ||
    text.includes("café") ||
    text.includes("food") ||
    text.includes("gastronomy") ||
    text.includes("bakery")
  ) {
    return "restaurants";
  }

  if (
    text.includes("activity") ||
    text.includes("experience") ||
    text.includes("hiking") ||
    text.includes("adventure") ||
    text.includes("sport") ||
    text.includes("tour")
  ) {
    return "activities";
  }

  return "places";
}


function getLocation(place) {
  const city =
    String(place?.city || "").trim();

  const region =
    String(place?.region || "").trim();

  if (
    city &&
    region &&
    city.toLowerCase() !==
      region.toLowerCase()
  ) {
    return `${city}, ${region}`;
  }

  return (
    city ||
    region ||
    place?.address ||
    "Lebanon"
  );
}


function resolveImage(place) {
  let value =
    place?.featured_image ||
    place?.cover_image ||
    place?.image ||
    place?.image_url;

  if (
    !value &&
    Array.isArray(place?.images) &&
    place.images.length
  ) {
    const first = place.images[0];

    value =
      typeof first === "string"
        ? first
        : first?.image_url ||
          first?.url;
  }

  if (!value) {
    return "/images/heritage-hero.jpg";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  if (value.startsWith("/images/")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${API_URL}${value}`;
  }

  return `${API_URL}/${value}`;
}


function normalizeSavedItem(
  item,
  detail = null
) {
  const summary =
    item?.place ||
    item ||
    {};

  const place = {
    ...summary,
    ...(detail || {}),
  };

  const id =
    getPlaceId(place);

  const categories =
    categoryNames(place);

  return {
    id,

    title:
      place?.name ||
      "Unnamed place",

    location:
      getLocation(place),

    type:
      classifyPlace(place),

    badge:
      place?.venue_type ||
      categories[0] ||
      "Place",

    note:
      place?.short_description ||
      place?.description ||
      "Saved for your next journey through Lebanon.",

    image:
      resolveImage(place),

    savedAt:
      item?.saved_at ||
      null,

    latitude:
      place?.latitude ??
      null,

    longitude:
      place?.longitude ??
      null,

    city:
      place?.city ||
      "",

    region:
      place?.region ||
      "",

    categories,

    raw:
      place,
  };
}


function normalizeSearchPlace(place) {
  const categories =
    categoryNames(place);

  return {
    id:
      getPlaceId(place),

    title:
      place?.name ||
      "Unnamed place",

    location:
      getLocation(place),

    badge:
      place?.venue_type ||
      categories[0] ||
      "Place",

    note:
      place?.short_description ||
      "",

    image:
      resolveImage(place),

    raw:
      place,
  };
}


/* =====================================================
   FETCH PLACE DETAILS
===================================================== */

async function fetchPlaceDetails(
  id,
  signal
) {
  if (!id) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/places/${id}`,
      {
        signal,
      }
    );

    if (!response.ok) {
      return null;
    }

    const payload =
      await response
        .json()
        .catch(() => ({}));

    return readPlace(payload);
  } catch {
    return null;
  }
}


/* =====================================================
   PAGE CONTENT
===================================================== */

function SavedPlacesContent() {
  const { language } =
    useSiteLanguage();

  const t =
    pageCopy[language] ||
    pageCopy.en;

  const [places, setPlaces] =
    useState([]);

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    authRequired,
    setAuthRequired,
  ] = useState(false);

  const [
    removingId,
    setRemovingId,
  ] = useState(null);

  const [
    lastRemoved,
    setLastRemoved,
  ] = useState(null);

  const [
    undoing,
    setUndoing,
  ] = useState(false);

  const [
    showAddModal,
    setShowAddModal,
  ] = useState(false);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    searchResults,
    setSearchResults,
  ] = useState([]);

  const [
    searchLoading,
    setSearchLoading,
  ] = useState(false);

  const [
    searchError,
    setSearchError,
  ] = useState("");

  const [
    searchMessage,
    setSearchMessage,
  ] = useState("");

  const [
    savingId,
    setSavingId,
  ] = useState(null);


  /* =====================================================
     LOAD SAVED PLACES
  ===================================================== */

  const loadSavedPlaces =
    useCallback(
      async (silent = false) => {
        if (!silent) {
          setLoading(true);
        }

        setError("");

        try {
          const response =
            await authFetch(
              "/api/saved-places"
            );

          const payload =
            await response
              .json()
              .catch(() => ({}));

          if (response.status === 401) {
            setAuthRequired(true);
            setPlaces([]);
            return;
          }

          if (!response.ok) {
            throw new Error(
              payload?.message ||
              t.loadError
            );
          }

          setAuthRequired(false);

          const rows =
            readSavedItems(payload);

          const normalized =
            await Promise.all(
              rows.map(async (item) => {
                const summary =
                  item?.place ||
                  item;

                const id =
                  getPlaceId(summary);

                const detail =
                  await fetchPlaceDetails(
                    id
                  );

                return normalizeSavedItem(
                  item,
                  detail
                );
              })
            );

          setPlaces(
            normalized.filter(
              (place) =>
                place.id != null
            )
          );
        } catch (err) {
          if (
            err?.code ===
            "AUTH_REQUIRED"
          ) {
            setAuthRequired(true);
            setPlaces([]);
          } else {
            setError(
              err?.message ||
              t.loadError
            );
          }
        } finally {
          if (!silent) {
            setLoading(false);
          }
        }
      },
      [t.loadError]
    );


  useEffect(() => {
    loadSavedPlaces();
  }, [loadSavedPlaces]);


  /* =====================================================
     COUNTS
  ===================================================== */

  const counts =
    useMemo(() => {
      const result = {
        all: places.length,
        places: 0,
        activities: 0,
        restaurants: 0,
      };

      for (const place of places) {
        if (
          result[place.type] != null
        ) {
          result[place.type] += 1;
        }
      }

      return result;
    }, [places]);


  /* =====================================================
     FILTER
  ===================================================== */

  const visiblePlaces =
    useMemo(() => {
      if (
        activeFilter === "all"
      ) {
        return places;
      }

      return places.filter(
        (place) =>
          place.type ===
          activeFilter
      );
    }, [
      places,
      activeFilter,
    ]);


  const savedIds =
    useMemo(
      () =>
        new Set(
          places.map((place) =>
            Number(place.id)
          )
        ),
      [places]
    );


  /* =====================================================
     REMOVE
  ===================================================== */

  async function handleRemove(id) {
    if (removingId != null) {
      return;
    }

    const index =
      places.findIndex(
        (place) =>
          Number(place.id) ===
          Number(id)
      );

    if (index === -1) {
      return;
    }

    const removedPlace =
      places[index];

    setRemovingId(id);
    setError("");

    try {
      const response =
        await authFetch(
          `/api/saved-places/${id}`,
          {
            method: "DELETE",
          }
        );

      const payload =
        await response
          .json()
          .catch(() => ({}));

      if (response.status === 401) {
        setAuthRequired(true);
        return;
      }

      if (!response.ok) {
        throw new Error(
          payload?.message ||
          t.removeError
        );
      }

      setPlaces((previous) =>
        previous.filter(
          (place) =>
            Number(place.id) !==
            Number(id)
        )
      );

      setLastRemoved({
        place: removedPlace,
        index,
      });
    } catch (err) {
      setError(
        err?.message ||
        t.removeError
      );
    } finally {
      setRemovingId(null);
    }
  }


  /* =====================================================
     UNDO
  ===================================================== */

  async function handleUndo() {
    if (
      !lastRemoved ||
      undoing
    ) {
      return;
    }

    setUndoing(true);

    const { place, index } =
      lastRemoved;

    try {
      const response =
        await authFetch(
          `/api/saved-places/${place.id}`,
          {
            method: "POST",
          }
        );

      const payload =
        await response
          .json()
          .catch(() => ({}));

      if (
        !response.ok &&
        response.status !== 409
      ) {
        throw new Error(
          payload?.message ||
          t.undoError
        );
      }

      const restored = {
        ...place,

        savedAt:
          payload?.data?.saved_at ||
          place.savedAt ||
          new Date().toISOString(),
      };

      setPlaces((previous) => {
        if (
          previous.some(
            (item) =>
              Number(item.id) ===
              Number(restored.id)
          )
        ) {
          return previous;
        }

        const next = [
          ...previous,
        ];

        next.splice(
          Math.min(
            index,
            next.length
          ),
          0,
          restored
        );

        return next;
      });

      setLastRemoved(null);
    } catch (err) {
      setError(
        err?.message ||
        t.undoError
      );
    } finally {
      setUndoing(false);
    }
  }


  useEffect(() => {
    if (!lastRemoved) {
      return;
    }

    const timer =
      setTimeout(() => {
        setLastRemoved(null);
      }, 6000);

    return () =>
      clearTimeout(timer);
  }, [lastRemoved]);


  /* =====================================================
     ADD MODAL
  ===================================================== */

  function openAddModal() {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError("");
    setSearchMessage("");
    setShowAddModal(true);
  }


  function closeAddModal() {
    setShowAddModal(false);
    setSearchQuery("");
    setSearchResults([]);
    setSearchError("");
    setSearchMessage("");
  }


  useEffect(() => {
    if (!showAddModal) {
      return;
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        closeAddModal();
      }
    }

    document.addEventListener(
      "keydown",
      closeOnEscape
    );

    return () =>
      document.removeEventListener(
        "keydown",
        closeOnEscape
      );
  }, [showAddModal]);


  /* =====================================================
     SEARCH DATABASE
  ===================================================== */

  useEffect(() => {
    if (!showAddModal) {
      return;
    }

    const query =
      searchQuery.trim();

    if (query.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const controller =
      new AbortController();

    const timer =
      setTimeout(async () => {
        setSearchLoading(true);
        setSearchError("");
        setSearchMessage("");

        try {
          const response =
            await fetch(
              `${API_URL}/api/search?q=${encodeURIComponent(
                query
              )}&page=1&per_page=12`,
              {
                signal:
                  controller.signal,
              }
            );

          const payload =
            await response
              .json()
              .catch(() => ({}));

          if (!response.ok) {
            throw new Error(
              payload?.message ||
              t.searchError
            );
          }

          setSearchResults(
            readPlaces(payload)
              .map(
                normalizeSearchPlace
              )
              .filter(
                (place) =>
                  place.id != null
              )
          );
        } catch (err) {
          if (
            err?.name !==
            "AbortError"
          ) {
            setSearchError(
              err?.message ||
              t.searchError
            );
          }
        } finally {
          setSearchLoading(false);
        }
      }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    searchQuery,
    showAddModal,
    t.searchError,
  ]);


  /* =====================================================
     SAVE PLACE
  ===================================================== */

  async function savePlace(place) {
    if (
      !place?.id ||
      savingId != null
    ) {
      return;
    }

    setSavingId(place.id);
    setSearchError("");
    setSearchMessage("");

    try {
      const response =
        await authFetch(
          `/api/saved-places/${place.id}`,
          {
            method: "POST",
          }
        );

      const payload =
        await response
          .json()
          .catch(() => ({}));

      if (response.status === 401) {
        setAuthRequired(true);
        closeAddModal();
        return;
      }

      if (response.status === 409) {
        setSearchMessage(
          t.alreadySaved
        );

        await loadSavedPlaces(
          true
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          payload?.message ||
          t.searchError
        );
      }

      setSearchMessage(
        t.savedSuccess
      );

      await loadSavedPlaces(
        true
      );
    } catch (err) {
      if (
        err?.code ===
        "AUTH_REQUIRED"
      ) {
        setAuthRequired(true);
        closeAddModal();
      } else {
        setSearchError(
          err?.message ||
          t.searchError
        );
      }
    } finally {
      setSavingId(null);
    }
  }


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main
      className="min-h-screen flex-1 bg-cream"
      lang={language}
      dir={
        language === "ar"
          ? "rtl"
          : "ltr"
      }
    >

      {/* HERO */}

      <section
        className="relative h-[138px] overflow-hidden bg-[#343d39]"
        style={{
          backgroundImage:
            'url("/images/heritage-hero.jpg")',
          backgroundSize: "cover",
          backgroundPosition:
            "center 43%",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />

        <div className="relative flex h-full items-center justify-between px-6 lg:px-10">
          <div>
            <h1 className="font-serif text-[38px] leading-none text-white md:text-[46px]">
              {t.title}
            </h1>

            <p className="mt-2 max-w-xl text-[13px] text-white/90 md:text-[14px]">
              {t.subtitle}
            </p>
          </div>

          <p
            aria-hidden="true"
            className="mr-8 hidden -rotate-6 font-script text-[26px] leading-[1.15] text-white lg:block"
          >
            {t.script1}
            <br />

            <span className="ml-7">
              {t.script2}
            </span>
          </p>
        </div>
      </section>


      {/* CONTENT */}

      <section className="px-5 pb-12 pt-4">

        {error && (
          <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              <X size={16} />
            </button>
          </div>
        )}


        {authRequired ? (
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-border bg-white px-8 py-12 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-olive-soft text-olive">
              <LogIn size={24} />
            </span>

            <h2 className="mt-5 font-serif text-2xl text-ink">
              {t.loginTitle}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-ink-soft">
              {t.loginDescription}
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-olive px-6 py-2.5 text-[13px] font-medium text-white hover:bg-ink"
            >
              <LogIn size={15} />
              {t.login}
            </Link>
          </div>
        ) : (
          <>

            {/* FILTERS */}

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

              <div
                className="flex flex-wrap items-center gap-2"
                role="tablist"
              >
                {filterConfig.map(
                  (filter) => {
                    const Icon =
                      filter.icon;

                    const active =
                      activeFilter ===
                      filter.id;

                    return (
                      <button
                        key={
                          filter.id
                        }
                        type="button"
                        role="tab"
                        aria-selected={
                          active
                        }
                        onClick={() =>
                          setActiveFilter(
                            filter.id
                          )
                        }
                        className={`
                          flex items-center gap-2
                          rounded-lg px-4 py-2
                          text-[13px] font-medium
                          transition
                          ${
                            active
                              ? "bg-olive text-white shadow-sm"
                              : "bg-cream-soft text-ink hover:bg-olive-soft"
                          }
                        `}
                      >
                        <Icon
                          size={16}
                          strokeWidth={
                            1.75
                          }
                        />

                        <span>
                          {
                            t[
                              filter
                                .translation
                            ]
                          }
                          {" ("}
                          {
                            counts[
                              filter.id
                            ] || 0
                          }
                          {")"}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>


              <button
                type="button"
                onClick={
                  openAddModal
                }
                className="flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2 text-[13px] font-medium text-ink transition hover:border-olive hover:text-olive"
              >
                <Plus size={15} />
                {t.addPlace}
              </button>
            </div>


            {/* LOADING */}

            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="text-center text-ink-soft">
                  <LoaderCircle
                    size={30}
                    className="mx-auto animate-spin"
                  />

                  <p className="mt-3 text-[13px]">
                    {t.loading}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">

                {/* CARDS */}

                <div>
                  {visiblePlaces.length >
                  0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                      {visiblePlaces.map(
                        (place) => (
                          <SavedPlaceCard
                            key={
                              place.id
                            }
                            place={
                              place
                            }
                            onRemove={
                              handleRemove
                            }
                            busy={
                              Number(
                                removingId
                              ) ===
                              Number(
                                place.id
                              )
                            }
                            labels={{
                              viewDetails:
                                t.viewDetails,
                              remove:
                                t.remove,
                              more:
                                t.more,
                            }}
                          />
                        )
                      )}

                    </div>
                  ) : places.length ===
                    0 ? (
                    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-white/60 px-6 py-14 text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-olive-soft text-olive">
                        <Bookmark
                          size={22}
                        />
                      </span>

                      <h3 className="mt-4 font-serif text-[20px] font-semibold text-ink">
                        {t.noSaved}
                      </h3>

                      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-ink-soft">
                        {
                          t.noSavedDescription
                        }
                      </p>

                      <Link
                        href="/explore"
                        className="mt-5 rounded-full bg-olive px-5 py-2.5 text-[13px] font-medium text-white hover:bg-ink"
                      >
                        {t.explore}
                      </Link>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border bg-white/60 px-6 py-14 text-center text-[13px] text-ink-soft">
                      {
                        t.emptyCategory
                      }{" "}

                      <button
                        type="button"
                        onClick={() =>
                          setActiveFilter(
                            "all"
                          )
                        }
                        className="font-medium text-olive underline underline-offset-4 hover:text-ink"
                      >
                        {t.showAll}
                      </button>
                    </div>
                  )}
                </div>


                {/* MAP */}

                <aside className="flex flex-col gap-4">

                  <SavedPlacesMap
                    places={
                      visiblePlaces
                    }
                    language={
                      language
                    }
                    detailsLabel={
                      t.viewDetails
                    }
                    approximateLabel={
                      t.approximate
                    }
                  />


                  <div className="flex items-center gap-4 rounded-lg border border-border bg-cream-soft px-5 py-6">

                    <svg
                      viewBox="0 0 48 64"
                      className="h-14 w-11 shrink-0 text-olive"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    >
                      <path d="M34 4 C20 20, 14 40, 12 60" />
                      <path d="M30 14 C22 14, 16 18, 14 26 C22 26, 28 22, 30 14 Z" />
                      <path d="M22 30 C14 30, 8 36, 8 44 C16 44, 22 38, 22 30 Z" />
                      <path d="M33 18 C40 20, 44 26, 42 34 C36 32, 32 26, 33 18 Z" />
                      <path d="M26 38 C32 40, 36 46, 34 54 C28 52, 24 46, 26 38 Z" />
                    </svg>

                    <p className="font-serif text-[17px] italic leading-snug text-ink">
                      “{t.quote1}
                      <br />
                      {t.quote2}”

                      <span className="mt-3 block h-px w-14 bg-gold" />
                    </p>
                  </div>

                </aside>
              </div>
            )}
          </>
        )}
      </section>


      {/* =================================================
          ADD PLACE MODAL
      ================================================= */}

      {showAddModal && (
        <div
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeAddModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            className="flex max-h-[88vh] w-full max-w-[680px] flex-col overflow-hidden rounded-2xl border border-border bg-[#faf8f2] shadow-2xl"
          >

            {/* HEADER */}

            <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">

              <div>
                <span className="text-[9px] font-semibold tracking-[0.2em] text-olive">
                  {t.addEyebrow}
                </span>

                <h2 className="mt-1 font-serif text-[27px] text-ink">
                  {t.addTitle}
                </h2>

                <p className="mt-1 max-w-lg text-[12px] leading-5 text-ink-soft">
                  {
                    t.addDescription
                  }
                </p>
              </div>


              <button
                type="button"
                onClick={
                  closeAddModal
                }
                aria-label={
                  t.close
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-cream-soft hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>


            {/* SEARCH */}

            <div className="shrink-0 border-b border-border px-6 py-4">

              <div className="relative">

                <Search
                  size={17}
                  className={`
                    absolute top-1/2
                    -translate-y-1/2
                    text-ink-soft
                    ${
                      language ===
                      "ar"
                        ? "right-4"
                        : "left-4"
                    }
                  `}
                />

                <input
                  autoFocus
                  type="search"
                  value={
                    searchQuery
                  }
                  onChange={(event) =>
                    setSearchQuery(
                      event.target
                        .value
                    )
                  }
                  placeholder={
                    t.searchPlaceholder
                  }
                  className={`
                    h-12 w-full rounded-xl
                    border border-border
                    bg-white text-[13px]
                    text-ink outline-none
                    focus:border-olive
                    focus:ring-2
                    focus:ring-olive/15
                    ${
                      language ===
                      "ar"
                        ? "pr-11 pl-4"
                        : "pl-11 pr-4"
                    }
                  `}
                />

              </div>
            </div>


            {/* RESULTS */}

            <div className="min-h-[200px] flex-1 overflow-y-auto px-6 py-5">

              {searchMessage && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-[12px] text-green-700">
                  {
                    searchMessage
                  }
                </div>
              )}


              {searchError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
                  {searchError}
                </div>
              )}


              {searchQuery
                .trim()
                .length < 2 ? (
                <p className="py-10 text-center text-[13px] text-ink-soft">
                  {t.searchHint}
                </p>
              ) : searchLoading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-[13px] text-ink-soft">
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />

                  {t.searching}
                </div>
              ) : searchResults.length ===
                0 ? (
                <p className="py-10 text-center text-[13px] text-ink-soft">
                  {t.noResults}
                </p>
              ) : (
                <div className="space-y-3">

                  {searchResults.map(
                    (place) => {
                      const isSaved =
                        savedIds.has(
                          Number(
                            place.id
                          )
                        );

                      const isSaving =
                        Number(
                          savingId
                        ) ===
                        Number(
                          place.id
                        );

                      return (
                        <article
                          key={
                            place.id
                          }
                          className="flex items-center gap-4 rounded-xl border border-border bg-white p-3"
                        >
                          <img
                            src={
                              place.image
                            }
                            alt=""
                            className="h-20 w-24 shrink-0 rounded-lg object-cover"
                            onError={(
                              event
                            ) => {
                              event.currentTarget.src =
                                "/images/heritage-hero.jpg";
                            }}
                          />


                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-olive">
                              {
                                place.badge
                              }
                            </span>

                            <h3 className="truncate font-serif text-[17px] text-ink">
                              {
                                place.title
                              }
                            </h3>

                            <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-soft">
                              <MapPin
                                size={12}
                              />

                              {
                                place.location
                              }
                            </p>
                          </div>


                          <button
                            type="button"
                            disabled={
                              isSaved ||
                              isSaving
                            }
                            onClick={() =>
                              savePlace(
                                place
                              )
                            }
                            className={`
                              shrink-0 rounded-full
                              px-4 py-2
                              text-[11px]
                              font-medium
                              transition
                              ${
                                isSaved
                                  ? "cursor-default bg-olive-soft text-olive"
                                  : "bg-olive text-white hover:bg-ink"
                              }
                              disabled:opacity-70
                            `}
                          >
                            {isSaved
                              ? t.saved
                              : isSaving
                                ? t.saving
                                : t.save}
                          </button>
                        </article>
                      );
                    }
                  )}

                </div>
              )}
            </div>
          </section>
        </div>
      )}


      {/* =================================================
          UNDO TOAST
      ================================================= */}

      {lastRemoved && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[3200] flex -translate-x-1/2 items-center gap-4 rounded-full bg-ink px-5 py-3 text-sm text-white shadow-lg"
        >
          <span>
            {t.removed}{" "}
            <strong className="font-medium">
              {
                lastRemoved
                  .place
                  .title
              }
            </strong>
          </span>


          <button
            type="button"
            disabled={
              undoing
            }
            onClick={
              handleUndo
            }
            className="flex items-center gap-1 font-medium text-gold hover:text-white disabled:opacity-50"
          >
            {undoing ? (
              <LoaderCircle
                size={14}
                className="animate-spin"
              />
            ) : (
              <Undo2 size={14} />
            )}

            {t.undo}
          </button>


          <button
            type="button"
            onClick={() =>
              setLastRemoved(null)
            }
            aria-label={
              t.dismiss
            }
            className="text-white/60 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </main>
  );
}


/* =====================================================
   PAGE
===================================================== */

export default function SavedPlacesPage() {
  return (
    <SiteLanguageProvider>
      <AppShell>
        <SavedPlacesContent />
      </AppShell>
    </SiteLanguageProvider>
  );
}
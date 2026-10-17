"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  LoaderCircle,
  MapPin,
  Tag,
} from "lucide-react";

import {
  useParams,
} from "next/navigation";

import AppShell from "@/components/AppShell";

import {
  SiteLanguageProvider,
  useSiteLanguage,
} from "@/components/SiteLanguage";


/* =====================================================
   API
===================================================== */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";


/* =====================================================
   TRANSLATIONS
===================================================== */

const copy = {
  en: {
    discover: "DISCOVER",
    about: "About",
    information:
      "Place Information",
    location: "Location",
    category: "Category",
    saved: "Saved",

    savedJourney:
      "Saved to your journey",

    savedJourneyText:
      "Find it anytime in Saved Places",

    saveJourney:
      "Save to your journey",

    saveJourneyText:
      "Add this place to your Saved Places",

    remove:
      "Remove from Saved Places",

    back:
      "Back to Saved Places",

    loading:
      "Loading place details...",

    error:
      "Unable to load this place.",

    highlights:
      "Why this place stands out",

    defaultDescription:
      "Discover this destination and create your own story while exploring Lebanon.",
  },

  fr: {
    discover: "DÉCOUVRIR",
    about: "À propos de",
    information: "Informations",
    location: "Localisation",
    category: "Catégorie",
    saved: "Enregistré",

    savedJourney:
      "Ajouté à votre voyage",

    savedJourneyText:
      "Retrouvez-le dans vos lieux enregistrés",

    saveJourney:
      "Ajouter à votre voyage",

    saveJourneyText:
      "Enregistrez ce lieu pour plus tard",

    remove:
      "Retirer des lieux enregistrés",

    back:
      "Retour aux lieux enregistrés",

    loading:
      "Chargement du lieu...",

    error:
      "Impossible de charger ce lieu.",

    highlights:
      "Pourquoi découvrir ce lieu",

    defaultDescription:
      "Découvrez cette destination et créez votre propre histoire au Liban.",
  },

  ar: {
    discover: "اكتشف",
    about: "حول",
    information:
      "معلومات المكان",
    location: "الموقع",
    category: "الفئة",
    saved: "تاريخ الحفظ",

    savedJourney:
      "محفوظ في رحلتك",

    savedJourneyText:
      "يمكنك العثور عليه في الأماكن المحفوظة",

    saveJourney:
      "احفظه في رحلتك",

    saveJourneyText:
      "أضف هذا المكان إلى الأماكن المحفوظة",

    remove:
      "إزالة من الأماكن المحفوظة",

    back:
      "العودة إلى الأماكن المحفوظة",

    loading:
      "جارٍ تحميل تفاصيل المكان...",

    error:
      "تعذر تحميل هذا المكان.",

    highlights:
      "ما الذي يميز هذا المكان",

    defaultDescription:
      "اكتشف هذه الوجهة واصنع قصتك الخاصة أثناء استكشاف لبنان.",
  },
};


/* =====================================================
   AUTH
===================================================== */

function getToken() {
  if (
    typeof window ===
    "undefined"
  ) {
    return "";
  }

  return (
    localStorage.getItem(
      "accessToken"
    ) ||
    localStorage.getItem(
      "access_token"
    ) ||
    localStorage.getItem(
      "token"
    ) ||
    ""
  );
}


async function authFetch(
  path,
  options = {}
) {
  const token =
    getToken();

  if (!token) {
    return null;
  }

  return fetch(
    `${API_URL}${path}`,
    {
      ...options,

      headers: {
        ...(options.headers ||
          {}),

        Authorization:
          `Bearer ${token}`,
      },
    }
  );
}


/* =====================================================
   API HELPERS
===================================================== */

function readPlace(payload) {
  return (
    payload?.data?.place ||
    payload?.place ||
    payload?.data ||
    payload
  );
}


function readSaved(payload) {
  if (
    Array.isArray(
      payload?.data
    )
  ) {
    return payload.data;
  }

  if (
    Array.isArray(
      payload
    )
  ) {
    return payload;
  }

  return [];
}


/* =====================================================
   PLACE HELPERS
===================================================== */

function placeId(place) {
  return (
    place?.id ??
    place?.place_id
  );
}


function categoryNames(place) {
  if (
    !Array.isArray(
      place?.categories
    )
  ) {
    return [];
  }

  return place.categories
    .map((category) =>
      typeof category ===
      "string"
        ? category
        : category?.name ||
          category
            ?.category_name ||
          ""
    )
    .filter(Boolean);
}


function locationName(place) {
  const city =
    place?.city?.trim();

  const region =
    place?.region?.trim();

  if (
    city &&
    region &&
    city.toLowerCase() !==
      region.toLowerCase()
  ) {
    return `${city}, ${region}, Lebanon`;
  }

  if (city) {
    return `${city}, Lebanon`;
  }

  if (region) {
    return `${region}, Lebanon`;
  }

  return "Lebanon";
}


function resolveImage(place) {
  let value =
    place?.featured_image ||
    place?.cover_image ||
    place?.image_url;

  if (
    !value &&
    Array.isArray(
      place?.images
    ) &&
    place.images.length
  ) {
    const first =
      place.images[0];

    value =
      typeof first ===
      "string"
        ? first
        : first?.image_url ||
          first?.url;
  }

  if (!value) {
    return "/images/heritage-hero.jpg";
  }

  if (
    value.startsWith(
      "http://"
    ) ||
    value.startsWith(
      "https://"
    ) ||
    value.startsWith(
      "/images/"
    )
  ) {
    return value;
  }

  if (
    value.startsWith("/")
  ) {
    return `${API_URL}${value}`;
  }

  return `${API_URL}/${value}`;
}


function formatDate(
  value,
  language
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    language === "fr"
      ? "fr-FR"
      : language === "ar"
        ? "ar-LB"
        : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}


/* =====================================================
   CONTENT
===================================================== */

function SavedPlaceDetailContent() {
  const params =
    useParams();

  const id =
    params?.id;

  const { language } =
    useSiteLanguage();

  const t =
    copy[language] ||
    copy.en;

  const [place, setPlace] =
    useState(null);

  const [
    savedAt,
    setSavedAt,
  ] = useState(null);

  const [
    isSaved,
    setIsSaved,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    if (!id) {
      return;
    }

    const controller =
      new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      try {
        const placeResponse =
          await fetch(
            `${API_URL}/api/places/${encodeURIComponent(
              id
            )}`,
            {
              signal:
                controller.signal,
            }
          );

        const placePayload =
          await placeResponse
            .json()
            .catch(() => ({}));

        if (!placeResponse.ok) {
          throw new Error(
            placePayload?.message ||
            t.error
          );
        }

        const realPlace =
          readPlace(
            placePayload
          );

        setPlace(realPlace);


        /* CHECK SAVED STATUS */

        const savedResponse =
          await authFetch(
            "/api/saved-places",
            {
              signal:
                controller.signal,
            }
          );

        if (savedResponse?.ok) {
          const savedPayload =
            await savedResponse
              .json()
              .catch(() => ({}));

          const matching =
            readSaved(
              savedPayload
            ).find(
              (item) =>
                Number(
                  placeId(
                    item?.place
                  )
                ) ===
                Number(id)
            );

          if (matching) {
            setIsSaved(true);

            setSavedAt(
              matching.saved_at ||
              null
            );
          } else {
            setIsSaved(false);
            setSavedAt(null);
          }
        }
      } catch (err) {
        if (
          err?.name !==
          "AbortError"
        ) {
          setError(
            err?.message ||
            t.error
          );
        }
      } finally {
        setLoading(false);
      }
    }

    load();

    return () =>
      controller.abort();
  }, [
    id,
    t.error,
  ]);


  /* =====================================================
     DATA
  ===================================================== */

  const categories =
    useMemo(
      () =>
        place
          ? categoryNames(
              place
            )
          : [],
      [place]
    );

  const mainCategory =
    categories[0] ||
    place?.venue_type ||
    "Place";

  const description =
    place?.description ||
    place?.short_description ||
    place?.summary ||
    t.defaultDescription;


  /* =====================================================
     TOGGLE SAVE
  ===================================================== */

  async function toggleSaved() {
    if (
      saving ||
      !place
    ) {
      return;
    }

    const token =
      getToken();

    if (!token) {
      window.location.href =
        "/login";

      return;
    }

    setSaving(true);
    setError("");

    try {
      const response =
        await authFetch(
          `/api/saved-places/${id}`,
          {
            method:
              isSaved
                ? "DELETE"
                : "POST",
          }
        );

      const payload =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload?.message ||
          t.error
        );
      }

      if (isSaved) {
        setIsSaved(false);
        setSavedAt(null);
      } else {
        setIsSaved(true);

        setSavedAt(
          payload?.data
            ?.saved_at ||
          new Date()
            .toISOString()
        );
      }
    } catch (err) {
      setError(
        err?.message ||
        t.error
      );
    } finally {
      setSaving(false);
    }
  }


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="flex min-h-[600px] flex-1 items-center justify-center bg-cream">
        <div className="text-center text-ink-soft">
          <LoaderCircle
            size={32}
            className="mx-auto animate-spin"
          />

          <p className="mt-3 text-sm">
            {t.loading}
          </p>
        </div>
      </main>
    );
  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (
    error &&
    !place
  ) {
    return (
      <main className="flex min-h-[600px] flex-1 items-center justify-center bg-cream p-6">

        <div className="max-w-lg text-center">

          <h1 className="font-serif text-3xl text-ink">
            {t.error}
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>

          <Link
            href="/saved"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-olive px-5 py-2.5 text-sm text-olive"
          >
            <ArrowLeft
              size={15}
            />

            {t.back}
          </Link>

        </div>
      </main>
    );
  }


  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main
      className="min-h-screen flex-1 bg-[#f8f5ed]"
      lang={language}
      dir={
        language === "ar"
          ? "rtl"
          : "ltr"
      }
    >

      {/* HERO */}

      <section className="relative min-h-[250px] overflow-hidden bg-[#475148]">

        <img
          src={
            resolveImage(
              place
            )
          }
          alt={
            place?.name ||
            ""
          }
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.src =
              "/images/heritage-hero.jpg";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />


        <div className="relative z-10 px-8 py-10 lg:px-10">

          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            {mainCategory}
          </span>


          <h1 className="mt-4 max-w-4xl font-serif text-[42px] leading-none text-white md:text-[56px]">
            {place?.name}
          </h1>


          <p className="mt-3 flex items-center gap-2 text-sm text-white/90">
            <MapPin size={15} />

            {
              locationName(
                place
              )
            }
          </p>

        </div>
      </section>


      {/* CONTENT */}

      <section className="grid gap-5 px-5 py-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-10">

        {/* LEFT */}

        <div className="space-y-5">

          <article className="rounded-xl border border-border bg-white p-6 md:p-7">

            <div className="flex items-start justify-between gap-4">

              <div>
                <span className="text-[9px] font-semibold tracking-[0.25em] text-olive">
                  {t.discover}
                </span>

                <h2 className="mt-3 font-serif text-[27px] text-ink">
                  {t.about}{" "}
                  {place?.name}
                </h2>
              </div>


              <button
                type="button"
                disabled={
                  saving
                }
                onClick={
                  toggleSaved
                }
                aria-label={
                  isSaved
                    ? t.remove
                    : t.saveJourney
                }
                className={`
                  flex h-9 w-9
                  items-center
                  justify-center
                  rounded-full
                  transition
                  ${
                    isSaved
                      ? "bg-olive text-white"
                      : "border border-olive text-olive"
                  }
                  disabled:opacity-50
                `}
              >
                {saving ? (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Bookmark
                    size={17}
                    fill={
                      isSaved
                        ? "currentColor"
                        : "none"
                    }
                  />
                )}
              </button>
            </div>


            <p className="mt-5 whitespace-pre-line text-[13px] leading-7 text-ink-soft">
              {description}
            </p>

          </article>


          <article className="rounded-xl border border-[#e2dccd] bg-[#f2eee4] p-6 md:p-7">

            <span className="text-[9px] font-semibold tracking-[0.2em] text-olive">
              {t.highlights}
            </span>


            <p className="mt-4 font-serif text-[18px] italic leading-8 text-ink">
              “
              {
                place
                  ?.short_description ||
                description
              }
              ”
            </p>

          </article>

        </div>


        {/* RIGHT */}

        <aside className="space-y-4">

          <section className="rounded-xl border border-border bg-white p-5">

            <h2 className="font-serif text-[20px] text-ink">
              {t.information}
            </h2>


            {/* LOCATION */}

            <div className="mt-5 flex gap-3 border-b border-border pb-4">

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive-soft text-olive">
                <MapPin size={15} />
              </span>

              <div>
                <span className="text-[8px] uppercase tracking-[0.15em] text-ink-soft">
                  {t.location}
                </span>

                <p className="mt-1 font-serif text-[13px] text-ink">
                  {
                    locationName(
                      place
                    )
                  }
                </p>
              </div>

            </div>


            {/* CATEGORY */}

            <div className="flex gap-3 border-b border-border py-4">

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive-soft text-olive">
                <Tag size={15} />
              </span>

              <div>
                <span className="text-[8px] uppercase tracking-[0.15em] text-ink-soft">
                  {t.category}
                </span>

                <p className="mt-1 font-serif text-[13px] text-ink">
                  {
                    categories.length
                      ? categories.join(
                          ", "
                        )
                      : mainCategory
                  }
                </p>
              </div>

            </div>


            {/* SAVED */}

            <div className="flex gap-3 pt-4">

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive-soft text-olive">
                <CalendarDays
                  size={15}
                />
              </span>

              <div>
                <span className="text-[8px] uppercase tracking-[0.15em] text-ink-soft">
                  {t.saved}
                </span>

                <p className="mt-1 font-serif text-[13px] text-ink">
                  {
                    isSaved
                      ? formatDate(
                          savedAt,
                          language
                        )
                      : "—"
                  }
                </p>
              </div>

            </div>

          </section>


          {/* SAVE BUTTON */}

          <button
            type="button"
            disabled={
              saving
            }
            onClick={
              toggleSaved
            }
            className={`
              flex w-full
              items-center
              gap-3
              rounded-xl
              border
              border-border
              p-5
              text-left
              transition
              ${
                isSaved
                  ? "bg-[#f1ede3]"
                  : "bg-white hover:border-olive"
              }
              disabled:opacity-60
            `}
          >
            <span
              className={`
                flex h-10 w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                ${
                  isSaved
                    ? "bg-olive text-white"
                    : "bg-olive-soft text-olive"
                }
              `}
            >
              {saving ? (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Bookmark
                  size={17}
                  fill={
                    isSaved
                      ? "currentColor"
                      : "none"
                  }
                />
              )}
            </span>


            <span>
              <strong className="block font-serif text-[15px] font-normal text-ink">
                {
                  isSaved
                    ? t.savedJourney
                    : t.saveJourney
                }
              </strong>

              <span className="mt-1 block text-[9px] text-ink-soft">
                {
                  isSaved
                    ? t.savedJourneyText
                    : t.saveJourneyText
                }
              </span>
            </span>
          </button>


          {/* BACK */}

          <Link
            href="/saved"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-olive px-5 py-3 text-[13px] text-olive transition hover:bg-olive hover:text-white"
          >
            <ArrowLeft size={15} />
            {t.back}
          </Link>

        </aside>

      </section>
    </main>
  );
}


/* =====================================================
   PAGE
===================================================== */

export default function SavedPlaceDetailPage() {
  return (
    <SiteLanguageProvider>
      <AppShell>
        <SavedPlaceDetailContent />
      </AppShell>
    </SiteLanguageProvider>
  );
}
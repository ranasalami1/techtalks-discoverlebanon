"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AppShell from "@/components/AppShell";
import { useSiteLanguage } from "@/components/SiteLanguage";

import {
  CalendarDays,
  LoaderCircle,
  Search,
  UserRound,
  X,
} from "lucide-react";

import "./heritage.css";


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
    heroLabel: "PEOPLE   PLACES   TRADITIONS",

    title: "Heritage Stories",

    subtitle:
      "Real stories. Lasting heritage.",

    description:
      "Discover the rich history, vibrant traditions and inspiring people that make Lebanon unique.",

    script1: "More",
    script2: "than places.",
    script3: "They are stories.",

    all: "All Stories",
    ancientHistory: "Ancient History",
    traditionalLife: "Traditional Life",
    artsCrafts: "Arts & Crafts",
    architecture: "Architecture",
    cuisine: "Cuisine",
    people: "People",
    festivals: "Festivals",

    searchPlaceholder:
      "Search heritage stories...",

    readMore: "Read More",

    loading:
      "Loading heritage stories...",

    error:
      "Heritage stories are unavailable right now.",

    noStories:
      "No stories found",

    noStoriesDescription:
      "There are no heritage stories in this category yet.",

    viewAll:
      "View All Stories",

    storyDetails:
      "Heritage Story",

    author:
      "Author",

    published:
      "Published",

    gallery:
      "Gallery",

    close:
      "Close",

    quote1:
      "Every place in Lebanon has a story,",

    quote2:
      "and every story keeps a piece of us alive.",

    story: "story",
    stories: "stories",
  },


  fr: {
    heroLabel:
      "PEUPLES   LIEUX   TRADITIONS",

    title:
      "Histoires du patrimoine",

    subtitle:
      "Des histoires réelles. Un patrimoine vivant.",

    description:
      "Découvrez la riche histoire, les traditions vivantes et les personnes qui rendent le Liban unique.",

    script1:
      "Plus que",

    script2:
      "des lieux.",

    script3:
      "Ce sont des histoires.",

    all:
      "Toutes les histoires",

    ancientHistory:
      "Histoire ancienne",

    traditionalLife:
      "Vie traditionnelle",

    artsCrafts:
      "Arts et artisanat",

    architecture:
      "Architecture",

    cuisine:
      "Cuisine",

    people:
      "Personnes",

    festivals:
      "Festivals",

    searchPlaceholder:
      "Rechercher une histoire du patrimoine...",

    readMore:
      "Lire la suite",

    loading:
      "Chargement des histoires...",

    error:
      "Les histoires du patrimoine sont momentanément indisponibles.",

    noStories:
      "Aucune histoire trouvée",

    noStoriesDescription:
      "Aucune histoire n'est encore disponible dans cette catégorie.",

    viewAll:
      "Voir toutes les histoires",

    storyDetails:
      "Histoire du patrimoine",

    author:
      "Auteur",

    published:
      "Publié",

    gallery:
      "Galerie",

    close:
      "Fermer",

    quote1:
      "Chaque lieu au Liban possède une histoire,",

    quote2:
      "et chaque histoire garde une part de nous vivante.",

    story:
      "histoire",

    stories:
      "histoires",
  },


  ar: {
    heroLabel:
      "الناس   الأماكن   التقاليد",

    title:
      "حكايات التراث",

    subtitle:
      "حكايات حقيقية. تراث باقٍ.",

    description:
      "اكتشف تاريخ لبنان الغني وتقاليده المتنوعة والأشخاص الذين يجعلونه فريدًا.",

    script1:
      "أكثر",

    script2:
      "من أماكن.",

    script3:
      "إنها حكايات.",

    all:
      "كل الحكايات",

    ancientHistory:
      "التاريخ القديم",

    traditionalLife:
      "الحياة التقليدية",

    artsCrafts:
      "الفنون والحرف",

    architecture:
      "العمارة",

    cuisine:
      "المطبخ",

    people:
      "الناس",

    festivals:
      "المهرجانات",

    searchPlaceholder:
      "ابحث في حكايات التراث...",

    readMore:
      "اقرأ المزيد",

    loading:
      "جارٍ تحميل حكايات التراث...",

    error:
      "حكايات التراث غير متاحة حاليًا.",

    noStories:
      "لم يتم العثور على حكايات",

    noStoriesDescription:
      "لا توجد حكايات في هذه الفئة حتى الآن.",

    viewAll:
      "عرض كل الحكايات",

    storyDetails:
      "حكاية تراثية",

    author:
      "الكاتب",

    published:
      "نُشر",

    gallery:
      "الصور",

    close:
      "إغلاق",

    quote1:
      "لكل مكان في لبنان حكاية،",

    quote2:
      "وكل حكاية تُبقي جزءًا منا حيًا.",

    story:
      "حكاية",

    stories:
      "حكايات",
  },
};


/* =====================================================
   FILTERS
===================================================== */

const filters = [
  {
    id: "all",
    translation: "all",
  },

  {
    id: "ancient-history",
    translation: "ancientHistory",
  },

  {
    id: "traditional-life",
    translation: "traditionalLife",
  },

  {
    id: "arts-crafts",
    translation: "artsCrafts",
  },

  {
    id: "architecture",
    translation: "architecture",
  },

  {
    id: "cuisine",
    translation: "cuisine",
  },

  {
    id: "people",
    translation: "people",
  },

  {
    id: "festivals",
    translation: "festivals",
  },
];


/* =====================================================
   READ API LIST
===================================================== */

function readStories(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (
    Array.isArray(
      payload?.data?.stories
    )
  ) {
    return payload.data.stories;
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
      payload?.stories
    )
  ) {
    return payload.stories;
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


/* =====================================================
   READ DETAIL API
===================================================== */

function readStory(payload) {
  if (
    payload?.data?.story
  ) {
    return payload.data.story;
  }

  if (
    payload?.story
  ) {
    return payload.story;
  }

  if (
    payload?.data
  ) {
    return payload.data;
  }

  return payload;
}


/* =====================================================
   IMAGE URL
===================================================== */

function resolveImage(value) {
  if (!value) {
    return "/images/heritage-hero.jpg";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  ) {
    return value;
  }

  return `${API_URL}/${value}`;
}


/* =====================================================
   CATEGORY NORMALIZATION
===================================================== */

function normalizeCategoryName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}


function categoriesFromBackend(story) {
  const raw = [];

  if (story?.category) {
    raw.push(story.category);
  }

  if (
    Array.isArray(
      story?.categories
    )
  ) {
    raw.push(
      ...story.categories
    );
  }

  if (
    Array.isArray(
      story?.tags
    )
  ) {
    raw.push(
      ...story.tags
    );
  }

  const mapped = [];

  raw.forEach((value) => {
    const text =
      typeof value === "string"
        ? value
        : value?.name || "";

    const normalized =
      normalizeCategoryName(text);

    if (
      normalized.includes("ancient") ||
      normalized.includes("history") ||
      normalized.includes("archaeology")
    ) {
      mapped.push("ancient-history");
    }

    if (
      normalized.includes("traditional") ||
      normalized.includes("tradition") ||
      normalized.includes("rural")
    ) {
      mapped.push("traditional-life");
    }

    if (
      normalized.includes("craft") ||
      normalized.includes("art")
    ) {
      mapped.push("arts-crafts");
    }

    if (
      normalized.includes("architecture")
    ) {
      mapped.push("architecture");
    }

    if (
      normalized.includes("cuisine") ||
      normalized.includes("food") ||
      normalized.includes("gastronomy")
    ) {
      mapped.push("cuisine");
    }

    if (
      normalized.includes("people") ||
      normalized.includes("person")
    ) {
      mapped.push("people");
    }

    if (
      normalized.includes("festival") ||
      normalized.includes("celebration")
    ) {
      mapped.push("festivals");
    }
  });

  return [...new Set(mapped)];
}


/* =====================================================
   FALLBACK CATEGORY CLASSIFICATION

   Database currently has no category column in the
   heritage_stories schema, so if the API doesn't provide
   tags/categories, classify using story text.
===================================================== */

function inferCategories(story) {
  const text = [
    story?.title,
    story?.summary,
    story?.content,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();


  const categories =
    new Set();


  if (
    /ancient|archaeolog|phoenician|roman|umayyad|ruins?|temple|civilization|historic city|old city|history/.test(
      text
    )
  ) {
    categories.add(
      "ancient-history"
    );
  }


  if (
    /tradition|traditional|village|rural|farmer|farming|folk|custom|ritual|daily life|land/.test(
      text
    )
  ) {
    categories.add(
      "traditional-life"
    );
  }


  if (
    /artisan|craft|pottery|weaving|woven|embroidery|glassblow|soap making|woodwork|handmade|workshop/.test(
      text
    )
  ) {
    categories.add(
      "arts-crafts"
    );
  }


  if (
    /architecture|architectural|stone houses?|palace|castle|monastery|church|mosque|building|narrow streets?/.test(
      text
    )
  ) {
    categories.add(
      "architecture"
    );
  }


  if (
    /cuisine|food|recipe|dish|gastronomy|olive oil|wine|winery|bread|coffee|restaurant|ingredient/.test(
      text
    )
  ) {
    categories.add(
      "cuisine"
    );
  }


  if (
    /people|artisan|farmer|locals?|family|families|community|biography|keeper|generation/.test(
      text
    )
  ) {
    categories.add(
      "people"
    );
  }


  if (
    /festival|celebration|music|dance|feast|parade|event|ceremony/.test(
      text
    )
  ) {
    categories.add(
      "festivals"
    );
  }


  return [...categories];
}


/* =====================================================
   STORY CATEGORY
===================================================== */

function getStoryCategories(story) {
  const backendCategories =
    categoriesFromBackend(story);

  if (
    backendCategories.length > 0
  ) {
    return backendCategories;
  }

  return inferCategories(story);
}


/* =====================================================
   DISPLAY CATEGORY
===================================================== */

function displayCategory(
  categories,
  t
) {
  const first =
    categories[0];

  const labels = {
    "ancient-history":
      t.ancientHistory,

    "traditional-life":
      t.traditionalLife,

    "arts-crafts":
      t.artsCrafts,

    architecture:
      t.architecture,

    cuisine:
      t.cuisine,

    people:
      t.people,

    festivals:
      t.festivals,
  };

  return (
    labels[first] ||
    t.storyDetails
  );
}


/* =====================================================
   NORMALIZE GALLERY
===================================================== */

function normalizeImages(story) {
  if (
    !Array.isArray(
      story?.images
    )
  ) {
    return [];
  }

  return story.images
    .map(
      (
        image,
        index
      ) => {
        if (
          typeof image ===
          "string"
        ) {
          return {
            id: index,

            url:
              resolveImage(
                image
              ),

            caption:
              "",
          };
        }

        return {
          id:
            image?.image_id ??
            image?.id ??
            index,

          url:
            resolveImage(
              image?.image_url ??
              image?.url
            ),

          caption:
            image?.caption ??
            image?.alt_text ??
            "",
        };
      }
    )

    .filter(
      (image) =>
        Boolean(image.url)
    );
}


/* =====================================================
   NORMALIZE STORY
===================================================== */

function normalizeStory(story) {
  const id =
    story?.story_id ??
    story?.id;

  const categories =
    getStoryCategories(
      story
    );

  const searchText = [
    story?.title,
    story?.summary,
    story?.content,
    story?.author_name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();


  return {
    id,

    title:
      story?.title ||
      "Untitled Story",

    summary:
      story?.summary ||
      "",

    content:
      story?.content ||
      "",

    author:
      story?.author_name ||
      "",

    coverImage:
      resolveImage(
        story?.cover_image
      ),

    publishedAt:
      story?.published_at ||
      null,

    categories,

    images:
      normalizeImages(
        story
      ),

    searchText,

    raw:
      story,
  };
}


/* =====================================================
   FETCH ALL STORIES
===================================================== */

async function fetchAllStories(
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
        `${API_URL}/api/heritage-stories?page=${page}&per_page=50`,
        {
          signal,
        }
      );


    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }


    const payload =
      await response.json();


    const rows =
      readStories(payload);


    rows.forEach(
      (story) => {

        const id =
          story?.story_id ??
          story?.id ??
          story?.title;


        if (
          !seen.has(id)
        ) {
          seen.add(id);

          all.push(story);
        }

      }
    );


    if (
      rows.length < 50
    ) {
      break;
    }
  }


  return all;
}


/* =====================================================
   DATE
===================================================== */

function formatDate(
  value,
  language
) {
  if (!value) {
    return "";
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

  const locales = {
    en: "en-US",
    fr: "fr-FR",
    ar: "ar-LB",
  };

  return date.toLocaleDateString(
    locales[language] ||
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}


/* =====================================================
   STORY CARD
===================================================== */

function StoryCard({
  story,
  onOpen,
  t,
}) {
  const [
    imageError,
    setImageError,
  ] =
    useState(false);


  const image =
    imageError
      ? "/images/heritage-hero.jpg"
      : story.coverImage;


  return (
    <article className="heritage-card">

      {/* IMAGE */}

      <div
        className="heritage-card-image"
        style={{
          backgroundImage:
            `url("${image}")`,
        }}
      >

        <img
          src={image}
          alt=""
          aria-hidden="true"
          onError={() =>
            setImageError(true)
          }
          style={{
            display: "none",
          }}
        />

      </div>


      {/* BODY */}

      <div className="heritage-card-body">

        <span className="story-category">
          {displayCategory(
            story.categories,
            t
          )}
        </span>


        <h2>
          {story.title}
        </h2>


        <p>
          {story.summary}
        </p>


        <button
          type="button"

          onClick={() =>
            onOpen(story)
          }

          className="
            inline-flex
            items-center
            gap-2
            border-b
            border-[#8b795a]
            bg-transparent
            text-[11px]
            text-[#493f32]
            transition
            hover:text-[#776247]
          "
        >
          {t.readMore}

          <span>
            →
          </span>
        </button>

      </div>

    </article>
  );
}


/* =====================================================
   PAGE CONTENT
===================================================== */

function HeritageContent() {
  const {
    language,
  } =
    useSiteLanguage();


  const t =
    pageCopy[language] ||
    pageCopy.en;


  const [
    stories,
    setStories,
  ] =
    useState([]);


  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState("all");


  const [
    query,
    setQuery,
  ] =
    useState("");


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
    selectedStory,
    setSelectedStory,
  ] =
    useState(null);


  const [
    loadingDetails,
    setLoadingDetails,
  ] =
    useState(false);


  /* =====================================================
     LOAD STORIES
  ===================================================== */

  useEffect(() => {
    const controller =
      new AbortController();

    let mounted =
      true;


    async function load() {
      setLoading(true);
      setError("");


      try {
        const rows =
          await fetchAllStories(
            controller.signal
          );


        if (!mounted) {
          return;
        }


        setStories(
          rows.map(
            normalizeStory
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

        if (mounted) {
          setError(
            err?.message ||
            "Unable to load stories."
          );
        }
      }

      finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }


    load();


    return () => {
      mounted = false;

      controller.abort();
    };
  }, []);


  /* =====================================================
     ESC CLOSE
  ===================================================== */

  useEffect(() => {
    if (!selectedStory) {
      return;
    }


    const keyDown =
      (event) => {

        if (
          event.key ===
          "Escape"
        ) {
          setSelectedStory(
            null
          );
        }

      };


    document.addEventListener(
      "keydown",
      keyDown
    );


    return () =>
      document.removeEventListener(
        "keydown",
        keyDown
      );

  }, [
    selectedStory,
  ]);


  /* =====================================================
     FILTER
  ===================================================== */

  const normalizedQuery =
    query
      .trim()
      .toLowerCase();


  const filteredStories =
    useMemo(() => {

      return stories.filter(
        (story) => {

          const categoryMatch =
            activeFilter ===
              "all" ||
            story.categories.includes(
              activeFilter
            );


          const searchMatch =
            !normalizedQuery ||
            story.searchText.includes(
              normalizedQuery
            );


          return (
            categoryMatch &&
            searchMatch
          );

        }
      );

    }, [
      stories,
      activeFilter,
      normalizedQuery,
    ]);


  /* =====================================================
     OPEN STORY DETAILS
  ===================================================== */

  async function openStory(
    story
  ) {
    setSelectedStory(
      story
    );


    if (!story.id) {
      return;
    }


    setLoadingDetails(
      true
    );


    try {
      const response =
        await fetch(
          `${API_URL}/api/heritage-stories/${story.id}`
        );


      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }


      const payload =
        await response.json();


      const detail =
        normalizeStory(
          readStory(payload)
        );


      setSelectedStory(
        detail
      );
    }

    catch {
      /*
        Keep card information visible
        if the detail request fails.
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
      className="heritage-page"

      lang={language}

      dir={
        language === "ar"
          ? "rtl"
          : "ltr"
      }
    >

      {/* =================================================
          HERO
      ================================================= */}

      <section className="heritage-hero">

        <div className="heritage-hero-overlay" />


        <div className="heritage-hero-content">

          <span className="heritage-label">
            {t.heroLabel}
          </span>


          <h1>
            {t.title}
          </h1>


          <h3>
            {t.subtitle}
          </h3>


          <p>
            {t.description}
          </p>

        </div>


        <div className="heritage-script">

          {t.script1}

          <br />

          {t.script2}

          <br />

          <span>
            {t.script3}
          </span>

        </div>

      </section>


      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="heritage-content">

        {/* =================================================
            FILTERS
        ================================================= */}

        <div
          className="heritage-filters"

          role="tablist"

          aria-label={
            t.title
          }
        >

          {filters.map(
            (filter) => {

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

                  className={
                    active
                      ? "filter-active"
                      : ""
                  }

                  onClick={() =>
                    setActiveFilter(
                      filter.id
                    )
                  }
                >

                  {
                    t[
                      filter.translation
                    ]
                  }

                </button>
              );
            }
          )}

        </div>


        {/* =================================================
            SEARCH
        ================================================= */}

        <div
          className="
            relative
            mx-auto
            mb-4
            mt-3
            max-w-[620px]
          "
        >

          <Search
            size={17}

            className={`
              absolute
              top-1/2
              -translate-y-1/2
              text-[#7a766d]

              ${
                language === "ar"
                  ? "right-4"
                  : "left-4"
              }
            `}
          />


          <input
            type="search"

            value={query}

            placeholder={
              t.searchPlaceholder
            }

            onChange={(
              event
            ) =>
              setQuery(
                event.target.value
              )
            }

            className={`
              h-11
              w-full
              rounded-xl
              border
              border-[#ded9d0]
              bg-white
              text-sm
              outline-none
              transition

              focus:border-[#7a8266]
              focus:ring-2
              focus:ring-[#7a8266]/20

              ${
                language === "ar"
                  ? "pr-11 pl-11"
                  : "pl-11 pr-11"
              }
            `}
          />


          {query && (
            <button
              type="button"

              aria-label={
                t.close
              }

              onClick={() =>
                setQuery("")
              }

              className={`
                absolute
                top-1/2
                -translate-y-1/2
                rounded-full
                p-1
                text-[#777]

                hover:bg-[#eee]

                ${
                  language === "ar"
                    ? "left-4"
                    : "right-4"
                }
              `}
            >
              <X size={15} />
            </button>
          )}

        </div>


        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {!loading &&
          !error && (

          <p
            className="
              mb-3
              text-xs
              text-[#777168]
            "
          >
            {
              filteredStories.length
            }

            {" "}

            {
              filteredStories.length ===
              1
                ? t.story
                : t.stories
            }
          </p>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
            "
          >

            <div
              className="
                text-center
                text-[#68675f]
              "
            >

              <LoaderCircle
                size={30}

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
                {t.loading}
              </p>

            </div>

          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading &&
          error && (

          <div
            className="
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-6
              py-12
              text-center
              text-sm
              text-red-700
            "
          >
            {t.error}

            <div
              className="
                mt-2
                text-xs
                opacity-70
              "
            >
              {error}
            </div>
          </div>

        )}


        {/* =================================================
            STORY CARDS
        ================================================= */}

        {!loading &&
          !error &&
          filteredStories.length >
          0 && (

          <div className="heritage-grid">

            {filteredStories.map(
              (story) => (

                <StoryCard
                  key={
                    story.id ||
                    story.title
                  }

                  story={
                    story
                  }

                  onOpen={
                    openStory
                  }

                  t={t}
                />

              )
            )}

          </div>

        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          filteredStories.length ===
          0 && (

          <div className="heritage-empty">

            <h2>
              {t.noStories}
            </h2>


            <p>
              {
                t.noStoriesDescription
              }
            </p>


            <button
              type="button"

              onClick={() => {
                setActiveFilter(
                  "all"
                );

                setQuery("");
              }}
            >
              {t.viewAll}
            </button>

          </div>

        )}


        {/* =================================================
            BOTTOM BANNER
        ================================================= */}

        <section className="heritage-bottom-banner">

          <div
            className="heritage-leaves"
            aria-hidden="true"
          >

            <span className="leaf-stem" />

            <span className="leaf leaf-1" />

            <span className="leaf leaf-2" />

            <span className="leaf leaf-3" />

            <span className="leaf leaf-4" />

          </div>


          <div className="heritage-bottom-quote">

            <p>
              “{t.quote1}
              <br />
              {t.quote2}”
            </p>

            <span />

          </div>


          <div className="heritage-bottom-art">

            <div className="heritage-bottom-words">

              <span>
                PLACES
              </span>

              <span>
                PEOPLE
              </span>

              <span>
                STORIES
              </span>

              <span>
                LEBANON
              </span>

            </div>

          </div>

        </section>

      </section>


      {/* =================================================
          STORY DETAIL MODAL
      ================================================= */}

      {selectedStory && (

        <div
          className="
            fixed
            inset-0
            z-[2500]
            flex
            items-center
            justify-center
            bg-[#24231f]/60
            p-3
            backdrop-blur-[2px]

            sm:p-5
          "

          onClick={() =>
            setSelectedStory(
              null
            )
          }
        >

          <article
            role="dialog"

            aria-modal="true"

            aria-labelledby="heritage-story-title"

            onClick={(
              event
            ) =>
              event.stopPropagation()
            }

            className="
              flex
              max-h-[92vh]
              w-full
              max-w-[760px]
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-[#ddd6ca]
              bg-[#fbf8f2]
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
                border-[#e2ddd3]
                p-5
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                    text-[#987e54]
                  "
                >
                  {
                    displayCategory(
                      selectedStory.categories,
                      t
                    )
                  }
                </p>


                <h2
                  id="heritage-story-title"

                  className="
                    mt-1
                    font-serif
                    text-3xl
                    leading-tight
                    text-[#292720]
                  "
                >
                  {
                    selectedStory.title
                  }
                </h2>

              </div>


              <button
                type="button"

                aria-label={
                  t.close
                }

                onClick={() =>
                  setSelectedStory(
                    null
                  )
                }

                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#eee8df]
                  text-[#5d5951]

                  hover:bg-[#dfd8cd]
                "
              >
                <X size={17} />
              </button>

            </div>


            {/* CONTENT */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
              "
            >

              {/* COVER */}

              <img
                src={
                  selectedStory.coverImage
                }

                alt={
                  selectedStory.title
                }

                className="
                  h-[250px]
                  w-full
                  object-cover

                  sm:h-[320px]
                "

                onError={(
                  event
                ) => {
                  event.currentTarget.src =
                    "/images/heritage-hero.jpg";
                }}
              />


              <div
                className="
                  p-5

                  sm:p-6
                "
              >

                {loadingDetails && (

                  <div
                    className="
                      mb-4
                      flex
                      items-center
                      gap-2
                      text-xs
                      text-[#777]
                    "
                  >
                    <LoaderCircle
                      size={14}
                      className="
                        animate-spin
                      "
                    />

                    {t.loading}
                  </div>

                )}


                {/* META */}

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  {selectedStory.author && (

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-[#ece8df]
                        px-3
                        py-1.5
                        text-xs
                        text-[#645f55]
                      "
                    >
                      <UserRound
                        size={13}
                      />

                      {
                        selectedStory.author
                      }
                    </span>

                  )}


                  {selectedStory.publishedAt && (

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-[#e8ebdf]
                        px-3
                        py-1.5
                        text-xs
                        text-[#5c654d]
                      "
                    >
                      <CalendarDays
                        size={13}
                      />

                      {
                        formatDate(
                          selectedStory
                            .publishedAt,
                          language
                        )
                      }
                    </span>

                  )}

                </div>


                {/* SUMMARY */}

                {selectedStory.summary && (

                  <p
                    className="
                      mt-5
                      font-serif
                      text-lg
                      italic
                      leading-7
                      text-[#575248]
                    "
                  >
                    {
                      selectedStory.summary
                    }
                  </p>

                )}


                {/* CONTENT */}

                {selectedStory.content && (

                  <div
                    className="
                      mt-5
                      whitespace-pre-line
                      text-sm
                      leading-7
                      text-[#504e48]
                    "
                  >
                    {
                      selectedStory.content
                    }
                  </div>

                )}


                {/* GALLERY */}

                {selectedStory.images.length >
                  0 && (

                  <section
                    className="
                      mt-7
                      border-t
                      border-[#e1dcd2]
                      pt-5
                    "
                  >

                    <h3
                      className="
                        font-serif
                        text-xl
                        text-[#332f29]
                      "
                    >
                      {t.gallery}
                    </h3>


                    <div
                      className="
                        mt-3
                        grid
                        gap-3

                        sm:grid-cols-2
                      "
                    >

                      {selectedStory.images.map(
                        (image) => (

                          <figure
                            key={
                              image.id
                            }

                            className="
                              overflow-hidden
                              rounded-xl
                              border
                              border-[#ddd8ce]
                              bg-white
                            "
                          >

                            <img
                              src={
                                image.url
                              }

                              alt={
                                image.caption ||
                                selectedStory.title
                              }

                              className="
                                h-[190px]
                                w-full
                                object-cover
                              "
                            />


                            {image.caption && (

                              <figcaption
                                className="
                                  px-3
                                  py-2
                                  text-xs
                                  text-[#716c63]
                                "
                              >
                                {
                                  image.caption
                                }
                              </figcaption>

                            )}

                          </figure>

                        )
                      )}

                    </div>

                  </section>

                )}

              </div>

            </div>

          </article>

        </div>

      )}

    </main>
  );
}


/* =====================================================
   EXPORT
===================================================== */

export default function HeritagePage() {
  return (
    <AppShell>
      <HeritageContent />
    </AppShell>
  );
}
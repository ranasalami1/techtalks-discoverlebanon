"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const dictionaries = {
  en: {
    exploreNav: "EXPLORE THE MAP",
    itinerariesNav: "CURATED ITINERARIES",
    heritageNav: "HERITAGE STORIES",
    searchNav: "SEARCH",

    myAccount: "My Account",
    settings: "Settings",
    help: "Help",
    language: "Language",

    explore: "Explore Lebanon",
    subtitle:
      "Discover ancient cities, natural wonders, local experiences and more.",

    searchPlaceholder:
      "Search a destination, restaurant, activity or village...",

    all: "All",
    historical: "Historical Sites",
    nature: "Nature & Outdoors",
    activities: "Activities & Experiences",
    food: "Food & Gastronomy",

    featured: "Featured Destinations",
    viewAll: "View All",
    showLess: "Show Less",
    searchResults: "Explore Places",

    noResults:
      "No matching destinations or places. Try a different search or category.",

    loading: "Loading places...",
    apiError:
      "Place data is unavailable right now. The featured destinations remain available.",

    quote: "Same places, different stories.",
    place: "place",
    places: "places",
    photoPending: "Explore this place",

    mapFocus: "Explore on map",
    clearSearch: "Clear search",
    found: "results",
    loadMore: "Load more places",
    region: "Region",
  },

  fr: {
    exploreNav: "EXPLORER LA CARTE",
    itinerariesNav: "ITINÉRAIRES",
    heritageNav: "PATRIMOINE",
    searchNav: "RECHERCHE",

    myAccount: "Mon compte",
    settings: "Paramètres",
    help: "Aide",
    language: "Langue",

    explore: "Explorer le Liban",

    subtitle:
      "Découvrez des villes anciennes, des merveilles naturelles et des expériences locales.",

    searchPlaceholder:
      "Rechercher une destination, un restaurant, une activité...",

    all: "Tout",
    historical: "Sites historiques",
    nature: "Nature et plein air",
    activities: "Activités et expériences",
    food: "Cuisine et gastronomie",

    featured: "Destinations à découvrir",
    viewAll: "Tout afficher",
    showLess: "Voir moins",
    searchResults: "Explorer les lieux",

    noResults:
      "Aucun résultat. Essayez une autre recherche ou catégorie.",

    loading: "Chargement des lieux...",
    apiError:
      "Les lieux sont momentanément indisponibles. Les destinations restent accessibles.",

    quote: "Mêmes lieux, autres histoires.",
    place: "lieu",
    places: "lieux",
    photoPending: "Découvrir ce lieu",

    mapFocus: "Explorer sur la carte",
    clearSearch: "Effacer",
    found: "résultats",
    loadMore: "Afficher plus de lieux",
    region: "Région",
  },

  ar: {
    exploreNav: "استكشف الخريطة",
    itinerariesNav: "المسارات السياحية",
    heritageNav: "قصص التراث",
    searchNav: "بحث",

    myAccount: "حسابي",
    settings: "الإعدادات",
    help: "المساعدة",
    language: "اللغة",

    explore: "اكتشف لبنان",

    subtitle:
      "اكتشف المدن التاريخية والطبيعة والتجارب المحلية في لبنان.",

    searchPlaceholder:
      "ابحث عن وجهة أو مطعم أو نشاط أو قرية...",

    all: "الكل",
    historical: "المواقع التاريخية",
    nature: "الطبيعة والهواء الطلق",
    activities: "الأنشطة والتجارب",
    food: "الطعام والمأكولات",

    featured: "وجهات مميزة",
    viewAll: "عرض الكل",
    showLess: "عرض أقل",
    searchResults: "استكشف الأماكن",

    noResults:
      "لا توجد نتائج مطابقة. جرّب بحثًا أو فئة أخرى.",

    loading: "جارٍ تحميل الأماكن...",
    apiError:
      "بيانات الأماكن غير متاحة حاليًا. الوجهات المميزة متاحة.",

    quote: "الأماكن نفسها، حكايات مختلفة.",
    place: "مكان",
    places: "أماكن",
    photoPending: "استكشف هذا المكان",

    mapFocus: "استكشف على الخريطة",
    clearSearch: "مسح البحث",
    found: "نتائج",
    loadMore: "عرض المزيد من الأماكن",
    region: "المنطقة",
  },
};

const LanguageContext = createContext(null);

export function SiteLanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(
        "discover-lebanon-language"
      );

      if (saved && dictionaries[saved]) {
        setLanguageState(saved);
      }
    } catch {
      // localStorage may be disabled
    }
  }, []);

  useEffect(() => {
    const isArabic = language === "ar";

    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = (code) => {
    if (!dictionaries[code]) {
      return;
    }

    setLanguageState(code);

    try {
      window.localStorage.setItem(
        "discover-lebanon-language",
        code
      );
    } catch {
      // Ignore localStorage errors
    }
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: dictionaries[language],
      direction: language === "ar" ? "rtl" : "ltr",
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useSiteLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useSiteLanguage must be used inside SiteLanguageProvider"
    );
  }

  return context;
}
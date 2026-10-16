"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Camera,
  Clock3,
  Grid2X2,
  Heart,
  LoaderCircle,
  LogIn,
  Map as MapIcon,
  MapPin,
  Pencil,
  Settings,
  Trash2,
  User,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import AppShell from "@/components/AppShell";

import {
  SiteLanguageProvider,
  useSiteLanguage,
} from "@/components/SiteLanguage";

import "./account.css";


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
    title: "My Account",
    subtitle:
      "Manage your profile, preferences and saved experiences.",

    hero1: "Same places,",
    hero2: "different stories.",

    memberSince:
      "Member since",

    member:
      "Discover Lebanon member",

    editProfile:
      "Edit Profile",

    editTitle:
      "Edit Profile",

    fullName:
      "Full name",

    email:
      "Email",

    profileImage:
      "Profile image URL",

    profileImageHelp:
      "Enter an image URL or a public image path, for example /images/profile.jpg.",

    cancel:
      "Cancel",

    saveChanges:
      "Save changes",

    saving:
      "Saving...",

    profileSaved:
      "Your profile changes have been saved.",

    accountError:
      "Unable to load your account.",

    updateError:
      "Unable to update your account.",

    loginTitle:
      "Sign in to view your account",

    loginText:
      "Your account information is private and requires you to be signed in.",

    signIn:
      "Sign In",

    placesVisited:
      "Places Visited",

    savedPlaces:
      "Saved Places",

    itinerariesCompleted:
      "Itineraries Completed",

    notTracked:
      "Not tracked by the current backend",

    overview:
      "Overview",

    myItineraries:
      "My Itineraries",

    activityHistory:
      "Activity History",

    preferences:
      "Preferences",

    recentlySaved:
      "Recently Saved",

    viewAll:
      "View All",

    noSaved:
      "You haven't saved any places yet.",

    explorePlaces:
      "Explore Places",

    curatedItineraries:
      "Curated Itineraries",

    curatedDescription:
      "Discover ready-made journeys across Lebanon.",

    noItineraries:
      "No curated itineraries are available yet.",

    viewItinerary:
      "View Itinerary",

    accountSettings:
      "Account Settings",

    personalInformation:
      "Personal Information",

    changePassword:
      "Change Password",

    notifications:
      "Notifications",

    language:
      "Language",

    signOut:
      "Sign Out",

    savedEyebrow:
      "YOUR COLLECTION",

    savedDescription:
      "Places you've saved to explore later.",

    savedCount:
      "saved places",

    removeSaved:
      "Remove from saved places",

    details:
      "Details",

    journeyEyebrow:
      "YOUR JOURNEYS",

    personalItineraryTitle:
      "Personal itinerary tracking isn't stored yet",

    personalItineraryText:
      "The current backend stores curated itineraries, but it does not yet store which itineraries a specific user has started or completed. You can still browse all curated itineraries here.",

    browseItineraries:
      "Browse Itineraries",

    activityTitle:
      "Activity history isn't stored yet",

    activityText:
      "The current database does not contain a user activity-history table, so this page won't invent visits or activity records.",

    exploreMap:
      "Explore the Map",

    preferencesTitle:
      "Account Preferences",

    preferencesText:
      "Language and notification preferences are managed through your Settings page.",

    generalSettings:
      "General Settings",

    notificationSettings:
      "Notification Settings",

    languageSettings:
      "Language Settings",

    fullNameRequired:
      "Full name must be between 2 and 100 characters.",

    invalidEmail:
      "Enter a valid email address.",

    invalidImage:
      "Profile image must be at most 255 characters.",

    removeError:
      "Unable to remove this saved place.",

    retry:
      "Try Again",

    duration:
      "days",

    difficulty:
      "Difficulty",
  },


  fr: {
    title: "Mon compte",
    subtitle:
      "Gérez votre profil, vos préférences et vos expériences enregistrées.",

    hero1: "Les mêmes lieux,",
    hero2: "d'autres histoires.",

    memberSince:
      "Membre depuis",

    member:
      "Membre de Discover Lebanon",

    editProfile:
      "Modifier le profil",

    editTitle:
      "Modifier le profil",

    fullName:
      "Nom complet",

    email:
      "E-mail",

    profileImage:
      "URL de la photo de profil",

    profileImageHelp:
      "Entrez une URL ou un chemin public, par exemple /images/profile.jpg.",

    cancel:
      "Annuler",

    saveChanges:
      "Enregistrer",

    saving:
      "Enregistrement...",

    profileSaved:
      "Les modifications du profil ont été enregistrées.",

    accountError:
      "Impossible de charger votre compte.",

    updateError:
      "Impossible de mettre à jour votre compte.",

    loginTitle:
      "Connectez-vous pour voir votre compte",

    loginText:
      "Les informations de votre compte sont privées.",

    signIn:
      "Se connecter",

    placesVisited:
      "Lieux visités",

    savedPlaces:
      "Lieux enregistrés",

    itinerariesCompleted:
      "Itinéraires terminés",

    notTracked:
      "Non suivi par le backend actuel",

    overview:
      "Aperçu",

    myItineraries:
      "Mes itinéraires",

    activityHistory:
      "Historique d'activité",

    preferences:
      "Préférences",

    recentlySaved:
      "Enregistrés récemment",

    viewAll:
      "Tout voir",

    noSaved:
      "Vous n'avez encore enregistré aucun lieu.",

    explorePlaces:
      "Explorer les lieux",

    curatedItineraries:
      "Itinéraires sélectionnés",

    curatedDescription:
      "Découvrez des parcours préparés à travers le Liban.",

    noItineraries:
      "Aucun itinéraire disponible.",

    viewItinerary:
      "Voir l'itinéraire",

    accountSettings:
      "Paramètres du compte",

    personalInformation:
      "Informations personnelles",

    changePassword:
      "Changer le mot de passe",

    notifications:
      "Notifications",

    language:
      "Langue",

    signOut:
      "Se déconnecter",

    savedEyebrow:
      "VOTRE COLLECTION",

    savedDescription:
      "Les lieux que vous souhaitez découvrir plus tard.",

    savedCount:
      "lieux enregistrés",

    removeSaved:
      "Retirer des lieux enregistrés",

    details:
      "Détails",

    journeyEyebrow:
      "VOS VOYAGES",

    personalItineraryTitle:
      "Le suivi personnel des itinéraires n'est pas encore enregistré",

    personalItineraryText:
      "Le backend actuel contient les itinéraires sélectionnés, mais ne stocke pas encore ceux qu'un utilisateur a commencés ou terminés.",

    browseItineraries:
      "Voir les itinéraires",

    activityTitle:
      "L'historique d'activité n'est pas encore enregistré",

    activityText:
      "La base de données actuelle ne contient pas de table d'historique utilisateur. Aucun faux historique n'est donc affiché.",

    exploreMap:
      "Explorer la carte",

    preferencesTitle:
      "Préférences du compte",

    preferencesText:
      "La langue et les notifications sont gérées depuis la page Paramètres.",

    generalSettings:
      "Paramètres généraux",

    notificationSettings:
      "Paramètres des notifications",

    languageSettings:
      "Paramètres de langue",

    fullNameRequired:
      "Le nom doit contenir entre 2 et 100 caractères.",

    invalidEmail:
      "Entrez une adresse e-mail valide.",

    invalidImage:
      "L'image du profil doit contenir au maximum 255 caractères.",

    removeError:
      "Impossible de retirer ce lieu.",

    retry:
      "Réessayer",

    duration:
      "jours",

    difficulty:
      "Difficulté",
  },


  ar: {
    title: "حسابي",
    subtitle:
      "إدارة ملفك الشخصي وتفضيلاتك والأماكن المحفوظة.",

    hero1: "الأماكن نفسها،",
    hero2: "حكايات مختلفة.",

    memberSince:
      "عضو منذ",

    member:
      "عضو في Discover Lebanon",

    editProfile:
      "تعديل الملف الشخصي",

    editTitle:
      "تعديل الملف الشخصي",

    fullName:
      "الاسم الكامل",

    email:
      "البريد الإلكتروني",

    profileImage:
      "رابط صورة الملف الشخصي",

    profileImageHelp:
      "أدخل رابط صورة أو مسارًا عامًا مثل /images/profile.jpg.",

    cancel:
      "إلغاء",

    saveChanges:
      "حفظ التغييرات",

    saving:
      "جارٍ الحفظ...",

    profileSaved:
      "تم حفظ تغييرات الملف الشخصي.",

    accountError:
      "تعذر تحميل حسابك.",

    updateError:
      "تعذر تحديث حسابك.",

    loginTitle:
      "سجّل الدخول لعرض حسابك",

    loginText:
      "معلومات حسابك خاصة وتتطلب تسجيل الدخول.",

    signIn:
      "تسجيل الدخول",

    placesVisited:
      "الأماكن التي تمت زيارتها",

    savedPlaces:
      "الأماكن المحفوظة",

    itinerariesCompleted:
      "الرحلات المكتملة",

    notTracked:
      "غير متاح في النظام الحالي",

    overview:
      "نظرة عامة",

    myItineraries:
      "رحلاتي",

    activityHistory:
      "سجل النشاط",

    preferences:
      "التفضيلات",

    recentlySaved:
      "المحفوظة مؤخرًا",

    viewAll:
      "عرض الكل",

    noSaved:
      "لم تحفظ أي أماكن حتى الآن.",

    explorePlaces:
      "استكشاف الأماكن",

    curatedItineraries:
      "المسارات المقترحة",

    curatedDescription:
      "اكتشف مسارات جاهزة في مختلف أنحاء لبنان.",

    noItineraries:
      "لا توجد مسارات متاحة حاليًا.",

    viewItinerary:
      "عرض المسار",

    accountSettings:
      "إعدادات الحساب",

    personalInformation:
      "المعلومات الشخصية",

    changePassword:
      "تغيير كلمة المرور",

    notifications:
      "الإشعارات",

    language:
      "اللغة",

    signOut:
      "تسجيل الخروج",

    savedEyebrow:
      "مجموعتك",

    savedDescription:
      "الأماكن التي حفظتها لاكتشافها لاحقًا.",

    savedCount:
      "أماكن محفوظة",

    removeSaved:
      "إزالة من الأماكن المحفوظة",

    details:
      "التفاصيل",

    journeyEyebrow:
      "رحلاتك",

    personalItineraryTitle:
      "تتبّع رحلات المستخدم غير محفوظ بعد",

    personalItineraryText:
      "النظام الحالي يخزن المسارات المقترحة، لكنه لا يخزن بعد المسارات التي بدأها أو أكملها مستخدم معين.",

    browseItineraries:
      "استعراض المسارات",

    activityTitle:
      "سجل النشاط غير محفوظ بعد",

    activityText:
      "قاعدة البيانات الحالية لا تحتوي على سجل نشاط خاص بالمستخدم، لذلك لن يتم عرض بيانات وهمية.",

    exploreMap:
      "استكشف الخريطة",

    preferencesTitle:
      "تفضيلات الحساب",

    preferencesText:
      "يمكن إدارة اللغة والإشعارات من صفحة الإعدادات.",

    generalSettings:
      "الإعدادات العامة",

    notificationSettings:
      "إعدادات الإشعارات",

    languageSettings:
      "إعدادات اللغة",

    fullNameRequired:
      "يجب أن يكون الاسم بين حرفين و100 حرف.",

    invalidEmail:
      "أدخل بريدًا إلكترونيًا صالحًا.",

    invalidImage:
      "يجب ألا يتجاوز رابط الصورة 255 حرفًا.",

    removeError:
      "تعذر إزالة هذا المكان.",

    retry:
      "إعادة المحاولة",

    duration:
      "أيام",

    difficulty:
      "الصعوبة",
  },
};


/* =====================================================
   TAB CONFIG
===================================================== */

const tabConfig = [
  {
    id: "overview",
    translation: "overview",
    icon: Grid2X2,
  },
  {
    id: "saved",
    translation: "savedPlaces",
    icon: Bookmark,
  },
  {
    id: "itineraries",
    translation: "myItineraries",
    icon: MapIcon,
  },
  {
    id: "activity",
    translation: "activityHistory",
    icon: Clock3,
  },
  {
    id: "preferences",
    translation: "preferences",
    icon: Settings,
  },
];


/* =====================================================
   TOKEN
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


/* =====================================================
   AUTH FETCH
===================================================== */

async function authFetch(
  path,
  options = {}
) {
  const token =
    getToken();

  if (!token) {
    const error =
      new Error(
        "AUTH_REQUIRED"
      );

    error.code =
      "AUTH_REQUIRED";

    throw error;
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
   RESPONSE HELPERS
===================================================== */

function readAccount(
  payload
) {
  return (
    payload?.data?.account ||
    payload?.account ||
    null
  );
}


function readSavedPlaces(
  payload
) {
  if (
    Array.isArray(
      payload?.data
    )
  ) {
    return payload.data;
  }

  if (
    Array.isArray(
      payload?.data
        ?.saved_places
    )
  ) {
    return payload.data
      .saved_places;
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


function readItineraries(
  payload
) {
  if (
    Array.isArray(
      payload?.data
        ?.itineraries
    )
  ) {
    return payload.data
      .itineraries;
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
      payload?.data
    )
  ) {
    return payload.data;
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
      payload
    )
  ) {
    return payload;
  }

  return [];
}


/* =====================================================
   IMAGE HELPERS
===================================================== */

function resolveImage(
  value,
  fallback =
    "/images/heritage-hero.jpg"
) {
  if (!value) {
    return fallback;
  }

  const source =
    String(value).trim();

  if (!source) {
    return fallback;
  }

  if (
    source.startsWith(
      "http://"
    ) ||
    source.startsWith(
      "https://"
    ) ||
    source.startsWith(
      "data:"
    )
  ) {
    return source;
  }

  if (
    source.startsWith(
      "/images/"
    )
  ) {
    return source;
  }

  if (
    source.startsWith("/")
  ) {
    return `${API_URL}${source}`;
  }

  return `${API_URL}/${source}`;
}


function resolvePlaceImage(
  place
) {
  let image =
    place?.featured_image ||
    place?.cover_image ||
    place?.image_url ||
    place?.image;

  if (
    !image &&
    Array.isArray(
      place?.images
    ) &&
    place.images.length
  ) {
    const first =
      place.images[0];

    image =
      typeof first ===
      "string"
        ? first
        : first?.image_url ||
          first?.url;
  }

  return resolveImage(
    image
  );
}


/* =====================================================
   SAVED PLACE NORMALIZATION
===================================================== */

function normalizeSavedPlace(
  row
) {
  const place =
    row?.place ||
    row ||
    {};

  const id =
    place?.id ??
    place?.place_id;

  const city =
    place?.city ||
    "";

  const region =
    place?.region ||
    "";

  const location =
    city &&
    region &&
    city
      .trim()
      .toLowerCase() !==
      region
        .trim()
        .toLowerCase()
      ? `${city}, ${region}`
      : city ||
        region ||
        "Lebanon";

  return {
    id,

    name:
      place?.name ||
      "Unnamed place",

    location,

    image:
      resolvePlaceImage(
        place
      ),

    savedAt:
      row?.saved_at ||
      null,

    raw:
      place,
  };
}


/* =====================================================
   ITINERARY NORMALIZATION
===================================================== */

function normalizeItinerary(
  itinerary
) {
  return {
    id:
      itinerary?.id ??
      itinerary
        ?.itinerary_id,

    title:
      itinerary?.title ||
      "Untitled itinerary",

    description:
      itinerary?.description ||
      "",

    duration:
      itinerary
        ?.duration_days ||
      null,

    difficulty:
      itinerary
        ?.difficulty ||
      "",

    image:
      resolveImage(
        itinerary
          ?.cover_image,
        "/images/chouf.jpg"
      ),
  };
}


/* =====================================================
   DATE
===================================================== */

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

  const locale =
    language === "fr"
      ? "fr-FR"
      : language === "ar"
        ? "ar-LB"
        : "en-US";

  return date
    .toLocaleDateString(
      locale,
      {
        year:
          "numeric",

        month:
          "long",
      }
    );
}


/* =====================================================
   PROFILE VALIDATION
===================================================== */

function validateProfile(
  draft,
  t
) {
  const errors = {};

  const name =
    draft.full_name
      .trim();

  const email =
    draft.email
      .trim();

  const profileImage =
    draft.profile_image
      ?.trim() ||
    "";

  if (
    name.length < 2 ||
    name.length > 100
  ) {
    errors.full_name =
      t.fullNameRequired;
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    )
  ) {
    errors.email =
      t.invalidEmail;
  }

  if (
    profileImage.length >
    255
  ) {
    errors.profile_image =
      t.invalidImage;
  }

  return errors;
}


/* =====================================================
   CONTENT
===================================================== */

function AccountContent() {
  const router =
    useRouter();

  const {
    language,
  } =
    useSiteLanguage();

  const t =
    pageCopy[language] ||
    pageCopy.en;


  const [
    account,
    setAccount,
  ] =
    useState(null);


  const [
    savedPlaces,
    setSavedPlaces,
  ] =
    useState([]);


  const [
    itineraries,
    setItineraries,
  ] =
    useState([]);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    authRequired,
    setAuthRequired,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    success,
    setSuccess,
  ] =
    useState("");


  const [
    activeTab,
    setActiveTab,
  ] =
    useState(
      "overview"
    );


  const [
    isEditing,
    setIsEditing,
  ] =
    useState(false);


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  const [
    draft,
    setDraft,
  ] =
    useState({
      full_name: "",
      email: "",
      profile_image: "",
    });


  const [
    fieldErrors,
    setFieldErrors,
  ] =
    useState({});


  const [
    removingSavedId,
    setRemovingSavedId,
  ] =
    useState(null);


  const profileImageRef =
    useRef(null);


  /* =====================================================
     LOAD DATA
  ===================================================== */

  async function loadAccountData() {
    setLoading(true);
    setError("");

    try {
      if (!getToken()) {
        setAuthRequired(true);
        return;
      }

      const [
        accountResponse,
        savedResponse,
        itinerariesResponse,
      ] =
        await Promise.all([
          authFetch(
            "/api/account"
          ),

          authFetch(
            "/api/saved-places"
          ),

          fetch(
            `${API_URL}/api/itineraries?page=1&per_page=3`
          ),
        ]);


      if (
        accountResponse
          .status === 401 ||
        savedResponse
          .status === 401
      ) {
        setAuthRequired(true);
        return;
      }


      const accountPayload =
        await accountResponse
          .json()
          .catch(
            () => ({})
          );


      const savedPayload =
        await savedResponse
          .json()
          .catch(
            () => ({})
          );


      const itinerariesPayload =
        await itinerariesResponse
          .json()
          .catch(
            () => ({})
          );


      if (
        !accountResponse.ok
      ) {
        throw new Error(
          accountPayload
            ?.message ||
          t.accountError
        );
      }


      if (
        !savedResponse.ok
      ) {
        throw new Error(
          savedPayload
            ?.message ||
          t.accountError
        );
      }


      const realAccount =
        readAccount(
          accountPayload
        );


      if (!realAccount) {
        throw new Error(
          t.accountError
        );
      }


      setAccount(
        realAccount
      );


      setDraft({
        full_name:
          realAccount
            .full_name ||
          "",

        email:
          realAccount
            .email ||
          "",

        profile_image:
          realAccount
            .profile_image ||
          "",
      });


      setSavedPlaces(
        readSavedPlaces(
          savedPayload
        ).map(
          normalizeSavedPlace
        )
      );


      if (
        itinerariesResponse.ok
      ) {
        setItineraries(
          readItineraries(
            itinerariesPayload
          )
            .map(
              normalizeItinerary
            )
            .filter(
              (item) =>
                item.id != null
            )
        );
      }


      setAuthRequired(
        false
      );

    } catch (err) {
      if (
        err?.code ===
        "AUTH_REQUIRED"
      ) {
        setAuthRequired(
          true
        );
      } else {
        setError(
          err?.message ||
          t.accountError
        );
      }
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadAccountData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* =====================================================
     EDIT PROFILE
  ===================================================== */

  function startEditing(
    focusImage = false
  ) {
    if (!account) {
      return;
    }

    setDraft({
      full_name:
        account.full_name ||
        "",

      email:
        account.email ||
        "",

      profile_image:
        account.profile_image ||
        "",
    });

    setFieldErrors({});
    setSuccess("");
    setError("");
    setIsEditing(true);

    if (focusImage) {
      window.setTimeout(
        () =>
          profileImageRef
            .current
            ?.focus(),
        50
      );
    }
  }


  function cancelEditing() {
    setIsEditing(false);
    setFieldErrors({});
    setError("");
  }


  function updateDraft(
    field,
    value
  ) {
    setDraft(
      (previous) => ({
        ...previous,
        [field]:
          value,
      })
    );

    setFieldErrors(
      (previous) => ({
        ...previous,
        [field]:
          "",
      })
    );
  }


  async function saveProfile(
    event
  ) {
    event.preventDefault();

    if (
      saving ||
      !account
    ) {
      return;
    }

    const validationErrors =
      validateProfile(
        draft,
        t
      );

    setFieldErrors(
      validationErrors
    );

    if (
      Object.keys(
        validationErrors
      ).length
    ) {
      return;
    }


    setSaving(true);
    setError("");
    setSuccess("");


    try {
      const response =
        await authFetch(
          "/api/account",
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                full_name:
                  draft
                    .full_name
                    .trim(),

                email:
                  draft
                    .email
                    .trim(),

                profile_image:
                  draft
                    .profile_image
                    .trim() ||
                  null,
              }),
          }
        );


      const payload =
        await response
          .json()
          .catch(
            () => ({})
          );


      if (
        response.status ===
        401
      ) {
        setAuthRequired(
          true
        );

        return;
      }


      if (!response.ok) {
        if (
          payload?.errors
        ) {
          setFieldErrors(
            payload.errors
          );
        }

        throw new Error(
          payload?.message ||
          t.updateError
        );
      }


      const updatedAccount =
        readAccount(
          payload
        );


      if (!updatedAccount) {
        throw new Error(
          t.updateError
        );
      }


      setAccount(
        updatedAccount
      );


      setDraft({
        full_name:
          updatedAccount
            .full_name ||
          "",

        email:
          updatedAccount
            .email ||
          "",

        profile_image:
          updatedAccount
            .profile_image ||
          "",
      });


      /*
        Keep browser-side user information
        in sync with the real account.
      */

      const storedUser = {
        id:
          updatedAccount.id,

        fullName:
          updatedAccount
            .full_name,

        email:
          updatedAccount
            .email,

        profileImage:
          updatedAccount
            .profile_image,
      };


      localStorage.setItem(
        "discoverLebanonUser",
        JSON.stringify(
          storedUser
        )
      );


      window.dispatchEvent(
        new Event(
          "discoverLebanonUserUpdated"
        )
      );


      setIsEditing(
        false
      );

      setSuccess(
        t.profileSaved
      );

    } catch (err) {
      if (
        err?.code ===
        "AUTH_REQUIRED"
      ) {
        setAuthRequired(
          true
        );
      } else {
        setError(
          err?.message ||
          t.updateError
        );
      }
    } finally {
      setSaving(false);
    }
  }


  /* =====================================================
     REMOVE SAVED PLACE
  ===================================================== */

  async function removeSavedPlace(
    id
  ) {
    if (
      removingSavedId != null
    ) {
      return;
    }

    setRemovingSavedId(
      id
    );

    setError("");


    try {
      const response =
        await authFetch(
          `/api/saved-places/${id}`,
          {
            method:
              "DELETE",
          }
        );


      const payload =
        await response
          .json()
          .catch(
            () => ({})
          );


      if (!response.ok) {
        throw new Error(
          payload?.message ||
          t.removeError
        );
      }


      setSavedPlaces(
        (previous) =>
          previous.filter(
            (place) =>
              Number(
                place.id
              ) !==
              Number(id)
          )
      );

    } catch (err) {
      setError(
        err?.message ||
        t.removeError
      );
    } finally {
      setRemovingSavedId(
        null
      );
    }
  }


  /* =====================================================
     SIGN OUT
  ===================================================== */

  function signOut() {
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "discoverLebanonUser"
    );

    router.push(
      "/login"
    );

    router.refresh();
  }


  /* =====================================================
     DERIVED
  ===================================================== */

  const recentSaved =
    useMemo(
      () =>
        savedPlaces.slice(
          0,
          3
        ),
      [savedPlaces]
    );


  const memberSince =
    formatDate(
      account
        ?.created_at,
      language
    );


  const profileImage =
    resolveImage(
      account
        ?.profile_image,
      "/images/profile.jpg"
    );


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="account-page">
        <div
          style={{
            minHeight:
              "600px",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
          }}
        >
          <div
            style={{
              textAlign:
                "center",
              color:
                "#6B6355",
            }}
          >
            <LoaderCircle
              size={32}
              className="animate-spin"
            />

            <p
              style={{
                marginTop:
                  "12px",
              }}
            >
              {t.accountError.replace(
                "Unable to load",
                "Loading"
              )}
            </p>
          </div>
        </div>
      </main>
    );
  }


  /* =====================================================
     SIGN IN REQUIRED
  ===================================================== */

  if (authRequired) {
    return (
      <main className="account-page">

        <section className="account-hero">
          <div className="account-hero-overlay" />

          <div className="account-hero-content">
            <h1>
              {t.title}
            </h1>

            <p>
              {t.subtitle}
            </p>
          </div>
        </section>


        <div className="account-content">

          <section
            className="account-panel"
            style={{
              maxWidth:
                "620px",
              margin:
                "40px auto",
              textAlign:
                "center",
              padding:
                "48px 32px",
            }}
          >
            <LogIn
              size={32}
              style={{
                margin:
                  "0 auto 16px",
              }}
            />

            <h3>
              {t.loginTitle}
            </h3>

            <p>
              {t.loginText}
            </p>

            <Link
              href="/login"
              className="account-primary-button"
              style={{
                display:
                  "inline-flex",
                marginTop:
                  "20px",
                textDecoration:
                  "none",
              }}
            >
              {t.signIn}
            </Link>
          </section>

        </div>
      </main>
    );
  }


  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main
      className="account-page"
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

      <section className="account-hero">

        <div className="account-hero-overlay" />


        <div className="account-hero-content">

          <h1>
            {t.title}
          </h1>

          <p>
            {t.subtitle}
          </p>

        </div>


        <div className="account-hero-note">

          {t.hero1}

          <br />

          {t.hero2}

        </div>

      </section>


      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="account-content">

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div
            className="account-success"
            style={{
              background:
                "#FBEDE8",

              borderColor:
                "#E2A898",

              color:
                "#A3402B",
            }}
          >
            {error}
          </div>

        )}


        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (

          <div className="account-success">
            {success}
          </div>

        )}


        {/* =================================================
            PROFILE + STATS
        ================================================= */}

        <section
          className="account-profile-grid"
          id="profile"
        >

          {/* PROFILE */}

          <div className="account-profile-card">

            <div className="account-avatar-wrap">

              <img
                src={profileImage}
                alt={
                  account
                    ?.full_name ||
                  "Profile"
                }
                className="account-avatar"
                onError={(event) => {
                  event.currentTarget.src =
                    "/images/profile.jpg";
                }}
              />


              <button
                type="button"
                className="account-camera"
                aria-label={
                  t.profileImage
                }
                title={
                  t.profileImage
                }
                onClick={() =>
                  startEditing(
                    true
                  )
                }
              >
                <Camera
                  size={15}
                />
              </button>

            </div>


            <div className="account-profile-info">

              <h2>
                {
                  account
                    ?.full_name
                }
              </h2>


              <p>
                {
                  account
                    ?.email
                }
              </p>


              <p className="account-location">

                <User size={14} />

                {t.member}

              </p>

            </div>


            {!isEditing && (

              <button
                type="button"
                className="account-edit-button"
                onClick={() =>
                  startEditing(
                    false
                  )
                }
              >
                <Pencil
                  size={14}
                />

                {t.editProfile}
              </button>

            )}

          </div>


          {/* STATS */}

          <div className="account-stats-card">

            <div className="account-member">

              <span className="member-leaf">
                ⌁
              </span>


              <div>

                <strong>
                  {
                    t.memberSince
                  }
                </strong>

                <span>
                  {memberSince}
                </span>

              </div>

            </div>


            <div className="account-stats">

              {/* NOT TRACKED */}

              <div
                className="account-stat"
                title={
                  t.notTracked
                }
              >
                <MapPin
                  size={21}
                />

                <strong>
                  —
                </strong>

                <span>
                  {
                    t.placesVisited
                  }
                </span>
              </div>


              {/* REAL SAVED COUNT */}

              <div className="account-stat">

                <Bookmark
                  size={21}
                />

                <strong>
                  {
                    savedPlaces
                      .length
                  }
                </strong>

                <span>
                  {
                    t.savedPlaces
                  }
                </span>
              </div>


              {/* NOT TRACKED */}

              <div
                className="account-stat"
                title={
                  t.notTracked
                }
              >
                <Heart
                  size={21}
                />

                <strong>
                  —
                </strong>

                <span>
                  {
                    t.itinerariesCompleted
                  }
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            EDIT PROFILE
        ================================================= */}

        {isEditing && (

          <section className="account-panel account-edit-panel">

            <h3>
              {t.editTitle}
            </h3>


            <form
              onSubmit={
                saveProfile
              }
              noValidate
            >

              {/* FULL NAME */}

              <div className="account-field">

                <label htmlFor="account-full-name">
                  {t.fullName}
                </label>


                <input
                  id="account-full-name"
                  value={
                    draft
                      .full_name
                  }
                  onChange={(event) =>
                    updateDraft(
                      "full_name",
                      event.target
                        .value
                    )
                  }
                  className={
                    fieldErrors
                      .full_name
                      ? "has-error"
                      : ""
                  }
                />


                {fieldErrors
                  .full_name && (

                  <span className="account-error">
                    {
                      fieldErrors
                        .full_name
                    }
                  </span>

                )}

              </div>


              {/* EMAIL */}

              <div className="account-field">

                <label htmlFor="account-email">
                  {t.email}
                </label>


                <input
                  id="account-email"
                  type="email"
                  value={
                    draft.email
                  }
                  onChange={(event) =>
                    updateDraft(
                      "email",
                      event.target
                        .value
                    )
                  }
                  className={
                    fieldErrors
                      .email
                      ? "has-error"
                      : ""
                  }
                />


                {fieldErrors
                  .email && (

                  <span className="account-error">
                    {
                      fieldErrors
                        .email
                    }
                  </span>

                )}

              </div>


              {/* PROFILE IMAGE */}

              <div className="account-field">

                <label htmlFor="account-profile-image">
                  {
                    t.profileImage
                  }
                </label>


                <input
                  ref={
                    profileImageRef
                  }
                  id="account-profile-image"
                  value={
                    draft
                      .profile_image
                  }
                  placeholder="/images/profile.jpg"
                  onChange={(event) =>
                    updateDraft(
                      "profile_image",
                      event.target
                        .value
                    )
                  }
                  className={
                    fieldErrors
                      .profile_image
                      ? "has-error"
                      : ""
                  }
                />


                <small
                  style={{
                    display:
                      "block",

                    marginTop:
                      "6px",

                    color:
                      "#7A746A",

                    fontSize:
                      "11px",
                  }}
                >
                  {
                    t.profileImageHelp
                  }
                </small>


                {fieldErrors
                  .profile_image && (

                  <span className="account-error">
                    {
                      fieldErrors
                        .profile_image
                    }
                  </span>

                )}

              </div>


              {/* ACTIONS */}

              <div className="account-form-actions">

                <button
                  type="button"
                  className="account-secondary-button"
                  onClick={
                    cancelEditing
                  }
                  disabled={
                    saving
                  }
                >
                  {t.cancel}
                </button>


                <button
                  type="submit"
                  className="account-primary-button"
                  disabled={
                    saving
                  }
                >

                  {saving && (
                    <LoaderCircle
                      size={14}
                      className="animate-spin"
                    />
                  )}

                  {saving
                    ? t.saving
                    : t.saveChanges}

                </button>

              </div>

            </form>

          </section>

        )}


        {/* =================================================
            TABS
        ================================================= */}

        <nav className="account-tabs">

          {tabConfig.map(
            (tab) => {

              const TabIcon =
                tab.icon;

              return (

                <button
                  key={
                    tab.id
                  }
                  type="button"
                  className={
                    activeTab ===
                    tab.id
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    setActiveTab(
                      tab.id
                    );

                    setSuccess("");
                  }}
                >
                  <TabIcon
                    size={18}
                  />

                  <span>
                    {
                      t[
                        tab
                          .translation
                      ]
                    }
                  </span>
                </button>

              );

            }
          )}

        </nav>


        {/* =================================================
            OVERVIEW
        ================================================= */}

        {activeTab ===
          "overview" && (

          <div className="account-overview">

            {/* LEFT */}

            <div className="account-left-column">

              {/* RECENTLY SAVED */}

              <section className="account-section">

                <div className="account-section-heading">

                  <h3>
                    {
                      t.recentlySaved
                    }
                  </h3>


                  <Link href="/saved">

                    {t.viewAll}

                    <span>
                      →
                    </span>

                  </Link>

                </div>


                {recentSaved.length >
                0 ? (

                  <div className="saved-places-grid">

                    {recentSaved.map(
                      (place) => (

                        <Link
                          href={`/saved/${place.id}`}
                          className="saved-place-card"
                          key={
                            place.id
                          }
                          style={{
                            textDecoration:
                              "none",
                          }}
                        >

                          <div className="saved-place-image-wrap">

                            <img
                              src={
                                place.image
                              }
                              alt={
                                place.name
                              }
                              className="saved-place-image"
                              onError={(event) => {
                                event.currentTarget.src =
                                  "/images/heritage-hero.jpg";
                              }}
                            />

                            <Bookmark
                              size={16}
                            />

                          </div>


                          <div className="saved-place-info">

                            <strong>
                              {
                                place.name
                              }
                            </strong>


                            <span>

                              <MapPin
                                size={11}
                              />

                              {
                                place.location
                              }

                            </span>

                          </div>

                        </Link>

                      )
                    )}

                  </div>

                ) : (

                  <div
                    className="account-panel"
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    <p>
                      {t.noSaved}
                    </p>

                    <Link href="/explore">
                      {
                        t.explorePlaces
                      }{" "}
                      →
                    </Link>
                  </div>

                )}

              </section>

            </div>


            {/* RIGHT */}

            <div className="account-right-column">

              {/* CURATED ITINERARIES */}

              <section className="account-section">

                <div className="account-section-heading">

                  <h3>
                    {
                      t.curatedItineraries
                    }
                  </h3>


                  <Link href="/itineraries">

                    {t.viewAll}

                    <span>
                      →
                    </span>

                  </Link>

                </div>


                {itineraries.length >
                0 ? (

                  <article className="upcoming-itinerary">

                    <img
                      src={
                        itineraries[0]
                          .image
                      }
                      alt={
                        itineraries[0]
                          .title
                      }
                      onError={(event) => {
                        event.currentTarget.src =
                          "/images/chouf.jpg";
                      }}
                    />


                    <div className="upcoming-itinerary-info">

                      <strong>
                        {
                          itineraries[0]
                            .title
                        }
                      </strong>


                      {itineraries[0]
                        .duration && (

                        <span>
                          {
                            itineraries[0]
                              .duration
                          }{" "}
                          {t.duration}
                        </span>

                      )}


                      {itineraries[0]
                        .difficulty && (

                        <span>
                          {
                            itineraries[0]
                              .difficulty
                          }
                        </span>

                      )}

                    </div>


                    <Link
                      href="/itineraries"
                      className="itinerary-arrow"
                      aria-label={
                        t.viewItinerary
                      }
                    >
                      →
                    </Link>

                  </article>

                ) : (

                  <div className="account-panel">
                    <p>
                      {
                        t.noItineraries
                      }
                    </p>
                  </div>

                )}

              </section>


              {/* ACCOUNT SETTINGS */}

              <section className="account-panel account-settings">

                <h3>
                  {
                    t.accountSettings
                  }
                </h3>


                <div className="account-settings-list">

                  <button
                    type="button"
                    onClick={() =>
                      startEditing(
                        false
                      )
                    }
                    style={{
                      width:
                        "100%",

                      border:
                        "none",

                      background:
                        "transparent",

                      cursor:
                        "pointer",
                    }}
                  >
                    <span>

                      <User
                        size={16}
                      />

                      {
                        t.personalInformation
                      }

                    </span>

                    <b>
                      ›
                    </b>
                  </button>


                  <Link href="/settings/privacy-security">

                    <span>
                      {
                        t.changePassword
                      }
                    </span>

                    <b>
                      ›
                    </b>

                  </Link>


                  <Link href="/settings/notifications">

                    <span>
                      {
                        t.notifications
                      }
                    </span>

                    <b>
                      ›
                    </b>

                  </Link>


                  <Link href="/settings/language">

                    <span>
                      {
                        t.language
                      }
                    </span>


                    <span className="setting-value">

                      {
                        language ===
                        "fr"
                          ? "Français"
                          : language ===
                              "ar"
                            ? "العربية"
                            : "English"
                      }

                      <b>
                        ›
                      </b>

                    </span>

                  </Link>


                  <button
                    type="button"
                    className="account-sign-out"
                    onClick={
                      signOut
                    }
                  >
                    {
                      t.signOut
                    }
                  </button>

                </div>

              </section>

            </div>

          </div>

        )}


        {/* =================================================
            SAVED PLACES TAB
        ================================================= */}

        {activeTab ===
          "saved" && (

          <section className="account-tab-content">

            <div className="account-tab-heading">

              <div>

                <span className="account-tab-eyebrow">
                  {
                    t.savedEyebrow
                  }
                </span>


                <h2>
                  {
                    t.savedPlaces
                  }
                </h2>


                <p>
                  {
                    t.savedDescription
                  }
                </p>

              </div>


              <span className="saved-count">

                {
                  savedPlaces.length
                }{" "}

                {
                  t.savedCount
                }

              </span>

            </div>


            {savedPlaces.length >
            0 ? (

              <div className="saved-tab-grid">

                {savedPlaces.map(
                  (place) => (

                    <article
                      className="saved-tab-card"
                      key={
                        place.id
                      }
                    >

                      <div className="saved-tab-image-wrap">

                        <img
                          src={
                            place.image
                          }
                          alt={
                            place.name
                          }
                          className="saved-tab-image"
                          onError={(event) => {
                            event.currentTarget.src =
                              "/images/heritage-hero.jpg";
                          }}
                        />


                        <button
                          type="button"
                          className="saved-tab-bookmark"
                          aria-label={`${t.removeSaved}: ${place.name}`}
                          disabled={
                            Number(
                              removingSavedId
                            ) ===
                            Number(
                              place.id
                            )
                          }
                          onClick={() =>
                            removeSavedPlace(
                              place.id
                            )
                          }
                        >

                          {Number(
                            removingSavedId
                          ) ===
                          Number(
                            place.id
                          ) ? (

                            <LoaderCircle
                              size={17}
                              className="animate-spin"
                            />

                          ) : (

                            <Trash2
                              size={17}
                            />

                          )}

                        </button>

                      </div>


                      <div className="saved-tab-card-content">

                        <div>

                          <h3>
                            {
                              place.name
                            }
                          </h3>


                          <span className="saved-tab-location">

                            <MapPin
                              size={12}
                            />

                            {
                              place.location
                            }

                          </span>

                        </div>


                        <Link
                          href={`/saved/${place.id}`}
                          className="saved-tab-explore"
                        >
                          {
                            t.details
                          }{" "}
                          →
                        </Link>

                      </div>

                    </article>

                  )
                )}

              </div>

            ) : (

              <div className="account-panel account-empty-tab">

                <Bookmark
                  size={28}
                />

                <h3>
                  {t.noSaved}
                </h3>

                <Link href="/explore">
                  {
                    t.explorePlaces
                  }{" "}
                  →
                </Link>

              </div>

            )}

          </section>

        )}


        {/* =================================================
            MY ITINERARIES TAB
        ================================================= */}

        {activeTab ===
          "itineraries" && (

          <section className="account-tab-content">

            <div className="account-tab-heading">

              <div>

                <span className="account-tab-eyebrow">
                  {
                    t.journeyEyebrow
                  }
                </span>


                <h2>
                  {
                    t.myItineraries
                  }
                </h2>

              </div>


              <Link
                href="/itineraries"
                className="account-create-itinerary"
              >
                +{" "}
                {
                  t.browseItineraries
                }
              </Link>

            </div>


            {/* IMPORTANT:
                current backend has no user_itineraries table */}

            <div
              className="account-panel"
              style={{
                marginBottom:
                  "20px",
              }}
            >

              <h3>
                {
                  t.personalItineraryTitle
                }
              </h3>


              <p>
                {
                  t.personalItineraryText
                }
              </p>

            </div>


            {itineraries.length >
            0 && (

              <div className="my-itineraries-grid">

                {itineraries.map(
                  (
                    itinerary
                  ) => (

                    <article
                      className="my-itinerary-card"
                      key={
                        itinerary.id
                      }
                    >

                      <img
                        src={
                          itinerary.image
                        }
                        alt={
                          itinerary.title
                        }
                        className="my-itinerary-image"
                        onError={(event) => {
                          event.currentTarget.src =
                            "/images/chouf.jpg";
                        }}
                      />


                      <div className="my-itinerary-content">

                        <div className="my-itinerary-top">

                          <span className="itinerary-status upcoming">
                            CURATED
                          </span>

                        </div>


                        <h3>
                          {
                            itinerary.title
                          }
                        </h3>


                        {itinerary
                          .description && (

                          <p className="my-itinerary-description">
                            {
                              itinerary.description
                            }
                          </p>

                        )}


                        <div className="my-itinerary-tags">

                          {itinerary
                            .duration && (

                            <span>
                              {
                                itinerary.duration
                              }{" "}
                              {
                                t.duration
                              }
                            </span>

                          )}


                          {itinerary
                            .difficulty && (

                            <span>
                              {
                                itinerary.difficulty
                              }
                            </span>

                          )}

                        </div>


                        <Link
                          href="/itineraries"
                          className="my-itinerary-link"
                        >
                          {
                            t.viewItinerary
                          }{" "}
                          →
                        </Link>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </section>

        )}


        {/* =================================================
            ACTIVITY HISTORY TAB
        ================================================= */}

        {activeTab ===
          "activity" && (

          <section className="account-tab-content">

            <div className="account-tab-heading">

              <div>

                <span className="account-tab-eyebrow">
                  ACTIVITY
                </span>

                <h2>
                  {
                    t.activityHistory
                  }
                </h2>

              </div>

            </div>


            <div className="account-panel account-empty-tab">

              <Clock3
                size={30}
              />


              <h3>
                {
                  t.activityTitle
                }
              </h3>


              <p>
                {
                  t.activityText
                }
              </p>


              <div
                style={{
                  display:
                    "flex",

                  gap:
                    "10px",

                  justifyContent:
                    "center",

                  flexWrap:
                    "wrap",

                  marginTop:
                    "18px",
                }}
              >

                <Link
                  href="/explore"
                  className="account-primary-button"
                >
                  {
                    t.exploreMap
                  }
                </Link>


                <Link
                  href="/saved"
                  className="account-secondary-button"
                >
                  {
                    t.savedPlaces
                  }
                </Link>

              </div>

            </div>

          </section>

        )}


        {/* =================================================
            PREFERENCES TAB
        ================================================= */}

        {activeTab ===
          "preferences" && (

          <section className="account-tab-content">

            <div className="account-tab-heading">

              <div>

                <span className="account-tab-eyebrow">
                  SETTINGS
                </span>


                <h2>
                  {
                    t.preferencesTitle
                  }
                </h2>


                <p>
                  {
                    t.preferencesText
                  }
                </p>

              </div>

            </div>


            <section className="account-panel account-settings">

              <div className="account-settings-list">

                <Link href="/settings">

                  <span>

                    <Settings
                      size={16}
                    />

                    {
                      t.generalSettings
                    }

                  </span>

                  <b>
                    ›
                  </b>

                </Link>


                <Link href="/settings/notifications">

                  <span>
                    {
                      t.notificationSettings
                    }
                  </span>

                  <b>
                    ›
                  </b>

                </Link>


                <Link href="/settings/language">

                  <span>
                    {
                      t.languageSettings
                    }
                  </span>

                  <span className="setting-value">

                    {
                      language ===
                      "fr"
                        ? "Français"
                        : language ===
                            "ar"
                          ? "العربية"
                          : "English"
                    }

                    <b>
                      ›
                    </b>

                  </span>

                </Link>

              </div>

            </section>

          </section>

        )}

      </div>

    </main>
  );
}


/* =====================================================
   PAGE
===================================================== */

export default function MyAccountPage() {
  return (
    <SiteLanguageProvider>

      <AppShell>

        <AccountContent />

      </AppShell>

    </SiteLanguageProvider>
  );
}
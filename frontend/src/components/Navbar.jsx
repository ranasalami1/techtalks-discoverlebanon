"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  ChevronDown,
  CircleHelp,
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";

import "./Navbar.css";


/* =====================================================
   API
===================================================== */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";


/* =====================================================
   LANGUAGES
===================================================== */

const languageOptions = [
  {
    code: "en",
    label: "English",
    short: "EN",
  },

  {
    code: "fr",
    label: "Français",
    short: "FR",
  },

  {
    code: "ar",
    label: "العربية",
    short: "AR",
  },
];


/* =====================================================
   TOKEN
===================================================== */

function getAccessToken() {
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
   NORMALIZE USER
===================================================== */

function normalizeUser(
  account
) {
  if (!account) {
    return null;
  }

  return {
    id:
      account?.id ??
      account?.user_id ??
      null,

    fullName:
      account?.full_name ??
      account?.fullName ??
      "",

    email:
      account?.email ??
      "",

    profileImage:
      account?.profile_image ??
      account?.profileImage ??
      null,
  };
}


/* =====================================================
   IMAGE
===================================================== */

function resolveProfileImage(
  value
) {
  if (!value) {
    return "";
  }

  const image =
    String(value).trim();

  if (!image) {
    return "";
  }

  if (
    image.startsWith(
      "http://"
    ) ||
    image.startsWith(
      "https://"
    ) ||
    image.startsWith(
      "data:"
    )
  ) {
    return image;
  }

  if (
    image.startsWith(
      "/images/"
    )
  ) {
    return image;
  }

  if (
    image.startsWith("/")
  ) {
    return `${API_URL}${image}`;
  }

  return `${API_URL}/${image}`;
}


/* =====================================================
   DISPLAY NAME
===================================================== */

function getFirstName(
  fullName
) {
  const name =
    String(
      fullName || ""
    ).trim();

  if (!name) {
    return "Account";
  }

  return (
    name.split(/\s+/)[0] ||
    "Account"
  );
}


/* =====================================================
   INITIALS
===================================================== */

function getInitials(
  fullName
) {
  const parts =
    String(
      fullName || ""
    )
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (!parts.length) {
    return "U";
  }

  if (
    parts.length === 1
  ) {
    return parts[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    parts[0]
      .charAt(0) +
    parts[1]
      .charAt(0)
  ).toUpperCase();
}


/* =====================================================
   NAVBAR
===================================================== */

export default function Navbar({
  onMenuClick,
}) {
  const pathname =
    usePathname();

  const router =
    useRouter();


  /* =====================================================
     USER
  ===================================================== */

  const [
    user,
    setUser,
  ] =
    useState(null);


  const [
    userLoading,
    setUserLoading,
  ] =
    useState(true);


  /* =====================================================
     MENUS
  ===================================================== */

  const [
    profileOpen,
    setProfileOpen,
  ] =
    useState(false);


  const [
    languageOpen,
    setLanguageOpen,
  ] =
    useState(false);


  const [
    language,
    setLanguage,
  ] =
    useState("en");


  const profileRef =
    useRef(null);


  const languageRef =
    useRef(null);


  /* =====================================================
     NAVIGATION
  ===================================================== */

  const links = [
    {
      label:
        "EXPLORE THE MAP",

      href:
        "/explore",
    },

    {
      label:
        "CURATED ITINERARIES",

      href:
        "/itineraries",
    },

    {
      label:
        "HERITAGE STORIES",

      href:
        "/heritage",
    },
  ];


  /* =====================================================
     LOAD CURRENT USER FROM REAL API
  ===================================================== */

  async function loadCurrentUser() {
    const token =
      getAccessToken();


    /*
      No JWT = nobody is logged in.
    */

    if (!token) {
      setUser(null);

      setUserLoading(
        false
      );

      return;
    }


    try {
      setUserLoading(
        true
      );


      const response =
        await fetch(
          `${API_URL}/api/account`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      /*
        Token expired / invalid.
      */

      if (
        response.status ===
        401
      ) {
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


        setUser(
          null
        );

        return;
      }


      if (
        !response.ok
      ) {
        throw new Error(
          "Unable to load account"
        );
      }


      const payload =
        await response.json();


      const account =
        payload?.data
          ?.account ??
        payload?.account ??
        null;


      const currentUser =
        normalizeUser(
          account
        );


      setUser(
        currentUser
      );


      /*
        Cache the REAL currently logged-in user.

        This gets replaced every time another
        account logs in.
      */

      if (currentUser) {
        localStorage.setItem(
          "discoverLebanonUser",
          JSON.stringify(
            currentUser
          )
        );
      }

    } catch (error) {
      console.error(
        "Navbar account error:",
        error
      );

    } finally {
      setUserLoading(
        false
      );
    }
  }


  /* =====================================================
     LOAD USER WHEN PAGE CHANGES
  ===================================================== */

  useEffect(() => {
    loadCurrentUser();
  }, [
    pathname,
  ]);


  /* =====================================================
     UPDATE NAVBAR WHEN PROFILE CHANGES
  ===================================================== */

  useEffect(() => {

    function handleUserUpdate() {
      loadCurrentUser();
    }


    function handleStorage(
      event
    ) {
      if (
        event.key ===
          "accessToken" ||
        event.key ===
          "discoverLebanonUser"
      ) {
        loadCurrentUser();
      }
    }


    /*
      Useful if user returns to the tab
      after logging in somewhere else.
    */

    function handleFocus() {
      loadCurrentUser();
    }


    window.addEventListener(
      "discoverLebanonUserUpdated",
      handleUserUpdate
    );


    window.addEventListener(
      "storage",
      handleStorage
    );


    window.addEventListener(
      "focus",
      handleFocus
    );


    return () => {
      window.removeEventListener(
        "discoverLebanonUserUpdated",
        handleUserUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );
    };

  }, []);


  /* =====================================================
     LOAD LANGUAGE
  ===================================================== */

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "discover-lebanon-language"
      );


    if (
      savedLanguage ===
        "en" ||
      savedLanguage ===
        "fr" ||
      savedLanguage ===
        "ar"
    ) {
      setLanguage(
        savedLanguage
      );
    }

  }, []);


  /* =====================================================
     CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {

    function handleOutsideClick(
      event
    ) {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setProfileOpen(
          false
        );
      }


      if (
        languageRef.current &&
        !languageRef.current.contains(
          event.target
        )
      ) {
        setLanguageOpen(
          false
        );
      }
    }


    function handleEscape(
      event
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setProfileOpen(
          false
        );

        setLanguageOpen(
          false
        );
      }
    }


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    document.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };

  }, []);


  /* =====================================================
     CHANGE LANGUAGE
  ===================================================== */

  function changeLanguage(
    nextLanguage
  ) {
    localStorage.setItem(
      "discover-lebanon-language",
      nextLanguage
    );


    setLanguage(
      nextLanguage
    );


    document.documentElement.lang =
      nextLanguage;


    document.documentElement.dir =
      nextLanguage ===
      "ar"
        ? "rtl"
        : "ltr";


    setLanguageOpen(
      false
    );


    /*
      Reload allows every existing page-level
      SiteLanguageProvider to read the new value.
    */

    window.location.reload();
  }


  /* =====================================================
     SIGN OUT
  ===================================================== */

  function handleSignOut() {
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


    setUser(
      null
    );


    setProfileOpen(
      false
    );


    window.dispatchEvent(
      new Event(
        "discoverLebanonUserUpdated"
      )
    );


    router.push(
      "/login"
    );

    router.refresh();
  }


  /* =====================================================
     DISPLAY VALUES
  ===================================================== */

  const displayName =
    user
      ? getFirstName(
          user.fullName
        )
      : userLoading
        ? "..."
        : "Sign In";


  const initials =
    getInitials(
      user?.fullName
    );


  const profileImage =
    resolveProfileImage(
      user?.profileImage
    );


  const currentLanguage =
    languageOptions.find(
      (item) =>
        item.code ===
        language
    ) ||
    languageOptions[0];


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <header className="top-navbar">

      {/* =================================================
          MOBILE MENU
      ================================================= */}

      <button
        className="navbar-menu-button"
        type="button"
        aria-label="Open navigation"
        onClick={
          onMenuClick
        }
      >
        <Menu
          size={24}
          strokeWidth={
            1.8
          }
        />
      </button>


      {/* =================================================
          MOBILE LOGO
      ================================================= */}

      <Link
        href="/"
        className="navbar-mobile-logo"
      >
        Discover Lebanon
      </Link>


      {/* =================================================
          DESKTOP LINKS
      ================================================= */}

      <nav
        className="navbar-links"
        aria-label="Top navigation"
      >

        {links.map(
          (link) => {

            const isActive =
              pathname ===
                link.href ||
              pathname.startsWith(
                `${link.href}/`
              );


            return (

              <Link
                key={
                  link.href
                }

                href={
                  link.href
                }

                className={
                  isActive
                    ? "navbar-link navbar-link-active"
                    : "navbar-link"
                }
              >
                {
                  link.label
                }
              </Link>

            );

          }
        )}

      </nav>


      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="navbar-actions">

        {/* SEARCH */}

        <Link
          href="/search"
          className="navbar-search"
        >
          <Search
            size={18}
            strokeWidth={
              1.8
            }
          />

          <span>
            SEARCH
          </span>
        </Link>


        <span
          className="navbar-separator"
          aria-hidden="true"
        />


        {/* =================================================
            PROFILE
        ================================================= */}

        <div
          ref={
            profileRef
          }

          className="relative"
        >

          <button
            className="navbar-profile"
            type="button"

            aria-label={
              user
                ? `Open profile for ${user.fullName}`
                : "Open profile"
            }

            aria-expanded={
              profileOpen
            }

            onClick={() => {

              setProfileOpen(
                (previous) =>
                  !previous
              );

              setLanguageOpen(
                false
              );

            }}
          >

            <div className="navbar-profile-picture">

              {profileImage ? (

                <img
                  src={
                    profileImage
                  }

                  alt=""

                  className="h-full w-full rounded-full object-cover"

                  onError={(
                    event
                  ) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />

              ) : (

                <span>
                  {
                    user
                      ? initials
                      : "U"
                  }
                </span>

              )}

            </div>


            <span className="navbar-user-name">
              {
                displayName
              }
            </span>


            <ChevronDown
              size={15}
              strokeWidth={
                1.7
              }

              className={`
                navbar-profile-chevron
                transition-transform

                ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />

          </button>


          {/* PROFILE DROPDOWN */}

          {profileOpen && (

            <div
              className="
                absolute
                right-0
                top-[calc(100%+10px)]
                z-[5000]
                w-[210px]
                overflow-hidden
                rounded-xl
                border
                border-[#ded8cc]
                bg-white
                shadow-xl
              "
            >

              {user ? (

                <>

                  {/* USER INFO */}

                  <div
                    className="
                      border-b
                      border-[#ece7de]
                      px-4
                      py-3
                    "
                  >

                    <strong
                      className="
                        block
                        truncate
                        text-[13px]
                        font-medium
                        text-[#2f2b25]
                      "
                    >
                      {
                        user.fullName
                      }
                    </strong>


                    <span
                      className="
                        mt-0.5
                        block
                        truncate
                        text-[10px]
                        text-[#7b756b]
                      "
                    >
                      {
                        user.email
                      }
                    </span>

                  </div>


                  {/* MY ACCOUNT */}

                  <Link
                    href="/account"

                    onClick={() =>
                      setProfileOpen(
                        false
                      )
                    }

                    className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-[12px]
                      text-[#4c4942]

                      hover:bg-[#f6f3ec]
                    "
                  >
                    <User
                      size={15}
                    />

                    My Account
                  </Link>


                  {/* SETTINGS */}

                  <Link
                    href="/settings"

                    onClick={() =>
                      setProfileOpen(
                        false
                      )
                    }

                    className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-[12px]
                      text-[#4c4942]

                      hover:bg-[#f6f3ec]
                    "
                  >
                    <Settings
                      size={15}
                    />

                    Settings
                  </Link>


                  {/* HELP */}

                  <Link
                    href="/help"

                    onClick={() =>
                      setProfileOpen(
                        false
                      )
                    }

                    className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-[12px]
                      text-[#4c4942]

                      hover:bg-[#f6f3ec]
                    "
                  >
                    <CircleHelp
                      size={15}
                    />

                    Help
                  </Link>


                  <div className="border-t border-[#ece7de]" />


                  {/* LOGOUT */}

                  <button
                    type="button"

                    onClick={
                      handleSignOut
                    }

                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      text-[12px]
                      text-red-700

                      hover:bg-red-50
                    "
                  >
                    <LogOut
                      size={15}
                    />

                    Sign Out
                  </button>

                </>

              ) : (

                <Link
                  href="/login"

                  onClick={() =>
                    setProfileOpen(
                      false
                    )
                  }

                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-[12px]
                    text-[#4c4942]

                    hover:bg-[#f6f3ec]
                  "
                >
                  <LogIn
                    size={15}
                  />

                  Sign In
                </Link>

              )}

            </div>

          )}

        </div>


        {/* =================================================
            LANGUAGE
        ================================================= */}

        <div
          ref={
            languageRef
          }

          className="relative"
        >

          <button
            className="navbar-language"
            type="button"

            aria-expanded={
              languageOpen
            }

            onClick={() => {

              setLanguageOpen(
                (previous) =>
                  !previous
              );

              setProfileOpen(
                false
              );

            }}
          >

            <span>
              {
                currentLanguage.short
              }
            </span>


            <ChevronDown
              size={14}
              strokeWidth={
                1.7
              }

              className={
                languageOpen
                  ? "rotate-180 transition-transform"
                  : "transition-transform"
              }
            />

          </button>


          {/* LANGUAGE DROPDOWN */}

          {languageOpen && (

            <div
              className="
                absolute
                right-0
                top-[calc(100%+10px)]
                z-[5000]
                min-w-[130px]
                overflow-hidden
                rounded-xl
                border
                border-[#ded8cc]
                bg-white
                py-1
                shadow-xl
              "
            >

              {languageOptions.map(
                (
                  option
                ) => (

                  <button
                    key={
                      option.code
                    }

                    type="button"

                    onClick={() =>
                      changeLanguage(
                        option.code
                      )
                    }

                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-4
                      px-4
                      py-2.5
                      text-left
                      text-[12px]

                      hover:bg-[#f6f3ec]

                      ${
                        language ===
                        option.code
                          ? "font-medium text-[#56654a]"
                          : "text-[#4c4942]"
                      }
                    `}
                  >

                    <span>
                      {
                        option.label
                      }
                    </span>


                    <span
                      className="
                        text-[10px]
                        text-[#8a8479]
                      "
                    >
                      {
                        option.short
                      }
                    </span>

                  </button>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </header>
  );
}
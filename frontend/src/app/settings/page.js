"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";


/* =====================================================
   API
===================================================== */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";


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
    throw new Error(
      "AUTH_REQUIRED"
    );
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


function readAccount(
  payload
) {
  return (
    payload?.data?.account ||
    payload?.account ||
    null
  );
}


function readSettings(
  payload
) {
  return (
    payload?.data?.settings ||
    payload?.settings ||
    payload?.data ||
    {}
  );
}


function resolveImage(
  value
) {
  if (!value) {
    return "";
  }

  const source =
    String(value).trim();

  if (
    source.startsWith(
      "http://"
    ) ||
    source.startsWith(
      "https://"
    ) ||
    source.startsWith(
      "data:"
    ) ||
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


/* =====================================================
   ICONS
===================================================== */

function Icon({
  children,
  size = 16,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}


function IconGear(props) {
  return (
    <Icon {...props}>
      <circle
        cx="12"
        cy="12"
        r="3"
      />

      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Icon>
  );
}


function IconBell(props) {
  return (
    <Icon {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Icon>
  );
}


function IconLock(props) {
  return (
    <Icon {...props}>
      <rect
        x="3"
        y="11"
        width="18"
        height="11"
        rx="2"
        ry="2"
      />

      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icon>
  );
}


function IconGlobe(props) {
  return (
    <Icon {...props}>
      <circle
        cx="12"
        cy="12"
        r="10"
      />

      <line
        x1="2"
        y1="12"
        x2="22"
        y2="12"
      />

      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Icon>
  );
}


function IconUser(props) {
  return (
    <Icon {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />

      <circle
        cx="12"
        cy="7"
        r="4"
      />
    </Icon>
  );
}


function IconMap(props) {
  return (
    <Icon {...props}>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />

      <line
        x1="8"
        y1="2"
        x2="8"
        y2="18"
      />

      <line
        x1="16"
        y1="6"
        x2="16"
        y2="22"
      />
    </Icon>
  );
}


function IconEdit(props) {
  return (
    <Icon {...props}>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </Icon>
  );
}


function IconCamera(props) {
  return (
    <Icon {...props}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />

      <circle
        cx="12"
        cy="13"
        r="4"
      />
    </Icon>
  );
}


function IconChevronRight(props) {
  return (
    <Icon {...props}>
      <polyline points="9 18 15 12 9 6" />
    </Icon>
  );
}


function IconChevronDown(props) {
  return (
    <Icon {...props}>
      <polyline points="6 9 12 15 18 9" />
    </Icon>
  );
}


/* =====================================================
   GENERAL SETTINGS
===================================================== */

export default function GeneralSettings() {
  const router =
    useRouter();


  const [
    account,
    setAccount,
  ] =
    useState(null);


  const [
    appPreferences,
    setAppPreferences,
  ] =
    useState({
      nearby: true,
      autoplay: false,
      offline: true,
    });


  const [
    defaultView,
    setDefaultView,
  ] =
    useState("Map");


  const [
    notificationPreferences,
    setNotificationPreferences,
  ] =
    useState({
      newItineraries: true,
      stories: true,
      attractions: true,
      events: false,
      tips: true,
    });


  const [
    language,
    setLanguage,
  ] =
    useState("en");


  const [
    savingLanguage,
    setSavingLanguage,
  ] =
    useState(false);


  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    async function load() {

      try {
        const storedApp =
          JSON.parse(
            localStorage.getItem(
              "discover-app-preferences"
            ) || "{}"
          );

        setAppPreferences(
          (
            previous
          ) => ({
            ...previous,
            ...storedApp,
          })
        );
      } catch {
        // Ignore invalid old local data.
      }


      try {
        const storedNotifications =
          JSON.parse(
            localStorage.getItem(
              "discover-notification-preferences"
            ) || "{}"
          );

        setNotificationPreferences(
          (
            previous
          ) => ({
            ...previous,
            ...storedNotifications,
          })
        );
      } catch {
        // Ignore invalid old local data.
      }


      const savedView =
        localStorage.getItem(
          "discover-default-view"
        );

      if (savedView) {
        setDefaultView(
          savedView
        );
      }


      const savedLanguage =
        localStorage.getItem(
          "discover-lebanon-language"
        );

      if (savedLanguage) {
        setLanguage(
          savedLanguage
        );
      }


      if (!getToken()) {
        return;
      }


      try {
        const [
          accountResponse,
          settingsResponse,
        ] =
          await Promise.all([
            authFetch(
              "/api/account"
            ),

            authFetch(
              "/api/settings"
            ),
          ]);


        if (
          accountResponse.ok
        ) {
          const payload =
            await accountResponse.json();

          setAccount(
            readAccount(
              payload
            )
          );
        }


        if (
          settingsResponse.ok
        ) {
          const payload =
            await settingsResponse.json();

          const settings =
            readSettings(
              payload
            );

          if (
            settings.language
          ) {
            setLanguage(
              settings.language
            );

            localStorage.setItem(
              "discover-lebanon-language",
              settings.language
            );
          }
        }

      } catch {
        // Keep local settings if API is temporarily unavailable.
      }
    }


    load();
  }, []);


  /* =====================================================
     LOCAL APP SETTINGS
  ===================================================== */

  function toggleAppPreference(
    field
  ) {
    setAppPreferences(
      (
        previous
      ) => {
        const next = {
          ...previous,
          [field]:
            !previous[field],
        };

        localStorage.setItem(
          "discover-app-preferences",
          JSON.stringify(
            next
          )
        );

        return next;
      }
    );
  }


  function changeDefaultView(
    value
  ) {
    setDefaultView(
      value
    );

    localStorage.setItem(
      "discover-default-view",
      value
    );
  }


  function toggleNotification(
    field
  ) {
    setNotificationPreferences(
      (
        previous
      ) => {
        const next = {
          ...previous,
          [field]:
            !previous[field],
        };

        localStorage.setItem(
          "discover-notification-preferences",
          JSON.stringify(
            next
          )
        );

        return next;
      }
    );
  }


  /* =====================================================
     LANGUAGE
  ===================================================== */

  async function changeLanguage(
    value
  ) {
    setLanguage(
      value
    );

    localStorage.setItem(
      "discover-lebanon-language",
      value
    );

    document.documentElement.lang =
      value;


    if (!getToken()) {
      return;
    }


    setSavingLanguage(
      true
    );


    try {
      const response =
        await authFetch(
          "/api/settings",
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                language:
                  value,
              }),
          }
        );


      if (!response.ok) {
        throw new Error(
          "Unable to save language."
        );
      }

    } catch {
      alert(
        "The language was saved on this device, but the server setting could not be updated."
      );

    } finally {
      setSavingLanguage(
        false
      );
    }
  }


  /* =====================================================
     LOCATION
  ===================================================== */

  function manageLocation() {
    if (
      !navigator.geolocation
    ) {
      alert(
        "Location is not supported by this browser."
      );

      return;
    }


    navigator.geolocation.getCurrentPosition(
      () => {
        alert(
          "Location permission is enabled."
        );
      },

      () => {
        alert(
          "Location permission is blocked or unavailable. You can change it from your browser site permissions."
        );
      }
    );
  }


  /* =====================================================
     ACCOUNT
  ===================================================== */

  const profileImage =
    resolveImage(
      account?.profile_image
    );


  const initial =
    account?.full_name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";


  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <>
      <div className="section-header">

        <span>
          PREFERENCES
        </span>

        <h2>
          General Settings
        </h2>

        <p>
          Manage your preferences and app experience.
        </p>

      </div>


      <div className="settings-grid">

        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <div className="settings-column">

          {/* ACCOUNT */}

          <section className="settings-card">

            <div className="card-title-row">

              <IconUser
                size={18}
              />

              <h2>
                Account Information
              </h2>

            </div>


            <p className="card-description">
              Update your personal details.
            </p>


            <div className="profile">

              <div className="avatar-wrap">

                <div
                  className="avatar"
                  style={{
                    overflow:
                      "hidden",
                  }}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt=""
                      style={{
                        width:
                          "100%",
                        height:
                          "100%",
                        objectFit:
                          "cover",
                      }}
                    />
                  ) : (
                    initial
                  )}
                </div>


                <button
                  type="button"
                  className="avatar-camera"
                  aria-label="Change photo"
                  onClick={() =>
                    router.push(
                      "/account"
                    )
                  }
                >
                  <IconCamera
                    size={9}
                  />
                </button>

              </div>


              <div className="profile-info">

                <strong>
                  {account?.full_name ||
                    "User"}
                </strong>

                <span>
                  {account?.email ||
                    ""}
                </span>

                <span className="profile-location">
                  Discover Lebanon member
                </span>

              </div>


              <button
                type="button"
                className="edit-button"
                onClick={() =>
                  router.push(
                    "/account"
                  )
                }
              >
                <IconEdit
                  size={11}
                />

                Edit
              </button>

            </div>

          </section>


          {/* APP PREFERENCES */}

          <section className="settings-card">

            <div className="card-title-row">

              <IconGear
                size={18}
              />

              <h2>
                App Preferences
              </h2>

            </div>


            <p className="card-description">
              Tailor your experience.
            </p>


            <Toggle
              label="Show nearby recommendations"
              enabled={
                appPreferences.nearby
              }
              onClick={() =>
                toggleAppPreference(
                  "nearby"
                )
              }
            />


            <Toggle
              label="Auto-play videos"
              enabled={
                appPreferences.autoplay
              }
              onClick={() =>
                toggleAppPreference(
                  "autoplay"
                )
              }
            />


            <Toggle
              label="Download content for offline use"
              enabled={
                appPreferences.offline
              }
              onClick={() =>
                toggleAppPreference(
                  "offline"
                )
              }
            />

          </section>


          {/* DEFAULT VIEW */}

          <section className="settings-card">

            <div className="card-title-row">

              <IconMap
                size={18}
              />

              <h2>
                Default View
              </h2>

            </div>


            <p className="card-description">
              Choose what you see first when opening the app.
            </p>


            {[
              "Map",
              "Curated Itineraries",
              "Heritage Stories",
            ].map(
              (
                option
              ) => (
                <button
                  key={option}
                  type="button"
                  className="option"
                  onClick={() =>
                    changeDefaultView(
                      option
                    )
                  }
                >
                  <span
                    className={`radio ${
                      defaultView ===
                      option
                        ? "selected"
                        : ""
                    }`}
                  />

                  {option}
                </button>
              )
            )}

          </section>

        </div>


        {/* =================================================
            RIGHT COLUMN
        ================================================= */}

        <div className="settings-column">

          {/* NOTIFICATIONS */}

          <section className="settings-card">

            <div className="card-title-row">

              <IconBell
                size={18}
              />

              <h2>
                Notifications
              </h2>

            </div>


            <p className="card-description">
              Manage what you want to be notified about.
            </p>


            <Toggle
              label="New itineraries"
              enabled={
                notificationPreferences
                  .newItineraries
              }
              onClick={() =>
                toggleNotification(
                  "newItineraries"
                )
              }
            />


            <Toggle
              label="Heritage stories"
              enabled={
                notificationPreferences
                  .stories
              }
              onClick={() =>
                toggleNotification(
                  "stories"
                )
              }
            />


            <Toggle
              label="Nearby attractions"
              enabled={
                notificationPreferences
                  .attractions
              }
              onClick={() =>
                toggleNotification(
                  "attractions"
                )
              }
            />


            <Toggle
              label="Special events & festivals"
              enabled={
                notificationPreferences
                  .events
              }
              onClick={() =>
                toggleNotification(
                  "events"
                )
              }
            />


            <Toggle
              label="Tips and travel inspiration"
              enabled={
                notificationPreferences
                  .tips
              }
              onClick={() =>
                toggleNotification(
                  "tips"
                )
              }
            />

          </section>


          {/* PRIVACY */}

          <section className="settings-card">

            <div className="card-title-row">

              <IconLock
                size={18}
              />

              <h2>
                Privacy & Security
              </h2>

            </div>


            <p className="card-description">
              Control your data and privacy settings.
            </p>


            <button
              type="button"
              className="list-row"
              onClick={
                manageLocation
              }
            >
              Manage location permissions

              <IconChevronRight
                size={14}
              />
            </button>


            <button
              type="button"
              className="list-row"
              onClick={() =>
                router.push(
                  "/account"
                )
              }
            >
              Manage personal data

              <IconChevronRight
                size={14}
              />
            </button>


            <button
              type="button"
              className="list-row"
              onClick={() =>
                router.push(
                  "/forgot-password"
                )
              }
            >
              Change password

              <IconChevronRight
                size={14}
              />
            </button>


            <button
              type="button"
              className="list-row"
              onClick={() =>
                alert(
                  "Two-factor authentication is not implemented in the backend yet."
                )
              }
            >
              Two-factor authentication

              <span className="list-row-right">

                Off

                <IconChevronRight
                  size={14}
                />

              </span>
            </button>


            <button
              type="button"
              className="list-row danger"
              onClick={() =>
                alert(
                  "Account deletion is not implemented in the backend yet."
                )
              }
            >
              Delete my account

              <IconChevronRight
                size={14}
              />
            </button>

          </section>


          {/* LANGUAGE */}

          <section className="settings-card">

            <div className="card-title-row">

              <IconGlobe
                size={18}
              />

              <h2>
                Language
              </h2>

            </div>


            <p className="card-description">
              Choose your preferred language.
            </p>


            <div className="lang-select-wrap">

              <select
                className="lang-select"
                value={language}
                disabled={
                  savingLanguage
                }
                onChange={(
                  event
                ) =>
                  changeLanguage(
                    event.target
                      .value
                  )
                }
              >

                <option value="en">
                  English
                </option>

                <option value="ar">
                  Arabic
                </option>

                <option value="fr">
                  French
                </option>

              </select>


              <IconChevronDown
                size={12}
              />

            </div>

          </section>

        </div>

      </div>
    </>
  );
}


/* =====================================================
   TOGGLE
===================================================== */

function Toggle({
  label,
  enabled,
  onClick,
}) {
  return (
    <div className="setting-row">

      <span>
        {label}
      </span>

      <button
        type="button"
        className={`toggle ${
          enabled
            ? "on"
            : ""
        }`}
        onClick={onClick}
        aria-label={`Toggle ${label}`}
        aria-pressed={enabled}
      >
        <span />
      </button>

    </div>
  );
}
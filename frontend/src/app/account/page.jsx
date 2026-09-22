"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import "./account.css";

/* =====================================================
   DATA
===================================================== */

const initialAccount = {
  fullName: "Lara Khoury",
  email: "larakhoury@gmail.com",
  location: "Beirut, Lebanon",
  bio: "Exploring Lebanon's hidden gems, one story at a time.",
};

const savedPlaces = [
  {
    name: "Byblos Citadel",
    location: "Byblos",
    image: "/images/byblos-account.jpg",
  },
  {
    name: "Cedars of God",
    location: "Bsharri",
    image: "/images/ceders-account.jpg",
  },
  {
    name: "Raouché Rock",
    location: "Beirut",
    image: "/images/raouche.jpg",
  },
];

const initialPreferences = {
  natureOutdoors: true,
  culturalHeritage: true,
  foodGastronomy: false,
  familyFriendly: true,
  adventureActivities: false,
  festivalsEvents: true,
};

const tabs = [
  "Overview",
  "Saved Places",
  "My Itineraries",
  "Activity History",
  "Preferences",
];

/* =====================================================
   VALIDATION
===================================================== */

function validateProfile(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name can't be empty";
  }

  if (!values.email.trim()) {
    errors.email = "Email can't be empty";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  return errors;
}

/* =====================================================
   ICONS
===================================================== */

function Icon({ children, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function PinIcon(props) {
  return (
    <Icon {...props}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Icon>
  );
}

function BookmarkIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6 3h12v18l-6-4-6 4Z" />
    </Icon>
  );
}

function HeartIcon(props) {
  return (
    <Icon {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </Icon>
  );
}

function UserIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </Icon>
  );
}

function GridIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </Icon>
  );
}

function MapIcon(props) {
  return (
    <Icon {...props}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </Icon>
  );
}

function ClockIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  );
}

function GearIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 13.5v-3l-2-.7a7 7 0 0 0-.7-1.7l.9-1.9-2.1-2.1-1.9.9a7 7 0 0 0-1.7-.7L10.5 2h-3l-.7 2a7 7 0 0 0-1.7.7l-1.9-.9-2.1 2.1.9 1.9a7 7 0 0 0-.7 1.7l-2 .7v3l2 .7a7 7 0 0 0 .7 1.7l-.9 1.9 2.1 2.1 1.9-.9a7 7 0 0 0 1.7.7l.7 2h3l.7-2a7 7 0 0 0 1.7-.7l1.9.9 2.1-2.1-.9-1.9a7 7 0 0 0 .7-1.7Z" />
    </Icon>
  );
}

function CameraIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 7h3l2-3h6l2 3h3v13H4Z" />
      <circle cx="12" cy="13" r="4" />
    </Icon>
  );
}

function EditIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </Icon>
  );
}

/* =====================================================
   PAGE
===================================================== */

export default function MyAccountPage() {
  const [values, setValues] = useState(initialAccount);
  const [draft, setDraft] = useState(initialAccount);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [preferences, setPreferences] = useState(initialPreferences);
  const [saved, setSaved] = useState(false);

  const handleEditClick = () => {
    setDraft(values);
    setErrors({});
    setSaved(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(values);
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (field) => (event) => {
    setDraft((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    const validationErrors = validateProfile(draft);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setValues(draft);
      setIsEditing(false);
      setSaved(true);
    }
  };

  const togglePreference = (key) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <AppShell>
      <main className="account-page">

        {/* HERO */}

        <section className="account-hero">
          <div className="account-hero-overlay" />

          <div className="account-hero-content">
            <h1>My Account</h1>
            <p>
              Manage your profile, preferences and saved experiences.
            </p>
          </div>

          <div className="account-hero-note">
            Same places,
            <br />
            different stories.
          </div>
        </section>

        <div className="account-content">

          {/* PROFILE */}

          <section className="account-profile-grid">

            <div className="account-profile-card">

              <div className="account-avatar-wrap">
                <img
                  src="/images/profile.jpg"
                  alt="Lara Khoury"
                  className="account-avatar"
                />

                <button
                  type="button"
                  className="account-camera"
                  aria-label="Change profile photo"
                >
                  <CameraIcon size={15} />
                </button>
              </div>

              <div className="account-profile-info">
                <h2>{values.fullName}</h2>

                <p>{values.email}</p>

                <p className="account-location">
                  <PinIcon size={14} />
                  {values.location}
                </p>

                <p className="account-bio">
                  {values.bio}
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  className="account-edit-button"
                  onClick={handleEditClick}
                >
                  <EditIcon size={14} />
                  Edit Profile
                </button>
              )}

            </div>

            {/* STATS */}

            <div className="account-stats-card">

              <div className="account-member">
                <span className="member-leaf">⌁</span>

                <div>
                  <strong>Member since</strong>
                  <span>September 2025</span>
                </div>
              </div>

              <div className="account-stats">

                <div className="account-stat">
                  <PinIcon size={21} />
                  <strong>12</strong>
                  <span>Places Visited</span>
                </div>

                <div className="account-stat">
                  <BookmarkIcon size={21} />
                  <strong>8</strong>
                  <span>Saved Places</span>
                </div>

                <div className="account-stat">
                  <HeartIcon size={21} />
                  <strong>4</strong>
                  <span>Itineraries Completed</span>
                </div>

              </div>

            </div>

          </section>

          {/* SUCCESS */}

          {saved && (
            <div className="account-success">
              Your profile changes have been saved.
            </div>
          )}

          {/* EDIT PROFILE */}

          {isEditing && (
            <section className="account-panel account-edit-panel">

              <h3>Edit Profile</h3>

              <form onSubmit={handleSave} noValidate>

                <div className="account-field">
                  <label htmlFor="fullName">
                    Full name
                  </label>

                  <input
                    id="fullName"
                    value={draft.fullName}
                    onChange={handleChange("fullName")}
                    className={errors.fullName ? "has-error" : ""}
                  />

                  {errors.fullName && (
                    <span className="account-error">
                      {errors.fullName}
                    </span>
                  )}
                </div>

                <div className="account-field">
                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={draft.email}
                    onChange={handleChange("email")}
                    className={errors.email ? "has-error" : ""}
                  />

                  {errors.email && (
                    <span className="account-error">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="account-field">
                  <label htmlFor="location">
                    Location
                  </label>

                  <input
                    id="location"
                    value={draft.location}
                    onChange={handleChange("location")}
                  />
                </div>

                <div className="account-field">
                  <label htmlFor="bio">
                    Bio
                  </label>

                  <input
                    id="bio"
                    value={draft.bio}
                    onChange={handleChange("bio")}
                  />
                </div>

                <div className="account-form-actions">

                  <button
                    type="button"
                    className="account-secondary-button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="account-primary-button"
                  >
                    Save changes
                  </button>

                </div>

              </form>

            </section>
          )}

          {/* =====================================================
              TABS
          ===================================================== */}

          <nav className="account-tabs">

            {tabs.map((tab, index) => {
              const icons = [
                GridIcon,
                BookmarkIcon,
                MapIcon,
                ClockIcon,
                GearIcon,
              ];

              const TabIcon = icons[index];

              return (
                <button
                  key={tab}
                  type="button"
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  <TabIcon size={18} />
                  <span>{tab}</span>
                </button>
              );
            })}

          </nav>

          {/* =====================================================
              OVERVIEW
          ===================================================== */}

          {activeTab === "Overview" && (
            <div className="account-overview">

              <div className="account-left-column">

                {/* RECENTLY SAVED */}

                <section className="account-section">

                  <div className="account-section-heading">

                    <h3>Recently Saved</h3>

                    <button
                      type="button"
                      className="account-view-all-button"
                      onClick={() => setActiveTab("Saved Places")}
                    >
                      View All →
                    </button>

                  </div>

                  <div className="saved-places-grid">

                    {savedPlaces.map((place) => (
                      <article
                        className="saved-place-card"
                        key={place.name}
                      >

                        <div className="saved-place-image-wrap">

                          <img
                            src={place.image}
                            alt={place.name}
                            className="saved-place-image"
                          />

                          <BookmarkIcon size={16} />

                        </div>

                        <div className="saved-place-info">

                          <strong>
                            {place.name}
                          </strong>

                          <span>
                            <PinIcon size={11} />
                            {place.location}
                          </span>

                        </div>

                      </article>
                    ))}

                  </div>

                </section>

                {/* OVERVIEW PREFERENCES */}

                <section className="account-panel account-preferences">

                  <h3>Preferences</h3>

                  <div className="account-preferences-grid">

                    {[
                      ["natureOutdoors", "Nature & Outdoors"],
                      ["familyFriendly", "Family Friendly"],
                      ["culturalHeritage", "Cultural Heritage"],
                      ["adventureActivities", "Adventure Activities"],
                      ["foodGastronomy", "Food & Gastronomy"],
                      ["festivalsEvents", "Festivals & Events"],
                    ].map(([key, label]) => (

                      <div
                        className="account-preference-row"
                        key={key}
                      >

                        <span>{label}</span>

                        <button
                          type="button"
                          className={`account-switch ${
                            preferences[key] ? "on" : ""
                          }`}
                          onClick={() => togglePreference(key)}
                          aria-label={`Toggle ${label}`}
                        >
                          <span />
                        </button>

                      </div>

                    ))}

                  </div>

                </section>

              </div>

              {/* RIGHT COLUMN */}

              <div className="account-right-column">

                {/* UPCOMING */}

                <section className="account-section">

                  <div className="account-section-heading">

                    <h3>My Upcoming Itineraries</h3>

                    <button
                      type="button"
                      className="account-view-all-button"
                      onClick={() => setActiveTab("My Itineraries")}
                    >
                      View All →
                    </button>

                  </div>

                  <article className="upcoming-itinerary">

                    <img
                      src="/images/chouf.jpg"
                      alt="Chouf landscape"
                    />

                    <div className="upcoming-itinerary-info">

                      <strong>
                        A Day in the Chouf
                      </strong>

                      <span>
                        Sat, Oct 4, 2025
                      </span>

                      <span>Chouf</span>

                      <span>
                        Nature, Culture, Food
                      </span>

                    </div>

                    <button
                      type="button"
                      className="itinerary-arrow"
                      onClick={() =>
                        setActiveTab("My Itineraries")
                      }
                      aria-label="Open itinerary"
                    >
                      →
                    </button>

                  </article>

                </section>

                {/* ACCOUNT SETTINGS */}

                <section className="account-panel account-settings">

                  <h3>Account Settings</h3>

                  <div className="account-settings-list">

                    <Link href="/settings">

                      <span>
                        <UserIcon size={16} />
                        Personal Information
                      </span>

                      <b>›</b>

                    </Link>

                    <Link href="/settings/privacy-security">

                      <span>
                        Change Password
                      </span>

                      <b>›</b>

                    </Link>

                    <Link href="/settings/notifications">

                      <span>
                        Notifications
                      </span>

                      <b>›</b>

                    </Link>

                    <Link href="/settings/language">

                      <span>
                        Language
                      </span>

                      <span className="setting-value">
                        English
                        <b>›</b>
                      </span>

                    </Link>

                    <button
                      type="button"
                      className="account-sign-out"
                    >
                      Sign Out
                    </button>

                  </div>

                </section>

              </div>

            </div>
          )}

          {/* =====================================================
              SAVED PLACES
          ===================================================== */}

          {activeTab === "Saved Places" && (
            <section className="account-tab-content">

              <div className="account-tab-heading">

                <div>

                  <span className="account-tab-eyebrow">
                    YOUR COLLECTION
                  </span>

                  <h2>Saved Places</h2>

                  <p>
                    Places you've saved to explore later.
                  </p>

                </div>

                <span className="saved-count">
                  {savedPlaces.length} saved places
                </span>

              </div>

              <div className="saved-tab-grid">

                {savedPlaces.map((place) => (

                  <article
                    className="saved-tab-card"
                    key={place.name}
                  >

                    <div className="saved-tab-image-wrap">

                      <img
                        src={place.image}
                        alt={place.name}
                        className="saved-tab-image"
                      />

                      <button
                        type="button"
                        className="saved-tab-bookmark"
                        aria-label={`Remove ${place.name} from saved places`}
                      >
                        <BookmarkIcon size={17} />
                      </button>

                    </div>

                    <div className="saved-tab-card-content">

                      <div>

                        <h3>
                          {place.name}
                        </h3>

                        <span className="saved-tab-location">
                          <PinIcon size={12} />
                          {place.location}
                        </span>

                      </div>

                      <Link
                        href="/map"
                        className="saved-tab-explore"
                      >
                        Explore →
                      </Link>

                    </div>

                  </article>

                ))}

              </div>

            </section>
          )}

          {/* =====================================================
              MY ITINERARIES
          ===================================================== */}

          {activeTab === "My Itineraries" && (
            <section className="account-tab-content">

              <div className="account-tab-heading">

                <div>

                  <span className="account-tab-eyebrow">
                    YOUR JOURNEYS
                  </span>

                  <h2>My Itineraries</h2>

                  <p>
                    Keep track of your upcoming and completed adventures.
                  </p>

                </div>

                <Link
                  href="/itineraries"
                  className="account-create-itinerary"
                >
                  + Explore Itineraries
                </Link>

              </div>

              <div className="my-itineraries-grid">

                {/* CHOUF */}

                <article className="my-itinerary-card">

                  <img
                    src="/images/chouf.jpg"
                    alt="Chouf landscape"
                    className="my-itinerary-image"
                  />

                  <div className="my-itinerary-content">

                    <div className="my-itinerary-top">

                      <span className="itinerary-status upcoming">
                        UPCOMING
                      </span>

                      <span className="itinerary-date">
                        Sat, Oct 4, 2025
                      </span>

                    </div>

                    <h3>
                      A Day in the Chouf
                    </h3>

                    <p className="my-itinerary-location">
                      <PinIcon size={12} />
                      Chouf, Lebanon
                    </p>

                    <p className="my-itinerary-description">
                      A day surrounded by nature, culture and
                      authentic Lebanese food.
                    </p>

                    <div className="my-itinerary-tags">
                      <span>Nature</span>
                      <span>Culture</span>
                      <span>Food</span>
                    </div>

                    <Link
                      href="/itineraries"
                      className="my-itinerary-link"
                    >
                      View Itinerary →
                    </Link>

                  </div>

                </article>

                {/* BYBLOS */}

                <article className="my-itinerary-card">

                  <img
                    src="/images/byblos-account.jpg"
                    alt="Byblos"
                    className="my-itinerary-image"
                  />

                  <div className="my-itinerary-content">

                    <div className="my-itinerary-top">

                      <span className="itinerary-status completed">
                        COMPLETED
                      </span>

                      <span className="itinerary-date">
                        Sun, Sep 14, 2025
                      </span>

                    </div>

                    <h3>
                      Historic Byblos
                    </h3>

                    <p className="my-itinerary-location">
                      <PinIcon size={12} />
                      Byblos, Lebanon
                    </p>

                    <p className="my-itinerary-description">
                      Discover ancient ruins, traditional streets
                      and the historic Mediterranean coast.
                    </p>

                    <div className="my-itinerary-tags">
                      <span>Heritage</span>
                      <span>History</span>
                      <span>Culture</span>
                    </div>

                    <Link
                      href="/itineraries"
                      className="my-itinerary-link"
                    >
                      View Itinerary →
                    </Link>

                  </div>

                </article>

              </div>

            </section>
          )}

          {/* =====================================================
              ACTIVITY HISTORY
          ===================================================== */}

          {activeTab === "Activity History" && (
            <section className="account-tab-content">

              <div className="account-tab-heading">

                <div>

                  <span className="account-tab-eyebrow">
                    YOUR JOURNEY
                  </span>

                  <h2>Activity History</h2>

                  <p>
                    A look back at the places, stories and
                    experiences you've explored.
                  </p>

                </div>

              </div>

              <div className="activity-history-list">

                {/* ACTIVITY 1 */}

                <div className="activity-history-item">

                  <div className="activity-history-icon">
                    <PinIcon size={17} />
                  </div>

                  <div className="activity-history-content">

                    <div>
                      <strong>
                        Visited Byblos Citadel
                      </strong>

                      <span>
                        Byblos, Lebanon
                      </span>
                    </div>

                    <span className="activity-history-date">
                      Sep 14, 2025
                    </span>

                  </div>

                </div>

                {/* ACTIVITY 2 */}

                <div className="activity-history-item">

                  <div className="activity-history-icon">
                    <BookmarkIcon size={17} />
                  </div>

                  <div className="activity-history-content">

                    <div>
                      <strong>
                        Saved Cedars of God
                      </strong>

                      <span>
                        Bsharri, Lebanon
                      </span>
                    </div>

                    <span className="activity-history-date">
                      Sep 10, 2025
                    </span>

                  </div>

                </div>

                {/* ACTIVITY 3 */}

                <div className="activity-history-item">

                  <div className="activity-history-icon">
                    <MapIcon size={17} />
                  </div>

                  <div className="activity-history-content">

                    <div>
                      <strong>
                        Completed Historic Byblos
                      </strong>

                      <span>
                        Itinerary completed
                      </span>
                    </div>

                    <span className="activity-history-date">
                      Sep 8, 2025
                    </span>

                  </div>

                </div>

                {/* ACTIVITY 4 */}

                <div className="activity-history-item">

                  <div className="activity-history-icon">
                    <BookmarkIcon size={17} />
                  </div>

                  <div className="activity-history-content">

                    <div>
                      <strong>
                        Saved Raouché Rock
                      </strong>

                      <span>
                        Beirut, Lebanon
                      </span>
                    </div>

                    <span className="activity-history-date">
                      Sep 2, 2025
                    </span>

                  </div>

                </div>

              </div>

            </section>
          )}

          {/* =====================================================
              PREFERENCES
          ===================================================== */}

          {activeTab === "Preferences" && (
            <section className="account-tab-content">

              <div className="account-tab-heading">

                <div>

                  <span className="account-tab-eyebrow">
                    PERSONALIZE YOUR EXPERIENCE
                  </span>

                  <h2>Preferences</h2>

                  <p>
                    Choose what interests you most while exploring Lebanon.
                  </p>

                </div>

              </div>

              <div className="preferences-tab-card">

                {[
                  {
                    key: "natureOutdoors",
                    title: "Nature & Outdoors",
                    description:
                      "Mountains, forests, hiking trails and natural landscapes.",
                  },
                  {
                    key: "culturalHeritage",
                    title: "Cultural Heritage",
                    description:
                      "Historic sites, traditions and Lebanon's cultural heritage.",
                  },
                  {
                    key: "foodGastronomy",
                    title: "Food & Gastronomy",
                    description:
                      "Local cuisine, traditional food and culinary experiences.",
                  },
                  {
                    key: "familyFriendly",
                    title: "Family Friendly",
                    description:
                      "Places and activities suitable for the whole family.",
                  },
                  {
                    key: "adventureActivities",
                    title: "Adventure Activities",
                    description:
                      "Outdoor adventures and exciting experiences.",
                  },
                  {
                    key: "festivalsEvents",
                    title: "Festivals & Events",
                    description:
                      "Local festivals, cultural events and seasonal celebrations.",
                  },
                ].map((item) => (

                  <div
                    className="preferences-tab-row"
                    key={item.key}
                  >

                    <div className="preferences-tab-text">

                      <strong>
                        {item.title}
                      </strong>

                      <span>
                        {item.description}
                      </span>

                    </div>

                    <button
                      type="button"
                      className={`account-switch ${
                        preferences[item.key] ? "on" : ""
                      }`}
                      onClick={() =>
                        togglePreference(item.key)
                      }
                      aria-label={`Toggle ${item.title}`}
                    >
                      <span />
                    </button>

                  </div>

                ))}

              </div>

            </section>
          )}

        </div>

      </main>
    </AppShell>
  );
}
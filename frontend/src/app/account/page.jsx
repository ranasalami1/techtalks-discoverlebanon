"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * My Account Page — Discover Lebanon
 * Rebuilt to match the provided dashboard design: left sidebar nav,
 * cover-photo header, profile card with avatar, stats, tabs, saved
 * places, upcoming itineraries, preferences toggles, account settings.
 *
 * IMPORTANT: The cover photo and place thumbnails below are illustrated
 * placeholders. Swap the relevant background-image / <img> sources for
 * your real photo assets once available.
 */

const initialAccount = {
  fullName: "Lara Khoury",
  email: "larakhoury@gmail.com",
  location: "Beirut, Lebanon",
  bio: "Exploring Lebanon's hidden gems, one story at a time.",
};

const savedPlaces = [
  { name: "Byblos Citadel", location: "Byblos" },
  { name: "Cedars of God", location: "Bsharri" },
  { name: "Raouche Rock", location: "Beirut" },
];

const initialPreferences = {
  natureOutdoors: true,
  culturalHeritage: true,
  foodGastronomy: false,
  familyFriendly: true,
  adventureActivities: false,
  festivalsEvents: true,
};

const sidebarLinks = [
  { label: "Explore the Map", href: "/explore" },
  { label: "Curated Itineraries", href: "/itineraries" },
  { label: "Heritage Stories", href: "/stories" },
  { label: "Saved Places", href: "/saved" },
  { label: "My Account", href: "/account", active: true },
  { label: "Settings", href: "/settings" },
  { label: "Help", href: "/help" },
];

const tabs = ["Overview", "Saved Places", "My Itineraries", "Activity History", "Preferences"];

function validateProfile(values) {
  const errors = {};
  if (!values.fullName.trim()) errors.fullName = "Full name can't be empty";
  if (!values.email.trim()) {
    errors.email = "Email can't be empty";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }
  return errors;
}

export default function MyAccountPage() {
  const [values, setValues] = useState(initialAccount);
  const [draft, setDraft] = useState(initialAccount);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [preferences, setPreferences] = useState(initialPreferences);
  const [saved, setSaved] = useState(false);

  const initials = values.fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

  const handleChange = (field) => (e) => {
    setDraft((d) => ({ ...d, [field]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const validationErrors = validateProfile(draft);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setValues(draft);
      setIsEditing(false);
      setSaved(true);
      // TODO: send updated profile to backend here once available
    }
  };

  const togglePreference = (key) => {
    setPreferences((p) => ({ ...p, [key]: !p[key] }));
    // TODO: persist preference changes to backend here once available
  };

  return (
    <div className="dashboard">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&family=Caveat:wght@500;600&display=swap');

        * { box-sizing: border-box; }

        .dashboard {
          display: grid;
          grid-template-columns: 230px 1fr;
          min-height: 100vh;
          font-family: 'Work Sans', sans-serif;
          color: #2B2620;
          background: #FBF8F2;
        }

        .sidebar {
          background: #FBF8F2;
          border-right: 1px solid #E9E1CF;
          padding: 24px 20px;
        }

        .sidebar__brand-ar {
          font-size: 17px;
          color: #B98A46;
          font-weight: 600;
          margin: 0;
        }

        .sidebar__brand-en {
          font-family: 'Fraunces', serif;
          font-size: 16px;
          font-weight: 600;
          margin: 2px 0 0;
        }

        .sidebar__brand-sub {
          font-size: 10px;
          color: #6B6355;
          margin: 2px 0 24px;
        }

        .sidebar__nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar__nav a {
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13.5px;
          color: #2B2620;
          text-decoration: none;
        }

        .sidebar__nav a:hover {
          background: #F0EADA;
        }

        .sidebar__nav a.active {
          background: #5C6B4A;
          color: #FFFFFF;
          font-weight: 600;
        }

        .sidebar__tagline {
          margin-top: 32px;
          font-family: 'Caveat', cursive;
          font-size: 20px;
          color: #6B6355;
          line-height: 1.2;
        }

        .main {
          padding: 0 40px 60px;
          max-width: 1100px;
        }

        .cover {
          position: relative;
          height: 150px;
          border-radius: 0 0 16px 16px;
          margin: 0 -40px;
          background-image:
            linear-gradient(180deg, rgba(20,28,20,0.15) 0%, rgba(20,28,20,0.45) 100%),
            url('/images/byblos-hero.jpg');
          background-size: cover;
          background-position: center;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 40px;
        }

        .cover h1 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 26px;
          color: #FFFFFF;
          margin: 0 0 4px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.25);
        }

        .cover p.subtitle {
          font-size: 13px;
          color: #F5F1E6;
          margin: 0;
          text-shadow: 0 1px 6px rgba(0,0,0,0.25);
        }

        .cover .cover-tagline {
          position: absolute;
          right: 32px;
          top: 20px;
          font-family: 'Caveat', cursive;
          font-size: 18px;
          color: #FFFFFF;
          text-align: right;
          text-shadow: 0 1px 6px rgba(0,0,0,0.25);
        }

        .profile-row {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          margin-top: -44px;
          position: relative;
          z-index: 2;
          flex-wrap: wrap;
        }

        .avatar-circle {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          border: 4px solid #FBF8F2;
          background: #5C6B4A;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fraunces', serif;
          font-size: 28px;
          flex-shrink: 0;
        }

        .profile-card {
          flex: 1;
          background: #FFFFFF;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 6px 24px rgba(30,30,20,0.06);
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          min-width: 260px;
        }

        .profile-card__info h2 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 19px;
          margin: 0 0 2px;
        }

        .profile-card__info p {
          margin: 2px 0 0;
          font-size: 12.5px;
          color: #6B6355;
        }

        .edit-btn {
          margin-left: auto;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1.5px solid #DDD3BE;
          background: #FFFFFF;
          font-size: 12.5px;
          font-weight: 600;
          color: #2B2620;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .edit-btn:hover {
          background: #FAF6EC;
        }

        .stats-card {
          background: #FFFFFF;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 6px 24px rgba(30,30,20,0.06);
          display: flex;
          gap: 24px;
          align-items: center;
          flex-wrap: wrap;
        }

        .stats-card__member {
          font-size: 11.5px;
          color: #6B6355;
          border-right: 1px solid #E9E1CF;
          padding-right: 20px;
        }

        .stats-card__member strong {
          display: block;
          font-size: 13px;
          color: #2B2620;
        }

        .stat {
          text-align: center;
        }

        .stat strong {
          display: block;
          font-family: 'Fraunces', serif;
          font-size: 20px;
        }

        .stat span {
          font-size: 10.5px;
          color: #6B6355;
        }

        .success-banner {
          background: #E9F0E6;
          border: 1.5px solid #A8C39B;
          color: #33502C;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          margin-top: 24px;
        }

        .tabs {
          display: flex;
          gap: 6px;
          margin-top: 28px;
          border-bottom: 1px solid #E9E1CF;
          flex-wrap: wrap;
        }

        .tabs button {
          padding: 10px 16px;
          border: none;
          background: none;
          font-size: 13px;
          font-weight: 500;
          color: #6B6355;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }

        .tabs button.active {
          color: #2B2620;
          font-weight: 600;
          border-bottom: 2px solid #5C6B4A;
        }

        .panels-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 20px;
          margin-top: 22px;
        }

        .panel {
          background: #FFFFFF;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 6px 24px rgba(30,30,20,0.06);
        }

        .panel__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .panel__header h3 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 16px;
          margin: 0;
        }

        .panel__header a {
          font-size: 12px;
          color: #5C6B4A;
          text-decoration: none;
          font-weight: 600;
        }

        .places-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .place-card__thumb {
          height: 70px;
          border-radius: 8px;
          background: linear-gradient(135deg, #CFE0DA, #E7DCC2);
          margin-bottom: 8px;
        }

        .place-card p {
          margin: 0;
          font-size: 12px;
          font-weight: 600;
        }

        .place-card span {
          font-size: 10.5px;
          color: #6B6355;
        }

        .itinerary-card {
          display: flex;
          gap: 12px;
        }

        .itinerary-card__thumb {
          width: 70px;
          height: 70px;
          border-radius: 8px;
          background: linear-gradient(135deg, #E7DCC2, #CFE0DA);
          flex-shrink: 0;
        }

        .itinerary-card p {
          margin: 0 0 4px;
          font-weight: 600;
          font-size: 13px;
        }

        .itinerary-card span {
          display: block;
          font-size: 11.5px;
          color: #6B6355;
        }

        .preferences-panel {
          margin-top: 20px;
        }

        .pref-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 24px;
        }

        .pref-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          padding: 6px 0;
        }

        .switch {
          width: 36px;
          height: 20px;
          border-radius: 999px;
          background: #E3DAC5;
          border: none;
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
        }

        .switch.on {
          background: #5C6B4A;
        }

        .switch__knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #FFFFFF;
          transition: left 0.15s ease;
        }

        .switch.on .switch__knob {
          left: 18px;
        }

        .settings-panel {
          margin-top: 20px;
        }

        .settings-list {
          display: flex;
          flex-direction: column;
        }

        .settings-list a,
        .settings-list button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #F0EADA;
          font-size: 13px;
          color: #2B2620;
          text-decoration: none;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .settings-list a:last-child,
        .settings-list button:last-child {
          border-bottom: none;
        }

        .settings-list .sign-out {
          color: #B3492C;
          font-weight: 600;
        }

        .field {
          margin-bottom: 14px;
        }

        .field label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #6B6355;
          margin-bottom: 5px;
        }

        .field input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1.5px solid #E3DAC5;
          background: #FBFAF6;
          font-size: 13.5px;
          font-family: 'Work Sans', sans-serif;
          color: #2B2620;
        }

        .field input:focus {
          outline: none;
          border-color: #5C6B4A;
        }

        .field input.has-error {
          border-color: #B3492C;
        }

        .field .error-text {
          margin-top: 5px;
          font-size: 11.5px;
          color: #B3492C;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 16px;
        }

        .btn-secondary {
          padding: 9px 18px;
          border-radius: 999px;
          border: 1.5px solid #DDD3BE;
          background: #FFFFFF;
          font-size: 12.5px;
          font-weight: 600;
          color: #2B2620;
          cursor: pointer;
        }

        .btn-primary-sm {
          padding: 9px 18px;
          border-radius: 999px;
          border: none;
          background: #5C6B4A;
          color: #FFFFFF;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .dashboard { grid-template-columns: 1fr; }
          .sidebar { display: none; }
          .main { padding: 0 20px 40px; }
          .cover { margin: 0 -20px; }
          .panels-grid { grid-template-columns: 1fr; }
          .places-grid { grid-template-columns: 1fr 1fr; }
          .stats-card { justify-content: space-between; }
        }
      `}</style>

      <aside className="sidebar">
        <p className="sidebar__brand-ar">اكتشف لبنان</p>
        <p className="sidebar__brand-en">DISCOVER LEBANON</p>
        <p className="sidebar__brand-sub">Interactive Heritage &amp; Activity Guide</p>
        <nav className="sidebar__nav">
          {sidebarLinks.map((link) => (
            <Link key={link.label} href={link.href} className={link.active ? "active" : ""}>
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="sidebar__tagline">A deeper<br />way to explore</p>
      </aside>

      <main className="main">
        <div className="cover">
          <span className="cover-tagline">Same places,<br />different stories</span>
          <h1>My Account</h1>
          <p className="subtitle">Manage your profile, preferences and saved experiences.</p>
        </div>

        <div className="profile-row">
          <div className="avatar-circle">{initials}</div>

          <div className="profile-card">
            <div className="profile-card__info">
              <h2>{values.fullName}</h2>
              <p>{values.email}</p>
              <p>{values.location} - {values.bio}</p>
            </div>
            {!isEditing && (
              <button type="button" className="edit-btn" onClick={handleEditClick}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>

          <div className="stats-card">
            <div className="stats-card__member">
              Member since<br /><strong>September 2025</strong>
            </div>
            <div className="stat"><strong>12</strong><span>Places Visited</span></div>
            <div className="stat"><strong>8</strong><span>Saved Places</span></div>
            <div className="stat"><strong>4</strong><span>Itineraries Completed</span></div>
          </div>
        </div>

        {saved && <div className="success-banner">Your profile changes have been saved.</div>}

        {isEditing && (
          <div className="panel" style={{ marginTop: 20 }}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 16, margin: "0 0 14px" }}>
              Edit Profile
            </h3>
            <form onSubmit={handleSave} noValidate>
              <div className="field">
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  type="text"
                  value={draft.fullName}
                  onChange={handleChange("fullName")}
                  className={errors.fullName ? "has-error" : ""}
                />
                {errors.fullName && <div className="error-text">{errors.fullName}</div>}
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={draft.email}
                  onChange={handleChange("email")}
                  className={errors.email ? "has-error" : ""}
                />
                {errors.email && <div className="error-text">{errors.email}</div>}
              </div>
              <div className="field">
                <label htmlFor="location">Location</label>
                <input id="location" type="text" value={draft.location} onChange={handleChange("location")} />
              </div>
              <div className="field">
                <label htmlFor="bio">Bio</label>
                <input id="bio" type="text" value={draft.bio} onChange={handleChange("bio")} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="btn-primary-sm">Save changes</button>
              </div>
            </form>
          </div>
        )}

        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Overview" && (
          <>
            <div className="panels-grid">
              <div className="panel">
                <div className="panel__header">
                  <h3>Recently Saved</h3>
                  <Link href="/saved">View All &#8594;</Link>
                </div>
                <div className="places-grid">
                  {savedPlaces.map((place) => (
                    <div className="place-card" key={place.name}>
                      <div className="place-card__thumb" />
                      <p>{place.name}</p>
                      <span>{place.location}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel__header">
                  <h3>My Upcoming Itineraries</h3>
                  <Link href="/itineraries">View All &#8594;</Link>
                </div>
                <div className="itinerary-card">
                  <div className="itinerary-card__thumb" />
                  <div>
                    <p>A Day in the Chouf</p>
                    <span>Sat, Oct 4, 2025</span>
                    <span>Chouf - Nature, Culture, Food</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel preferences-panel">
              <div className="panel__header">
                <h3>Preferences</h3>
              </div>
              <div className="pref-grid">
                {[
                  ["natureOutdoors", "Nature & Outdoors"],
                  ["familyFriendly", "Family Friendly"],
                  ["culturalHeritage", "Cultural Heritage"],
                  ["adventureActivities", "Adventure Activities"],
                  ["foodGastronomy", "Food & Gastronomy"],
                  ["festivalsEvents", "Festivals & Events"],
                ].map(([key, label]) => (
                  <div className="pref-row" key={key}>
                    <span>{label}</span>
                    <button
                      type="button"
                      className={`switch ${preferences[key] ? "on" : ""}`}
                      onClick={() => togglePreference(key)}
                      aria-label={`Toggle ${label}`}
                    >
                      <span className="switch__knob" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel settings-panel">
              <div className="panel__header">
                <h3>Account Settings</h3>
              </div>
              <div className="settings-list">
                <Link href="/account/personal-info">Personal Information &#8250;</Link>
                <Link href="/account/change-password">Change Password &#8250;</Link>
                <Link href="/account/notifications">Notifications &#8250;</Link>
                <Link href="/account/language">Language: English &#8250;</Link>
                <button type="button" className="sign-out">Sign Out</button>
              </div>
            </div>
          </>
        )}

        {activeTab !== "Overview" && (
          <div className="panel" style={{ marginTop: 22 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#6B6355" }}>
              {activeTab} content goes here - build this out the same way as Overview once the backend/data for it is ready.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

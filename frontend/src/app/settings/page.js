"use client";

import { useState } from "react";

function Icon({ children, size = 16 }) {
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
    >
      {children}
    </svg>
  );
}

function IconGear(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3" />
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icon>
  );
}

function IconGlobe(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Icon>
  );
}

function IconUser(props) {
  return (
    <Icon {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Icon>
  );
}

function IconMap(props) {
  return (
    <Icon {...props}>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
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
      <circle cx="12" cy="13" r="4" />
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

function IconMapPin(props) {
  return (
    <Icon {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  );
}

export default function GeneralSettings() {
  return (
    <>
      <div className="section-header">
        <span>PREFERENCES</span>
        <h2>General Settings</h2>
        <p>Manage your preferences and app experience.</p>
      </div>

      <div className="settings-grid">
        <div className="settings-column">
          <AccountCard />
          <PreferencesCard />
          <DefaultViewCard />
        </div>

        <div className="settings-column">
          <NotificationsCard />
          <PrivacySecurityCard />
          <LanguageCard />
        </div>
      </div>
    </>
  );
}

function AccountCard() {
  return (
    <section className="settings-card">
      <div className="card-title-row">
        <IconUser size={18} />
        <h2>Account Information</h2>
      </div>
      <p className="card-description">Update your personal details.</p>

      <div className="profile">
        <div className="avatar-wrap">
          <div className="avatar">U</div>
          <button className="avatar-camera" aria-label="Change photo">
            <IconCamera size={9} />
          </button>
        </div>

        <div className="profile-info">
          <strong>Your Name</strong>
          <span>your@email.com</span>
          <span className="profile-location">
            <IconMapPin size={10} />
            Your City, Country
          </span>
        </div>

        <button className="edit-button">
          <IconEdit size={11} />
          Edit
        </button>
      </div>
    </section>
  );
}

function PreferencesCard() {
  const [nearby, setNearby] = useState(true);
  const [videos, setVideos] = useState(false);
  const [offline, setOffline] = useState(true);

  return (
    <section className="settings-card">
      <div className="card-title-row">
        <IconGear size={18} />
        <h2>App Preferences</h2>
      </div>
      <p className="card-description">Tailor your experience.</p>

      <Toggle label="Show nearby recommendations" enabled={nearby} onClick={() => setNearby(!nearby)} />
      <Toggle label="Auto-play videos" enabled={videos} onClick={() => setVideos(!videos)} />
      <Toggle label="Download content for offline use" enabled={offline} onClick={() => setOffline(!offline)} />
    </section>
  );
}

function DefaultViewCard() {
  const [selected, setSelected] = useState("Map");
  const options = ["Map", "Curated Itineraries", "Heritage Stories"];

  return (
    <section className="settings-card">
      <div className="card-title-row">
        <IconMap size={18} />
        <h2>Default View</h2>
      </div>
      <p className="card-description">Choose what you see first when opening the app.</p>

      {options.map((option) => (
        <button key={option} className="option" onClick={() => setSelected(option)}>
          <span className={`radio ${selected === option ? "selected" : ""}`} />
          {option}
        </button>
      ))}
    </section>
  );
}

function NotificationsCard() {
  const [newItineraries, setNewItineraries] = useState(true);
  const [stories, setStories] = useState(true);
  const [attractions, setAttractions] = useState(true);
  const [events, setEvents] = useState(false);
  const [tips, setTips] = useState(true);

  return (
    <section className="settings-card">
      <div className="card-title-row">
        <IconBell size={18} />
        <h2>Notifications</h2>
      </div>
      <p className="card-description">Manage what you want to be notified about.</p>

      <Toggle label="New itineraries" enabled={newItineraries} onClick={() => setNewItineraries(!newItineraries)} />
      <Toggle label="Heritage stories" enabled={stories} onClick={() => setStories(!stories)} />
      <Toggle label="Nearby attractions" enabled={attractions} onClick={() => setAttractions(!attractions)} />
      <Toggle label="Special events & festivals" enabled={events} onClick={() => setEvents(!events)} />
      <Toggle label="Tips and travel inspiration" enabled={tips} onClick={() => setTips(!tips)} />
    </section>
  );
}

function PrivacySecurityCard() {
  return (
    <section className="settings-card">
      <div className="card-title-row">
        <IconLock size={18} />
        <h2>Privacy & Security</h2>
      </div>
      <p className="card-description">Control your data and privacy settings.</p>

      <button className="list-row">
        Manage location permissions
        <IconChevronRight size={14} />
      </button>
      <button className="list-row">
        Manage personal data
        <IconChevronRight size={14} />
      </button>
      <button className="list-row">
        Change password
        <IconChevronRight size={14} />
      </button>
      <button className="list-row">
        Two-factor authentication
        <span className="list-row-right">
          Off
          <IconChevronRight size={14} />
        </span>
      </button>
      <button className="list-row danger">
        Delete my account
        <IconChevronRight size={14} />
      </button>
    </section>
  );
}

function LanguageCard() {
  return (
    <section className="settings-card">
      <div className="card-title-row">
        <IconGlobe size={18} />
        <h2>Language</h2>
      </div>
      <p className="card-description">Choose your preferred language.</p>

      <div className="lang-select-wrap">
        <select className="lang-select" defaultValue="English">
          <option>English</option>
          <option>Arabic</option>
          <option>French</option>
        </select>
        <IconChevronDown size={12} />
      </div>
    </section>
  );
}

function Toggle({ label, enabled, onClick }) {
  return (
    <div className="setting-row">
      <span>{label}</span>
      <button className={`toggle ${enabled ? "on" : ""}`} onClick={onClick} aria-label={`Toggle ${label}`}>
        <span />
      </button>
    </div>
  );
}
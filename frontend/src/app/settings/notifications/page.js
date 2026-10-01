"use client";

import { useState } from "react";

/* =========================
   ICON
========================= */

function Icon({ children, size = 18 }) {
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

function IconBell(props) {
  return (
    <Icon {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Icon>
  );
}

/* =========================
   PAGE
========================= */

export default function NotificationsPage() {
  const [newItineraries, setNewItineraries] = useState(true);
  const [heritageStories, setHeritageStories] = useState(true);
  const [nearbyAttractions, setNearbyAttractions] = useState(true);
  const [specialEvents, setSpecialEvents] = useState(false);
  const [travelTips, setTravelTips] = useState(true);

  return (
    <>
      <div className="section-header">
        <span>PREFERENCES</span>

        <h2>Notifications</h2>

        <p>
          Choose what you want to be notified about.
        </p>
      </div>

      <section
        className="settings-card"
        style={{ maxWidth: "620px" }}
      >
        <div className="card-title-row">
          <IconBell size={18} />
          <h2>Notification Preferences</h2>
        </div>

        <p className="card-description">
          Manage the updates and recommendations you receive.
        </p>

        <NotificationRow
          label="New itineraries"
          description="Get notified when new curated itineraries are available."
          enabled={newItineraries}
          onClick={() => setNewItineraries(!newItineraries)}
        />

        <NotificationRow
          label="Heritage stories"
          description="Receive updates when new heritage stories are published."
          enabled={heritageStories}
          onClick={() => setHeritageStories(!heritageStories)}
        />

        <NotificationRow
          label="Nearby attractions"
          description="Get recommendations for interesting places near you."
          enabled={nearbyAttractions}
          onClick={() => setNearbyAttractions(!nearbyAttractions)}
        />

        <NotificationRow
          label="Special events & festivals"
          description="Stay informed about local events and festivals."
          enabled={specialEvents}
          onClick={() => setSpecialEvents(!specialEvents)}
        />

        <NotificationRow
          label="Tips and travel inspiration"
          description="Receive travel ideas and inspiration for exploring Lebanon."
          enabled={travelTips}
          onClick={() => setTravelTips(!travelTips)}
        />
      </section>
    </>
  );
}

/* =========================
   NOTIFICATION ROW
========================= */

function NotificationRow({
  label,
  description,
  enabled,
  onClick,
}) {
  return (
    <div className="notification-preference-row">

      <div className="notification-preference-text">
        <strong>{label}</strong>
        <span>{description}</span>
      </div>

      <button
        type="button"
        className={`toggle ${enabled ? "on" : ""}`}
        onClick={onClick}
        aria-pressed={enabled}
        aria-label={`Toggle ${label}`}
      >
        <span />
      </button>

    </div>
  );
}
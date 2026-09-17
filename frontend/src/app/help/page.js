import Link from "next/link";
import "./help.css";

/* ---------- SIMPLE LINE ICONS ---------- */

function Icon({ type, size = 26 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  if (type === "map") {
    return (
      <svg {...common}>
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
    );
  }

  if (type === "list") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <line x1="8" y1="8" x2="17" y2="8" />
        <line x1="8" y1="12" x2="17" y2="12" />
        <line x1="8" y1="16" x2="17" y2="16" />
        <circle cx="5.5" cy="8" r=".5" fill="currentColor" />
        <circle cx="5.5" cy="12" r=".5" fill="currentColor" />
        <circle cx="5.5" cy="16" r=".5" fill="currentColor" />
      </svg>
    );
  }

  if (type === "heritage") {
    return (
      <svg {...common}>
        <path d="M3 9h18" />
        <path d="M5 9v8" />
        <path d="M9 9v8" />
        <path d="M15 9v8" />
        <path d="M19 9v8" />
        <path d="M3 17h18" />
        <path d="M2 20h20" />
        <path d="M12 3 3 7h18L12 3z" />
      </svg>
    );
  }

  if (type === "bookmark") {
    return (
      <svg {...common}>
        <path d="M6 3h12v18l-6-4-6 4V3z" />
      </svg>
    );
  }

  if (type === "user") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </svg>
    );
  }

  if (type === "settings") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.86 2.86-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.86-2.86.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88L4.2 7.06 7.06 4.2l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.86 2.86-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.1v4h-.1a1.7 1.7 0 0 0-1.7.6z" />
      </svg>
    );
  }

  if (type === "help") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.3 2.3 0 1 1 3.55 1.93c-.95.63-1.35 1.03-1.35 2.07" />
        <circle cx="12" cy="16.8" r=".6" fill="currentColor" />
      </svg>
    );
  }

  if (type === "pin") {
    return (
      <svg {...common}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg {...common}>
        <rect x="7" y="2" width="10" height="20" rx="1.5" />
        <line x1="10" y1="18" x2="14" y2="18" />
      </svg>
    );
  }

  if (type === "mail") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg {...common}>
        <path d="M21 11a8 8 0 0 1-8 8H8l-5 3 1.5-5A8 8 0 1 1 21 11z" />
        <circle cx="9" cy="11" r=".5" fill="currentColor" />
        <circle cx="12" cy="11" r=".5" fill="currentColor" />
        <circle cx="15" cy="11" r=".5" fill="currentColor" />
      </svg>
    );
  }

  if (type === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="6.5" />
        <line x1="16" y1="16" x2="21" y2="21" />
      </svg>
    );
  }

  return null;
}

export default function HelpPage() {
  return (
    <main className="help-page">

      {/* =====================================================
          LEFT SIDEBAR
      ====================================================== */}

      <aside className="help-sidebar">

        <div className="help-brand">
          <div className="brand-arabic">اكتشف لبنان</div>

          <div className="brand-name">
            DISCOVER LEBANON
          </div>

          <p>Interactive Heritage &amp; Activity Guide</p>
        </div>

        <nav className="sidebar-main-nav">

          <Link href="/map">
            <Icon type="map" />
            <span>Explore the Map</span>
          </Link>

          <Link href="/itineraries">
            <Icon type="list" />
            <span>Curated Itineraries</span>
          </Link>

          <Link href="/heritage">
            <Icon type="heritage" />
            <span>Heritage Stories</span>
          </Link>

          <Link href="/saved">
            <Icon type="bookmark" />
            <span>Saved Places</span>
          </Link>

        </nav>

        <div className="sidebar-divider" />

        <nav className="sidebar-secondary-nav">

          <Link href="/account">
            <Icon type="user" />
            <span>My Account</span>
          </Link>

          <Link href="/settings">
            <Icon type="settings" />
            <span>Settings</span>
          </Link>

          <Link href="/help" className="sidebar-selected">
            <Icon type="help" />
            <span>Help</span>

            <span className="selected-gold-line" />
          </Link>

        </nav>

        <div className="sidebar-decorative">

          <div className="sidebar-handwriting">
            A deeper
            <br />
            way to explore
          </div>

          <div className="sidebar-art" />

          <div className="sidebar-words">
            <span>PLACES</span>
            <span>PEOPLE</span>
            <span>STORIES</span>
            <span>LEBANON</span>

            <i />
          </div>

        </div>

      </aside>

      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="help-main">

        {/* TOP NAVBAR */}

        <header className="help-topbar">

          <nav className="help-topbar-links">

            <Link href="/map">
              EXPLORE THE MAP
            </Link>

            <Link href="/itineraries">
              CURATED ITINERARIES
            </Link>

            <Link href="/heritage">
              HERITAGE STORIES
            </Link>

            <Link href="/search" className="top-search-link">
              <Icon type="search" size={22} />
              SEARCH
            </Link>

            <span className="top-divider" />

            <button className="top-language">
              EN
              <span>⌄</span>
            </button>

          </nav>

        </header>

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="help-hero">

          <div className="hero-shade" />

          <div className="hero-content">

            <div className="hero-label">
              SUPPORT
            </div>

            <h1>
              How can we help?
            </h1>

            <p>
              Find answers, get guidance, and make the most
              <br />
              of your Discover Lebanon experience.
            </p>

          </div>

          <div className="hero-handwriting">
            Same places,
            <br />
            different stories.
            <span />
          </div>

        </section>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="help-body">

          <div className="help-content">

            {/* SEARCH */}

            <div className="help-search">

              <div className="help-search-icon">
                <Icon type="search" size={25} />
              </div>

              <input
                type="text"
                placeholder='Search for help (e.g. “how to save a place”, “offline maps”, “itineraries”)'
              />

              <button type="button">
                Search
              </button>

            </div>

            {/* HELP TOPICS */}

            <section className="topics-section">

              <h2>
                Help Topics
              </h2>

              <p className="section-subtitle">
                Browse support articles by category.
              </p>

              <div className="topics-grid">

                <article className="topic-card">

                  <div className="topic-icon">
                    <Icon type="map" size={31} />
                  </div>

                  <div>
                    <h3>Getting Started</h3>

                    <p>
                      Learn the basics and
                      <br />
                      start exploring.
                    </p>
                  </div>

                  <span className="topic-arrow">
                    →
                  </span>

                </article>

                <article className="topic-card">

                  <div className="topic-icon">
                    <Icon type="pin" size={31} />
                  </div>

                  <div>
                    <h3>Explore the Map</h3>

                    <p>
                      Find places, filters
                      <br />
                      and offline access.
                    </p>
                  </div>

                  <span className="topic-arrow">
                    →
                  </span>

                </article>

                <article className="topic-card">

                  <div className="topic-icon">
                    <Icon type="list" size={31} />
                  </div>

                  <div>
                    <h3>Itineraries</h3>

                    <p>
                      How to use and
                      <br />
                      create itineraries.
                    </p>
                  </div>

                  <span className="topic-arrow">
                    →
                  </span>

                </article>

                <article className="topic-card">

                  <div className="topic-icon">
                    <Icon type="bookmark" size={31} />
                  </div>

                  <div>
                    <h3>Saved Places</h3>

                    <p>
                      Manage your
                      <br />
                      favorites.
                    </p>
                  </div>

                  <span className="topic-arrow">
                    →
                  </span>

                </article>

                <article className="topic-card">

                  <div className="topic-icon">
                    <Icon type="user" size={31} />
                  </div>

                  <div>
                    <h3>Account &amp; Settings</h3>

                    <p>
                      Profile, preferences
                      <br />
                      and privacy.
                    </p>
                  </div>

                  <span className="topic-arrow">
                    →
                  </span>

                </article>

                <article className="topic-card">

                  <div className="topic-icon">
                    <Icon type="phone" size={31} />
                  </div>

                  <div>
                    <h3>Technical Support</h3>

                    <p>
                      Troubleshooting
                      <br />
                      and app issues.
                    </p>
                  </div>

                  <span className="topic-arrow">
                    →
                  </span>

                </article>

              </div>

            </section>

            {/* FAQ */}

            <section className="faq-section">

              <div className="faq-heading">

                <h2>
                  Frequently Asked Questions
                </h2>

                <button type="button">
                  View All&nbsp; →
                </button>

              </div>

              <div className="faq-list">

                <details>
                  <summary>
                    How do I save a place?
                  </summary>

                  <p>
                    Open the place you want to save and select the
                    bookmark option to add it to Saved Places.
                  </p>
                </details>

                <details>
                  <summary>
                    Can I use the app offline?
                  </summary>

                  <p>
                    Saved content and selected map information can be
                    accessed offline when available.
                  </p>
                </details>

                <details>
                  <summary>
                    How do I plan an itinerary?
                  </summary>

                  <p>
                    Open Curated Itineraries to discover routes,
                    destinations and activities.
                  </p>
                </details>

                <details>
                  <summary>
                    How do I change my language settings?
                  </summary>

                  <p>
                    Open Settings and choose your preferred language.
                  </p>
                </details>

                <details>
                  <summary>
                    How can I contact support?
                  </summary>

                  <p>
                    Use Contact Support or Live Chat from the support
                    panel on the right.
                  </p>
                </details>

              </div>

            </section>

          </div>

          {/* =====================================================
              RIGHT SUPPORT COLUMN
          ====================================================== */}

          <aside className="support-column">

            <section className="support-card">

              <h3>
                Still need help?
              </h3>

              <p className="support-intro">
                Our team is here for you.
              </p>

              <div className="support-row">

                <div className="support-row-icon">
                  <Icon type="mail" size={25} />
                </div>

                <div className="support-row-text">
                  <strong>
                    Contact Support
                  </strong>

                  <small>
                    Send us a message
                  </small>
                </div>

                <span className="support-chevron">
                  ›
                </span>

              </div>

              <div className="support-row">

                <div className="support-row-icon">
                  <Icon type="chat" size={25} />
                </div>

                <div className="support-row-text">
                  <strong>
                    Live Chat
                  </strong>

                  <small>
                    Chat with our support team
                  </small>
                </div>

                <span className="support-chevron">
                  ›
                </span>

              </div>

              <div className="support-row">

                <div className="support-row-icon">
                  <Icon type="map" size={25} />
                </div>

                <div className="support-row-text">
                  <strong>
                    Visit our Help Center
                  </strong>

                  <small>
                    Browse all articles
                  </small>
                </div>

                <span className="support-chevron">
                  ›
                </span>

              </div>

            </section>

            <section className="quote-card">

              <div className="quote-leaf">
                ❧
              </div>

              <blockquote>
                “Questions lead
                <br />
                to deeper journeys.”
              </blockquote>

              <div className="quote-line" />

              <div className="quote-words">
                <span>DISCOVER</span>
                <span>LEARN</span>
                <span>EXPLORE</span>
              </div>

            </section>

            <section className="explore-support-card">

              <div className="explore-support-shade" />

              <div className="explore-support-text">

                <h3>
                  Explore more.
                  <br />
                  We&apos;re here to help.
                </h3>

                <span />

              </div>

            </section>

          </aside>

        </div>

      </div>

    </main>
  );
}
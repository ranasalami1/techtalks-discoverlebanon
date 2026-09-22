import AppShell from "@/components/AppShell";
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
    <AppShell>
      <main className="help-page">

        {/* ================= HERO ================= */}

        <section className="help-hero">
          <div className="hero-shade" />

          <div className="hero-content">
            <div className="hero-label">SUPPORT</div>

            <h1>How can we help?</h1>

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

        {/* ================= MAIN CONTENT ================= */}

        <div className="help-body">

          <div className="help-content">

            {/* SEARCH */}

            <div className="help-search">
              <div className="help-search-icon">
                <Icon type="search" size={25} />
              </div>

              <input
                type="text"
                placeholder='Search for help (e.g. "how to save a place", "offline maps", "itineraries")'
              />

              <button type="button">
                Search
              </button>
            </div>

            {/* ================= HELP TOPICS ================= */}

            <section className="topics-section">

              <h2>Help Topics</h2>

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

                  <span className="topic-arrow">→</span>
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

                  <span className="topic-arrow">→</span>
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

                  <span className="topic-arrow">→</span>
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

                  <span className="topic-arrow">→</span>
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

                  <span className="topic-arrow">→</span>
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

                  <span className="topic-arrow">→</span>
                </article>

              </div>
            </section>

            {/* ================= FAQ ================= */}

            <section className="faq-section">

              <div className="faq-heading">
                <h2>Frequently Asked Questions</h2>

                <button type="button">
                  View All&nbsp; →
                </button>
              </div>

              <div className="faq-list">

                <details>
                  <summary>How do I save a place?</summary>
                  <p>
                    Open the place you want to save and select the
                    bookmark option to add it to Saved Places.
                  </p>
                </details>

                <details>
                  <summary>Can I use the app offline?</summary>
                  <p>
                    Saved content and selected map information can be
                    accessed offline when available.
                  </p>
                </details>

                <details>
                  <summary>How do I plan an itinerary?</summary>
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
                  <summary>How can I contact support?</summary>
                  <p>
                    Use Contact Support or Live Chat from the support
                    panel on the right.
                  </p>
                </details>

              </div>
            </section>

          </div>

          {/* ================= SUPPORT COLUMN ================= */}

          <aside className="support-column">

            <section className="support-card">

              <h3>Still need help?</h3>

              <p className="support-intro">
                Our team is here for you.
              </p>

              <div className="support-row">
                <div className="support-row-icon">
                  <Icon type="mail" size={25} />
                </div>

                <div className="support-row-text">
                  <strong>Contact Support</strong>
                  <small>Send us a message</small>
                </div>

                <span className="support-chevron">›</span>
              </div>

              <div className="support-row">
                <div className="support-row-icon">
                  <Icon type="chat" size={25} />
                </div>

                <div className="support-row-text">
                  <strong>Live Chat</strong>
                  <small>Chat with our support team</small>
                </div>

                <span className="support-chevron">›</span>
              </div>

              <div className="support-row">
                <div className="support-row-icon">
                  <Icon type="map" size={25} />
                </div>

                <div className="support-row-text">
                  <strong>Visit our Help Center</strong>
                  <small>Browse all articles</small>
                </div>

                <span className="support-chevron">›</span>
              </div>

            </section>

            {/* QUOTE */}

            <section className="quote-card">

              <div className="quote-leaf">❧</div>

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

            {/* IMAGE CARD */}

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

      </main>
    </AppShell>
  );
}
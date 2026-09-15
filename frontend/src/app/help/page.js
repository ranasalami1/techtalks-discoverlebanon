import "./help.css";

export default function HelpPage() {
  return (
    <main className="help-page">

      {/* HERO */}
      <section className="help-hero">
        <h1>How can we help?</h1>

        <div className="help-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search for help..."
          />
        </div>
      </section>

      {/* HELP TOPICS */}
      <section className="help-content">
        <h2>Help Topics</h2>

        <div className="help-topics">

          <div className="topic-card">
            <h3>Getting Started</h3>
            <p>
              Learn how to explore Discover Lebanon and use the platform.
            </p>
          </div>

          <div className="topic-card">
            <h3>Explore the Map</h3>
            <p>
              Find places, destinations, and experiences across Lebanon.
            </p>
          </div>

          <div className="topic-card">
            <h3>Curated Itineraries</h3>
            <p>
              Discover and follow suggested itineraries for your trip.
            </p>
          </div>

          <div className="topic-card">
            <h3>Heritage Stories</h3>
            <p>
              Learn more about Lebanon&apos;s culture, history, and heritage.
            </p>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="help-content">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-list">

          <details className="faq-item">
            <summary>How do I explore places in Lebanon?</summary>
            <p>
              Use the Explore the Map section to discover destinations,
              restaurants, cafés, and attractions across Lebanon.
            </p>
          </details>

          <details className="faq-item">
            <summary>How do curated itineraries work?</summary>
            <p>
              Curated itineraries provide suggested routes and activities
              to help you plan your trip.
            </p>
          </details>

          <details className="faq-item">
            <summary>What are Heritage Stories?</summary>
            <p>
              Heritage Stories help you discover Lebanon&apos;s history,
              traditions, culture, and important places.
            </p>
          </details>

          <details className="faq-item">
            <summary>Can I search for a specific place?</summary>
            <p>
              Yes. You can use the search feature to find specific places
              and information on Discover Lebanon.
            </p>
          </details>

        </div>
      </section>

    </main>
  );
}
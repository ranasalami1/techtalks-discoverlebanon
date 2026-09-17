import Link from "next/link";
import "./heritage.css";

const stories = [
  {
    image: "/images/byblos.jpg",
    category: "ANCIENT HISTORY",
    title: "Byblos: Where History Began",
    description:
      "Walk through one of the world's oldest continuously inhabited cities and discover layers of Lebanon's ancient past.",
  },
  {
    image: "/images/keepers.jpg",
    category: "PEOPLE",
    title: "Keepers of Tradition",
    description:
      "Meet the people preserving Lebanon's traditions, crafts and stories for future generations.",
  },
  {
    image: "/images/villages.jpg",
    category: "TRADITIONAL LIFE",
    title: "Life in the Mountain Villages",
    description:
      "Discover the rhythms, customs and daily life that shaped generations across Lebanon's mountains.",
  },
  {
    image: "/images/cuisine.jpg",
    category: "CUISINE",
    title: "Flavors Passed Down",
    description:
      "Explore family recipes, local ingredients and the traditions behind Lebanon's celebrated cuisine.",
  },
  {
    image: "/images/festivals.jpg",
    category: "FESTIVALS",
    title: "Celebrations Through Time",
    description:
      "From village gatherings to cultural festivals, discover the celebrations that bring communities together.",
  },
  {
    image: "/images/landscapes.jpg",
    category: "ARCHITECTURE",
    title: "Built Into the Landscape",
    description:
      "Explore stone houses, arches and historic structures shaped by Lebanon's diverse landscapes.",
  },
  {
    image: "/images/crafts.jpg",
    category: "ARTS & CRAFTS",
    title: "Hands of Heritage",
    description:
      "Discover traditional craftsmanship and the artisans keeping centuries-old skills alive.",
  },
  {
    image: "/images/stories-land.jpg",
    category: "PEOPLE",
    title: "Stories of the Land",
    description:
      "Listen to the memories and experiences connecting Lebanese communities to the places they call home.",
  },
];

export default function HeritagePage() {
  return (
    <main className="heritage-page">

      {/* LEFT SIDEBAR */}
      <aside className="heritage-sidebar">

        <div className="heritage-brand">
          <div className="brand-arabic">اكتشف لبنان</div>
          <div className="brand-name">DISCOVER LEBANON</div>
          <p>Interactive Heritage &amp; Activity Guide</p>
        </div>

        <nav className="heritage-side-nav">

          <Link href="/map">
            <span className="side-icon">⌖</span>
            <span>Explore the Map</span>
          </Link>

          <Link href="/itineraries">
            <span className="side-icon">▣</span>
            <span>Curated Itineraries</span>
          </Link>

          <Link href="/heritage" className="side-active">
            <span className="side-icon">♜</span>
            <span>Heritage Stories</span>
            <i />
          </Link>

          <Link href="/saved">
            <span className="side-icon">♡</span>
            <span>Saved Places</span>
          </Link>

        </nav>

        <div className="side-divider" />

        <nav className="heritage-side-nav secondary">

          <Link href="/account">
            <span className="side-icon">♙</span>
            <span>My Account</span>
          </Link>

          <Link href="/settings">
            <span className="side-icon">⚙</span>
            <span>Settings</span>
          </Link>

          <Link href="/help">
            <span className="side-icon">?</span>
            <span>Help</span>
          </Link>

        </nav>

        <div className="heritage-sidebar-bottom">
          <p>
            Stories that
            <br />
            live on.
          </p>

          <div className="sidebar-image" />

          <div className="sidebar-small-words">
            <span>PEOPLE</span>
            <span>PLACES</span>
            <span>TRADITIONS</span>
            <span>LEBANON</span>
          </div>
        </div>

      </aside>

      {/* RIGHT SIDE */}
      <div className="heritage-main">

        {/* TOP NAVBAR */}
        <header className="heritage-topbar">

          <nav>
            <Link href="/map">
              EXPLORE THE MAP
            </Link>

            <Link href="/itineraries">
              CURATED ITINERARIES
            </Link>

            <Link href="/heritage" className="top-active">
              HERITAGE STORIES
            </Link>

            <Link href="/search" className="top-search">
              <span>⌕</span>
              SEARCH
            </Link>

            <div className="top-divider" />

            <button>
              EN <span>⌄</span>
            </button>
          </nav>

        </header>

        {/* HERO */}
        <section className="heritage-hero">

          <div className="heritage-hero-overlay" />

          <div className="heritage-hero-content">
  <span className="heritage-label">
    PEOPLE &nbsp;&nbsp; PLACES &nbsp;&nbsp; TRADITIONS
  </span>

  <h1>Heritage Stories</h1>

  <h3>Real stories. Lasting heritage.</h3>

  <p>
    Discover the rich history, vibrant traditions and inspiring
    <br />
    people that make Lebanon unique.
  </p>
</div>

<div className="heritage-script">
  More
  <br />
  than places.
  <br />
  They are stories.
  <span></span>
</div>

          <div className="heritage-script">
            Every place
            <br />
            has a story.
          </div>

        </section>

        {/* FILTERS */}
        <section className="heritage-content">

          <div className="heritage-filters">

            <button className="filter-active">
              All Stories
            </button>

            <button>Ancient History</button>
            <button>Traditional Life</button>
            <button>Arts &amp; Crafts</button>
            <button>Architecture</button>
            <button>Cuisine</button>
            <button>People</button>
            <button>Festivals</button>

          </div>

          {/* CARDS */}
          <div className="heritage-grid">

            {stories.map((story) => (
              <article className="heritage-card" key={story.title}>

                <div
                  className="heritage-card-image"
                  style={{
                    backgroundImage: `url("${story.image}")`,
                  }}
                />

                <div className="heritage-card-body">

                  <span className="story-category">
                    {story.category}
                  </span>

                  <h2>
                    {story.title}
                  </h2>

                  <p>
                    {story.description}
                  </p>

                  <Link href="#">
                    Read More <span>→</span>
                  </Link>

                </div>

              </article>
            ))}

          </div>

        </section>

        {/* BOTTOM DECORATIVE IMAGE */}
        <section className="heritage-footer-art">

          <div className="footer-art-overlay" />

          <div className="footer-art-text">
            <span>OUR HERITAGE</span>

            <h2>
              Stories carried
              <br />
              through generations.
            </h2>

            <i />
          </div>

        </section>

      </div>

    </main>
  );
}
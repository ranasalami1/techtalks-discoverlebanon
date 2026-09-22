"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import "./heritage.css";

/* =====================================================
   HERITAGE STORIES DATA
===================================================== */

const stories = [
  {
    slug: "byblos",
    image: "/images/byblos.jpg",
    category: "ANCIENT HISTORY",
    filter: "ancient-history",
    title: "Byblos: A Journey Through Time",
    description:
      "One of the world's oldest continuously inhabited cities, where civilizations left their mark.",
  },
  {
    slug: "keepers-of-tradition",
    image: "/images/keepers.jpg",
    category: "PEOPLE",
    filter: "people",
    title: "The Keepers of Tradition",
    description:
      "Meet the artisans, farmers and locals who keep Lebanon's heritage alive, generation after generation.",
  },
  {
    slug: "villages-on-the-mountain",
    image: "/images/villages.jpg",
    category: "ARCHITECTURE",
    filter: "architecture",
    title: "The Villages on the Mountain",
    description:
      "Stone houses, narrow streets and timeless landscapes that tell stories of resilience and belonging.",
  },
  {
    slug: "taste-of-heritage",
    image: "/images/cuisine.jpg",
    category: "CUISINE",
    filter: "cuisine",
    title: "A Taste of Heritage",
    description:
      "From traditional recipes to local ingredients, Lebanese cuisine is a story of land, people and culture.",
  },
  {
    slug: "festivals-that-unite",
    image: "/images/festivals.jpg",
    category: "TRADITIONS",
    filter: "festivals",
    title: "Festivals That Unite",
    description:
      "Celebrations, music and rituals that reflect the spirit and diversity of Lebanon.",
  },
  {
    slug: "sacred-landscapes",
    image: "/images/landscapes.jpg",
    category: "NATURE & HERITAGE",
    filter: "traditional-life",
    title: "Sacred Landscapes",
    description:
      "Forests, valleys and natural wonders that have inspired generations and shaped our history.",
  },
  {
    slug: "hands-that-create",
    image: "/images/crafts.jpg",
    category: "ARTS & CRAFTS",
    filter: "arts-crafts",
    title: "Hands That Create",
    description:
      "The story behind Lebanon's traditional crafts — from pottery to weaving, a legacy of skill and soul.",
  },
  {
    slug: "stories-from-the-land",
    image: "/images/stories-land.jpg",
    category: "PEOPLE",
    filter: "people",
    title: "Stories from the Land",
    description:
      "Personal stories of courage, belonging and love for a homeland that never stops inspiring.",
  },
];


/* =====================================================
   FILTERS
===================================================== */

const filters = [
  {
    id: "all",
    label: "All Stories",
  },
  {
    id: "ancient-history",
    label: "Ancient History",
  },
  {
    id: "traditional-life",
    label: "Traditional Life",
  },
  {
    id: "arts-crafts",
    label: "Arts & Crafts",
  },
  {
    id: "architecture",
    label: "Architecture",
  },
  {
    id: "cuisine",
    label: "Cuisine",
  },
  {
    id: "people",
    label: "People",
  },
  {
    id: "festivals",
    label: "Festivals",
  },
];


/* =====================================================
   PAGE
===================================================== */

export default function HeritagePage() {
  const [activeFilter, setActiveFilter] = useState("all");

  /* Filter the cards */

  const filteredStories =
    activeFilter === "all"
      ? stories
      : stories.filter(
          (story) => story.filter === activeFilter
        );

  return (
    <AppShell>

      <main className="heritage-page">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="heritage-hero">

          <div className="heritage-hero-overlay" />

          <div className="heritage-hero-content">

            <span className="heritage-label">
              PEOPLE &nbsp;&nbsp;&nbsp; PLACES &nbsp;&nbsp;&nbsp; TRADITIONS
            </span>

            <h1>
              Heritage Stories
            </h1>

            <h3>
              Real stories. Lasting heritage.
            </h3>

            <p>
              Discover the rich history, vibrant traditions and inspiring
              <br />
              people that make Lebanon unique.
            </p>

          </div>


          {/* HANDWRITTEN TEXT */}

          <div className="heritage-script">

            More
            <br />

            than places.
            <br />

            <span>
              They are stories.
            </span>

          </div>

        </section>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="heritage-content">


          {/* =================================================
              FILTERS
          ================================================= */}

          <div
            className="heritage-filters"
            role="tablist"
            aria-label="Filter heritage stories"
          >

            {filters.map((filter) => {

              const isActive =
                activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={
                    isActive
                      ? "filter-active"
                      : ""
                  }
                  onClick={() =>
                    setActiveFilter(filter.id)
                  }
                >

                  {filter.label}

                </button>
              );
            })}

          </div>


          {/* =================================================
              STORY CARDS
          ================================================= */}

          <div className="heritage-grid">

            {filteredStories.map((story) => (

              <article
                className="heritage-card"
                key={story.slug}
              >

                {/* IMAGE */}

                <div
                  className="heritage-card-image"
                  style={{
                    backgroundImage: `url("${story.image}")`,
                  }}
                />


                {/* CARD CONTENT */}

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


                  <Link
                    href={`/heritage/${story.slug}`}
                  >
                    Read More

                    <span>
                      →
                    </span>
                  </Link>

                </div>

              </article>

            ))}

          </div>


          {/* =================================================
              EMPTY FILTER
          ================================================= */}

          {filteredStories.length === 0 && (

            <div className="heritage-empty">

              <h2>
                No stories found
              </h2>

              <p>
                There are no heritage stories in this
                category yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  setActiveFilter("all")
                }
              >
                View All Stories
              </button>

            </div>

          )}


          {/* =================================================
              BOTTOM DECORATIVE BANNER
          ================================================= */}

          <section className="heritage-bottom-banner">


            {/* LEAVES */}

            <div
              className="heritage-leaves"
              aria-hidden="true"
            >

              <span className="leaf-stem" />

              <span className="leaf leaf-1" />

              <span className="leaf leaf-2" />

              <span className="leaf leaf-3" />

              <span className="leaf leaf-4" />

            </div>


            {/* QUOTE */}

            <div className="heritage-bottom-quote">

              <p>
                “Every place in Lebanon has a story,
                <br />
                and every story keeps a piece of us alive.”
              </p>

              <span />

            </div>


            {/* BACKGROUND ART */}

            <div className="heritage-bottom-art">

              <div className="heritage-bottom-words">

                <span>
                  PLACES
                </span>

                <span>
                  PEOPLE
                </span>

                <span>
                  STORIES
                </span>

                <span>
                  LEBANON
                </span>

              </div>

            </div>

          </section>

        </section>

      </main>

    </AppShell>
  );
}
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";

import AppShell from "@/components/AppShell";
import "./story.css";

const stories = [
  {
    slug: "byblos",
    image: "/images/byblos.jpg",
    category: "ANCIENT HISTORY",
    title: "Byblos: A Journey Through Time",
    location: "Byblos, Lebanon",
    intro:
      "One of the world's oldest continuously inhabited cities, where civilizations left their mark.",
    paragraphs: [
      "For thousands of years, Byblos has stood along Lebanon's Mediterranean coast as a meeting point between cultures, travelers and civilizations.",
      "Walking through its historic streets reveals layers of the past. Ancient ruins, stone walls, traditional houses and views of the old harbor all tell different chapters of the city's long story.",
      "Byblos is more than an archaeological destination. It is a living city where history continues alongside everyday life, connecting Lebanon's past with the present.",
    ],
    quote:
      "In Byblos, history is not hidden behind walls. It lives beside the sea.",
  },

  {
    slug: "keepers-of-tradition",
    image: "/images/keepers.jpg",
    category: "PEOPLE",
    title: "The Keepers of Tradition",
    location: "Lebanon",
    intro:
      "Meet the artisans, farmers and locals who keep Lebanon's heritage alive, generation after generation.",
    paragraphs: [
      "Across Lebanon, traditions survive because people continue to practice, teach and share them.",
      "Artisans work with skills learned from previous generations, while farmers preserve knowledge connected to the land, seasons and local communities.",
      "These traditions are not simply memories of the past. Through the people who continue them, they remain part of Lebanon's living heritage.",
    ],
    quote:
      "Heritage survives when knowledge passes from one pair of hands to another.",
  },

  {
    slug: "villages-on-the-mountain",
    image: "/images/villages.jpg",
    category: "ARCHITECTURE",
    title: "The Villages on the Mountain",
    location: "Mount Lebanon",
    intro:
      "Stone houses, narrow streets and timeless landscapes that tell stories of resilience and belonging.",
    paragraphs: [
      "Lebanon's mountain villages have developed around landscapes that shaped how communities lived, worked and built their homes.",
      "Stone houses, tiled roofs, arches and narrow streets became characteristic features of many villages across the mountains.",
      "Today these villages preserve architectural details and community traditions that connect modern Lebanon with generations that came before.",
    ],
    quote:
      "Every stone house carries traces of the people who once called it home.",
  },

  {
    slug: "taste-of-heritage",
    image: "/images/cuisine.jpg",
    category: "CUISINE",
    title: "A Taste of Heritage",
    location: "Lebanon",
    intro:
      "From traditional recipes to local ingredients, Lebanese cuisine is a story of land, people and culture.",
    paragraphs: [
      "Lebanese cuisine has developed through generations of family cooking, regional ingredients and traditions centered around sharing food.",
      "Recipes often reflect the landscapes where communities live, from mountain villages and fertile valleys to towns along the Mediterranean coast.",
      "More than a meal, food brings families and communities together. Recipes passed from one generation to another preserve memories as well as flavors.",
    ],
    quote:
      "A recipe can carry the memory of a family for generations.",
  },

  {
    slug: "festivals-that-unite",
    image: "/images/festivals.jpg",
    category: "TRADITIONS",
    title: "Festivals That Unite",
    location: "Lebanon",
    intro:
      "Celebrations, music and rituals that reflect the spirit and diversity of Lebanon.",
    paragraphs: [
      "Throughout Lebanon, festivals and local celebrations bring communities together through music, dance, food and shared traditions.",
      "Some celebrations have deep historical roots, while others have developed into modern cultural events that welcome visitors from across the country.",
      "Together they create spaces where traditions can be celebrated, remembered and shared with younger generations.",
    ],
    quote:
      "A celebration becomes heritage when a community continues to share it.",
  },

  {
    slug: "sacred-landscapes",
    image: "/images/landscapes.jpg",
    category: "NATURE & HERITAGE",
    title: "Sacred Landscapes",
    location: "Lebanon",
    intro:
      "Forests, valleys and natural wonders that have inspired generations and shaped our history.",
    paragraphs: [
      "Lebanon's natural landscapes have always influenced the communities that developed around them.",
      "Mountains, cedar forests, valleys and rivers provided resources, shaped travel routes and became part of local stories and traditions.",
      "Protecting these landscapes means preserving not only nature, but also the cultural memories and identities connected to them.",
    ],
    quote:
      "The landscape remembers the generations that learned to live within it.",
  },

  {
    slug: "hands-that-create",
    image: "/images/crafts.jpg",
    category: "ARTS & CRAFTS",
    title: "Hands That Create",
    location: "Lebanon",
    intro:
      "The story behind Lebanon's traditional crafts — from pottery to weaving, a legacy of skill and soul.",
    paragraphs: [
      "Traditional craftsmanship reflects generations of knowledge, patience and creativity.",
      "Pottery, weaving, woodwork and other crafts developed through techniques learned through practice and passed between generations.",
      "Every handmade object carries something beyond its practical purpose: the knowledge of the artisan and a connection to the community where it was created.",
    ],
    quote:
      "What the hands remember can keep centuries of knowledge alive.",
  },

  {
    slug: "stories-from-the-land",
    image: "/images/stories-land.jpg",
    category: "PEOPLE",
    title: "Stories from the Land",
    location: "Lebanon",
    intro:
      "Personal stories of courage, belonging and love for a homeland that never stops inspiring.",
    paragraphs: [
      "Lebanon's heritage is not found only in monuments, landscapes or historic buildings. It also lives in people's memories.",
      "Stories shared by families and communities preserve experiences of villages, neighborhoods, traditions and everyday life.",
      "Together, these personal memories create a human record of Lebanon and help future generations understand their connection to the land.",
    ],
    quote:
      "Places become part of us through the stories we carry from them.",
  },
];

export default async function HeritageStoryPage({ params }) {
  const { slug } = await params;

  const story = stories.find(
    (item) => item.slug === slug
  );

  if (!story) {
    notFound();
  }

  return (
    <AppShell>
      <main className="story-page">

        {/* HERO */}

        <section className="story-hero">
          <Image
            src={story.image}
            alt={story.title}
            fill
            priority
            sizes="100vw"
            className="story-hero-image"
          />

          <div className="story-hero-overlay" />

          <Link
            href="/heritage"
            className="story-back"
          >
            <ArrowLeft size={14} />
            Heritage Stories
          </Link>

          <div className="story-hero-content">
            <span className="story-hero-category">
              {story.category}
            </span>

            <h1>{story.title}</h1>

            <div className="story-location">
              <MapPin size={13} />
              {story.location}
            </div>
          </div>

          <div className="story-script">
            Every place
            <br />
            has a story.
          </div>
        </section>

        {/* ARTICLE */}

        <section className="story-content">

          <article className="story-article">

            <span className="story-small-title">
              DISCOVER THE STORY
            </span>

            <h2>{story.intro}</h2>

            <div className="story-gold-line" />

            {story.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                {paragraph}
              </p>
            ))}

            <blockquote>
              “{story.quote}”
            </blockquote>

          </article>

          {/* SIDE CARD */}

          <aside className="story-aside">

            <span className="story-aside-label">
              HERITAGE STORY
            </span>

            <h3>{story.title}</h3>

            <div className="story-aside-row">
              <MapPin size={15} />
              <div>
                <small>LOCATION</small>
                <span>{story.location}</span>
              </div>
            </div>

            <div className="story-aside-category">
              <small>CATEGORY</small>
              <span>{story.category}</span>
            </div>

            <Link href="/heritage">
              Explore More Stories
              <ArrowRight size={14} />
            </Link>

          </aside>

        </section>

      </main>
    </AppShell>
  );
}
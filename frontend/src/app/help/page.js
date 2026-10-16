"use client";

import {
  useMemo,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import AppShell from "@/components/AppShell";

import {
  Bookmark,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  Smartphone,
  User,
  X,
} from "lucide-react";

import "./help.css";


/* =====================================================
   HELP TOPICS
===================================================== */

const topics = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Learn the basics and start exploring.",
    icon: Map,
    route: "/explore",
    article:
      "Start with Explore the Map to browse destinations across Lebanon. You can search, filter places and open a destination for more information.",
  },

  {
    id: "explore-map",
    title: "Explore the Map",
    description:
      "Find places, filters and map features.",
    icon: MapPin,
    route: "/explore",
    article:
      "Use Explore the Map to browse real places from the database. Search for a city or destination, choose a category, then select a place.",
  },

  {
    id: "itineraries",
    title: "Itineraries",
    description:
      "Browse curated journeys.",
    icon: Map,
    route: "/itineraries",
    article:
      "Curated Itineraries contains ready-made journeys with real itinerary stops. Select an itinerary to see its route and details.",
  },

  {
    id: "saved-places",
    title: "Saved Places",
    description:
      "Manage your favorites.",
    icon: Bookmark,
    route: "/saved",
    article:
      "When signed in, you can save places to your personal collection. Open Saved Places to view, remove or restore saved destinations.",
  },

  {
    id: "account-settings",
    title: "Account & Settings",
    description:
      "Profile, preferences and privacy.",
    icon: User,
    route: "/account",
    article:
      "Use My Account to manage your personal information. Settings lets you manage language, notifications, display preferences and other options.",
  },

  {
    id: "technical",
    title: "Technical Support",
    description:
      "Troubleshooting and app issues.",
    icon: Smartphone,
    route: null,
    article:
      "If something is not loading, refresh the page, confirm that the Flask backend and Next.js frontend are running, and sign in again if an authenticated page reports that your session is missing.",
  },
];


/* =====================================================
   FAQ
===================================================== */

const faqs = [
  {
    id: 1,
    question:
      "How do I save a place?",
    answer:
      "Open Saved Places and choose Add Place, or use the bookmark option on a place. You must be signed in because saved places belong to your account.",
  },

  {
    id: 2,
    question:
      "Can I use the app offline?",
    answer:
      "Some app preferences can be stored on your device. Full offline maps are not currently implemented.",
  },

  {
    id: 3,
    question:
      "How do I plan an itinerary?",
    answer:
      "Open Curated Itineraries to browse available journeys and see their ordered stops.",
  },

  {
    id: 4,
    question:
      "How do I change my language settings?",
    answer:
      "Open Settings and choose Language. You can select English, French or Arabic.",
  },

  {
    id: 5,
    question:
      "How do I edit my profile?",
    answer:
      "Open My Account and choose Edit Profile. You can update the information supported by your account.",
  },

  {
    id: 6,
    question:
      "Why do I need to sign in for Saved Places?",
    answer:
      "Saved Places is connected to your account so every user has their own saved collection.",
  },

  {
    id: 7,
    question:
      "How do I change my password?",
    answer:
      "Open Settings, then Privacy & Security, and choose Change Password.",
  },
];


/* =====================================================
   ARTICLE MODAL
===================================================== */

function ArticleModal({
  topic,
  onClose,
}) {
  if (!topic) {
    return null;
  }

  const TopicIcon =
    topic.icon;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background:
          "rgba(0, 0, 0, 0.45)",
      }}
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <article
        style={{
          width: "100%",
          maxWidth: "560px",
          padding: "28px",
          border:
            "1px solid #ded8cb",
          borderRadius: "16px",
          background: "#faf8f2",
          boxShadow:
            "0 20px 50px rgba(0,0,0,.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems:
              "flex-start",
            justifyContent:
              "space-between",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                borderRadius:
                  "50%",
                background:
                  "#e5eadb",
                color: "#61704f",
              }}
            >
              <TopicIcon
                size={20}
              />
            </div>

            <h2
              style={{
                margin: 0,
                fontFamily:
                  "Georgia, serif",
                fontSize: "25px",
                fontWeight: 400,
              }}
            >
              {topic.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              border: 0,
              background:
                "transparent",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <p
          style={{
            margin:
              "24px 0 0",
            color: "#615d55",
            fontSize: "14px",
            lineHeight: 1.7,
          }}
        >
          {topic.article}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          {topic.route && (
            <Link
              href={topic.route}
              style={{
                padding:
                  "10px 20px",
                borderRadius:
                  "999px",
                background:
                  "#657044",
                color: "white",
                textDecoration:
                  "none",
                fontSize: "13px",
              }}
            >
              Open page →
            </Link>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              padding:
                "10px 20px",
              border:
                "1px solid #d8d1c4",
              borderRadius:
                "999px",
              background:
                "transparent",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </article>
    </div>
  );
}


/* =====================================================
   SUPPORT MODAL
===================================================== */

function SupportModal({
  mode,
  onClose,
}) {
  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    sent,
    setSent,
  ] =
    useState(false);


  if (!mode) {
    return null;
  }


  function handleSubmit(
    event
  ) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    try {
      const previous =
        JSON.parse(
          localStorage.getItem(
            "discover-support-drafts"
          ) || "[]"
        );

      previous.push({
        message:
          message.trim(),

        createdAt:
          new Date()
            .toISOString(),
      });

      localStorage.setItem(
        "discover-support-drafts",
        JSON.stringify(
          previous
        )
      );
    } catch {
      // The UI can still show
      // the confirmation.
    }

    setSent(true);
  }


  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background:
          "rgba(0,0,0,.45)",
      }}
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "26px",
          borderRadius: "16px",
          background: "#faf8f2",
          boxShadow:
            "0 20px 50px rgba(0,0,0,.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "flex-start",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily:
                "Georgia, serif",
              fontSize: "25px",
              fontWeight: 400,
            }}
          >
            {mode === "chat"
              ? "Support Chat"
              : "Contact Support"}
          </h2>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              border: 0,
              background:
                "transparent",
              cursor: "pointer",
            }}
          >
            <X size={19} />
          </button>
        </div>

        {sent ? (
          <>
            <div
              style={{
                marginTop:
                  "20px",
                padding: "16px",
                border:
                  "1px solid #cbd8be",
                borderRadius:
                  "10px",
                background:
                  "#eef4e9",
                color:
                  "#495c3c",
                fontSize:
                  "13px",
                lineHeight: 1.6,
              }}
            >
              Your support request
              has been saved.
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                marginTop:
                  "18px",
                padding:
                  "10px 20px",
                border: 0,
                borderRadius:
                  "999px",
                background:
                  "#657044",
                color: "white",
                cursor:
                  "pointer",
              }}
            >
              Close
            </button>
          </>
        ) : (
          <form
            onSubmit={
              handleSubmit
            }
          >
            {mode ===
              "chat" && (
              <div
                style={{
                  marginTop:
                    "18px",
                  padding:
                    "14px",
                  borderRadius:
                    "10px",
                  background:
                    "#efede6",
                  color:
                    "#625e55",
                  fontSize:
                    "13px",
                  lineHeight:
                    1.6,
                }}
              >
                Tell us what
                problem you are
                having.
              </div>
            )}

            <textarea
              value={message}
              onChange={(
                event
              ) =>
                setMessage(
                  event
                    .target
                    .value
                )
              }
              placeholder="Describe your problem..."
              required
              rows={5}
              style={{
                width: "100%",
                marginTop:
                  "16px",
                padding: "12px",
                resize:
                  "vertical",
                border:
                  "1px solid #d9d2c5",
                borderRadius:
                  "10px",
                background:
                  "white",
                outline: 0,
                fontFamily:
                  "inherit",
              }}
            />

            <button
              type="submit"
              style={{
                marginTop:
                  "14px",
                padding:
                  "10px 20px",
                border: 0,
                borderRadius:
                  "999px",
                background:
                  "#657044",
                color: "white",
                cursor:
                  "pointer",
              }}
            >
              Save Support Request
            </button>
          </form>
        )}
      </section>
    </div>
  );
}


/* =====================================================
   HELP CONTENT
===================================================== */

function HelpContent() {
  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    submittedQuery,
    setSubmittedQuery,
  ] =
    useState("");

  const [
    showAllFaqs,
    setShowAllFaqs,
  ] =
    useState(false);

  const [
    selectedTopic,
    setSelectedTopic,
  ] =
    useState(null);

  const [
    supportMode,
    setSupportMode,
  ] =
    useState("");

  const topicsRef =
    useRef(null);


  const normalizedQuery =
    submittedQuery
      .trim()
      .toLowerCase();


  const visibleTopics =
    useMemo(() => {
      if (!normalizedQuery) {
        return topics;
      }

      return topics.filter(
        (topic) =>
          `${topic.title} ${topic.description} ${topic.article}`
            .toLowerCase()
            .includes(
              normalizedQuery
            )
      );
    }, [normalizedQuery]);


  const visibleFaqs =
    useMemo(() => {
      if (normalizedQuery) {
        return faqs.filter(
          (faq) =>
            `${faq.question} ${faq.answer}`
              .toLowerCase()
              .includes(
                normalizedQuery
              )
        );
      }

      return showAllFaqs
        ? faqs
        : faqs.slice(
            0,
            3
          );
    }, [
      normalizedQuery,
      showAllFaqs,
    ]);


  function handleSearch(
    event
  ) {
    event.preventDefault();

    setSubmittedQuery(
      query
    );

    window.setTimeout(
      () => {
        topicsRef.current
          ?.scrollIntoView({
            behavior:
              "smooth",
            block:
              "start",
          });
      },
      0
    );
  }


  return (
    <div className="help-page">

      {/* =================================================
          HERO
      ================================================= */}

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


      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="help-body">

        <div className="help-content">

          {/* SEARCH */}

          <form
            className="help-search"
            onSubmit={
              handleSearch
            }
          >
            <div className="help-search-icon">
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                />

                <line
                  x1="16"
                  y1="16"
                  x2="21"
                  y2="21"
                />
              </svg>
            </div>

            <input
              type="search"
              value={query}
              onChange={(
                event
              ) =>
                setQuery(
                  event
                    .target
                    .value
                )
              }
              placeholder='Search for help (e.g. “how to save a place”, “language”, “itineraries”)'
            />

            <button
              type="submit"
            >
              Search
            </button>
          </form>


          {/* =================================================
              HELP TOPICS
          ================================================= */}

          <section
            className="topics-section"
            ref={topicsRef}
          >
            <h2>
              Help Topics
            </h2>

            <p className="section-subtitle">
              Browse support articles by category.
            </p>


            <div className="topics-grid">

              {visibleTopics.map(
                (topic) => {
                  const TopicIcon =
                    topic.icon;

                  return (
                    <button
                      key={
                        topic.id
                      }
                      type="button"
                      className="topic-card"
                      onClick={() =>
                        setSelectedTopic(
                          topic
                        )
                      }
                      style={{
                        width:
                          "100%",
                        textAlign:
                          "left",
                        cursor:
                          "pointer",
                      }}
                    >
                      <div className="topic-icon">
                        <TopicIcon
                          size={31}
                          strokeWidth={
                            1.7
                          }
                        />
                      </div>

                      <div>
                        <h3>
                          {
                            topic.title
                          }
                        </h3>

                        <p>
                          {
                            topic.description
                          }
                        </p>
                      </div>

                      <span className="topic-arrow">
                        →
                      </span>
                    </button>
                  );
                }
              )}

            </div>


            {normalizedQuery &&
              visibleTopics.length ===
                0 &&
              visibleFaqs.length ===
                0 && (
                <p
                  style={{
                    marginTop:
                      "20px",
                    color:
                      "#746e63",
                  }}
                >
                  No help result found for “{submittedQuery}”.
                </p>
              )}

          </section>


          {/* =================================================
              FAQ
          ================================================= */}

          <section className="faq-section">

            <div className="faq-heading">

              <h2>
                Frequently Asked Questions
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowAllFaqs(
                    (
                      previous
                    ) =>
                      !previous
                  )
                }
              >
                {showAllFaqs
                  ? "Show Less"
                  : "View All"}{" "}
                →
              </button>

            </div>


            <div className="faq-list">

              {visibleFaqs.map(
                (faq) => (
                  <details
                    key={
                      faq.id
                    }
                  >
                    <summary>
                      {
                        faq.question
                      }
                    </summary>

                    <p>
                      {
                        faq.answer
                      }
                    </p>
                  </details>
                )
              )}

            </div>

          </section>

        </div>


        {/* =================================================
            RIGHT SUPPORT COLUMN
        ================================================= */}

        <aside className="support-column">

          <section className="support-card">

            <h3>
              Still need help?
            </h3>

            <p className="support-intro">
              Our support tools are here for you.
            </p>


            {/* CONTACT SUPPORT */}

            <button
              type="button"
              className="support-row"
              onClick={() =>
                setSupportMode(
                  "contact"
                )
              }
              style={{
                width: "100%",
                border: 0,
                padding: 0,
                background:
                  "transparent",
                textAlign:
                  "left",
                cursor:
                  "pointer",
              }}
            >
              <div className="support-row-icon">
                <Mail
                  size={25}
                  strokeWidth={
                    1.7
                  }
                />
              </div>

              <div className="support-row-text">
                <strong>
                  Contact Support
                </strong>

                <small>
                  Create a support request
                </small>
              </div>

              <span className="support-chevron">
                ›
              </span>
            </button>


            {/* SUPPORT CHAT */}

            <button
              type="button"
              className="support-row"
              onClick={() =>
                setSupportMode(
                  "chat"
                )
              }
              style={{
                width: "100%",
                border: 0,
                padding: 0,
                background:
                  "transparent",
                textAlign:
                  "left",
                cursor:
                  "pointer",
              }}
            >
              <div className="support-row-icon">
                <MessageCircle
                  size={25}
                  strokeWidth={
                    1.7
                  }
                />
              </div>

              <div className="support-row-text">
                <strong>
                  Support Chat
                </strong>

                <small>
                  Describe a technical issue
                </small>
              </div>

              <span className="support-chevron">
                ›
              </span>
            </button>


            {/* HELP CENTER */}

            <button
              type="button"
              className="support-row"
              onClick={() =>
                topicsRef.current
                  ?.scrollIntoView({
                    behavior:
                      "smooth",
                    block:
                      "start",
                  })
              }
              style={{
                width: "100%",
                border: 0,
                padding: 0,
                background:
                  "transparent",
                textAlign:
                  "left",
                cursor:
                  "pointer",
              }}
            >
              <div className="support-row-icon">
                <Map
                  size={25}
                  strokeWidth={
                    1.7
                  }
                />
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
            </button>

          </section>


          {/* QUOTE */}

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
              <span>
                DISCOVER
              </span>

              <span>
                LEARN
              </span>

              <span>
                EXPLORE
              </span>
            </div>

          </section>


          {/* EXPLORE */}

          <Link
            href="/explore"
            className="explore-support-card"
          >
            <div className="explore-support-shade" />

            <div className="explore-support-text">
              <h3>
                Explore more.
                <br />
                We&apos;re here to help.
              </h3>

              <span />
            </div>
          </Link>

        </aside>

      </div>


      {/* =================================================
          MODALS
      ================================================= */}

      <ArticleModal
        topic={
          selectedTopic
        }
        onClose={() =>
          setSelectedTopic(
            null
          )
        }
      />


      <SupportModal
        mode={
          supportMode
        }
        onClose={() =>
          setSupportMode("")
        }
      />

    </div>
  );
}


/* =====================================================
   PAGE
===================================================== */

export default function HelpPage() {
  return (
    <AppShell>
      <HelpContent />
    </AppShell>
  );
}
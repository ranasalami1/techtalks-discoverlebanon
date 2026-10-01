"use client";

import Link from "next/link";

/* =========================
   ICONS
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

function IconHelp(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Icon>
  );
}

function IconMessage(props) {
  return (
    <Icon {...props}>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </Icon>
  );
}

function IconMail(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <polyline points="3 7 12 13 21 7" />
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

/* =========================
   PAGE
========================= */

export default function HelpSupportPage() {
  return (
    <>
      <div className="section-header">
        <span>SUPPORT</span>

        <h2>Help &amp; Support</h2>

        <p>
          Find answers and get help with Discover Lebanon.
        </p>
      </div>

      <div className="help-support-grid">

        {/* HELP CENTER */}

        <section className="settings-card">
          <div className="card-title-row">
            <IconHelp size={18} />
            <h2>Help Center</h2>
          </div>

          <p className="card-description">
            Find answers to common questions and learn more about Discover Lebanon.
          </p>

          <Link
            href="/help"
            className="support-action-row"
          >
            <div>
              <strong>Visit Help Center</strong>
              <span>
                Browse help topics and frequently asked questions.
              </span>
            </div>

            <IconChevronRight size={14} />
          </Link>
        </section>

        {/* CONTACT SUPPORT */}

        <section className="settings-card">
          <div className="card-title-row">
            <IconMessage size={18} />
            <h2>Contact Support</h2>
          </div>

          <p className="card-description">
            Need more help? Our support team is here for you.
          </p>

          <button
            type="button"
            className="support-action-row"
          >
            <div className="support-action-content">
              <IconMessage size={16} />

              <span>
                <strong>Chat with us</strong>
                <small>
                  Start a conversation with our support team.
                </small>
              </span>
            </div>

            <IconChevronRight size={14} />
          </button>

          <button
            type="button"
            className="support-action-row"
          >
            <div className="support-action-content">
              <IconMail size={16} />

              <span>
                <strong>Email support</strong>
                <small>
                  Send us a message and we'll get back to you.
                </small>
              </span>
            </div>

            <IconChevronRight size={14} />
          </button>
        </section>

      </div>
    </>
  );
}
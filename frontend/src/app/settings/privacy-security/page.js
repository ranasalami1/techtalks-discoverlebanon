"use client";

import { useState } from "react";

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

function IconLock(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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

export default function PrivacySecurityPage() {
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <>
      <div className="section-header">
        <span>PREFERENCES</span>

        <h2>Privacy &amp; Security</h2>

        <p>
          Manage your privacy, security, and personal data.
        </p>
      </div>

      <section
        className="settings-card"
        style={{ maxWidth: "620px" }}
      >
        <div className="card-title-row">
          <IconLock size={18} />
          <h2>Privacy &amp; Security</h2>
        </div>

        <p className="card-description">
          Control your data and privacy settings.
        </p>

        <button type="button" className="privacy-setting-row">
          <div>
            <strong>Location permissions</strong>
            <span>
              Manage how Discover Lebanon uses your location.
            </span>
          </div>

          <IconChevronRight size={14} />
        </button>

        <button type="button" className="privacy-setting-row">
          <div>
            <strong>Personal data</strong>
            <span>
              Review and manage your personal information.
            </span>
          </div>

          <IconChevronRight size={14} />
        </button>

        <button type="button" className="privacy-setting-row">
          <div>
            <strong>Change password</strong>
            <span>
              Update the password associated with your account.
            </span>
          </div>

          <IconChevronRight size={14} />
        </button>

        <div className="privacy-setting-row">
          <div>
            <strong>Two-factor authentication</strong>
            <span>
              Add an extra layer of security to your account.
            </span>
          </div>

          <button
            type="button"
            className={`toggle ${twoFactor ? "on" : ""}`}
            onClick={() => setTwoFactor(!twoFactor)}
            aria-pressed={twoFactor}
            aria-label="Toggle two-factor authentication"
          >
            <span />
          </button>
        </div>

        <button
          type="button"
          className="privacy-setting-row privacy-danger"
        >
          <div>
            <strong>Delete my account</strong>
            <span>
              Permanently delete your account and associated data.
            </span>
          </div>

          <IconChevronRight size={14} />
        </button>
      </section>
    </>
  );
}
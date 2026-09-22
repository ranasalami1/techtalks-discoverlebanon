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

function IconDatabase(props) {
  return (
    <Icon {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </Icon>
  );
}

function IconDownload(props) {
  return (
    <Icon {...props}>
      <path d="M12 3v12" />
      <polyline points="7 10 12 15 17 10" />
      <path d="M5 21h14" />
    </Icon>
  );
}

function IconTrash(props) {
  return (
    <Icon {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M8 6V4h8v2" />
      <line x1="10" y1="10" x2="10" y2="16" />
      <line x1="14" y1="10" x2="14" y2="16" />
    </Icon>
  );
}

/* =========================
   PAGE
========================= */

export default function DataStoragePage() {
  const [offlineContent, setOfflineContent] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);

  return (
    <>
      <div className="section-header">
        <span>PREFERENCES</span>

        <h2>Data &amp; Storage</h2>

        <p>
          Manage downloaded content and storage preferences.
        </p>
      </div>

      <div className="data-storage-grid">

        {/* STORAGE */}

        <section className="settings-card">
          <div className="card-title-row">
            <IconDatabase size={18} />
            <h2>Storage</h2>
          </div>

          <p className="card-description">
            Review how Discover Lebanon uses storage on your device.
          </p>

          <div className="storage-summary">
            <div className="storage-bar">
              <span />
            </div>

            <div className="storage-values">
              <span>Downloaded content</span>
              <strong>1.2 GB</strong>
            </div>
          </div>

          <button type="button" className="storage-action-row">
            <div>
              <IconTrash size={16} />

              <span>
                <strong>Clear downloaded content</strong>
                <small>
                  Remove saved offline maps and downloaded content.
                </small>
              </span>
            </div>

            <span className="storage-action-arrow">›</span>
          </button>
        </section>

        {/* DOWNLOAD SETTINGS */}

        <section className="settings-card">
          <div className="card-title-row">
            <IconDownload size={18} />
            <h2>Download Preferences</h2>
          </div>

          <p className="card-description">
            Control how content is downloaded to your device.
          </p>

          <div className="data-setting-row">
            <div>
              <strong>Offline content</strong>
              <span>
                Allow content to be saved for offline use.
              </span>
            </div>

            <button
              type="button"
              className={`toggle ${offlineContent ? "on" : ""}`}
              onClick={() => setOfflineContent(!offlineContent)}
              aria-pressed={offlineContent}
              aria-label="Toggle offline content"
            >
              <span />
            </button>
          </div>

          <div className="data-setting-row">
            <div>
              <strong>Download using Wi-Fi only</strong>
              <span>
                Avoid using mobile data for downloads.
              </span>
            </div>

            <button
              type="button"
              className={`toggle ${wifiOnly ? "on" : ""}`}
              onClick={() => setWifiOnly(!wifiOnly)}
              aria-pressed={wifiOnly}
              aria-label="Toggle Wi-Fi only downloads"
            >
              <span />
            </button>
          </div>
        </section>

      </div>
    </>
  );
}
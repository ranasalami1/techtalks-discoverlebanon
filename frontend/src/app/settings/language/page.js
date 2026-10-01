"use client";

import { useState } from "react";

function Icon({ children, size = 16 }) {
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
    >
      {children}
    </svg>
  );
}

function IconGlobe(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Icon>
  );
}

export default function LanguagePage() {
  const [selected, setSelected] = useState("English");

  const options = ["Arabic", "English", "French"];

  return (
    <>
      <div className="section-header">
        <span>PREFERENCES</span>
        <h2>Language</h2>
        <p>Choose your preferred language.</p>
      </div>

      <section className="settings-card" style={{ maxWidth: 480 }}>
        <div className="card-title-row">
          <IconGlobe size={18} />
          <h2>Choose Language</h2>
        </div>

        <p className="card-description">
          This changes the language used throughout the app.
        </p>

        {options.map((option) => (
          <button
            key={option}
            className="option"
            onClick={() => setSelected(option)}
          >
            <span
              className={`radio ${selected === option ? "selected" : ""}`}
            />
            {option}
          </button>
        ))}
      </section>
    </>
  );
}
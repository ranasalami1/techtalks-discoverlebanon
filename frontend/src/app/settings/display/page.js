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

function IconSun(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </Icon>
  );
}

function IconMoon(props) {
  return (
    <Icon {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Icon>
  );
}

export default function DisplayPage() {
  const [mode, setMode] = useState("Light");

  const options = [
    { name: "Light", icon: IconSun },
    { name: "Dark", icon: IconMoon },
  ];

  return (
    <>
      <div className="section-header">
        <span>PREFERENCES</span>
        <h2>Display</h2>
        <p>Customize how Discover Lebanon looks.</p>
      </div>

      <section className="settings-card" style={{ maxWidth: 480 }}>
        <div className="card-title-row">
          <IconSun size={18} />
          <h2>Appearance</h2>
        </div>

        <p className="card-description">
          Choose how the app looks on your device.
        </p>

        {options.map(({ name, icon: OptIcon }) => (
          <button
            key={name}
            className="option"
            onClick={() => setMode(name)}
          >
            <span className={`radio ${mode === name ? "selected" : ""}`} />
            <OptIcon size={14} />
            {name}
          </button>
        ))}
      </section>
    </>
  );
}
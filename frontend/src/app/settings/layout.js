"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AppShell from "@/components/AppShell";
import "./settings.css";

/* =====================================================
   SIMPLE ICON
===================================================== */

function Icon({
  children,
  size = 16,
}) {
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


/* =====================================================
   ICONS
===================================================== */

function IconGear(props) {
  return (
    <Icon {...props}>
      <circle
        cx="12"
        cy="12"
        r="3"
      />

      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Icon>
  );
}


function IconBell(props) {
  return (
    <Icon {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Icon>
  );
}


function IconLock(props) {
  return (
    <Icon {...props}>
      <rect
        x="3"
        y="11"
        width="18"
        height="11"
        rx="2"
        ry="2"
      />

      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icon>
  );
}


function IconSun(props) {
  return (
    <Icon {...props}>
      <circle
        cx="12"
        cy="12"
        r="5"
      />

      <line
        x1="12"
        y1="1"
        x2="12"
        y2="3"
      />

      <line
        x1="12"
        y1="21"
        x2="12"
        y2="23"
      />

      <line
        x1="4.22"
        y1="4.22"
        x2="5.64"
        y2="5.64"
      />

      <line
        x1="18.36"
        y1="18.36"
        x2="19.78"
        y2="19.78"
      />

      <line
        x1="1"
        y1="12"
        x2="3"
        y2="12"
      />

      <line
        x1="21"
        y1="12"
        x2="23"
        y2="12"
      />

      <line
        x1="4.22"
        y1="19.78"
        x2="5.64"
        y2="18.36"
      />

      <line
        x1="18.36"
        y1="5.64"
        x2="19.78"
        y2="4.22"
      />
    </Icon>
  );
}


function IconGlobe(props) {
  return (
    <Icon {...props}>
      <circle
        cx="12"
        cy="12"
        r="10"
      />

      <line
        x1="2"
        y1="12"
        x2="22"
        y2="12"
      />

      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Icon>
  );
}


function IconDatabase(props) {
  return (
    <Icon {...props}>
      <ellipse
        cx="12"
        cy="5"
        rx="9"
        ry="3"
      />

      <path d="M3 5v14a9 3 0 0 0 18 0V5" />

      <path d="M3 12a9 3 0 0 0 18 0" />
    </Icon>
  );
}


function IconHelpCircle(props) {
  return (
    <Icon {...props}>
      <circle
        cx="12"
        cy="12"
        r="10"
      />

      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />

      <line
        x1="12"
        y1="17"
        x2="12.01"
        y2="17"
      />
    </Icon>
  );
}


/* =====================================================
   SETTINGS MENU
===================================================== */

const sections = [
  {
    name: "General",
    href: "/settings",
    icon: IconGear,
  },

  {
    name: "Notifications",
    href: "/settings/notifications",
    icon: IconBell,
  },

  {
    name: "Privacy & Security",
    href: "/settings/privacy-security",
    icon: IconLock,
  },

  {
    name: "Display",
    href: "/settings/display",
    icon: IconSun,
  },

  {
    name: "Language",
    href: "/settings/language",
    icon: IconGlobe,
  },

  {
    name: "Data & Storage",
    href: "/settings/data-storage",
    icon: IconDatabase,
  },

  {
    name: "Help & Support",
    href: "/settings/help-support",
    icon: IconHelpCircle,
  },
];


/* =====================================================
   SETTINGS LAYOUT
===================================================== */

export default function SettingsLayout({
  children,
}) {
  const pathname =
    usePathname();

  return (
    <AppShell>

      <main className="settings-page">

        {/* =============================================
            HERO
        ============================================= */}

        <section className="settings-hero">

          <div className="settings-hero-overlay" />

          <div className="settings-hero-content">

            <span>
              YOUR EXPERIENCE
            </span>

            <h1>
              Settings
            </h1>

            <p>
              Customize your experience and make Discover Lebanon truly yours.
            </p>

          </div>

        </section>


        {/* =============================================
            SETTINGS BODY
        ============================================= */}

        <section className="settings-container">

          {/* INTERNAL SETTINGS MENU */}

          <aside className="settings-menu">

            <p className="menu-label">
              SETTINGS
            </p>


            {sections.map(
              ({
                name,
                href,
                icon:
                  ItemIcon,
              }) => {

                const active =
                  pathname === href;

                return (
                  <Link
                    key={name}
                    href={href}
                    className={`menu-item ${
                      active
                        ? "active"
                        : ""
                    }`}
                  >
                    <ItemIcon
                      size={15}
                    />

                    {name}
                  </Link>
                );
              }
            )}

          </aside>


          {/* =============================================
              THIS IS VERY IMPORTANT
              Next.js renders page.js here
          ============================================= */}

          <div className="settings-main">
            {children}
          </div>

        </section>

      </main>

    </AppShell>
  );
}
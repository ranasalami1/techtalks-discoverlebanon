"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  ChevronDown,
} from "lucide-react";

import "./Navbar.css";

export default function Navbar({ onMenuClick }) {
  const pathname = usePathname();

  const links = [
    {
      label: "EXPLORE THE MAP",
      href: "/explore",
    },
    {
      label: "CURATED ITINERARIES",
      href: "/itineraries",
    },
    {
      label: "HERITAGE STORIES",
      href: "/heritage",
    },
  ];

  return (
    <header className="top-navbar">

      {/* MOBILE MENU */}
      <button
        className="navbar-menu-button"
        type="button"
        aria-label="Open navigation"
        onClick={onMenuClick}
      >
        <Menu size={24} strokeWidth={1.8} />
      </button>

      {/* MOBILE LOGO */}
      <Link
        href="/"
        className="navbar-mobile-logo"
      >
        Discover Lebanon
      </Link>

      {/* DESKTOP LINKS */}
      <nav
        className="navbar-links"
        aria-label="Top navigation"
      >
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive
                  ? "navbar-link navbar-link-active"
                  : "navbar-link"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* RIGHT */}
      <div className="navbar-actions">

        <Link
          href="/search"
          className="navbar-search"
        >
          <Search size={18} strokeWidth={1.8} />
          <span>SEARCH</span>
        </Link>

        <span
          className="navbar-separator"
          aria-hidden="true"
        />

        {/* PROFILE */}
        <button
          className="navbar-profile"
          type="button"
          aria-label="Open profile"
        >
          <div className="navbar-profile-picture">
            L
          </div>

          <span className="navbar-user-name">
            Lara
          </span>

          <ChevronDown
            size={15}
            strokeWidth={1.7}
            className="navbar-profile-chevron"
          />
        </button>

        {/* LANGUAGE */}
        <button
          className="navbar-language"
          type="button"
        >
          <span>EN</span>

          <ChevronDown
            size={14}
            strokeWidth={1.7}
          />
        </button>

      </div>

    </header>
  );
}
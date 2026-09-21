"use client";

import "./Navbar.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link
          href="/map"
          className={pathname === "/map" ? "active" : ""}
        >
          EXPLORE THE MAP
        </Link>

        <Link
          href="/itineraries"
          className={pathname === "/itineraries" ? "active" : ""}
        >
          CURATED ITINERARIES
        </Link>

        <Link
          href="/heritage"
          className={pathname === "/heritage" ? "active" : ""}
        >
          HERITAGE STORIES
        </Link>

        <Link
          href="/search"
          className={
            pathname === "/search"
              ? "active search-link"
              : "search-link"
          }
        >
          <span className="search-icon">⌕</span>
          SEARCH
        </Link>

        <button className="language-btn">
          EN <span>⌄</span>
        </button>
      </div>
    </nav>
  );
}
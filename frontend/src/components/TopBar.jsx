"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Explore the Map", href: "/map" },
  { label: "Curated Itineraries", href: "/itineraries" },
  { label: "Heritage Stories", href: "/stories" },
];

const languages = ["EN", "AR", "FR"];

export default function TopBar() {
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("EN");

  return (
    <header className="absolute right-0 top-0 z-20 flex items-center justify-end gap-4 border-b border-white/30 bg-transparent px-5 py-4 text-white sm:gap-8 sm:px-10">
      <nav className="hidden items-center gap-8 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-[10px] font-medium tracking-[0.08em] transition-colors hover:text-white ${
              pathname.startsWith(link.href) ? "text-white" : "text-white/85"
            }`}
          >
            {link.label.toUpperCase()}
          </Link>
        ))}
      </nav>

      <div className="hidden h-5 w-px bg-white/50 md:block" />

      <Link
        href="/search"
        className={`flex items-center gap-2 rounded-sm px-2 py-1 text-[10px] font-semibold tracking-[0.12em] ${
          pathname.startsWith("/search")
            ? "bg-white text-ink underline decoration-1 underline-offset-4"
            : "text-white/90 hover:bg-white/15 hover:text-white"
        }`}
      >
        <Search size={15} strokeWidth={1.75} />
        SEARCH
      </Link>

      <div className="h-5 w-px bg-white/50" />

      <div className="relative">
        <button
          type="button"
          onClick={() => setLangOpen((open) => !open)}
          className="flex items-center gap-1 text-[10px] font-medium tracking-[0.08em] text-white/85 hover:text-white"
        >
          {lang}
          <ChevronDown size={14} strokeWidth={1.75} />
        </button>
        {langOpen && (
          <ul className="absolute right-0 top-7 z-10 w-20 overflow-hidden rounded-lg border border-border bg-cream shadow-md">
            {languages.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    setLang(option);
                    setLangOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-[13px] text-ink-soft hover:bg-cream-soft hover:text-ink"
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}

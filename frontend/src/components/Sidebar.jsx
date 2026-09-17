"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  ListChecks,
  Landmark,
  Bookmark,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";

const primaryNav = [
  { label: "Explore the Map", href: "/map", icon: Map },
  { label: "Curated Itineraries", href: "/itineraries", icon: ListChecks },
  { label: "Heritage Stories", href: "/stories", icon: Landmark },
  { label: "Saved Places", href: "/saved", icon: Bookmark },
];

const secondaryNav = [
  { label: "My Account", href: "/account", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help", href: "/help", icon: HelpCircle },
];

function NavLink({ item, active }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-[15px] transition-colors ${
        active
          ? "bg-olive-soft text-olive-dark font-medium"
          : "text-ink-soft hover:bg-cream-soft hover:text-ink"
      }`}
    >
      <Icon size={18} strokeWidth={1.75} />
      {item.label}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[280px] shrink-0 flex-col justify-between border-r border-border bg-cream px-6 py-8 lg:flex">
      <div>
        <Link href="/" className="block">
          <div
            className="bg-gradient-to-b from-gold to-olive-dark bg-clip-text text-3xl leading-none text-transparent"
            style={{ fontFamily: "var(--font-arabic)" }}
            dir="rtl"
          >
            اكتشف لبنان
          </div>
          <div className="mt-2 font-serif text-xl font-bold tracking-wide text-ink">
            DISCOVER LEBANON
          </div>
          <div className="mt-1 text-xs text-ink-faint">
            Interactive Heritage &amp; Activity Guide
          </div>
        </Link>

        <nav className="mt-10 flex flex-col gap-1">
          {primaryNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={pathname.startsWith(item.href)}
            />
          ))}
        </nav>

        <div className="my-6 border-t border-border" />

        <nav className="flex flex-col gap-1">
          {secondaryNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={pathname.startsWith(item.href)}
            />
          ))}
        </nav>
      </div>

      <div>
        <p
          className="text-2xl text-ink-soft"
          style={{ fontFamily: "var(--font-script)" }}
        >
          A deeper way to explore
        </p>

        <svg
          viewBox="0 0 220 120"
          className="mt-4 w-full text-olive/40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        >
          <path d="M20 110 L20 55 A40 40 0 0 1 100 55 L100 110" />
          <path d="M0 110 H120" />
          <path d="M130 110 L130 40 H210 V110" />
          <path d="M130 60 H210" />
          <path d="M145 110 V60 M160 110 V60 M175 110 V60 M190 110 V60" />
          <circle cx="200" cy="20" r="10" opacity="0.5" />
        </svg>

        <div className="mt-4 flex items-center justify-between text-[11px] tracking-[0.2em] text-ink-faint">
          <span>
            PLACES
            <br />
            PEOPLE
            <br />
            STORIES
            <br />
            LEBANON
          </span>
        </div>
      </div>
    </aside>
  );
}

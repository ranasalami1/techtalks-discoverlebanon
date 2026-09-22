"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { primaryNavigation } from "@/data/navigation";

// Top links mirror the first three sidebar entries so the two navs never drift apart.
const topLinks = primaryNavigation.slice(0, 3);

export default function TopBar() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-end gap-8 bg-cream px-6 py-5 sm:px-10">
      <nav className="hidden items-center gap-8 md:flex" aria-label="Top navigation">
        {topLinks.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`text-[13px] font-medium tracking-[0.12em] transition-colors hover:text-ink ${
                active ? "text-ink" : "text-ink-soft"
              }`}
            >
              {link.label.toUpperCase()}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/search"
        className="flex items-center gap-2 text-[13px] font-medium tracking-[0.12em] text-ink-soft hover:text-ink"
      >
        <Search size={17} strokeWidth={1.75} />
        SEARCH
      </Link>

      <div className="h-6 w-px bg-border" />

      <button
        type="button"
        className="flex items-center gap-2 text-[14px] font-medium text-ink hover:text-olive"
        aria-label="Account menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-olive-soft text-[12px] font-semibold text-olive ring-1 ring-border">
          L
        </span>
        Lara
        <ChevronDown size={14} strokeWidth={1.75} />
      </button>
    </header>
  );
}

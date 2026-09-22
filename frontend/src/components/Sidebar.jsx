"use client";
import "./Sidebar.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  CircleHelp,
  Landmark,
  List,
  Map,
  Settings,
  User,
} from "lucide-react";
import { primaryNavigation, secondaryNavigation } from "@/data/navigation";

const navigationIcons = {
  bookmark: Bookmark,
  "circle-help": CircleHelp,
  landmark: Landmark,
  list: List,
  map: Map,
  settings: Settings,
  user: User,
};

function NavigationLink({ item, pathname, onNavigate }) {
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = navigationIcons[item.icon];

  return (
    <Link
      className={`sidebar-link${isActive ? " sidebar-link-active" : ""}`}
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
    >
      <Icon className="sidebar-link-icon" aria-hidden="true" strokeWidth={1.8} />
      <span>{item.label}</span>
    </Link>
  );
}

function SidebarIllustration() {
  return (
    <svg
      viewBox="0 0 200 190"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 178 V82" />
      <path d="M60 178 V82" />
      <path d="M20 82 Q20 54 40 54 Q60 54 60 82" />
      <path d="M14 178 H66" />
      <path d="M12 96 H68" opacity=".7" />
      <path d="M12 118 H68" opacity=".7" />
      <path d="M12 140 H68" opacity=".7" />
      <path d="M6 54 H74" opacity=".7" />
      <path d="M130 178 V148" />
      <path d="M108 148 L130 118 L152 148 Z" />
      <path d="M114 122 L130 96 L146 122 Z" />
      <path d="M119 98 L130 78 L141 98 Z" />
      <path d="M2 178 H198" opacity=".5" />
    </svg>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      <button
        className={`sidebar-backdrop${isOpen ? " sidebar-backdrop-visible" : ""}`}
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
      />
      <aside className={`sidebar${isOpen ? " sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <Link className="brand-mark" href="/" onClick={onClose}>
            <span className="brand-mark-arabic" lang="ar" dir="rtl">اكتشف لبنان</span>
            <span className="brand-mark-en">Discover Lebanon</span>
          </Link>
          <p className="brand-tagline">Interactive Heritage &amp; Activity Guide</p>
          <button className="sidebar-close" type="button" aria-label="Close navigation" onClick={onClose}>×</button>
        </div>
        <nav className="sidebar-navigation" aria-label="Primary navigation">
          {primaryNavigation.map((item) => <NavigationLink key={item.href} item={item} pathname={pathname} onNavigate={onClose} />)}
          <div className="sidebar-divider" role="separator" />
          {secondaryNavigation.map((item) => <NavigationLink key={item.href} item={item} pathname={pathname} onNavigate={onClose} />)}
        </nav>
        <div className="sidebar-tagline">
          <span className="sidebar-tagline-accent" aria-hidden="true" />
          <p>A deeper<br />way to explore</p>
        </div>
        <div className="sidebar-illustration" aria-hidden="true">
          <SidebarIllustration />
        </div>
      </aside>
    </>
  );
}

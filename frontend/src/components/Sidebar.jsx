"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  CircleHelp,
  Landmark,
  Map,
  Route,
  Settings,
  User,
} from "lucide-react";
import { primaryNavigation, secondaryNavigation } from "@/data/navigation";

const navigationIcons = {
  bookmark: Bookmark,
  "circle-help": CircleHelp,
  landmark: Landmark,
  map: Map,
  route: Route,
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
            <span className="brand-mark-symbol" aria-hidden="true">DL</span>
            <span><strong>Discover</strong><small>Lebanon</small></span>
          </Link>
          <button className="sidebar-close" type="button" aria-label="Close navigation" onClick={onClose}>×</button>
        </div>
        <nav className="sidebar-navigation" aria-label="Primary navigation">
          <p className="sidebar-section-label">Discover</p>
          {primaryNavigation.map((item) => <NavigationLink key={item.href} item={item} pathname={pathname} onNavigate={onClose} />)}
          <p className="sidebar-section-label sidebar-section-label-spaced">Your space</p>
          {secondaryNavigation.map((item) => <NavigationLink key={item.href} item={item} pathname={pathname} onNavigate={onClose} />)}
        </nav>
        <div className="sidebar-footer"><span className="sidebar-footer-dot" aria-hidden="true" />Made for curious travelers</div>
      </aside>
    </>
  );
}
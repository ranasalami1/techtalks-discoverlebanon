"use client";

import { useSyncExternalStore } from "react";
import { Bookmark } from "lucide-react";

const STORAGE_KEY = "discover-lebanon:saved-places";
const listeners = new Set();

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot() {
  return "[]";
}

function parseSaved(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function SaveButton({ placeId, variant = "solid" }) {
  const savedIds = parseSaved(useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot));
  const saved = savedIds.includes(placeId);

  function toggle() {
    const next = saved ? savedIds.filter((id) => id !== placeId) : [...savedIds, placeId];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable — nothing to persist
    }
    listeners.forEach((listener) => listener());
  }

  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium tracking-[0.08em] transition-colors";
  const styles =
    variant === "solid"
      ? saved
        ? "bg-olive-dark text-cream"
        : "bg-cream/90 text-ink backdrop-blur hover:bg-cream"
      : saved
        ? "border border-olive-dark bg-olive-soft text-olive-dark"
        : "border border-border text-ink-soft hover:border-olive hover:text-ink";

  return (
    <button type="button" onClick={toggle} aria-pressed={saved} className={`${base} ${styles}`}>
      <Bookmark size={16} strokeWidth={1.75} fill={saved ? "currentColor" : "none"} />
      {saved ? "SAVED" : "SAVE PLACE"}
    </button>
  );
}

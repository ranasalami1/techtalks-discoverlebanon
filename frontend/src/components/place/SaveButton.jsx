"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

const STORAGE_KEY = "discover-lebanon:saved-places";

function readSaved() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function SaveButton({ placeId, variant = "solid" }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readSaved().includes(placeId));
  }, [placeId]);

  function toggle() {
    const current = readSaved();
    const next = current.includes(placeId)
      ? current.filter((id) => id !== placeId)
      : [...current, placeId];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable — keep in-memory state only
    }
    setSaved(next.includes(placeId));
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
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={`${base} ${styles}`}
    >
      <Bookmark
        size={16}
        strokeWidth={1.75}
        fill={saved ? "currentColor" : "none"}
      />
      {saved ? "SAVED" : "SAVE PLACE"}
    </button>
  );
}

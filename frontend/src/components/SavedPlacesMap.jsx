import { MapPin } from "lucide-react";
import { mapPins } from "@/data/savedPlaces";

// Simplified outline of Lebanon with pins for each saved location.
export default function SavedPlacesMap() {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-[#e9e3d3]">
      <svg
        viewBox="0 0 100 133"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d9dcc6" />
            <stop offset="1" stopColor="#cfd2b8" />
          </linearGradient>
        </defs>
        <rect width="100" height="133" fill="#dfe6e3" />
        <path
          d="M52 4 L70 8 L84 22 L92 48 L96 78 L88 104 L70 122 L48 130 L26 118 L12 96 L8 70 L14 44 L26 22 Z"
          fill="url(#land)"
          stroke="#b9b8a2"
          strokeWidth="0.8"
        />
        <path
          d="M40 18 C48 40, 44 70, 36 96"
          fill="none"
          stroke="#c6c3ab"
          strokeWidth="0.6"
          strokeDasharray="1.5 1.5"
        />
      </svg>

      {mapPins.map((pin) => (
        <div
          key={pin.label}
          className="absolute flex -translate-x-1/2 -translate-y-full items-center gap-1 text-[12px] font-medium text-ink"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <MapPin size={18} strokeWidth={2} className="text-ink" fill="#fff" />
          <span>{pin.label}</span>
        </div>
      ))}
    </div>
  );
}

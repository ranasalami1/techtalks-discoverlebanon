// Placeholder content matching the approved Saved Places mockup (KAN-10).
// Images are picsum placeholders keyed by seed — swap for real assets later.
// Replace with data fetched from the backend saved-places API once it's available.
const img = (seed) => `https://picsum.photos/seed/${seed}/800/500`;

export const savedFilters = [
  { id: "all", label: "All Saved", icon: "bookmark" },
  { id: "places", label: "Places", icon: "map-pin" },
  { id: "activities", label: "Activities", icon: "hiking" },
  { id: "restaurants", label: "Restaurants", icon: "utensils" },
];

export const savedPlaces = [
  {
    id: "byblos-citadel",
    title: "Byblos Citadel",
    location: "Byblos",
    note: "Incredible history and sea views. A must visit again!",
    badge: "Cultural Site",
    type: "places",
    image: img("byblos-citadel"),
    savedAt: "2026-09-14",
  },
  {
    id: "cedars-of-god",
    title: "Cedars of God",
    location: "Bsharri",
    note: "Breathtaking landscapes. Perfect for a hiking trip.",
    badge: "Nature",
    type: "places",
    image: img("cedars-of-god"),
    savedAt: "2026-09-12",
  },
  {
    id: "raouche-rock",
    title: "Raouché Rock",
    location: "Beirut",
    note: "Stunning sunset view. Go again in the evening.",
    badge: "Coastal",
    type: "places",
    image: img("raouche-rock"),
    savedAt: "2026-09-10",
  },
  {
    id: "deir-el-qamar",
    title: "Deir el Qamar",
    location: "Chouf",
    note: "Beautiful architecture and peaceful atmosphere.",
    badge: "Traditional Village",
    type: "places",
    image: img("deir-el-qamar"),
    savedAt: "2026-09-05",
  },
  {
    id: "local-manousheh-bakery",
    title: "Local Manousheh Bakery",
    location: "Beirut",
    note: "Amazing authentic taste! Try the zaatar manousheh.",
    badge: "Food & Gastronomy",
    type: "restaurants",
    image: img("manousheh-bakery"),
    savedAt: "2026-08-30",
  },
  {
    id: "baalbek-temples",
    title: "Baalbek Temples",
    location: "Baalbek",
    note: "Impressive and unforgettable. Plan a full day visit.",
    badge: "Cultural Site",
    type: "places",
    image: img("baalbek-temples"),
    savedAt: "2026-08-22",
  },
  {
    id: "qadisha-valley-hike",
    title: "Qadisha Valley Hike",
    location: "Bsharri",
    note: "Monasteries carved into the cliffs. Bring good shoes.",
    badge: "Hiking",
    type: "activities",
    image: img("qadisha-valley"),
    savedAt: "2026-08-15",
  },
  {
    id: "tyre-sea-kayaking",
    title: "Tyre Sea Kayaking",
    location: "Tyre",
    note: "Paddle past the old harbour at golden hour.",
    badge: "Water Sports",
    type: "activities",
    image: img("tyre-kayaking"),
    savedAt: "2026-08-08",
  },
];

// Map pins for the saved-places mini map (positions are % of the map box).
export const mapPins = [
  { label: "Tripoli", x: 48, y: 17 },
  { label: "Bsharri", x: 54, y: 29 },
  { label: "Byblos", x: 36, y: 40 },
  { label: "Baalbek", x: 63, y: 46 },
  { label: "Beirut", x: 30, y: 52 },
  { label: "Deir el Qamar", x: 36, y: 64 },
  { label: "Tyre", x: 18, y: 80 },
];

// Placeholder content matching the approved design mockup.
// Replace with data fetched from the backend search API once it's available.

export const categories = [
  { id: "all", label: "All", icon: "grid" },
  { id: "places", label: "Places", icon: "map-pin" },
  { id: "activities", label: "Activities", icon: "activity" },
  { id: "cultural-sites", label: "Cultural Sites", icon: "landmark" },
  { id: "food", label: "Food & Gastronomy", icon: "utensils" },
  { id: "nature", label: "Nature & Outdoors", icon: "trees" },
  { id: "stories", label: "Stories", icon: "book-open" },
];

export const searchSuggestions = [
  "Byblos",
  "hiking",
  "Roman ruins",
  "local food",
  "beaches",
  "festivals",
];

export const searchResults = [
  {
    id: "byblos-citadel",
    title: "Byblos Citadel",
    location: "Byblos",
    description: "A timeless city where history meets the sea.",
    badge: "Cultural Site",
    category: "cultural-sites",
    accent: "olive",
  },
  {
    id: "cedars-of-god",
    title: "Cedars of God",
    location: "Bsharri",
    description: "Majestic forests and breathtaking mountain views.",
    badge: "Nature",
    category: "nature",
    accent: "green",
  },
  {
    id: "raouche-rock",
    title: "Raouché Rock",
    location: "Beirut",
    description: "Iconic cliffs and a stunning Mediterranean sunset.",
    badge: "Experience",
    category: "activities",
    accent: "blue",
  },
  {
    id: "baalbek-ruins",
    title: "Baalbek Ruins",
    location: "Baalbek",
    description: "One of the greatest Roman treasures in the world.",
    badge: "Cultural Site",
    category: "cultural-sites",
    accent: "olive",
  },
  {
    id: "deir-el-qamar",
    title: "Deir el Qamar",
    location: "Chouf",
    description: "A historic village full of charm and tradition.",
    badge: "Village",
    category: "places",
    accent: "brown",
  },
  {
    id: "local-cuisine",
    title: "Local Cuisine",
    location: "Various Locations",
    description: "Authentic flavors, homegrown ingredients.",
    badge: "Food",
    category: "food",
    accent: "red",
  },
  {
    id: "lebanon-mountain-trail",
    title: "The Lebanon Mountain Trail",
    location: "Various Regions",
    description: "Hike through nature, villages, and stunning landscapes.",
    badge: "Hiking",
    category: "activities",
    accent: "teal",
  },
  {
    id: "tripoli-old-souk",
    title: "Tripoli Old Souk",
    location: "Tripoli",
    description: "A vibrant souk with a rich cultural heritage.",
    badge: "Experience",
    category: "cultural-sites",
    accent: "blue",
  },
];

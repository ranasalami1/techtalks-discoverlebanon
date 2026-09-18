import { places } from "@/data/places";

export function getAllPlaces() {
  return places;
}

export function getPlaceById(id) {
  return places.find((place) => place.id === id) ?? null;
}

export function getNearbyPlaces(place) {
  return place.nearby.map((id) => getPlaceById(id)).filter(Boolean);
}

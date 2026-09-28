import { notFound } from "next/navigation";
import { getAllPlaces, getNearbyPlaces, getPlaceById } from "@/lib/places";
import PlaceHero from "@/components/place/PlaceHero";
import PlaceOverview from "@/components/place/PlaceOverview";
import PracticalInfo from "@/components/place/PracticalInfo";
import PlaceGallery from "@/components/place/PlaceGallery";
import PlaceLocation from "@/components/place/PlaceLocation";
import NearbyPlaces from "@/components/place/NearbyPlaces";
import ItinerarySuggestions from "@/components/place/ItinerarySuggestions";
import SavedPlaceSummary from "@/components/place/SavedPlaceSummary";
import { savedPlaces } from "@/data/savedPlaces";

// Saved items that don't have full place data yet fall back to their saved-place
// summary instead of a 404. Remove once both pages load places from the backend API.
function getSavedPlaceById(id) {
  return savedPlaces.find((item) => item.id === id) ?? null;
}

export function generateStaticParams() {
  return getAllPlaces().map((place) => ({ id: place.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const place = getPlaceById(id);
  if (place) {
    return {
      title: `${place.name} · Discover Lebanon`,
      description: place.tagline,
    };
  }
  const saved = getSavedPlaceById(id);
  if (saved) {
    return { title: `${saved.title} · Discover Lebanon`, description: saved.note };
  }
  return { title: "Place not found · Discover Lebanon" };
}

export default async function PlaceDetailsPage({ params }) {
  const { id } = await params;
  const place = getPlaceById(id);
  if (!place) {
    const saved = getSavedPlaceById(id);
    if (saved) return <SavedPlaceSummary place={saved} />;
    notFound();
  }

  const nearby = getNearbyPlaces(place);

  return (
    <article>
      <PlaceHero place={place} />

      <div className="mx-auto max-w-6xl space-y-16 px-6 py-12 sm:px-10 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
          <PlaceOverview place={place} />
          <PracticalInfo practical={place.practical} />
        </div>

        <PlaceGallery images={place.gallery} placeName={place.name} />
        <PlaceLocation location={place.location} placeName={place.name} />
        <NearbyPlaces places={nearby} />
        <ItinerarySuggestions
          itineraries={place.itineraries}
          placeName={place.name}
        />
      </div>
    </article>
  );
}

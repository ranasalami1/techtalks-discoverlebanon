import { notFound } from "next/navigation";
import { getAllPlaces, getNearbyPlaces, getPlaceById } from "@/lib/places";
import PlaceHero from "@/components/place/PlaceHero";
import PlaceOverview from "@/components/place/PlaceOverview";
import PracticalInfo from "@/components/place/PracticalInfo";
import PlaceGallery from "@/components/place/PlaceGallery";
import PlaceLocation from "@/components/place/PlaceLocation";
import NearbyPlaces from "@/components/place/NearbyPlaces";
import ItinerarySuggestions from "@/components/place/ItinerarySuggestions";

export function generateStaticParams() {
  return getAllPlaces().map((place) => ({ id: place.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const place = getPlaceById(id);
  if (!place) return { title: "Place not found · Discover Lebanon" };
  return {
    title: `${place.name} · Discover Lebanon`,
    description: place.tagline,
  };
}

export default async function PlaceDetailsPage({ params }) {
  const { id } = await params;
  const place = getPlaceById(id);
  if (!place) notFound();

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

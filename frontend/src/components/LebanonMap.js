"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import lebanonOutline from "@/data/lebanon-outline.json";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

// Restrict the interactive viewport to Lebanon and mask surrounding territory.
// The outline is an approximate cartographic shape, not a legal boundary.
const LEBANON_BOUNDS = L.latLngBounds(
  [33.02, 35.05],
  [34.75, 36.68]
);
const LEBANON_RING = lebanonOutline.geometry.coordinates[0]
  .map(([longitude, latitude]) => [latitude, longitude]);
const MASK_OUTER_RING = [
  [25, 25], [25, 45], [43, 45], [43, 25],
];

function LebanonViewport() {
  const map = useMap();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      map.invalidateSize();
      map.fitBounds(LEBANON_BOUNDS, {
        animate: false,
        padding: [14, 14],
        maxZoom: 9.5,
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [map]);
  return null;
}


/* =====================================================
   MAIN MAP LOCATIONS
===================================================== */

const locations = [
  {
    name: "Tripoli",
    latitude: 34.4335,
    longitude: 35.8442,
  },
  {
    name: "Batroun",
    latitude: 34.2553,
    longitude: 35.6581,
  },
  {
    name: "Byblos",
    latitude: 34.123,
    longitude: 35.6519,
  },
  {
    name: "Beirut",
    latitude: 33.8938,
    longitude: 35.5018,
  },
  {
    name: "Zahle",
    latitude: 33.8463,
    longitude: 35.902,
  },
  {
    name: "Baalbek",
    latitude: 34.0069,
    longitude: 36.2039,
  },
  {
    name: "Chouf",
    latitude: 33.697,
    longitude: 35.567,
  },
  {
    name: "Nabatieh",
    latitude: 33.378,
    longitude: 35.483,
  },
  {
    name: "Sidon",
    latitude: 33.5575,
    longitude: 35.3715,
  },
  {
    name: "Tyre",
    latitude: 33.2705,
    longitude: 35.2038,
  },
];


/* =====================================================
   MARKER
===================================================== */

const markerIcon = L.divIcon({
  className: "",
  html: `
    <div
      style="
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: #66715b;
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,.35);
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <div
        style="
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
        "
      ></div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});


/* =====================================================
   GROUPS
===================================================== */

const groups = [
  {
    key: "restaurant",
    label: "Restaurants",
    category: "Restaurant",
  },
  {
    key: "coffee",
    label: "Coffee Shops",
    category: "Coffee Shop",
  },
  {
    key: "activity",
    label: "Activities",
    category: "Activity",
  },
];


/* =====================================================
   API HELPERS
===================================================== */

function getResults(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.items)) {
    return payload.data.items;
  }

  if (Array.isArray(payload?.data?.places)) {
    return payload.data.places;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.places)) {
    return payload.places;
  }

  return [];
}


function getPlace(payload) {
  if (payload?.data?.place) {
    return payload.data.place;
  }

  if (payload?.data) {
    return payload.data;
  }

  if (payload?.place) {
    return payload.place;
  }

  return payload;
}


function getCategoryArray(place) {
  if (!Array.isArray(place?.categories)) {
    return [];
  }

  return place.categories
    .map((category) => {
      if (typeof category === "string") {
        return category;
      }

      return (
        category?.name ??
        category?.category_name ??
        ""
      );
    })
    .filter(Boolean);
}


function getCategoryNames(place) {
  return getCategoryArray(place).join(", ");
}


function belongsToGroup(place, groupKey) {
  const group = groups.find(
    (item) => item.key === groupKey
  );

  if (!group) {
    return false;
  }

  const categories =
    getCategoryArray(place).map(
      (category) =>
        category.trim().toLowerCase()
    );

  return categories.includes(
    group.category.toLowerCase()
  );
}


/* =====================================================
   LOCALITY HELPERS
===================================================== */

function getLocalityName(place, regionName) {
  const city = place?.city?.trim();
  if (!city) return regionName;
  if (String(regionName).trim().toLowerCase() !== "tyre") return city;

  // Display-only normalization; does not modify PostgreSQL records.
  const aliases = {
    "tyre - old port": "Old Port",
    "tyre - al-bass": "Al-Bass",
    "jal el-bahr": "Jal El Bahr",
    "aabbasiyyeh / tyre area": "Aabbasiyyeh",
    "borj ech chemali / tyre area": "Borj Ech Chemali",
    "borj el chmali": "Borj Ech Chemali",
    "tyre - old souk": "Old Souk",
    "tyre - corniche": "Corniche",
    "tyre - christian quarter": "Christian Quarter",
    "tyre - al-mina": "Al-Mina",
    "tyre - seaside road": "Seaside Road",
    "tyre - western sea": "Western Sea",
    "tyre - al-mina / seaside": "Al-Mina",
  };
  const lower = city.toLowerCase();
  if (lower === "tyre - old city" && String(place?.name || "").toLowerCase().includes("old souk")) {
    return "Old Souk";
  }
  return aliases[lower] ?? city;
}


function getLocalityKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}


/* =====================================================
   CLEAN RESEARCH NOTES FOR PUBLIC DISPLAY
   (original data in PostgreSQL remains unchanged)
===================================================== */

function cleanResearchText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\s*\|?\s*\[\s*REVIEW\s*:[^\]]*\]/gi, "")
    .replace(/\s*\|\s*REVIEW\s*:.*/gi, "")
    .replace(/^\s*REVIEW\s*:.*/gi, "")
    .trim();
}


/* =====================================================
   GOOGLE MAP FALLBACK

   If Excel already provided map_url:
   -> use it.

   Otherwise:
   -> automatically search Google Maps.
===================================================== */

function getMapUrl(place) {
  if (place?.map_url) {
    return place.map_url;
  }

  const query = [
    place?.name,
    place?.address,
    place?.city,
    place?.region,
    "Lebanon",
  ]
    .filter(Boolean)
    .join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}


/* =====================================================
   FETCH ALL PLACES FOR REGION
===================================================== */

async function fetchAllRegionPlaces(
  regionName
) {
  const allPlaces = [];
  const seen = new Set();

  /*
    Flask backend currently has
    MAX_PER_PAGE = 50.
  */

  for (
    let page = 1;
    page <= 100;
    page += 1
  ) {
    const response = await fetch(
      `${API_URL}/api/places?region=${encodeURIComponent(
        regionName
      )}&page=${page}&per_page=50`
    );

    const payload = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        payload?.message ??
          "Unable to load this region."
      );
    }

    const batch = getResults(payload);

    if (batch.length === 0) {
      break;
    }

    for (const place of batch) {
      const id =
        place?.id ??
        place?.place_id;

      const key =
        id ??
        `${place?.name}-${place?.city}-${place?.region}`;

      if (!seen.has(key)) {
        seen.add(key);
        allPlaces.push(place);
      }
    }

    if (batch.length < 50) {
      break;
    }
  }

  return allPlaces;
}


/* =====================================================
   MAP FOCUS
===================================================== */

function MapFocus({
  focusRegion,
  focusRequestId,
}) {
  const map = useMap();

  useEffect(() => {
    if (!focusRegion) {
      return;
    }

    const location =
      locations.find(
        (item) =>
          item.name.toLowerCase() ===
          focusRegion.toLowerCase()
      );

    if (!location) {
      return;
    }

    map.flyTo(
      [
        location.latitude,
        location.longitude,
      ],
      10,
      {
        duration: 1,
      }
    );
  }, [
    focusRegion,
    focusRequestId,
    map,
  ]);

  return null;
}


/* =====================================================
   COMPONENT
===================================================== */

export default function LebanonMap({
  focusRegion = null,
  focusPlace = null,
  focusRequestId = 0,
}) {
  const [
    selectedRegion,
    setSelectedRegion,
  ] = useState(null);

  const [
    selectedLocality,
    setSelectedLocality,
  ] = useState(null);

  const [
    regionPlaces,
    setRegionPlaces,
  ] = useState([]);

  const [
    activeGroup,
    setActiveGroup,
  ] = useState("restaurant");

  const [
    selectedPlace,
    setSelectedPlace,
  ] = useState(null);

  const [
    loadingRegion,
    setLoadingRegion,
  ] = useState(false);

  const [
    loadingPlace,
    setLoadingPlace,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // Ignore results from earlier requests after another marker/card is chosen.
  const regionRequestRef = useRef(0);
  const placeRequestRef = useRef(0);


  /* =====================================================
     LOCALITIES
  ===================================================== */

  const localities = useMemo(() => {
    if (!selectedRegion) {
      return [];
    }

    const localityMap = new Map();

    for (const place of regionPlaces) {
      const locality =
        getLocalityName(
          place,
          selectedRegion
        );

      const key =
        getLocalityKey(locality);

      if (!localityMap.has(key)) {
        localityMap.set(key, {
          name: locality,
          count: 0,
        });
      }

      localityMap.get(key).count += 1;
    }

    return Array.from(
      localityMap.values()
    ).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [
    regionPlaces,
    selectedRegion,
  ]);


  /* =====================================================
     CURRENT LOCALITY PLACES
  ===================================================== */

  const localityPlaces =
    useMemo(() => {
      if (
        !selectedRegion ||
        !selectedLocality
      ) {
        return [];
      }

      const wanted =
        getLocalityKey(
          selectedLocality
        );

      return regionPlaces.filter(
        (place) => {
          const locality =
            getLocalityName(
              place,
              selectedRegion
            );

          return (
            getLocalityKey(locality) ===
            wanted
          );
        }
      );
    }, [
      regionPlaces,
      selectedRegion,
      selectedLocality,
    ]);


  /* =====================================================
     CATEGORY COUNTS
  ===================================================== */

  const counts = useMemo(() => {
    return {
      restaurant:
        localityPlaces.filter(
          (place) =>
            belongsToGroup(
              place,
              "restaurant"
            )
        ).length,

      coffee:
        localityPlaces.filter(
          (place) =>
            belongsToGroup(
              place,
              "coffee"
            )
        ).length,

      activity:
        localityPlaces.filter(
          (place) =>
            belongsToGroup(
              place,
              "activity"
            )
        ).length,
    };
  }, [localityPlaces]);


  /* =====================================================
     FILTERED PLACES
  ===================================================== */

  const visiblePlaces =
    useMemo(() => {
      return localityPlaces.filter(
        (place) =>
          belongsToGroup(
            place,
            activeGroup
          )
      );
    }, [
      localityPlaces,
      activeGroup,
    ]);


  /* =====================================================
     CLOSE
  ===================================================== */

  const closePanel = () => {
    regionRequestRef.current += 1;
    placeRequestRef.current += 1;
    setLoadingRegion(false);
    setLoadingPlace(false);
    setSelectedRegion(null);
    setSelectedLocality(null);
    setSelectedPlace(null);

    setRegionPlaces([]);

    setError("");
  };


  /* =====================================================
     LOAD REGION
  ===================================================== */

  const loadRegion =
    useCallback(
      async (location, requestedPlace = null) => {
        const requestId = ++regionRequestRef.current;
        placeRequestRef.current += 1;
        setLoadingRegion(true);

        setError("");

        setSelectedRegion(
          location.name
        );

        setSelectedLocality(null);
        setSelectedPlace(null);

        setRegionPlaces([]);

        setActiveGroup(
          "restaurant"
        );

        try {
          const places =
            await fetchAllRegionPlaces(
              location.name
            );

          if (requestId !== regionRequestRef.current) return;
          setRegionPlaces(places);

          // A featured place card can open the matching locality and detail
          // panel directly without requiring an extra map click.
          if (requestedPlace) {
            const wantedId = String(requestedPlace.place_id ?? requestedPlace.id ?? "");
            const match = places.find((place) =>
              String(place.place_id ?? place.id ?? "") === wantedId
            );
            if (match) {
              setSelectedLocality(getLocalityName(match, location.name));
              const matchCategories = getCategoryArray(match).map((c) => c.toLowerCase());
              if (matchCategories.includes("restaurant")) setActiveGroup("restaurant");
              else if (matchCategories.includes("coffee shop")) setActiveGroup("coffee");
              else setActiveGroup("activity");
              setSelectedPlace(match); // Immediate display; details GET enriches the record.
              await loadPlaceDetails(match);
            }
          }

          if (
            places.length === 0
          ) {
            setError(
              `No database places were found for ${location.name}.`
            );
          }
        } catch (err) {
          if (requestId === regionRequestRef.current) {
            setError(
              err?.message ??
                "Unable to connect to the backend."
            );
          }
        } finally {
          if (requestId === regionRequestRef.current) {
            setLoadingRegion(false);
          }
        }
      },
      []
    );


  /* =====================================================
     OPTIONAL FEATURED DESTINATION SUPPORT
  ===================================================== */

  useEffect(() => {
    if (!focusRegion) {
      return;
    }

    const location =
      locations.find(
        (item) =>
          item.name.toLowerCase() ===
          focusRegion.toLowerCase()
      );

    if (location) {
      loadRegion(location, focusPlace);
    }
  }, [
    focusRegion,
    focusPlace,
    focusRequestId,
    loadRegion,
  ]);


  /* =====================================================
     CHOOSE CITY / VILLAGE
  ===================================================== */

  const chooseLocality = (
    localityName
  ) => {
    setSelectedLocality(
      localityName
    );

    setSelectedPlace(null);
    setError("");

    const places =
      regionPlaces.filter(
        (place) => {
          const locality =
            getLocalityName(
              place,
              selectedRegion
            );

          return (
            getLocalityKey(
              locality
            ) ===
            getLocalityKey(
              localityName
            )
          );
        }
      );


    const restaurantCount =
      places.filter(
        (place) =>
          belongsToGroup(
            place,
            "restaurant"
          )
      ).length;

    const coffeeCount =
      places.filter(
        (place) =>
          belongsToGroup(
            place,
            "coffee"
          )
      ).length;

    const activityCount =
      places.filter(
        (place) =>
          belongsToGroup(
            place,
            "activity"
          )
      ).length;


    if (restaurantCount > 0) {
      setActiveGroup(
        "restaurant"
      );
    } else if (coffeeCount > 0) {
      setActiveGroup(
        "coffee"
      );
    } else if (activityCount > 0) {
      setActiveGroup(
        "activity"
      );
    }
  };


  /* =====================================================
     PLACE DETAILS
  ===================================================== */

  const loadPlaceDetails =
    async (place) => {
      const requestId = ++placeRequestRef.current;
      const placeId =
        place?.id ??
        place?.place_id;

      if (!placeId) {
        setSelectedPlace(place);
        return;
      }

      setLoadingPlace(true);
      setError("");

      try {
        const response =
          await fetch(
            `${API_URL}/api/places/${placeId}`
          );

        const payload =
          await response
            .json()
            .catch(
              () => ({})
            );

        if (!response.ok) {
          throw new Error(
            payload?.message ??
              "Unable to load place details."
          );
        }

        if (requestId === placeRequestRef.current) {
          setSelectedPlace(getPlace(payload));
        }
      } catch (err) {
        if (requestId === placeRequestRef.current) {
          setError(err?.message ?? "Unable to load place details.");
        }
      } finally {
        if (requestId === placeRequestRef.current) {
          setLoadingPlace(false);
        }
      }
    };


  const categories =
    selectedPlace
      ? getCategoryNames(
          selectedPlace
        )
      : "";


  const description = cleanResearchText(
    selectedPlace?.description ??
    selectedPlace?.short_description ??
    selectedPlace?.summary ??
    ""
  );

  const publicNotes = cleanResearchText(
    selectedPlace?.notes
  );

  const showNotes =
    Boolean(publicNotes) &&
    publicNotes.toLowerCase() !== description.toLowerCase();


  const selectedMapUrl =
    selectedPlace
      ? getMapUrl(selectedPlace)
      : null;


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="
        relative
        h-full
        min-h-[620px]
        w-full
        overflow-hidden
      "
    >
      <MapContainer
        center={[
          33.8547,
          35.8623,
        ]}
        zoom={9}
        minZoom={8}
        maxZoom={18}
        maxBounds={LEBANON_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom
        className="
          h-full
          min-h-[620px]
          w-full
        "
      >

        <LebanonViewport />

        {/* SATELLITE */}

        <TileLayer
          attribution="Tiles © Esri"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />


        {/* PLACE LABELS */}

        <TileLayer
          attribution="Esri reference layer"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        />


        <MapFocus
          focusRegion={
            focusRegion
          }
          focusRequestId={
            focusRequestId
          }
        />


        {/* Cover all places outside Lebanon. Only the Lebanon silhouette
            remains visible on the satellite map. This layer is not clickable. */}
        <Polygon
          positions={[MASK_OUTER_RING, LEBANON_RING]}
          interactive={false}
          pathOptions={{
            fillRule: "evenodd",
            fillColor: "#f8f5ef",
            fillOpacity: 1,
            stroke: false,
          }}
        />
        <Polygon
          positions={LEBANON_RING}
          interactive={false}
          pathOptions={{
            color: "#f6f0e2",
            opacity: 0.95,
            weight: 2,
            fill: false,
          }}
        />

        {/* REGION MARKERS */}

        {locations.map(
          (location) => (
            <Marker
              key={
                location.name
              }
              position={[
                location.latitude,
                location.longitude,
              ]}
              icon={
                markerIcon
              }
              eventHandlers={{
                click: () =>
                  loadRegion(
                    location
                  ),
              }}
            >
              <Tooltip
                direction="right"
                offset={[
                  15,
                  0,
                ]}
              >
                <strong>
                  {
                    location.name
                  }
                </strong>
              </Tooltip>
            </Marker>
          )
        )}

      </MapContainer>


      {/* =====================================================
          LOADING REGION
      ===================================================== */}

      {loadingRegion && (
        <div
          className="
            absolute
            left-4
            top-4
            z-[1200]
            rounded-xl
            bg-white
            px-4
            py-3
            text-sm
            font-medium
            text-[#41443c]
            shadow-lg
          "
        >
          Loading region...
        </div>
      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          className="
            absolute
            bottom-5
            left-5
            right-5
            z-[1300]
            rounded-xl
            border
            border-[#e4b5a8]
            bg-white
            p-4
            shadow-xl
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <p
              className="
                text-sm
                text-[#a0442c]
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="
                text-lg
                text-[#686a64]
              "
            >
              ×
            </button>
          </div>
        </div>
      )}


      {/* =====================================================
          STEP 1
          REGION → CITY / VILLAGE
      ===================================================== */}

      {selectedRegion &&
        !selectedLocality &&
        !selectedPlace && (
          <div
            className="
              absolute
              bottom-4
              left-4
              right-4
              top-4
              z-[1000]
              flex
              flex-col
              overflow-hidden
              rounded-2xl
              bg-white/95
              shadow-2xl
              backdrop-blur
            "
          >

            <div
              className="
                border-b
                border-[#e9e5dc]
                p-5
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >
                <div>
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[#a87537]
                    "
                  >
                    Explore Lebanon
                  </p>

                  <h2
                    className="
                      mt-1
                      font-serif
                      text-2xl
                      font-semibold
                      text-[#252821]
                    "
                  >
                    {selectedRegion}
                  </h2>

                  {!loadingRegion && (
                    <p
                      className="
                        mt-1
                        text-xs
                        text-[#777a72]
                      "
                    >
                      {
                        localities.length
                      }{" "}
                      cities / villages ·{" "}
                      {
                        regionPlaces.length
                      }{" "}
                      places
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={
                    closePanel
                  }
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-[#f1eee7]
                    text-lg
                    text-[#55584f]
                    hover:bg-[#e5e0d6]
                  "
                >
                  ×
                </button>
              </div>
            </div>


            <div
              className="
                flex-1
                overflow-y-auto
                p-4
              "
            >
              {loadingRegion ? (
                <div
                  className="
                    flex
                    h-full
                    items-center
                    justify-center
                  "
                >
                  <p
                    className="
                      text-sm
                      text-[#777a72]
                    "
                  >
                    Loading villages...
                  </p>
                </div>
              ) : localities.length ===
                0 ? (
                <div
                  className="
                    py-12
                    text-center
                  "
                >
                  <p
                    className="
                      text-sm
                      text-[#777a72]
                    "
                  >
                    No localities found.
                  </p>
                </div>
              ) : (
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                  "
                >
                  {localities.map(
                    (locality) => (
                      <button
                        key={
                          locality.name
                        }
                        type="button"
                        onClick={() =>
                          chooseLocality(
                            locality.name
                          )
                        }
                        className="
                          rounded-xl
                          border
                          border-[#e5e0d6]
                          bg-white
                          p-4
                          text-left
                          transition
                          hover:border-[#9a927f]
                          hover:shadow-md
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                          "
                        >
                          <div>
                            <h3
                              className="
                                font-serif
                                text-base
                                font-semibold
                                text-[#292c25]
                              "
                            >
                              {
                                locality.name
                              }
                            </h3>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-[#777a72]
                              "
                            >
                              {
                                locality.count
                              }{" "}
                              places
                            </p>
                          </div>

                          <span
                            className="
                              text-xl
                              text-[#8d795b]
                            "
                          >
                            ›
                          </span>
                        </div>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}


      {/* =====================================================
          STEP 2
          LOCALITY → CATEGORY → PLACES
      ===================================================== */}

      {selectedRegion &&
        selectedLocality &&
        !selectedPlace && (
          <div
            className="
              absolute
              bottom-4
              left-4
              right-4
              top-4
              z-[1050]
              flex
              flex-col
              overflow-hidden
              rounded-2xl
              bg-white/95
              shadow-2xl
              backdrop-blur
            "
          >

            <div
              className="
                border-b
                border-[#e9e5dc]
                p-5
              "
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedLocality(
                    null
                  );

                  setSelectedPlace(
                    null
                  );
                }}
                className="
                  mb-3
                  text-xs
                  font-semibold
                  text-[#7b6647]
                  hover:underline
                "
              >
                ← Back to{" "}
                {selectedRegion}
              </button>


              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >
                <div>
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[#a87537]
                    "
                  >
                    {selectedRegion}
                  </p>

                  <h2
                    className="
                      mt-1
                      font-serif
                      text-2xl
                      font-semibold
                      text-[#252821]
                    "
                  >
                    {
                      selectedLocality
                    }
                  </h2>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-[#777a72]
                    "
                  >
                    {
                      localityPlaces.length
                    }{" "}
                    places
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closePanel
                  }
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-[#f1eee7]
                    text-lg
                    text-[#55584f]
                    hover:bg-[#e5e0d6]
                  "
                >
                  ×
                </button>
              </div>


              <div
                className="
                  mt-4
                  grid
                  grid-cols-3
                  gap-2
                "
              >
                {groups.map(
                  (group) => {
                    const active =
                      activeGroup ===
                      group.key;

                    return (
                      <button
                        key={
                          group.key
                        }
                        type="button"
                        onClick={() =>
                          setActiveGroup(
                            group.key
                          )
                        }
                        className={`
                          rounded-xl
                          px-2
                          py-2
                          text-xs
                          font-semibold
                          transition

                          ${
                            active
                              ? "bg-[#66715b] text-white"
                              : "bg-[#f1eee7] text-[#55584f] hover:bg-[#e5e0d6]"
                          }
                        `}
                      >
                        <span className="block">
                          {
                            group.label
                          }
                        </span>

                        <span
                          className={`
                            mt-1
                            block
                            text-[10px]

                            ${
                              active
                                ? "text-white/80"
                                : "text-[#8a8c85]"
                            }
                          `}
                        >
                          {
                            counts[
                              group.key
                            ] ?? 0
                          }
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>


            <div
              className="
                flex-1
                overflow-y-auto
                p-4
              "
            >
              {visiblePlaces.length ===
              0 ? (
                <div
                  className="
                    py-12
                    text-center
                  "
                >
                  <p
                    className="
                      text-sm
                      text-[#777a72]
                    "
                  >
                    No places found in
                    this category.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visiblePlaces.map(
                    (place) => {
                      const placeId =
                        place.id ??
                        place.place_id;

                      return (
                        <button
                          key={
                            placeId ??
                            `${place.name}-${place.city}`
                          }
                          type="button"
                          onClick={() =>
                            loadPlaceDetails(
                              place
                            )
                          }
                          className="
                            w-full
                            rounded-xl
                            border
                            border-[#e9e5dc]
                            bg-white
                            p-4
                            text-left
                            transition
                            hover:border-[#c9c0af]
                            hover:shadow-md
                          "
                        >
                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-3
                            "
                          >
                            <div>
                              <h3
                                className="
                                  font-semibold
                                  text-[#292c25]
                                "
                              >
                                {
                                  place.name
                                }
                              </h3>

                              <p
                                className="
                                  mt-1
                                  text-xs
                                  text-[#777a72]
                                "
                              >
                                {
                                  selectedLocality
                                }
                                ,{" "}
                                {
                                  selectedRegion
                                }
                              </p>
                            </div>

                            <span
                              className="
                                text-lg
                                text-[#8d795b]
                              "
                            >
                              ›
                            </span>
                          </div>

                          {cleanResearchText(place.short_description) && (
                            <p
                              className="
                                mt-2
                                line-clamp-2
                                text-xs
                                leading-5
                                text-[#666961]
                              "
                            >
                              {
                                cleanResearchText(place.short_description)
                              }
                            </p>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        )}


      {/* =====================================================
          STEP 3
          PLACE DETAILS
      ===================================================== */}

      {selectedPlace && (
        <div
          className="
            absolute
            bottom-4
            left-4
            right-4
            top-4
            z-[1100]
            flex
            flex-col
            overflow-hidden
            rounded-2xl
            bg-white/95
            shadow-2xl
            backdrop-blur
          "
        >

          <div
            className="
              border-b
              border-[#e9e5dc]
              p-5
            "
          >
            <button
              type="button"
              onClick={() =>
                setSelectedPlace(
                  null
                )
              }
              className="
                mb-4
                text-xs
                font-semibold
                text-[#7b6647]
                hover:underline
              "
            >
              ← Back to{" "}
              {selectedLocality}
            </button>


            <div
              className="
                flex
                items-start
                justify-between
                gap-5
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-[#a87537]
                  "
                >
                  Discover Lebanon
                </p>

                <h2
                  className="
                    mt-1
                    font-serif
                    text-2xl
                    font-semibold
                    text-[#252821]
                  "
                >
                  {
                    selectedPlace.name ??
                    "Place"
                  }
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closePanel
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f1eee7]
                  text-lg
                  text-[#55584f]
                  hover:bg-[#e5e0d6]
                "
              >
                ×
              </button>
            </div>
          </div>


          <div
            className="
              flex-1
              overflow-y-auto
              p-5
            "
          >
            {loadingPlace ? (
              <p
                className="
                  text-sm
                  text-[#777a72]
                "
              >
                Loading details...
              </p>
            ) : (
              <>

                {(selectedPlace.city ||
                  selectedPlace.region) && (
                  <p
                    className="
                      text-sm
                      text-[#6d7067]
                    "
                  >
                    {[
                      selectedPlace.city,
                      selectedPlace.region,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}


                {categories && (
                  <div
                    className="
                      mt-3
                      inline-flex
                      rounded-full
                      bg-[#e8ebdf]
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-[#566047]
                    "
                  >
                    {categories}
                  </div>
                )}


                {selectedPlace.rating !=
                  null && (
                  <p
                    className="
                      mt-4
                      text-sm
                      font-semibold
                      text-[#44473f]
                    "
                  >
                    Rating:{" "}
                    {
                      selectedPlace.rating
                    }

                    {selectedPlace.review_count !=
                      null &&
                      ` (${selectedPlace.review_count} reviews)`}
                  </p>
                )}


                {description && (
                  <p
                    className="
                      mt-4
                      text-sm
                      leading-6
                      text-[#555850]
                    "
                  >
                    {description}
                  </p>
                )}


                <div
                  className="
                    mt-5
                    space-y-3
                    border-t
                    border-[#ebe7de]
                    pt-4
                  "
                >

                  {selectedPlace.venue_type && (
                    <p
                      className="
                        text-xs
                        text-[#777a72]
                      "
                    >
                      <span
                        className="
                          font-semibold
                          text-[#44473f]
                        "
                      >
                        Type:
                      </span>{" "}
                      {
                        selectedPlace.venue_type
                      }
                    </p>
                  )}


                  {selectedPlace.address && (
                    <p
                      className="
                        text-xs
                        text-[#777a72]
                      "
                    >
                      <span
                        className="
                          font-semibold
                          text-[#44473f]
                        "
                      >
                        Address:
                      </span>{" "}
                      {
                        selectedPlace.address
                      }
                    </p>
                  )}


                  {selectedPlace.phone && (
                    <p
                      className="
                        text-xs
                        text-[#777a72]
                      "
                    >
                      <span
                        className="
                          font-semibold
                          text-[#44473f]
                        "
                      >
                        Phone:
                      </span>{" "}
                      {
                        selectedPlace.phone
                      }
                    </p>
                  )}


                  {selectedPlace.opening_hours && (
                    <p
                      className="
                        text-xs
                        text-[#777a72]
                      "
                    >
                      <span
                        className="
                          font-semibold
                          text-[#44473f]
                        "
                      >
                        Opening hours:
                      </span>{" "}
                      {
                        selectedPlace.opening_hours
                      }
                    </p>
                  )}


                  {selectedPlace.status && (
                    <p
                      className="
                        text-xs
                        text-[#777a72]
                      "
                    >
                      <span
                        className="
                          font-semibold
                          text-[#44473f]
                        "
                      >
                        Status:
                      </span>{" "}
                      {
                        selectedPlace.status
                      }
                    </p>
                  )}


                  {selectedPlace.public_access && (
                    <p
                      className="
                        text-xs
                        text-[#777a72]
                      "
                    >
                      <span
                        className="
                          font-semibold
                          text-[#44473f]
                        "
                      >
                        Public access:
                      </span>{" "}
                      {
                        selectedPlace.public_access
                      }
                    </p>
                  )}


                  {showNotes && (
                    <p
                      className="
                        text-xs
                        leading-5
                        text-[#777a72]
                      "
                    >
                      <span
                        className="
                          font-semibold
                          text-[#44473f]
                        "
                      >
                        Notes:
                      </span>{" "}
                      {
                        publicNotes
                      }
                    </p>
                  )}
                </div>


                {/* =====================================================
                    LINKS
                ===================================================== */}

                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  {selectedPlace.website && (
                    <a
                      href={
                        selectedPlace.website
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="
                        rounded-lg
                        bg-[#66715b]
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-white
                      "
                    >
                      Website
                    </a>
                  )}


                  {/* OPEN MAP ALWAYS EXISTS */}

                  {selectedMapUrl && (
                    <a
                      href={
                        selectedMapUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="
                        rounded-lg
                        bg-[#66715b]
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#59634f]
                      "
                    >
                      Open Map
                    </a>
                  )}


                  {/* RESEARCH SOURCE */}

                  {selectedPlace.source_url && (
                    <a
                      href={
                        selectedPlace.source_url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="
                        rounded-lg
                        bg-[#eee9df]
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-[#5d574d]
                        transition
                        hover:bg-[#e3ddcf]
                      "
                    >
                      Source
                    </a>
                  )}

                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
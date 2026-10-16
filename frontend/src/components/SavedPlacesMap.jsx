"use client";

import {
  useEffect,
  useMemo,
} from "react";

import Link from "next/link";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


/* =====================================================
   LEBANON
===================================================== */

const LEBANON_CENTER = [
  33.8547,
  35.8623,
];


const LEBANON_BOUNDS = [
  [
    32.95,
    34.95,
  ],

  [
    34.75,
    36.75,
  ],
];


/* =====================================================
   FALLBACK CITY COORDINATES

   Used only when a database place does not yet
   contain latitude/longitude.
===================================================== */

const localityCoordinates = {
  tripoli: [
    34.4335,
    35.8442,
  ],

  batroun: [
    34.2553,
    35.6581,
  ],

  byblos: [
    34.123,
    35.6519,
  ],

  jbeil: [
    34.123,
    35.6519,
  ],

  beirut: [
    33.8938,
    35.5018,
  ],

  bsharri: [
    34.2509,
    36.0106,
  ],

  bcharre: [
    34.2509,
    36.0106,
  ],

  baalbek: [
    34.0069,
    36.2039,
  ],

  zahle: [
    33.8463,
    35.902,
  ],

  chouf: [
    33.697,
    35.567,
  ],

  "deir el qamar": [
    33.6977,
    35.5632,
  ],

  sidon: [
    33.5575,
    35.3715,
  ],

  saida: [
    33.5575,
    35.3715,
  ],

  tyre: [
    33.2705,
    35.2038,
  ],

  sour: [
    33.2705,
    35.2038,
  ],

  nabatieh: [
    33.378,
    35.483,
  ],
};


/* =====================================================
   ICON
===================================================== */

const savedMarkerIcon =
  L.divIcon({
    className: "",

    html: `
      <div
        style="
          width: 32px;
          height: 32px;
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
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: white;
          "
        ></div>
      </div>
    `,

    iconSize: [
      32,
      32,
    ],

    iconAnchor: [
      16,
      16,
    ],

    popupAnchor: [
      0,
      -18,
    ],
  });


/* =====================================================
   HELPERS
===================================================== */

function numberOrNull(
  value
) {
  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? number
    : null;
}


function normalizeKey(
  value
) {
  return String(
    value || ""
  )
    .trim()
    .toLowerCase();
}


function getMapPoint(
  place
) {
  const latitude =
    numberOrNull(
      place?.latitude
    );

  const longitude =
    numberOrNull(
      place?.longitude
    );


  if (
    latitude != null &&
    longitude != null &&
    latitude >= 32 &&
    latitude <= 35.5 &&
    longitude >= 34.5 &&
    longitude <= 37.5
  ) {
    return {
      latitude,
      longitude,
      approximate:
        false,
    };
  }


  const candidates = [
    place?.city,
    place?.region,
    place?.location
      ?.split(",")?.[0],
  ];


  for (
    const candidate
    of candidates
  ) {

    const key =
      normalizeKey(
        candidate
      );


    if (
      localityCoordinates[
        key
      ]
    ) {
      return {
        latitude:
          localityCoordinates[
            key
          ][0],

        longitude:
          localityCoordinates[
            key
          ][1],

        approximate:
          true,
      };
    }

  }


  return null;
}


/* =====================================================
   FIT MARKERS
===================================================== */

function FitSavedPlaces({
  points,
}) {
  const map =
    useMap();


  useEffect(() => {

    if (
      points.length === 0
    ) {

      map.setView(
        LEBANON_CENTER,
        8
      );

      return;
    }


    if (
      points.length === 1
    ) {

      map.flyTo(
        [
          points[0]
            .latitude,

          points[0]
            .longitude,
        ],
        11,
        {
          duration:
            0.7,
        }
      );

      return;
    }


    const bounds =
      L.latLngBounds(
        points.map(
          (point) => [
            point.latitude,
            point.longitude,
          ]
        )
      );


    map.fitBounds(
      bounds,
      {
        padding: [
          35,
          35,
        ],

        maxZoom:
          11,
      }
    );

  }, [
    map,
    points,
  ]);


  return null;
}


/* =====================================================
   MAP
===================================================== */

export default function SavedPlacesMap({
  places = [],
  detailsLabel = "View Details",
  approximateLabel =
    "Approximate location",
}) {
  const points =
    useMemo(
      () => {

        return places
          .map(
            (
              place
            ) => {

              const point =
                getMapPoint(
                  place
                );


              if (!point) {
                return null;
              }


              return {
                ...point,
                place,
              };

            }
          )
          .filter(Boolean);

      },
      [places]
    );


  return (

    <div
      className="
        relative
        aspect-[3/4]
        min-h-[360px]
        overflow-hidden
        rounded-xl
        border
        border-border
        bg-[#dfe5df]
      "
    >

      <MapContainer
        center={
          LEBANON_CENTER
        }

        zoom={8}

        minZoom={8}

        maxZoom={18}

        maxBounds={
          LEBANON_BOUNDS
        }

        maxBoundsViscosity={
          0.9
        }

        scrollWheelZoom

        className="
          h-full
          w-full
        "
      >

        {/* REAL OPENSTREETMAP */}

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'

          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        <FitSavedPlaces
          points={
            points
          }
        />


        {
          points.map(
            (
              point
            ) => (

              <Marker
                key={
                  point
                    .place
                    .id
                }

                position={[
                  point.latitude,
                  point.longitude,
                ]}

                icon={
                  savedMarkerIcon
                }
              >

                <Popup>

                  <div
                    style={{
                      minWidth:
                        "150px",
                    }}
                  >

                    <strong
                      style={{
                        display:
                          "block",

                        marginBottom:
                          "3px",

                        fontSize:
                          "14px",
                      }}
                    >
                      {
                        point
                          .place
                          .title
                      }
                    </strong>


                    <span
                      style={{
                        display:
                          "block",

                        marginBottom:
                          "7px",

                        fontSize:
                          "11px",

                        color:
                          "#69665f",
                      }}
                    >
                      {
                        point
                          .place
                          .location
                      }
                    </span>


                    {
                      point
                        .approximate && (

                        <span
                          style={{
                            display:
                              "block",

                            marginBottom:
                              "7px",

                            fontSize:
                              "10px",

                            color:
                              "#857654",
                          }}
                        >
                          {
                            approximateLabel
                          }
                        </span>

                      )
                    }


                    <Link
                      href={
                        `/saved/${point.place.id}`
                      }

                      style={{
                        color:
                          "#59654c",

                        fontSize:
                          "12px",

                        fontWeight:
                          600,

                        textDecoration:
                          "underline",
                      }}
                    >
                      {
                        detailsLabel
                      }
                    </Link>

                  </div>

                </Popup>

              </Marker>

            )
          )
        }

      </MapContainer>


      {
        points.length ===
          0 && (

          <div
            className="
              pointer-events-none
              absolute
              bottom-3
              left-3
              right-3
              z-[500]
              rounded-lg
              bg-white/90
              px-3
              py-2
              text-center
              text-[11px]
              text-ink-soft
              shadow
            "
          >
            No map coordinates are available for the currently displayed places.
          </div>

        )
      }

    </div>
  );
}
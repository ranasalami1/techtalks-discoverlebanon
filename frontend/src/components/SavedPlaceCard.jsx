"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Bookmark,
  Ellipsis,
  LoaderCircle,
  MapPin,
  Trash2,
} from "lucide-react";


export default function SavedPlaceCard({
  place,
  onRemove,
  busy = false,
  labels = {},
}) {
  const [
    menuOpen,
    setMenuOpen,
  ] =
    useState(false);


  const [
    imageError,
    setImageError,
  ] =
    useState(false);


  const menuRef =
    useRef(null);


  const viewDetails =
    labels.viewDetails ||
    "View Details";


  const removeLabel =
    labels.remove ||
    "Remove from saved";


  const moreLabel =
    labels.more ||
    "More options";


  /* =====================================================
     CLOSE MENU
  ===================================================== */

  useEffect(() => {

    if (!menuOpen) {
      return;
    }


    function handleOutside(
      event
    ) {

      if (
        !menuRef
          .current
          ?.contains(
            event.target
          )
      ) {
        setMenuOpen(
          false
        );
      }

    }


    function handleEscape(
      event
    ) {

      if (
        event.key ===
        "Escape"
      ) {
        setMenuOpen(
          false
        );
      }

    }


    document.addEventListener(
      "mousedown",
      handleOutside
    );


    document.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, [
    menuOpen,
  ]);


  const image =
    imageError
      ? "/images/heritage-hero.jpg"
      : place.image;


  return (

    <article
      className="
        flex
        min-w-0
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-border
        bg-white
        shadow-sm
        transition

        hover:-translate-y-0.5
        hover:shadow-md
      "
    >

      {/* =================================================
          IMAGE
      ================================================= */}

      <div
        className="
          relative
          aspect-[16/10]
          overflow-hidden
          bg-[#dde1d6]
        "
      >

        <img
          src={
            image
          }

          alt={
            place.title
          }

          onError={() =>
            setImageError(
              true
            )
          }

          className="
            h-full
            w-full
            object-cover
          "
        />


        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/15
            to-transparent
          "
        />


        <span
          className="
            absolute
            left-3
            top-3
            max-w-[70%]
            truncate
            rounded-full
            bg-ink/65
            px-3
            py-1
            text-[10px]
            font-medium
            text-white
            backdrop-blur-sm
          "
        >
          {
            place.badge
          }
        </span>


        {/* =================================================
            ... MENU
        ================================================= */}

        <div
          ref={
            menuRef
          }

          className="
            absolute
            right-3
            top-3
          "
        >

          <button
            type="button"

            disabled={
              busy
            }

            onClick={() =>
              setMenuOpen(
                (
                  previous
                ) =>
                  !previous
              )
            }

            aria-label={
              `${moreLabel}: ${place.title}`
            }

            aria-expanded={
              menuOpen
            }

            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white/95
              text-ink
              shadow-sm

              hover:bg-white

              disabled:opacity-50
            "
          >
            {
              busy ? (

                <LoaderCircle
                  size={15}

                  className="
                    animate-spin
                  "
                />

              ) : (

                <Ellipsis
                  size={17}
                />

              )
            }
          </button>


          {
            menuOpen && (

              <div
                className="
                  absolute
                  right-0
                  top-10
                  z-20
                  w-44
                  overflow-hidden
                  rounded-lg
                  border
                  border-border
                  bg-white
                  py-1
                  shadow-xl
                "
              >

                <Link
                  href={
                    `/saved/${place.id}`
                  }

                  onClick={() =>
                    setMenuOpen(
                      false
                    )
                  }

                  className="
                    block
                    px-4
                    py-2.5
                    text-[12px]
                    text-ink-soft

                    hover:bg-cream-soft
                    hover:text-ink
                  "
                >
                  {
                    viewDetails
                  }
                </Link>


                <button
                  type="button"

                  disabled={
                    busy
                  }

                  onClick={() => {

                    setMenuOpen(
                      false
                    );

                    onRemove(
                      place.id
                    );

                  }}

                  className="
                    flex
                    w-full
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    text-left
                    text-[12px]
                    text-red-700

                    hover:bg-red-50

                    disabled:opacity-50
                  "
                >
                  <Trash2
                    size={13}
                  />

                  {
                    removeLabel
                  }
                </button>

              </div>

            )
          }

        </div>

      </div>


      {/* =================================================
          BODY
      ================================================= */}

      <div
        className="
          flex
          flex-1
          flex-col
          px-4
          pb-4
          pt-3
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

          <div
            className="
              min-w-0
            "
          >

            <h3
              className="
                line-clamp-2
                font-serif
                text-[18px]
                font-semibold
                leading-tight
                text-ink
              "
            >
              {
                place.title
              }
            </h3>


            <p
              className="
                mt-1
                flex
                items-center
                gap-1
                text-[12px]
                text-ink-soft
              "
            >
              <MapPin
                size={13}
              />

              <span
                className="
                  truncate
                "
              >
                {
                  place.location
                }
              </span>

            </p>

          </div>


          <button
            type="button"

            disabled={
              busy
            }

            onClick={() =>
              onRemove(
                place.id
              )
            }

            aria-label={
              `${removeLabel}: ${place.title}`
            }

            title={
              removeLabel
            }

            className="
              mt-0.5
              shrink-0
              text-olive
              transition

              hover:text-ink

              disabled:opacity-50
            "
          >
            {
              busy ? (

                <LoaderCircle
                  size={18}

                  className="
                    animate-spin
                  "
                />

              ) : (

                <Bookmark
                  size={18}
                  strokeWidth={
                    1.75
                  }
                  fill="currentColor"
                />

              )
            }
          </button>

        </div>


        <p
          className="
            mt-3
            line-clamp-3
            text-[13px]
            leading-relaxed
            text-ink-soft
          "
        >
          {
            place.note
          }
        </p>


        <Link
          href={
            `/saved/${place.id}`
          }

          className="
            mt-auto
            inline-flex
            items-center
            gap-1.5
            pt-4
            text-[13px]
            text-ink

            hover:text-olive
          "
        >
          <span
            className="
              underline
              underline-offset-4
            "
          >
            {
              viewDetails
            }
          </span>

          <ArrowRight
            size={14}
          />
        </Link>

      </div>

    </article>
  );
}
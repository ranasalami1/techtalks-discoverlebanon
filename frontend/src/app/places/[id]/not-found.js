import Link from "next/link";

export default function PlaceNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-[11px] font-medium tracking-[0.2em] text-gold">404</p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
        We couldn&apos;t find that place
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-7 text-ink-soft">
        It may have been moved, or the link might be incorrect.
      </p>
      <Link
        href="/explore"
        className="mt-8 rounded-full bg-olive-dark px-6 py-3 text-[13px] font-medium tracking-[0.1em] text-cream hover:bg-olive"
      >
        EXPLORE THE MAP
      </Link>
    </div>
  );
}

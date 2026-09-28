export default function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-medium tracking-[0.2em] text-gold">
            {eyebrow.toUpperCase()}
          </p>
        )}
        <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

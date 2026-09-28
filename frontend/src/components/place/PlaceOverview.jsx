import SectionHeading from "./SectionHeading";

export default function PlaceOverview({ place }) {
  return (
    <section>
      <SectionHeading eyebrow="About" title={place.name} />
      <p
        className="mb-6 text-2xl leading-snug text-olive-dark"
        style={{ fontFamily: "var(--font-script)" }}
      >
        {place.tagline}
      </p>
      <div className="space-y-4 text-[15px] leading-7 text-ink-soft">
        {place.description.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

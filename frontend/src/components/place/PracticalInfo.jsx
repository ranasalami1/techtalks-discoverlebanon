import {
  Clock,
  Ticket,
  CalendarDays,
  Hourglass,
  Phone,
  Globe,
  Lightbulb,
} from "lucide-react";

function InfoRow({ icon: Icon, label, children }) {
  if (!children) return null;
  return (
    <div className="flex gap-3 py-3">
      <Icon size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-olive" />
      <div className="min-w-0">
        <dt className="text-[11px] font-medium tracking-[0.15em] text-ink-faint">
          {label.toUpperCase()}
        </dt>
        <dd className="mt-0.5 text-[15px] text-ink">{children}</dd>
      </div>
    </div>
  );
}

export default function PracticalInfo({ practical }) {
  const website = practical.website
    ? practical.website.replace(/^https?:\/\//, "")
    : "";

  return (
    <aside className="rounded-2xl border border-border bg-cream-soft/60 p-6">
      <h2 className="font-serif text-xl font-semibold text-ink">
        Practical information
      </h2>
      <dl className="mt-2 divide-y divide-border">
        <InfoRow icon={Clock} label="Opening hours">
          {practical.openingHours}
        </InfoRow>
        <InfoRow icon={Ticket} label="Entry fee">
          {practical.entryFee}
        </InfoRow>
        <InfoRow icon={CalendarDays} label="Best time to visit">
          {practical.bestTime}
        </InfoRow>
        <InfoRow icon={Hourglass} label="Suggested duration">
          {practical.duration}
        </InfoRow>
        <InfoRow icon={Phone} label="Phone">
          {practical.phone && (
            <a href={`tel:${practical.phone.replace(/\s/g, "")}`} className="hover:text-olive-dark">
              {practical.phone}
            </a>
          )}
        </InfoRow>
        <InfoRow icon={Globe} label="Website">
          {practical.website && (
            <a
              href={practical.website}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all hover:text-olive-dark"
            >
              {website}
            </a>
          )}
        </InfoRow>
      </dl>

      {practical.tips?.length > 0 && (
        <div className="mt-4 rounded-xl bg-olive-soft p-4">
          <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.15em] text-olive-dark">
            <Lightbulb size={14} strokeWidth={1.75} />
            GOOD TO KNOW
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-6 text-ink-soft">
            {practical.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

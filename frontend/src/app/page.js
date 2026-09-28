<<<<<<< HEAD
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/itineraries');
=======
import AppShell from "@/components/AppShell";

export default function Home() {
  return (
    <AppShell>

      <section className="welcome-page">

        <div className="welcome-copy">

          <p className="eyebrow">
            A doorway to Lebanon
          </p>

          <h1>
            Start with a place worth remembering.
          </h1>

          <p className="welcome-description">
            Explore landscapes, stories, and local routes as the rest
            of the Discover Lebanon experience comes together.
          </p>

        </div>

        <div
          className="welcome-stamp"
          aria-hidden="true"
        >
          <span>DL</span>

          <small>
            Discover
            <br />
            Lebanon
          </small>
        </div>

      </section>

    </AppShell>
  );
>>>>>>> origin/dev
}

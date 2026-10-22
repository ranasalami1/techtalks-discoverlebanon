import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/signup"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#6b6b63] transition hover:text-[#b5742a]"
        >
          <ArrowLeft size={17} />
          Back to Sign Up
        </Link>

        <div className="rounded-2xl border border-[#ded8cc] bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b5742a]">
            Discover Lebanon
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold text-[#30342f] sm:text-4xl">
            Terms &amp; Conditions
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#77776f]">
            Last updated: September 2026
          </p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-[#62635d]">
            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                1. Acceptance of Terms
              </h2>

              <p className="mt-2">
                By accessing or using Discover Lebanon, you agree to these
                Terms &amp; Conditions. If you do not agree with these terms,
                please do not use the platform.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                2. About Discover Lebanon
              </h2>

              <p className="mt-2">
                Discover Lebanon is a digital platform designed to help users
                explore Lebanese places, activities, heritage, stories, and
                curated itineraries.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                3. User Accounts
              </h2>

              <p className="mt-2">
                Some features may require you to create an account. You are
                responsible for providing accurate information and for keeping
                your login credentials secure.
              </p>

              <p className="mt-2">
                You are responsible for activity performed through your
                account and should contact us if you believe your account has
                been accessed without authorization.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                4. Acceptable Use
              </h2>

              <p className="mt-2">
                You agree to use Discover Lebanon only for lawful purposes and
                in a way that does not interfere with the platform or the
                experience of other users.
              </p>

              <p className="mt-2">
                You must not attempt to gain unauthorized access to the
                platform, misuse its services, introduce harmful software, or
                use the platform for fraudulent or illegal activities.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                5. Information and Content
              </h2>

              <p className="mt-2">
                We aim to provide useful and accurate information about
                destinations, activities, heritage sites, and experiences.
                However, information such as opening hours, availability,
                prices, and local conditions may change.
              </p>

              <p className="mt-2">
                Users should verify important information with the relevant
                location or service provider before making travel decisions.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                6. Intellectual Property
              </h2>

              <p className="mt-2">
                The design, branding, text, graphics, and other original
                content available through Discover Lebanon may be protected by
                intellectual property rights.
              </p>

              <p className="mt-2">
                Content may not be copied, reproduced, distributed, or used
                commercially without the appropriate permission.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                7. Third-Party Services
              </h2>

              <p className="mt-2">
                Discover Lebanon may contain links or references to third-party
                websites, businesses, maps, or services. We do not control
                third-party services and are not responsible for their
                availability, content, or practices.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                8. Limitation of Liability
              </h2>

              <p className="mt-2">
                Discover Lebanon is provided for informational and
                informational-planning purposes. To the extent permitted by
                applicable law, we are not responsible for losses or damages
                resulting from reliance on information provided through the
                platform or from third-party services.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                9. Changes to These Terms
              </h2>

              <p className="mt-2">
                These Terms &amp; Conditions may be updated when the platform
                or its services change. The latest version will be displayed
                on this page with its most recent update date.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                10. Contact
              </h2>

              <p className="mt-2">
                If you have questions about these Terms &amp; Conditions,
                please contact the Discover Lebanon team.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
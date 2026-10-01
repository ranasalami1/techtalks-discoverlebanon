import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#77776f]">
            Last updated: September 2026
          </p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-[#62635d]">
            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                1. Introduction
              </h2>

              <p className="mt-2">
                Discover Lebanon respects your privacy. This Privacy Policy
                explains the types of information that may be collected when
                you use the platform and how that information may be used and
                protected.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                2. Information We Collect
              </h2>

              <p className="mt-2">
                When you create or use an account, we may collect information
                that you provide directly, such as your name, email address,
                account credentials, and profile information.
              </p>

              <p className="mt-2">
                We may also process information generated through your use of
                the platform, such as saved places, selected preferences, and
                interactions with Discover Lebanon features.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                3. How We Use Information
              </h2>

              <p className="mt-2">
                Information may be used to provide and maintain your account,
                personalize your experience, remember saved content, improve
                the platform, provide support, and protect the security of the
                service.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                4. Account Security
              </h2>

              <p className="mt-2">
                We take reasonable measures to protect account information.
                Users should also protect their passwords and avoid sharing
                login credentials with other people.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                5. Cookies and Similar Technologies
              </h2>

              <p className="mt-2">
                Discover Lebanon may use cookies or similar technologies to
                maintain sessions, remember preferences, and improve the user
                experience.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                6. Sharing of Information
              </h2>

              <p className="mt-2">
                Personal information is not intended to be sold to third
                parties. Information may be shared with service providers when
                necessary to operate the platform or when disclosure is
                required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                7. Third-Party Links
              </h2>

              <p className="mt-2">
                The platform may provide links to external websites and
                services. Their privacy practices are governed by their own
                policies, and Discover Lebanon does not control those
                practices.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                8. Your Choices
              </h2>

              <p className="mt-2">
                Depending on the features available on the platform and
                applicable law, you may be able to review or update certain
                account information and request changes relating to your
                personal information.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                9. Changes to This Policy
              </h2>

              <p className="mt-2">
                This Privacy Policy may be updated as Discover Lebanon evolves.
                Any updated version will be published on this page with the
                corresponding update date.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-[#343831]">
                10. Contact
              </h2>

              <p className="mt-2">
                If you have questions about this Privacy Policy or how your
                information is handled, please contact the Discover Lebanon
                team.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
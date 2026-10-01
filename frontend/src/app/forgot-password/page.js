"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send reset instructions.");
      }

      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message || "Unable to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f0e9]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* =====================================================
            LEFT IMAGE
        ===================================================== */}

        <section
          className="
            relative
            hidden
            min-h-screen
            overflow-hidden
            bg-cover
            bg-center
            lg:block
          "
          style={{
            backgroundImage:
              "url('/images/heritage-hero.jpg')",
          }}
        >
          {/* OVERLAY */}

          <div className="absolute inset-0 bg-[#1f302f]/45" />

          {/* BRAND */}

          <Link
            href="/"
            className="
              absolute
              left-10
              top-9
              z-10
              text-white
            "
          >
            <div
              className="
                text-[28px]
                leading-none
                text-[#d9c7a0]
              "
              dir="rtl"
            >
              اكتشف لبنان
            </div>

            <div
              className="
                mt-2
                font-serif
                text-[17px]
                font-semibold
                uppercase
                tracking-[0.12em]
              "
            >
              Discover Lebanon
            </div>

            <p
              className="
                mt-1
                text-[9px]
                tracking-[0.08em]
                text-white/75
              "
            >
              Interactive Heritage &amp; Activity Guide
            </p>
          </Link>

          {/* LEFT TEXT */}

          <div
            className="
              absolute
              bottom-16
              left-10
              right-10
              z-10
              max-w-[520px]
              text-white
            "
          >
            <p
              className="
                mb-3
                text-[10px]
                uppercase
                tracking-[0.35em]
                text-[#dfcfaa]
              "
            >
              Rediscover Lebanon
            </p>

            <h1
              className="
                font-serif
                text-[44px]
                leading-[1.05]
              "
            >
              Your journey
              <br />
              is waiting.
            </h1>

            <div
              className="
                mt-5
                h-px
                w-16
                bg-[#c9aa70]
              "
            />

            <p
              className="
                mt-5
                max-w-[400px]
                text-[13px]
                leading-6
                text-white/85
              "
            >
              Explore places, stories and experiences
              that reveal the heart of Lebanon.
            </p>
          </div>
        </section>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <section
          className="
            relative
            flex
            min-h-screen
            items-center
            justify-center
            px-6
            py-12
            sm:px-10
            lg:px-16
          "
        >
          <div className="w-full max-w-[430px]">

            {/* MOBILE BRAND */}

            <Link
              href="/"
              className="
                mb-12
                block
                lg:hidden
              "
            >
              <p
                className="
                  font-serif
                  text-xl
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-[#33352f]
                "
              >
                Discover Lebanon
              </p>
            </Link>

            {/* =====================================================
                FORM STATE
            ===================================================== */}

            {!submitted ? (
              <>
                {/* BACK */}

                <Link
                  href="/login"
                  className="
                    mb-8
                    inline-flex
                    items-center
                    gap-2
                    text-[12px]
                    font-medium
                    text-[#77756e]
                    transition
                    hover:text-[#555a49]
                  "
                >
                  <ArrowLeft
                    size={15}
                    strokeWidth={1.7}
                  />

                  Back to login
                </Link>

                {/* TITLE */}

                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.28em]
                    text-[#9a8257]
                  "
                >
                  Account recovery
                </p>

                <h1
                  className="
                    mt-3
                    font-serif
                    text-[38px]
                    font-medium
                    leading-tight
                    text-[#30312d]
                  "
                >
                  Forgot your password?
                </h1>

                <p
                  className="
                    mt-4
                    max-w-[390px]
                    text-[13px]
                    leading-6
                    text-[#77756e]
                  "
                >
                  No worries. Enter the email address
                  associated with your account and we&apos;ll
                  send you instructions to reset your password.
                </p>

                {/* =====================================================
                    FORM
                ===================================================== */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-8"
                >
                  <label
                    htmlFor="email"
                    className="
                      mb-2
                      block
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-[#45463f]
                    "
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      strokeWidth={1.6}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-[#8c8a82]
                      "
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);

                        if (error) {
                          setError("");
                        }
                      }}
                      placeholder="Enter your email"
                      autoComplete="email"
                      className={`
                        h-[50px]
                        w-full
                        rounded-lg
                        border
                        bg-[#fbfaf7]
                        pl-11
                        pr-4
                        text-[13px]
                        text-[#34352f]
                        outline-none
                        transition
                        placeholder:text-[#aaa69d]

                        ${
                          error
                            ? "border-[#b76c63] focus:border-[#b76c63]"
                            : "border-[#d9d4ca] focus:border-[#747b64]"
                        }
                      `}
                    />
                  </div>

                  {error && (
                    <p
                      className="
                        mt-2
                        text-[11px]
                        text-[#a95f57]
                      "
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      mt-5
                      flex
                      h-[50px]
                      w-full
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#606653]
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      text-white
                      transition
                      hover:bg-[#505745]
                      active:scale-[0.99]
                      disabled:cursor-not-allowed
                      disabled:opacity-65
                    "
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>

                {/* BOTTOM LOGIN */}

                <p
                  className="
                    mt-7
                    text-center
                    text-[12px]
                    text-[#77756e]
                  "
                >
                  Remember your password?{" "}

                  <Link
                    href="/login"
                    className="
                      font-semibold
                      text-[#606653]
                      hover:underline
                    "
                  >
                    Sign in
                  </Link>
                </p>
              </>
            ) : (
              /* =====================================================
                  SUCCESS STATE
              ===================================================== */

              <div>
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-[#e3e6dc]
                    text-[#606653]
                  "
                >
                  <CheckCircle2
                    size={27}
                    strokeWidth={1.6}
                  />
                </div>

                <p
                  className="
                    mt-7
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.28em]
                    text-[#9a8257]
                  "
                >
                  Check your inbox
                </p>

                <h1
                  className="
                    mt-3
                    font-serif
                    text-[38px]
                    font-medium
                    leading-tight
                    text-[#30312d]
                  "
                >
                  Reset link sent
                </h1>

                <p
                  className="
                    mt-4
                    text-[13px]
                    leading-6
                    text-[#77756e]
                  "
                >
                  We&apos;ve sent password reset instructions to
                </p>

                <p
                  className="
                    mt-1
                    text-[13px]
                    font-semibold
                    text-[#45463f]
                  "
                >
                  {email}
                </p>

                <p
                  className="
                    mt-4
                    text-[12px]
                    leading-5
                    text-[#8b8982]
                  "
                >
                  If you don&apos;t see the email, check your spam
                  folder or try again.
                </p>

                <Link
                  href="/login"
                  className="
                    mt-7
                    flex
                    h-[50px]
                    w-full
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#606653]
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-white
                    transition
                    hover:bg-[#505745]
                  "
                >
                  Back to Login
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setError("");
                  }}
                  className="
                    mt-4
                    w-full
                    text-center
                    text-[12px]
                    font-medium
                    text-[#696d5c]
                    hover:underline
                  "
                >
                  Try another email
                </button>
              </div>
            )}

          </div>
        </section>

      </div>
    </main>
  );
}
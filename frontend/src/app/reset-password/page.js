"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, LockKeyhole } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError("This reset link is invalid or expired. Request a new one.");
      return;
    }
    if (password.length < 8) {
      setError("Your password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to reset your password.");
      }
      setIsComplete(true);
    } catch (requestError) {
      setError(requestError.message || "Unable to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f0e9] px-6 py-12">
      <section className="w-full max-w-[440px]">
        <Link
          href="/login"
          className="mb-10 inline-flex items-center gap-2 text-[12px] font-medium text-[#77756e] transition hover:text-[#555a49]"
        >
          <ArrowLeft size={15} strokeWidth={1.7} />
          Back to login
        </Link>

        {isComplete ? (
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e3e6dc] text-[#606653]">
              <CheckCircle2 size={27} strokeWidth={1.6} />
            </div>
            <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.28em] text-[#9a8257]">
              Password updated
            </p>
            <h1 className="mt-3 font-serif text-[36px] font-medium leading-tight text-[#30312d]">
              You&apos;re all set.
            </h1>
            <p className="mt-4 text-[13px] leading-6 text-[#77756e]">
              Your password has been changed. Sign in with your new password.
            </p>
            <Link
              href="/login"
              className="mt-7 flex h-[50px] w-full items-center justify-center rounded-lg bg-[#606653] text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#505745]"
            >
              Continue to login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#9a8257]">
              Account recovery
            </p>
            <h1 className="mt-3 font-serif text-[38px] font-medium leading-tight text-[#30312d]">
              Create a new password
            </h1>
            <p className="mt-4 text-[13px] leading-6 text-[#77756e]">
              Choose a new password for your Discover Lebanon account.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#45463f]">
                New password
                <span className="relative mt-2 block">
                  <LockKeyhole size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c8a82]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="h-[50px] w-full rounded-lg border border-[#d9d4ca] bg-[#fbfaf7] pl-11 pr-4 text-[13px] text-[#34352f] outline-none transition placeholder:text-[#aaa69d] focus:border-[#747b64]"
                  />
                </span>
              </label>

              <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#45463f]">
                Confirm new password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="mt-2 h-[50px] w-full rounded-lg border border-[#d9d4ca] bg-[#fbfaf7] px-4 text-[13px] text-[#34352f] outline-none transition placeholder:text-[#aaa69d] focus:border-[#747b64]"
                />
              </label>

              {error && (
                <p role="alert" className="text-[12px] leading-5 text-[#a95f57]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !token}
                className="flex h-[50px] w-full items-center justify-center rounded-lg bg-[#606653] text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#505745] disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isSubmitting ? "Updating..." : "Update password"}
              </button>
              {!token && (
                <p className="text-center text-[12px] text-[#a95f57]">
                  This reset link is missing its token.
                </p>
              )}
            </form>
          </>
        )}
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f3f0e9]" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
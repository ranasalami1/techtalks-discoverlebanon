"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

const countries = [
  "Lebanon",
  "United States",
  "France",
  "Canada",
  "United Kingdom",
  "United Arab Emirates",
  "Other",
];

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  country: "Lebanon",
  agreeTerms: false,
  wantsUpdates: false,
};

function validate(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Enter your full name";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "That name looks too short";
  }

  if (!values.email.trim()) {
    errors.email = "Enter your email";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      values.email
    )
  ) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Create a password";
  } else if (values.password.length < 8) {
    errors.password = "Use at least 8 characters";
  } else if (!/\d/.test(values.password)) {
    errors.password = "Include at least one number";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm your password";
  } else if (
    values.confirmPassword !== values.password
  ) {
    errors.confirmPassword = "Passwords don't match";
  }

  if (!values.agreeTerms) {
    errors.agreeTerms =
      "You must agree to continue";
  }

  return errors;
}

export default function SignUpPage() {
  const [values, setValues] =
    useState(initialForm);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [serverError, setServerError] =
    useState("");

  const router = useRouter();

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;

    const next = {
      ...values,
      [field]: value,
    };

    setValues(next);

    if (touched[field]) {
      setErrors(validate(next));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));

    setErrors(validate(values));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors =
      validate(values);

    setErrors(validationErrors);

    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    });

    if (
      Object.keys(validationErrors).length > 0 ||
      submitting
    ) {
      return;
    }

    setSubmitting(true);
    setServerError("");
    setSubmitted(false);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/signup`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName: values.fullName,
            email: values.email,
            password: values.password,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        setServerError(
          data.message ??
            "Something went wrong. Please try again."
        );

        return;
      }

      setSubmitted(true);

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch {
      setServerError(
        "Can't reach the server. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-hero">
      <style>{`
        @import url(
          'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&family=Caveat:wght@500;600&display=swap'
        );

        * {
          box-sizing: border-box;
        }

        .login-hero {
          position: relative;
          min-height: 100vh;
          font-family: 'Work Sans', sans-serif;
          color: #2B2620;

          background:
            linear-gradient(
              180deg,
              rgba(20,28,20,0.35) 0%,
              rgba(20,28,20,0.1) 30%,
              rgba(0,0,0,0) 60%
            ),
            url('/images/byblos-hero.jpg');

          background-size: cover;
          background-position: center;
          overflow: hidden;
          padding-bottom: 40px;
        }

        .topnav {
          position: relative;
          z-index: 2;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 24px 48px;

          flex-wrap: wrap;
          gap: 16px;
        }

        .topnav__brand-ar {
          font-size: 20px;
          color: #B98A46;
          font-weight: 600;
          margin: 0;
        }

        .topnav__brand-en {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 600;
          margin: 2px 0 0;
          color: #2B2620;
        }

        .topnav__brand-sub {
          font-size: 11px;
          letter-spacing: 0.03em;
          color: #6B6355;
          margin: 2px 0 0;
        }

        .topnav__links {
          display: flex;
          align-items: center;
          gap: 32px;

          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.04em;

          color: #2B2620;
        }

        .topnav__links a {
          color: inherit;
          text-decoration: none;
        }

        .topnav__links a:hover {
          color: #5C6B4A;
        }

        .hero-tagline {
          position: relative;
          z-index: 1;

          font-family: 'Caveat', cursive;
          font-size: 34px;
          color: #2B2620;

          padding-left: 56px;
          margin-top: 24px;

          line-height: 1.15;
        }

        .hero-labels {
          position: relative;
          z-index: 1;

          margin: 40px 0 0 56px;

          display: flex;
          gap: 20px;

          font-size: 11px;
          letter-spacing: 0.12em;
          font-weight: 600;

          color: #3A4A3A;
        }

        .place-pins {
          position: relative;
          z-index: 1;

          margin: 20px 0 0 56px;

          display: flex;
          flex-direction: column;
          gap: 6px;

          font-size: 11.5px;
          color: #3A4A3A;
        }

        .olive-branch {
          position: absolute;

          top: 90px;
          right: 40px;

          width: 90px;
          height: 220px;

          opacity: 0.5;
          z-index: 1;
        }

        .auth-card {
          position: relative;
          z-index: 2;

          max-width: 420px;

          margin: 40px auto 0 auto;

          background: #FFFFFF;

          border-radius: 16px;

          padding: 36px;

          box-shadow:
            0 20px 50px
            rgba(30, 30, 20, 0.18);
        }

        @media (min-width: 900px) {
          .auth-card {
            margin: -20px 90px 0 auto;
          }
        }

        .auth-card h1 {
          font-family: 'Fraunces', serif;

          font-weight: 500;
          font-size: 24px;

          margin: 0 0 8px;
        }

        .auth-card > p {
          margin: 0 0 22px;

          font-size: 13.5px;

          color: #6B6355;

          line-height: 1.5;
        }

        .field {
          margin-bottom: 14px;
        }

        .field-input-wrap {
          position: relative;

          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;

          left: 12px;

          color: #A79D8A;

          display: flex;
        }

        .field input,
        .field select {
          width: 100%;

          padding:
            10px 14px 10px 38px;

          border-radius: 8px;

          border:
            1.5px solid #E3DAC5;

          background: #FBFAF6;

          font-size: 13.5px;

          font-family:
            'Work Sans',
            sans-serif;

          color: #2B2620;
        }

        .field select {
          appearance: none;

          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B6355' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");

          background-repeat: no-repeat;

          background-position:
            right 14px center;
        }

        .field input:focus,
        .field select:focus {
          outline: none;
          border-color: #5C6B4A;
        }

        .field input.has-error,
        .field select.has-error {
          border-color: #B3492C;
        }

        .field .error-text,
        .error-text {
          margin-top: 5px;

          font-size: 11.5px;

          color: #B3492C;
        }

        .password-toggle {
          position: absolute;

          right: 10px;

          background: none;
          border: none;

          cursor: pointer;

          color: #A79D8A;

          display: flex;

          padding: 4px;
        }

        .password-toggle:hover {
          color: #2B2620;
        }

        .checkbox-row {
          display: flex;
          align-items: flex-start;

          gap: 8px;

          margin-bottom: 10px;
        }

        .checkbox-row input {
          margin-top: 2px;

          width: 15px;
          height: 15px;

          accent-color: #5C6B4A;

          flex-shrink: 0;
        }

        .checkbox-row label {
          font-size: 12px;

          color: #6B6355;

          line-height: 1.5;
        }

        .checkbox-row a {
          color: #B98A46;

          font-weight: 600;

          text-decoration: none;
        }

        .checkbox-row a:hover {
          text-decoration: underline;
        }

        .btn-pill-primary {
          width: 100%;

          padding: 12px;

          border-radius: 999px;

          border: none;

          background: #5C6B4A;

          color: #FFFFFF;

          font-size: 14.5px;
          font-weight: 600;

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          margin-top: 6px;

          transition:
            background 0.15s ease,
            opacity 0.15s ease;
        }

        .btn-pill-primary:hover:not(:disabled) {
          background: #4B5A3B;
        }

        .btn-pill-primary:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .divider {
          display: flex;
          align-items: center;

          gap: 12px;

          margin: 18px 0;

          color: #A79D8A;

          font-size: 11.5px;

          letter-spacing: 0.05em;
        }

        .divider::before,
        .divider::after {
          content: "";

          flex: 1;

          height: 1px;

          background: #E9E1CF;
        }

        .oauth-row {
          display: flex;
          gap: 10px;
        }

        .btn-oauth {
          flex: 1;

          padding: 10px;

          border-radius: 8px;

          border:
            1.5px solid #E3DAC5;

          background: #FFFFFF;

          font-size: 12px;
          font-weight: 500;

          color: #2B2620;

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 6px;
        }

        .btn-oauth:hover {
          background: #FAF6EC;
        }

        .bottom-line {
          text-align: center;

          margin-top: 20px;

          font-size: 13px;

          color: #6B6355;
        }

        .bottom-line a {
          color: #B98A46;

          font-weight: 600;

          text-decoration: none;
        }

        .bottom-line a:hover {
          text-decoration: underline;
        }

        .success-banner {
          background: #E9F0E6;

          border:
            1.5px solid #A8C39B;

          color: #33502C;

          padding: 10px 12px;

          border-radius: 8px;

          font-size: 13px;

          margin-bottom: 14px;
        }

        .server-error {
          background: #FBEDE8;

          border:
            1.5px solid #E2A898;

          color: #B3492C;

          padding: 10px 12px;

          border-radius: 8px;

          font-size: 13px;

          margin-bottom: 14px;
        }

        @media (max-width: 640px) {
          .topnav__links {
            display: none;
          }

          .hero-tagline {
            font-size: 24px;
            padding-left: 24px;
          }

          .hero-labels,
          .place-pins {
            display: none;
          }

          .auth-card {
            margin: 24px 16px 40px;

            padding: 26px 20px;
          }
        }
      `}</style>

      <svg
        className="olive-branch"
        viewBox="0 0 90 220"
      >
        <path
          d="
            M45,10
            C40,60 50,110 40,160
            C35,185 45,205 45,215
          "
          stroke="#8E9D82"
          strokeWidth="2"
          fill="none"
        />

        {Array.from({
          length: 8,
        }).map((_, i) => (
          <ellipse
            key={i}
            cx={
              i % 2 === 0
                ? 32
                : 58
            }
            cy={30 + i * 22}
            rx="10"
            ry="5"
            fill="#B7C4A6"
            opacity="0.7"
            transform={`
              rotate(
                ${
                  i % 2 === 0
                    ? -20
                    : 20
                }
                ${
                  i % 2 === 0
                    ? 32
                    : 58
                }
                ${30 + i * 22}
              )
            `}
          />
        ))}
      </svg>

      <div className="topnav">
        <div>
          <p className="topnav__brand-ar">
            اكتشف لبنان
          </p>

          <p className="topnav__brand-en">
            DISCOVER LEBANON
          </p>

          <p className="topnav__brand-sub">
            Interactive Heritage &amp;
            Activity Guide
          </p>
        </div>

        <div className="topnav__links">
          <Link href="/explore">
            EXPLORE THE MAP
          </Link>

          <Link href="/itineraries">
            CURATED ITINERARIES
          </Link>

          <Link href="/heritage">
            HERITAGE STORIES
          </Link>

          <Link href="/search">
            SEARCH
          </Link>

          <span>EN ▾</span>
        </div>
      </div>

      <p className="hero-tagline">
        A deeper
        <br />
        way to explore
      </p>

      <div className="place-pins">
        <span>📍 Tripoli</span>
        <span>📍 Byblos</span>
        <span>📍 Beirut</span>
        <span>📍 Tyre</span>
      </div>

      <div className="hero-labels">
        <span>SAME PLACES,</span>
        <span>DIFFERENT STORIES</span>
      </div>

      <div className="auth-card">
        <h1>Create Your Account</h1>

        <p>
          Join Discover Lebanon and start
          your journey through heritage,
          culture and unique experiences.
        </p>

        {submitted && (
          <div className="success-banner">
            Account created successfully!
            Redirecting to login...
          </div>
        )}

        {serverError && (
          <div className="server-error">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="field">
            <div className="field-input-wrap">
              <span className="field-icon">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                  />

                  <path
                    d="
                      M4 21
                      c0-4.4 3.6-7 8-7
                      s8 2.6 8 7
                    "
                  />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Full Name"
                value={values.fullName}
                onChange={
                  handleChange("fullName")
                }
                onBlur={
                  handleBlur("fullName")
                }
                className={
                  touched.fullName &&
                  errors.fullName
                    ? "has-error"
                    : ""
                }
              />
            </div>

            {touched.fullName &&
              errors.fullName && (
                <div className="error-text">
                  {errors.fullName}
                </div>
              )}
          </div>

          <div className="field">
            <div className="field-input-wrap">
              <span className="field-icon">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="2"
                  />

                  <path d="M2 7l10 6 10-6" />
                </svg>
              </span>

              <input
                type="email"
                placeholder="Email Address"
                value={values.email}
                onChange={
                  handleChange("email")
                }
                onBlur={
                  handleBlur("email")
                }
                className={
                  touched.email &&
                  errors.email
                    ? "has-error"
                    : ""
                }
              />
            </div>

            {touched.email &&
              errors.email && (
                <div className="error-text">
                  {errors.email}
                </div>
              )}
          </div>

          <div className="field">
            <div className="field-input-wrap">
              <span className="field-icon">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="10"
                    rx="2"
                  />

                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                  />
                </svg>
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={values.password}
                onChange={
                  handleChange("password")
                }
                onBlur={
                  handleBlur("password")
                }
                className={
                  touched.password &&
                  errors.password
                    ? "has-error"
                    : ""
                }
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="
                        M17.94 17.94
                        A10.94 10.94 0 0 1 12 19
                        c-6 0-10-7-10-7
                        a18.7 18.7 0 0 1 4.22-5.19
                        M9.9 4.24
                        A10.9 10.9 0 0 1 12 4
                        c6 0 10 7 10 7
                        a18.65 18.65 0 0 1-2.16 3.19
                        m-6.72-1.07
                        a3 3 0 1 1-4.24-4.24
                      "
                    />

                    <line
                      x1="1"
                      y1="1"
                      x2="23"
                      y2="23"
                    />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="
                        M1 12
                        s4-7 11-7
                        11 7 11 7
                        -4 7-11 7
                        -11-7-11-7z
                      "
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                    />
                  </svg>
                )}
              </button>
            </div>

            {touched.password &&
              errors.password && (
                <div className="error-text">
                  {errors.password}
                </div>
              )}
          </div>

          <div className="field">
            <div className="field-input-wrap">
              <span className="field-icon">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="10"
                    rx="2"
                  />

                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                  />
                </svg>
              </span>

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                value={
                  values.confirmPassword
                }
                onChange={
                  handleChange(
                    "confirmPassword"
                  )
                }
                onBlur={
                  handleBlur(
                    "confirmPassword"
                  )
                }
                className={
                  touched.confirmPassword &&
                  errors.confirmPassword
                    ? "has-error"
                    : ""
                }
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) =>
                      !current
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="
                        M17.94 17.94
                        A10.94 10.94 0 0 1 12 19
                        c-6 0-10-7-10-7
                        a18.7 18.7 0 0 1 4.22-5.19
                        M9.9 4.24
                        A10.9 10.9 0 0 1 12 4
                        c6 0 10 7 10 7
                        a18.65 18.65 0 0 1-2.16 3.19
                        m-6.72-1.07
                        a3 3 0 1 1-4.24-4.24
                      "
                    />

                    <line
                      x1="1"
                      y1="1"
                      x2="23"
                      y2="23"
                    />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="
                        M1 12
                        s4-7 11-7
                        11 7 11 7
                        -4 7-11 7
                        -11-7-11-7z
                      "
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                    />
                  </svg>
                )}
              </button>
            </div>

            {touched.confirmPassword &&
              errors.confirmPassword && (
                <div className="error-text">
                  {
                    errors.confirmPassword
                  }
                </div>
              )}
          </div>

          <div className="field">
            <div className="field-input-wrap">
              <span className="field-icon">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="
                      M12 21
                      s7-6.5 7-12
                      a7 7 0 1 0-14 0
                      c0 5.5 7 12 7 12z
                    "
                  />

                  <circle
                    cx="12"
                    cy="9"
                    r="2.5"
                  />
                </svg>
              </span>

              <select
                value={values.country}
                onChange={
                  handleChange("country")
                }
              >
                {countries.map(
                  (country) => (
                    <option
                      key={country}
                      value={country}
                    >
                      {country}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="checkbox-row">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={
                values.agreeTerms
              }
              onChange={
                handleChange(
                  "agreeTerms"
                )
              }
              onBlur={
                handleBlur(
                  "agreeTerms"
                )
              }
            />

            <label htmlFor="agreeTerms">
              I agree to the{" "}
              <Link href="/terms">
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {touched.agreeTerms &&
            errors.agreeTerms && (
              <div
                className="error-text"
                style={{
                  marginTop: -6,
                  marginBottom: 10,
                }}
              >
                {errors.agreeTerms}
              </div>
            )}

          <div className="checkbox-row">
            <input
              type="checkbox"
              id="wantsUpdates"
              checked={
                values.wantsUpdates
              }
              onChange={
                handleChange(
                  "wantsUpdates"
                )
              }
            />

            <label htmlFor="wantsUpdates">
              I would like to receive
              updates about new
              destinations, activities
              and cultural events.
            </label>
          </div>

          <button
            type="submit"
            className="btn-pill-primary"
            disabled={submitting}
          >
            {submitting
              ? "Creating Account..."
              : "Create Account"}

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>

          <div className="divider">
            OR
          </div>

          <div className="oauth-row">
            <button
              type="button"
              className="btn-oauth"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.87c2.27-2.09 3.58-5.17 3.58-8.8z"
                />

                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.1C3.24 21.3 7.29 24 12 24z"
                />

                <path
                  fill="#FBBC05"
                  d="M5.27 14.3a7.2 7.2 0 0 1 0-4.6v-3.1H1.27a12 12 0 0 0 0 10.8z"
                />

                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.29 0 3.24 2.7 1.27 6.6l4 3.1C6.22 6.86 8.87 4.75 12 4.75z"
                />
              </svg>

              Sign up with Google
            </button>

            <button
              type="button"
              className="btn-oauth"
            >
              <svg
                width="12"
                height="14"
                viewBox="0 0 384 512"
                fill="#2B2620"
              >
                <path
                  d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 0 184.6 0 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 37.4 59 129 107.2 127.5 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-84.1 102.6-121.6-65.2-30.7-57.7-90-57.7-91.9zM256.4 85.3c27-32.2 24.6-61.5 23.8-72-23.9 1.4-51.6 16.4-67.5 34.8-17.5 19.5-27.8 43.6-25.6 71.4 26.3 2 50.2-11 69.3-34.2z"
                />
              </svg>

              Sign up with Apple
            </button>
          </div>

          <p className="bottom-line">
            Already have an account?{" "}
            <Link href="/login">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";


/* =====================================================
   API
===================================================== */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";


/* =====================================================
   INITIAL FORM
===================================================== */

const initialForm = {
  email: "",
  password: "",
};


/* =====================================================
   VALIDATION
===================================================== */

function validate(values) {
  const errors = {};

  const email =
    values.email.trim();

  if (!email) {
    errors.email =
      "Enter your email";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    )
  ) {
    errors.email =
      "Enter a valid email address";
  }


  if (!values.password) {
    errors.password =
      "Enter your password";
  }


  return errors;
}


/* =====================================================
   READ ACCESS TOKEN
===================================================== */

function readAccessToken(
  data
) {
  return (
    data?.accessToken ||
    data?.access_token ||
    data?.data?.accessToken ||
    data?.data?.access_token ||
    ""
  );
}


/* =====================================================
   NORMALIZE ACCOUNT
===================================================== */

function normalizeAccount(
  account
) {
  if (!account) {
    return null;
  }

  return {
    id:
      account?.id ??
      account?.user_id ??
      null,

    fullName:
      account?.full_name ??
      account?.fullName ??
      "",

    email:
      account?.email ??
      "",

    profileImage:
      account?.profile_image ??
      account?.profileImage ??
      null,
  };
}


/* =====================================================
   PAGE
===================================================== */

export default function LoginPage() {
  const router =
    useRouter();


  const [
    values,
    setValues,
  ] =
    useState(
      initialForm
    );


  const [
    errors,
    setErrors,
  ] =
    useState({});


  const [
    touched,
    setTouched,
  ] =
    useState({});


  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);


  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);


  const [
    submitted,
    setSubmitted,
  ] =
    useState(false);


  const [
    serverError,
    setServerError,
  ] =
    useState("");


  /* =====================================================
     CHANGE FIELD
  ===================================================== */

  function handleChange(
    field
  ) {
    return (
      event
    ) => {
      const nextValues = {
        ...values,

        [field]:
          event.target.value,
      };


      setValues(
        nextValues
      );


      if (
        touched[
          field
        ]
      ) {
        setErrors(
          validate(
            nextValues
          )
        );
      }
    };
  }


  /* =====================================================
     BLUR FIELD
  ===================================================== */

  function handleBlur(
    field
  ) {
    return () => {
      setTouched(
        (
          previous
        ) => ({
          ...previous,

          [field]:
            true,
        })
      );


      setErrors(
        validate(
          values
        )
      );
    };
  }


  /* =====================================================
     LOAD REAL CURRENT ACCOUNT

     This makes the JWT the source of truth.
  ===================================================== */

  async function loadRealAccount(
    accessToken
  ) {
    try {
      const response =
        await fetch(
          `${API_URL}/api/account`,
          {
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          }
        );


      if (
        !response.ok
      ) {
        return null;
      }


      const payload =
        await response
          .json()
          .catch(
            () => ({})
          );


      const account =
        payload?.data
          ?.account ??
        payload?.account ??
        null;


      return normalizeAccount(
        account
      );

    } catch {
      return null;
    }
  }


  /* =====================================================
     SUBMIT LOGIN
  ===================================================== */

  async function handleSubmit(
    event
  ) {
    event.preventDefault();


    const validationErrors =
      validate(
        values
      );


    setErrors(
      validationErrors
    );


    setTouched({
      email:
        true,

      password:
        true,
    });


    if (
      Object.keys(
        validationErrors
      ).length >
        0 ||
      submitting
    ) {
      return;
    }


    setSubmitting(
      true
    );

    setSubmitted(
      false
    );

    setServerError(
      ""
    );


    try {

      /* ===============================================
         LOGIN REQUEST
      =============================================== */

      const response =
        await fetch(
          `${API_URL}/api/auth/login`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email:
                  values
                    .email
                    .trim(),

                password:
                  values
                    .password,
              }),
          }
        );


      const data =
        await response
          .json()
          .catch(
            () => ({})
          );


      /* ===============================================
         LOGIN FAILED
      =============================================== */

      if (
        !response.ok
      ) {
        setServerError(
          data?.message ||
          data?.error ||
          "Invalid email or password."
        );

        return;
      }


      /* ===============================================
         READ NEW JWT
      =============================================== */

      const accessToken =
        readAccessToken(
          data
        );


      if (
        !accessToken
      ) {
        setServerError(
          "Login succeeded, but no authentication token was returned."
        );

        return;
      }


      /* ===============================================
         REMOVE OLD SESSION DATA

         IMPORTANT:
         Lara / old user disappears here.
      =============================================== */

      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "discoverLebanonUser"
      );


      /* ===============================================
         STORE THE NEW USER'S TOKEN
      =============================================== */

      localStorage.setItem(
        "accessToken",
        accessToken
      );


      /* ===============================================
         ASK THE BACKEND WHO THIS TOKEN BELONGS TO

         GET /api/account reads the JWT identity,
         therefore it returns the REAL logged-in user.
      =============================================== */

      const realAccount =
        await loadRealAccount(
          accessToken
        );


      /* ===============================================
         FALLBACK TO LOGIN RESPONSE

         Used only if /api/account could not be loaded.
      =============================================== */

      const loginUser =
        data?.user ??
        data?.data?.user ??
        null;


      const normalizedLoginUser =
        normalizeAccount(
          loginUser
        );


      const currentUser =
        realAccount ||
        normalizedLoginUser;


      /* ===============================================
         SAVE CURRENT USER
      =============================================== */

      if (
        currentUser
      ) {
        localStorage.setItem(
          "discoverLebanonUser",
          JSON.stringify(
            currentUser
          )
        );
      }


      /* ===============================================
         NOTIFY NAVBAR IMMEDIATELY

         Navbar listens to this event and reloads
         GET /api/account.
      =============================================== */

      window.dispatchEvent(
        new Event(
          "discoverLebanonUserUpdated"
        )
      );


      /* ===============================================
         SUCCESS
      =============================================== */

      setSubmitted(
        true
      );


      window.setTimeout(
        () => {
          router.push(
            "/account"
          );

          router.refresh();
        },
        700
      );

    } catch (
      error
    ) {

      console.error(
        "Login error:",
        error
      );


      setServerError(
        "Can't reach the server. Please try again."
      );

    } finally {

      setSubmitting(
        false
      );

    }
  }


  /* =====================================================
     PAGE
  ===================================================== */

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

          font-family:
            'Work Sans',
            sans-serif;

          color:
            #2B2620;

          background:
            linear-gradient(
              180deg,
              rgba(
                20,
                28,
                20,
                0.35
              ) 0%,
              rgba(
                20,
                28,
                20,
                0.10
              ) 30%,
              rgba(
                0,
                0,
                0,
                0
              ) 60%
            ),
            url(
              '/images/byblos-hero.jpg'
            );

          background-size:
            cover;

          background-position:
            center;

          overflow:
            hidden;
        }


        .topnav {
          position: relative;
          z-index: 2;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding:
            24px 48px;

          flex-wrap: wrap;
          gap: 16px;
        }


        .topnav__brand-ar {
          margin: 0;

          color:
            #B98A46;

          font-size:
            20px;

          font-weight:
            600;
        }


        .topnav__brand-en {
          margin:
            2px 0 0;

          color:
            #2B2620;

          font-family:
            'Fraunces',
            serif;

          font-size:
            20px;

          font-weight:
            600;
        }


        .topnav__brand-sub {
          margin:
            2px 0 0;

          color:
            #6B6355;

          font-size:
            11px;

          letter-spacing:
            0.03em;
        }


        .topnav__links {
          display: flex;
          align-items: center;

          gap:
            32px;

          color:
            #2B2620;

          font-size:
            12.5px;

          font-weight:
            500;

          letter-spacing:
            0.04em;
        }


        .topnav__links a {
          color: inherit;
          text-decoration:
            none;
        }


        .topnav__links a:hover {
          color:
            #5C6B4A;
        }


        .hero-tagline {
          position: relative;
          z-index: 1;

          margin-top:
            24px;

          padding-left:
            56px;

          color:
            #2B2620;

          font-family:
            'Caveat',
            cursive;

          font-size:
            34px;

          line-height:
            1.15;
        }


        .hero-labels {
          position:
            absolute;

          left:
            56px;

          bottom:
            56px;

          z-index:
            1;

          display:
            flex;

          flex-direction:
            column;

          gap:
            4px;

          color:
            #3A4A3A;

          font-size:
            11px;

          font-weight:
            600;

          letter-spacing:
            0.12em;
        }


        .hero-corner-text {
          position:
            absolute;

          right:
            56px;

          bottom:
            56px;

          z-index:
            1;

          color:
            #2B2620;

          font-family:
            'Caveat',
            cursive;

          font-size:
            22px;

          line-height:
            1.2;

          text-align:
            right;
        }


        .olive-branch {
          position:
            absolute;

          top:
            90px;

          right:
            40px;

          z-index:
            1;

          width:
            90px;

          height:
            220px;

          opacity:
            0.5;
        }


        .auth-card {
          position:
            relative;

          z-index:
            2;

          max-width:
            400px;

          margin:
            40px auto 0;

          padding:
            40px 36px;

          background:
            #FFFFFF;

          border-radius:
            16px;

          box-shadow:
            0 20px 50px
            rgba(
              30,
              30,
              20,
              0.18
            );
        }


        .auth-card h1 {
          margin:
            0 0 8px;

          color:
            #2B2620;

          font-family:
            'Fraunces',
            serif;

          font-size:
            26px;

          font-weight:
            500;
        }


        .auth-card > p {
          margin:
            0 0 26px;

          color:
            #6B6355;

          font-size:
            13.5px;

          line-height:
            1.5;
        }


        .field {
          margin-bottom:
            16px;
        }


        .field label {
          display:
            block;

          margin-bottom:
            6px;

          color:
            #2B2620;

          font-size:
            12.5px;

          font-weight:
            600;
        }


        .field-input-wrap {
          position:
            relative;

          display:
            flex;

          align-items:
            center;
        }


        .field-icon {
          position:
            absolute;

          left:
            12px;

          display:
            flex;

          color:
            #A79D8A;
        }


        .field input {
          width:
            100%;

          padding:
            11px
            42px
            11px
            38px;

          border:
            1.5px solid
            #E3DAC5;

          border-radius:
            8px;

          background:
            #FBFAF6;

          color:
            #2B2620;

          font-family:
            'Work Sans',
            sans-serif;

          font-size:
            14px;
        }


        .field input:focus {
          border-color:
            #5C6B4A;

          outline:
            none;

          box-shadow:
            0 0 0 3px
            rgba(
              92,
              107,
              74,
              0.08
            );
        }


        .field input.has-error {
          border-color:
            #B3492C;
        }


        .error-text {
          margin-top:
            6px;

          color:
            #B3492C;

          font-size:
            12px;
        }


        .password-toggle {
          position:
            absolute;

          right:
            10px;

          display:
            flex;

          padding:
            4px;

          border:
            none;

          background:
            none;

          color:
            #A79D8A;

          cursor:
            pointer;
        }


        .password-toggle:hover {
          color:
            #2B2620;
        }


        .row-between {
          display:
            flex;

          justify-content:
            flex-end;

          margin:
            -8px 0 20px;
        }


        .forgot-link {
          color:
            #2B2620;

          font-size:
            12px;

          text-decoration:
            underline;
        }


        .btn-pill-primary {
          display:
            flex;

          width:
            100%;

          align-items:
            center;

          justify-content:
            center;

          gap:
            8px;

          padding:
            12px;

          border:
            none;

          border-radius:
            999px;

          background:
            #5C6B4A;

          color:
            #FFFFFF;

          cursor:
            pointer;

          font-size:
            14.5px;

          font-weight:
            600;

          transition:
            background
            0.15s ease;
        }


        .btn-pill-primary:hover {
          background:
            #4B5A3B;
        }


        .btn-pill-primary:disabled {
          cursor:
            wait;

          opacity:
            0.65;
        }


        .bottom-line {
          margin-top:
            22px;

          color:
            #6B6355;

          font-size:
            13px;

          text-align:
            center;
        }


        .bottom-line a {
          color:
            #B98A46;

          font-weight:
            600;

          text-decoration:
            none;
        }


        .bottom-line a:hover {
          text-decoration:
            underline;
        }


        .success-banner {
          margin-bottom:
            16px;

          padding:
            10px 12px;

          border:
            1.5px solid
            #A8C39B;

          border-radius:
            8px;

          background:
            #E9F0E6;

          color:
            #33502C;

          font-size:
            13px;
        }


        .server-error {
          margin-bottom:
            16px;

          padding:
            10px 12px;

          border:
            1.5px solid
            #E2A898;

          border-radius:
            8px;

          background:
            #FBEDE8;

          color:
            #B3492C;

          font-size:
            13px;
        }


        @media (
          min-width:
          900px
        ) {

          .auth-card {
            margin:
              -40px
              90px
              0
              auto;
          }

        }


        @media (
          max-width:
          640px
        ) {

          .topnav {
            padding:
              20px 22px;
          }


          .topnav__links {
            display:
              none;
          }


          .hero-tagline {
            padding-left:
              24px;

            font-size:
              24px;
          }


          .hero-labels,
          .hero-corner-text {
            display:
              none;
          }


          .auth-card {
            margin:
              24px
              16px
              40px;

            padding:
              28px
              22px;
          }

        }

      `}</style>


      {/* =================================================
          DECORATIVE OLIVE BRANCH
      ================================================= */}

      <svg
        className="olive-branch"
        viewBox="0 0 90 220"
        aria-hidden="true"
      >

        <path
          d="
            M45,10
            C40,60
            50,110
            40,160
            C35,185
            45,205
            45,215
          "
          stroke="#8E9D82"
          strokeWidth="2"
          fill="none"
        />


        {Array.from({
          length: 8,
        }).map(
          (
            _,
            index
          ) => (

            <ellipse
              key={
                index
              }

              cx={
                index %
                  2 ===
                0
                  ? 32
                  : 58
              }

              cy={
                30 +
                index *
                  22
              }

              rx="10"
              ry="5"

              fill="#B7C4A6"

              opacity="0.7"

              transform={`
                rotate(
                  ${
                    index %
                      2 ===
                    0
                      ? -20
                      : 20
                  }

                  ${
                    index %
                      2 ===
                    0
                      ? 32
                      : 58
                  }

                  ${
                    30 +
                    index *
                      22
                  }
                )
              `}
            />

          )
        )}

      </svg>


      {/* =================================================
          TOP NAV
      ================================================= */}

      <header className="topnav">

        <div>

          <p className="topnav__brand-ar">
            اكتشف لبنان
          </p>


          <p className="topnav__brand-en">
            DISCOVER LEBANON
          </p>


          <p className="topnav__brand-sub">
            Interactive Heritage
            {" & "}
            Activity Guide
          </p>

        </div>


        <nav className="topnav__links">

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

        </nav>

      </header>


      {/* =================================================
          HERO TEXT
      ================================================= */}

      <p className="hero-tagline">

        A deeper

        <br />

        way to explore

      </p>


      <div className="hero-labels">

        <span>
          HERITAGE
        </span>

        <span>
          CULTURE
        </span>

        <span>
          NATURE
        </span>

        <span>
          PEOPLE
        </span>

      </div>


      <p className="hero-corner-text">

        Same places,

        <br />

        different stories

      </p>


      {/* =================================================
          LOGIN CARD
      ================================================= */}

      <section className="auth-card">

        <h1>
          Welcome Back
        </h1>


        <p>
          Log in to continue
          your journey with
          Discover Lebanon.
        </p>


        {/* SUCCESS */}

        {submitted && (

          <div className="success-banner">

            Login successful.
            Loading your account…

          </div>

        )}


        {/* ERROR */}

        {serverError && (

          <div className="server-error">

            {serverError}

          </div>

        )}


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={
            handleSubmit
          }
          noValidate
        >

          {/* EMAIL */}

          <div className="field">

            <label htmlFor="email">
              Email Address
            </label>


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
                id="email"

                type="email"

                autoComplete="email"

                placeholder="Enter your email"

                value={
                  values.email
                }

                onChange={
                  handleChange(
                    "email"
                  )
                }

                onBlur={
                  handleBlur(
                    "email"
                  )
                }

                className={
                  touched
                    .email &&
                  errors
                    .email
                    ? "has-error"
                    : ""
                }
              />

            </div>


            {touched.email &&
              errors.email && (

                <div className="error-text">

                  {
                    errors.email
                  }

                </div>

              )}

          </div>


          {/* PASSWORD */}

          <div className="field">

            <label htmlFor="password">
              Password
            </label>


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

                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />

                </svg>

              </span>


              <input
                id="password"

                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                autoComplete="current-password"

                placeholder="Enter your password"

                value={
                  values.password
                }

                onChange={
                  handleChange(
                    "password"
                  )
                }

                onBlur={
                  handleBlur(
                    "password"
                  )
                }

                className={
                  touched
                    .password &&
                  errors
                    .password
                    ? "has-error"
                    : ""
                }
              />


              <button
                type="button"

                className="password-toggle"

                onClick={() =>
                  setShowPassword(
                    (
                      previous
                    ) =>
                      !previous
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

                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6 0-10-7-10-7a18.7 18.7 0 0 1 4.22-5.19M9.9 4.24A10.9 10.9 0 0 1 12 4c6 0 10 7 10 7a18.65 18.65 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />

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

                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />

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

                  {
                    errors.password
                  }

                </div>

              )}

          </div>


          {/* FORGOT PASSWORD */}

          <div className="row-between">

            <Link
              href="/forgot-password"
              className="forgot-link"
            >
              Forgot Password?
            </Link>

          </div>


          {/* LOGIN */}

          <button
            type="submit"

            className="btn-pill-primary"

            disabled={
              submitting ||
              submitted
            }
          >

            {submitting
              ? "Logging In…"
              : submitted
                ? "Logged In"
                : "Log In"}


            {!submitting &&
              !submitted && (

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

              )}

          </button>


          {/* REGISTER */}

          <p className="bottom-line">

            Don&apos;t have an
            account?{" "}

            <Link href="/signup">
              Register
            </Link>

          </p>

        </form>

      </section>

    </div>
  );
}
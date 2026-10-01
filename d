[1mdiff --cc frontend/src/app/globals.css[m
[1mindex b0a7ba4,ed3838c..0000000[m
[1m--- a/frontend/src/app/globals.css[m
[1m+++ b/frontend/src/app/globals.css[m
[36m@@@ -16,76 -19,221 +19,273 @@@[m
  @theme inline {[m
    --color-background: var(--background);[m
    --color-foreground: var(--foreground);[m
[32m+ [m
    --font-sans: var(--font-geist-sans);[m
    --font-mono: var(--font-geist-mono);[m
[32m +  --font-serif: var(--font-playfair);[m
[32m +  --font-script: var(--font-caveat);[m
[32m +[m
[32m +  /* Page-level palette (Saved Places, etc.), derived from the sidebar tokens above. */[m
[32m +  --color-cream: var(--background);[m
[32m +  --color-cream-soft: #f1ece2;[m
[32m +  --color-ink: var(--foreground);[m
[32m +  --color-ink-soft: var(--ink-muted);[m
[32m +  --color-ink-faint: #8d8a80;[m
[32m +  --color-border: var(--sidebar-border);[m
[32m +  --color-olive: var(--accent);[m
[32m +  --color-olive-soft: var(--accent-soft);[m
[32m +  --color-gold: var(--accent-gold);[m
  }[m
  [m
[31m- * { box-sizing: border-box; }[m
[31m- html, body { min-height: 100%; }[m
[31m- body { margin: 0; background: var(--background); color: var(--foreground); font-family: var(--font-geist-sans), sans-serif; }[m
[31m- button, a { font: inherit; }[m
  [m
[32m++<<<<<<< HEAD[m
[32m +.app-shell { min-height: 100vh; display: flex; }[m
[32m +.sidebar { position: relative; overflow: hidden; width: 300px; min-height: 100vh; padding: 34px 0 24px; background: var(--sidebar); color: var(--sidebar-ink); display: flex; flex-direction: column; flex-shrink: 0; }[m
[32m +.sidebar-brand { position: relative; padding: 0 26px 26px; }[m
[32m +.brand-mark { display: flex; flex-direction: column; gap: 8px; color: inherit; text-decoration: none; transition: transform 180ms ease; }[m
[32m +.brand-mark:hover { transform: translateY(-2px) rotate(-1deg); }[m
[32m +.brand-mark:active { transform: translateY(0) scale(.96); }[m
[32m +.brand-mark:focus-visible { outline: 2px solid var(--accent); outline-offset: 5px; }[m
[32m +.brand-mark-arabic { font-family: var(--font-aref-ruqaa), serif; font-size: 27px; line-height: 1; color: var(--accent-gold); }[m
[32m +.brand-mark-en { font-family: var(--font-playfair), serif; font-size: 19px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--sidebar-ink); }[m
[32m +.brand-tagline { margin: 12px 0 0; max-width: 190px; color: var(--sidebar-muted); font-family: var(--font-playfair), serif; font-style: italic; font-size: 12px; line-height: 1.5; }[m
[32m +.sidebar-navigation { flex: 0 0 auto; padding: 6px 0 0; }[m
[32m +.sidebar-link { min-height: 46px; display: flex; align-items: center; gap: 14px; margin: 3px 12px; padding: 0 14px; border-radius: 10px; color: var(--sidebar-ink); text-decoration: none; font-size: 14.5px; font-weight: 500; transition: color 160ms ease, background 160ms ease; }[m
[32m +.sidebar-link:hover { background: rgba(76, 97, 66, .08); }[m
[32m +.sidebar-link-active { color: var(--accent); background: var(--accent-soft); }[m
[32m +.sidebar-link-icon { width: 19px; height: 19px; flex-shrink: 0; color: inherit; }[m
[32m +.sidebar-divider { height: 1px; margin: 18px 24px 14px; background: var(--sidebar-border); }[m
[32m +.sidebar-tagline { margin: 22px 26px 0; padding-top: 18px; }[m
[32m +.sidebar-tagline-accent { display: block; width: 34px; height: 2px; margin-bottom: 16px; background: var(--accent-gold); }[m
[32m +.sidebar-tagline p { margin: 0; color: var(--sidebar-muted); font-family: var(--font-caveat), cursive; font-size: 23px; line-height: 1.25; }[m
[32m +.sidebar-illustration { position: relative; flex: 1; min-height: 130px; margin-top: 12px; color: #8a744f; opacity: .55; pointer-events: none; }[m
[32m +.sidebar-illustration svg { position: absolute; left: -30px; bottom: -12px; width: 210px; height: auto; }[m
[32m +.sidebar-close, .mobile-header, .sidebar-backdrop { display: none; }[m
[32m +.app-content { min-width: 0; flex: 1; display: flex; flex-direction: column; }[m
[32m +.welcome-page { min-height: 100vh; display: flex; align-items: center; justify-content: space-between; gap: 40px; padding: 9vw 11vw; background: radial-gradient(circle at 85% 15%, rgba(228, 163, 90, .2), transparent 28%), var(--background); }[m
[32m +.welcome-copy { max-width: 620px; }[m
[32m +.eyebrow { color: #ae7040; font-size: 11px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }[m
[32m +.welcome-page h1 { max-width: 600px; margin: 18px 0 24px; color: var(--sidebar-ink); font-size: clamp(42px, 6vw, 82px); font-weight: 500; letter-spacing: -.04em; line-height: .98; }[m
[32m +.welcome-description { max-width: 450px; color: var(--ink-muted); font-size: 16px; line-height: 1.7; }[m
[32m +.welcome-stamp { width: 170px; height: 170px; display: grid; place-items: center; align-content: center; flex-shrink: 0; border: 1px solid rgba(35, 50, 56, .3); border-radius: 50%; color: var(--sidebar-ink); transform: rotate(8deg); transition: transform 220ms ease, border-color 220ms ease; }[m
[32m +.welcome-stamp:hover { border-color: var(--accent); transform: rotate(3deg) scale(1.03); }[m
[32m +.welcome-stamp:active { transform: rotate(3deg) scale(.97); }[m
[32m +.welcome-stamp span { color: #ae7040; font-size: 28px; font-weight: 700; letter-spacing: .1em; }[m
[32m +.welcome-stamp small { margin-top: 8px; font-size: 10px; letter-spacing: .18em; line-height: 1.5; text-align: center; text-transform: uppercase; }[m
[32m +[m
[32m +@media (prefers-reduced-motion: reduce) {[m
[32m +  .brand-mark, .welcome-stamp { transition: none; }[m
[32m++=======[m
[32m+ * {[m
[32m+   box-sizing: border-box;[m
[32m++>>>>>>> origin/dev[m
[32m+ }[m
[32m+ [m
[32m+ [m
[32m+ html,[m
[32m+ body {[m
[32m+   min-height: 100%;[m
[32m+ }[m
[32m+ [m
[32m+ [m
[32m+ body {[m
[32m+   margin: 0;[m
[32m+ [m
[32m+   background: var(--background);[m
[32m+ [m
[32m+   color: var(--foreground);[m
[32m+ [m
[32m+   font-family: var(--font-geist-sans), sans-serif;[m
[32m+ }[m
[32m+ [m
[32m+ [m
[32m+ button,[m
[32m+ a {[m
[32m+   font: inherit;[m
[32m+ }[m
[32m+ [m
[32m+ [m
[32m+ /* =========================================[m
[32m+    APP[m
[32m+ ========================================= */[m
[32m+ [m
[32m+ .app-shell {[m
[32m+   width: 100%;[m
[32m+ [m
[32m+   min-height: 100vh;[m
[32m+ [m
[32m+   display: flex;[m
[32m+ }[m
[32m+ [m
[32m+ [m
[32m+ .app-main {[m
[32m+   flex: 1;[m
[32m+ [m
[32m+   min-width: 0;[m
[32m+   min-height: 100vh;[m
[32m+ [m
[32m+   display: flex;[m
[32m+   flex-direction: column;[m
[32m+ }[m
[32m+ [m
[32m+ [m
[32m+ .page-content {[m
[32m+   width: 100%;[m
[32m+ [m
[32m+   min-width: 0;[m
[32m+ [m
[32m+   flex: 1;[m
[32m+ }[m
[32m+ [m
[32m+ [m
[32m+ /* =========================================[m
[32m+    WELCOME PAGE[m
[32m+ ========================================= */[m
[32m+ [m
[32m+ .welcome-page {[m
[32m+   width: 100%;[m
[32m+ [m
[32m+   min-height: calc(100vh - 64px);[m
[32m+ [m
[32m+   display: flex;[m
[32m+ [m
[32m+   align-items: center;[m
[32m+ [m
[32m+   justify-content: space-between;[m
[32m+ [m
[32m+   gap: 40px;[m
[32m+ [m
[32m+   padding: 9vw 11vw;[m
[32m+ [m
[32m+   background:[m
[32m+     radial-gradient([m
[32m+       circle at 85% 15%,[m
[32m+       rgba(228, 163, 90, 0.2),[m
[32m+       transparent 28%[m
[32m+     ),[m
[32m+     var(--background);[m
[32m+ }[m
[32m+ [m
[32m+ [m
[32m+ .welcome-copy {[m
[32m+   max-width: 620px;[m
[32m+ }[m
[32m+ [m
[32m+ [m
[32m+ .eyebrow {[m
[32m+   color: #ae7040;[m
[32m+ [m
[32m+   font-size: 11px;[m
[32m+   font-weight: 700;[m
[32m+ [m
[32m+   letter-spacing: 0.18em;[m
[32m+ [m
[32m+   text-transform: uppercase;[m
[32m+ }[m
[32m+ [m
[32m+ [m
[32m+ .welcome-page h1 {[m
[32m+   max-width: 600px;[m
[32m+ [m
[32m+   margin: 18px 0 24px;[m
[32m+ [m
[32m+   color: var(--sidebar-ink);[m
[32m+ [m
[32m+   font-size: clamp(42px, 6vw,
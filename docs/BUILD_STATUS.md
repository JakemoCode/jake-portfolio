# Build Status

Running status of the portfolio build — what's in flight, whether it's
green, and what's queued. Update after any build activity (per the
workspace `frontend-standards.md`).

_Last updated: 2026-09-25_

## Gates

| Check | Command | Status |
|-------|---------|--------|
| Types | `npx tsc --noEmit` | ✅ clean |
| Unit/RTL | `npx vitest run` | ✅ 81 passing |
| Build | `npx vite build` | ✅ clean |
| Dev | `npm run dev` | serves at `localhost:5173` |

## Shipped

**PRs #41 and #42, the `/portfolio` restructure** (merged 2026-09-25).
A full-screen teal hero with the Canvas2D "synaptic field", an Experience
timeline, the case-study teaser, "What I build", How I work with AI, "Tools I
recommend", then contact. Testimonials left the portfolio; the landing's
`Proof` still uses them. The side rail and the timeline share one scroll tick
(`src/components/portfolio/scrollTick/`). Axe clean at 390/768/1280/1440 ×
light/dark × motion/reduced; hero text at AA against the canvas over eight
frames, excluding the brightest 0.1% of pixels. The impeccable detector's
remaining flags are deliberate (link color, shimmer) or false positives
(screen-reader-only text).

**PR #25 — work gallery + testimonial spotlight** (merged 2026-07-07, in `main`).
Reworked the landing's "proof" zone into two dark-surface sections: the
`WorkGallery` (hero-on-hover/tap tiles + phone inset, VP9 WebM per
[`MEDIA.md`](./MEDIA.md), replacing the device-pill preview) and the imageless
`Proof` spotlight. The old responsive-preview system is archived to
`_archive/responsive-preview/`.

## In flight

**Route swap** · branch `feat/route-swap`. The portfolio moves to `/` and
the client landing to `/mosher-web-dev`. Vercel answers `/portfolio` with a
301 to `/`, and the router covers client-side visits, keeping any
`#section`. `index.html` now carries the portfolio's link-preview tags and a
new card (`public/og-portfolio.png`, from `og-portfolio.source.html`);
`scripts/emit-route-meta.mjs` writes the landing's tags and its business
schema (`scripts/mosher-web-dev.jsonld`) to `/mosher-web-dev`. A route that
arrives with a `#section` now opens there instead of at the top.

**Victoria Grace testimonial** · branch `feat/victoria-testimonial`.
Fourth testimonial (the flagship gallery client) — every gallery site now has a
quote, from three distinct clients.

## Follow-ups

- Product cards: tall captures of Coffee Roast Tracker and Baby Day Planner
  that pan inside their frame on scroll. Needs signed-in captures; both
  public URLs stop at a landing or sign-in page.
- One shared section-heading style. The same seven declarations sit in
  `ExperienceStrip`, `Recommendations`, `DistillIndex` and
  `Portfolio.module.css` (PR #41 review).
- Give gallery items a numeric count. `CaseStudyTeaser` scrapes it from the
  note text with a regex, so a note without a digit renders an empty count
  (PR #41 review).

## Reviews

- `/impeccable critique` on the two new sections: **35/40 (Good)**, detector
  clean, "not AI-made" verdict. Acted on: unified the client-site CTA to
  "See it live", made the gallery subhead's verb device-neutral, fixed the
  focus-outline clip. Deferred: none material.
- `/ux-check` (Laws of UX + Motion) on the two sections: all motion passes
  §9; laws mostly pass. Fixed: persistent-accent "See it live" on touch
  (was hover-only, so muted on mobile), `preload="metadata"` on the flagship
  tile to kill first-play lag.

## Awaiting

- Nothing outstanding. All three gallery sites (Arbor, Zendeb, Victoria) now
  have testimonials; the spotlight cycles four quotes from three clients.

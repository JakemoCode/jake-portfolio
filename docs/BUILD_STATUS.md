# Build Status

Running status of the portfolio build — what's in flight, whether it's
green, and what's queued. Update after any build activity (per the
workspace `frontend-standards.md`).

_Last updated: 2026-09-26_

## Gates

| Check | Command | Status |
|-------|---------|--------|
| Types | `npx tsc --noEmit` | ✅ clean |
| Unit/RTL | `npx vitest run` | ✅ 86 passing |
| Build | `npx vite build` | ✅ clean |
| Dev | `npm run dev` | serves at `localhost:5173` |

## Shipped

**PRs #43 and #44, the route swap and dark-only portfolio** (merged
2026-09-25). The portfolio serves at `/` and the client landing at
`/mosher-web-dev`; `/portfolio` answers with a 301, confirmed on production.
Root carries the portfolio's link-preview card (`public/og-portfolio.png`)
and the landing's tags and business schema move with it. The portfolio is
dark only, with no theme toggle or home mark; the landing and legal pages
stay light and set their own ground on `<html>`.

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

**Field affordance** · branch `feat/field-affordance`. The hero field now
shows that it can be clicked. With a mouse, a faint ring marks the node a
click would fire, the nodes under the cursor brighten (hover glow 0.8), and
a drag that starts on the field fires each node it crosses, once per node
cooldown. Touch keeps tap-to-fire only, since a drag there scrolls. Headline
contrast with the cursor resting on it: 7.3:1 at the worst pixel.

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
- One source for page titles and descriptions. The portfolio's live in both
  `index.html` and `Portfolio.tsx`, the landing's in both
  `scripts/emit-route-meta.mjs` and `Landing.tsx`, so editing one copy
  leaves link previews stale without failing the build (PR #43 review).
- One `--tap-target` in `tokens.css`. Ten modules each define their own
  (six at 44px, four at 2.75rem), and the `::after` tap-area block is
  copied between ProjectCard and Recommendations (PR #44 review).
- One token for the light ground. `#f6f5f3` and `color-scheme: light` are
  repeated in the `html:has(.page)` blocks of Landing, LegalPage and
  Playground (PR #44 review).
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

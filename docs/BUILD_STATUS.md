# Build Status

Running status of the portfolio build — what's in flight, whether it's
green, and what's queued. Update after any build activity (per the
workspace `frontend-standards.md`).

_Last updated: 2026-09-24_

## Gates

| Check | Command | Status |
|-------|---------|--------|
| Types | `npx tsc --noEmit` | ✅ clean |
| Unit/RTL | `npx vitest run` | ✅ 64 passing |
| Build | `npx vite build` | ✅ clean |
| Dev | `npm run dev` | serves at `localhost:5173` |

## Shipped

**PR #25 — work gallery + testimonial spotlight** (merged 2026-07-07, in `main`).
Reworked the landing's "proof" zone into two dark-surface sections: the
`WorkGallery` (hero-on-hover/tap tiles + phone inset, VP9 WebM per
[`MEDIA.md`](./MEDIA.md), replacing the device-pill preview) and the imageless
`Proof` spotlight. The old responsive-preview system is archived to
`_archive/responsive-preview/`.

## In flight

**`/portfolio` restructure** · branch `feat/portfolio-restructure`. New order:
a full-screen teal hero (Canvas2D "synaptic field", title, availability line,
résumé PDF from `public/`, contact links, a cue into the first section, and a
pause control), How I work with AI (the old "How I build" paragraph folded
into its intro), the case-study teaser with the nakshatra wheel, "What I
build" over the project cards, testimonials, a new "Tools I recommend"
section (`src/content/recommendedTools.ts`, drawn from the Workspace
`docs/how-i-work-with-ai-tools.md`), then contact. A sticky side rail
at 75em and up tracks the section in view with scroll-driven CSS only. Axe
clean at 390/768/1280/1440 × light/dark × motion/reduced; hero text measured
at AA against the brightest canvas pixel over eight frames. The route swap to
`/` waits until the page is signed off.

**Victoria Grace testimonial** · branch `feat/victoria-testimonial`.
Fourth testimonial (the flagship gallery client) — every gallery site now has a
quote, from three distinct clients.

## Follow-ups

- Product cards: tall captures of Coffee Roast Tracker and Baby Day Planner
  that pan inside their frame on scroll. Needs signed-in captures; both
  public URLs stop at a landing or sign-in page.
- Tune the hero field (density, firing rate).
- Route swap: `/portfolio` to `/`, landing to `/mosher-web-dev`, 301 from
  `/portfolio`.

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

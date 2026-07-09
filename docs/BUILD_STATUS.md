# Build Status

Running status of the portfolio build — what's in flight, whether it's
green, and what's queued. Update after any build activity (per the
workspace `frontend-standards.md`).

_Last updated: 2026-07-07_

## Gates

| Check | Command | Status |
|-------|---------|--------|
| Types | `npx tsc --noEmit` | ✅ clean |
| Unit/RTL | `npx vitest run` | ✅ 22 passing |
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

**Victoria Grace testimonial** · branch `feat/victoria-testimonial`.
Fourth testimonial (the flagship gallery client) — every gallery site now has a
quote, from three distinct clients.

## Follow-ups

- None open. (The testimonial focus-outline clipping is fixed via
  `overflow: clip` + `overflow-clip-margin` on `.stage`.)

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

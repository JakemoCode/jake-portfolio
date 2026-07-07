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

## In flight

**PR #25 — work gallery + testimonial spotlight** · branch `feat/responsive-preview` · **draft**, base `main`.

Reworks the landing's "proof" zone into two sections on a shared dark surface:

- **Work gallery** (`WorkGallery`) — replaces the old device-pill / scroll-video
  "See it adapt" preview. Each client tile plays the site's real hero entrance
  on hover (desktop) or tap (no-hover devices); a static phone inset shows the
  mobile layout; the tile links to the live site. VP9 WebM, lazy (`preload="none"`),
  captured per [`MEDIA.md`](./MEDIA.md).
- **Testimonial spotlight** (`Proof`) — imageless, full-width quote (the per-quote
  screenshot duplicated the gallery below it).
- Old system (`ResponsiveShowcase`, `ResponsivePreview`, `Filmstrip`,
  `previewLayers`, `demos` + per-device assets) archived to
  `_archive/responsive-preview/` (excluded from vitest).

Reviewed (multi-angle) and simplified; findings addressed in-branch.

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

- **Victoria Grace** testimonial to round out the set (Arbor and Zendeb, the
  other two gallery sites, now have quotes).

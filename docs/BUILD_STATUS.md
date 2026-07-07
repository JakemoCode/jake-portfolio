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

- [ ] **a11y: focus outline clipped in the testimonial spotlight.** `Proof`'s
  `.stage { overflow: hidden }` (required to clip the off-stage swiped slides)
  crops the `:focus-visible` outline of the flush-left "See it live" and
  "Read more" controls (their `outline-offset: 3px` paints outside the clipped
  box). Fix without breaking the swipe clip — e.g. inset the slide content, a
  focus-only outline treatment, or a `mask` instead of `overflow`. _Pre-existing;
  surfaced in the PR #25 review._

## Awaiting

- Updated **Zendeb** testimonial from the client (requested a more concrete
  edit); joins the existing `zendeb` gallery tile when it lands.
- Testimonials from Zendeb / Victoria to balance the testimonial set.

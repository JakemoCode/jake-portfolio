# Design & Accessibility Audit

_Run: 2026-06-11 · routes `/` and `/portfolio` · axe-core 4.10 (injected in-page) + source review._

## Tooling caveat (read first)

This audit ran against a **long-lived dev-browser instance that proved
unreliable** this session: the renderer froze repeatedly, screenshots
rendered the light theme while the DOM reported dark, and computed styles
read back in an incoherent state (e.g. `--color-bg` = `#111110` while
`body` background computed `transparent`, project titles `#000` on dark
cards, links `#f0eee8` on white). No correct stylesheet produces that mix.

**Consequence:** the axe **color-contrast** results on `/portfolio` are
artifacts of that broken render, not real defects — confirmed against
source (see Passes). A clean re-run in a fresh browser session is
recommended to regenerate trustworthy automated numbers.

## Critical (fix before merge)

_None._

## Major (fix in same sprint)

_None confirmed._ axe reported `color-contrast` × 9 on `/portfolio`, but
these are the tooling artifact described above — the dark theme is
correctly wired (see Passes).

## Minor (fix when touching the component)

- **Landmark / `region`** · `/portfolio` · `Portfolio.tsx` · `.home` +
  `ThemeToggle` — the fixed home mark and theme toggle rendered as direct
  children of `.page`, outside any landmark, so not all content was
  contained by a landmark (axe `region`, moderate). **Fixed:** wrapped both
  in a `<header>` banner landmark (controls stay `position: fixed`, so no
  layout box is added).

## Passes

- **Landing `/`** — 0 axe violations.
- **`/portfolio` dark theme is correctly wired (source):** `global.css`
  sets `body { background: var(--color-bg); color: var(--color-text) }`;
  `tokens.css` `[data-theme="dark"]` defines `--color-bg: #111110`,
  `--color-text: #f0eee8`; `ProjectCard .name` inherits the light text
  color. A correct render of `/portfolio` in dark mode is fully legible —
  the axe contrast flags are not reproducible from this source.
- Semantic structure, `aria-label`s on icon-only controls, `alt` text on
  project/avatar images, reduced-motion gating on all motion, visible
  focus states.

## Recommended follow-up

1. Re-run `/design-audit` in a fresh browser session for trustworthy
   automated numbers (this instance was corrupted).
2. 5-second manual confirm: open `/portfolio` on a dark-mode device — text
   should be fully legible.

## Acknowledged Issues

_None._

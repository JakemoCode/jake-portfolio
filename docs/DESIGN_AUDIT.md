# Design & Accessibility Audit

**Route:** `/` (single-route app)
**Date:** 2026-06-01
**Conformance target:** WCAG 2.2 AA
**Method:** axe-core (real scan via Playwright) at 4 breakpoints × 2 themes (8 scans), plus
manual contrast math and static checklist review. Dev server: `http://localhost:5173/`.

## Summary

| Severity | Count |
|---|---|
| Critical | 0 |
| Major | 0 |
| Minor | 1 |

- **axe-core: 0 violations** across all 8 breakpoint/theme combinations
  (mobile 375 / tablet 768 / desktop 1280 / lg-desktop 1440, in light + dark),
  tested against `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`.
- **Color contrast (1.4.3): all text pairs pass AA** in both themes after the
  `--color-text-subtle` token fix (light `#6e6e6b`, dark `#8a877f`).
- **Section eyebrows unified**: Hero "Portfolio", "Testimonials", and "Get in touch"
  now share one treatment (`0.9375rem`, weight 400, `--color-text-muted`).
- One Minor finding: motion does not respect `prefers-reduced-motion`.

## Critical (fix before merge)

None.

## Major (fix in same sprint)

None.

## Minor (fix when touching the component)

### M1 · Motion does not respect `prefers-reduced-motion`
- **Route:** `/` (global)
- **File:** `src/styles/global.css` (also affects `ProjectCard.module.css`,
  `ThemeToggle.module.css`, `ContactLinks.module.css`, `Testimonials.module.css`)
- **Issue:** Standard "Motion respects prefers-reduced-motion media query."
  Transitions on `background`/`color` (body), `border-color`/`transform` (cards),
  and link/toggle hovers run unconditionally. No `@media (prefers-reduced-motion: reduce)`
  block exists.
- **DOM selector:** `body`, `.card`, `.toggle`, `.link`
- **Fix:** Add a global reduced-motion guard:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }
  }
  ```
- **Status:** Not auto-fixed (protocol: Minor issues flagged for human review).

## Passes (verified correct)

- **Contrast 1.4.3** — all text ≥ 4.5:1 (small) / ≥ 3:1 (large) in both themes.
- **Focus visible 2.4.7 / 1.4.11** — 2px accent outline, 3px offset; 5.01:1 (light) /
  6.52:1 (dark) against background, exceeds 3:1.
- **Motion technique** — transitions animate paint/transform only; no layout animations.
- **Target size 2.5.8** — theme toggle ≈ 27px tall; other links inline (exempt).
- **Non-text contrast 1.4.11** — decorative card borders exempt; the one control
  (toggle) is identifiable by text label + fill.
- **Landmarks** — `header`, `main`, `section[aria-labelledby]`, `footer`, `nav[aria-label]`.
- **Headings** — clean `h1 → h2 → h3`, no skipped levels.
- **Images** — meaningful `alt` on both screenshots; decorative glyphs `aria-hidden`.
- **Name/role/value** — theme toggle has `aria-label`; reflows 2→1 col without loss.
- **Reflow 1.4.10** — no overflow/clipping at 375px (mobile) and up.

## Screenshots

Captured at 2× DPR, full-page. Grouped by theme then breakpoint.

**Light:**
- `docs/design-audit-screenshots/light-mobile.png` (375)
- `docs/design-audit-screenshots/light-tablet.png` (768)
- `docs/design-audit-screenshots/light-desktop.png` (1280)
- `docs/design-audit-screenshots/light-lg-desktop.png` (1440)

**Dark:**
- `docs/design-audit-screenshots/dark-mobile.png` (375)
- `docs/design-audit-screenshots/dark-tablet.png` (768)
- `docs/design-audit-screenshots/dark-desktop.png` (1280)
- `docs/design-audit-screenshots/dark-lg-desktop.png` (1440)

## Non-a11y notes (out of audit scope, flagged in passing)

- `src/content/testimonials.ts:9` — `// PLACEHOLDER content` comment is now stale;
  both entries are real. Remove the comment.
- `src/content/testimonials.ts:17` — role reads "Joytish Tarot"; the quote and the
  linked domain (`jyotishtarot.com`) spell it "Jyotish". Likely a typo.

## Acknowledged Issues (user-approved to ship)

None recorded.

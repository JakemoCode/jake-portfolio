# jake-portfolio

Personal portfolio site. Vite + React 19 + TypeScript, deployed on Vercel.

## Run

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

## Structure

- `src/content/projects.ts` — typed array of project case studies. Edit here to update card content.
- `src/components/` — Hero, ProjectCard, ContactLinks, ThemeToggle.
- `src/styles/tokens.css` — design tokens (colors, spacing, type) with light/dark theme switching via `[data-theme]`.
- `src/styles/global.css` — base element styles.
- `src/App.tsx` — page composition.

## Theming

Light/dark mode is driven by a `data-theme` attribute on `<html>`. The initial value is set by an inline script in `index.html` before React hydrates to prevent flicker. `ThemeToggle` persists user choice to `localStorage`.

## Screenshots

Screenshots are picked up from `src/assets/` by filename, but only for slugs listed in the orientation map below. A file alone is not enough; without a map entry the card keeps the dashed placeholder.

| Project | Filename | Capture viewport | Final image | Orientation |
|---|---|---|---|---|
| Coffee Roast Tracker | `coffee-roast-tracker.png` | 1440 × 1080 (4:3) | ≥ 1200 × 900 px | Landscape, fills the 4:3 slot |
| Baby Day Planner | `baby-day-planner.png` | 390 × 844 (iPhone) | 780 × 1688 px (2×) | Mobile portrait, rendered inside a phone-frame mockup |

Supported extensions: `png`, `jpg`, `jpeg`, `webp`, `gif`.

Wiring lives in `src/content/projects.ts` (`screenshotOrientations`). To add a new project's screenshot, drop the image in `src/assets/<slug>.png` and add an entry to that map with the desired orientation (`"landscape"` or `"phone"`).

## Deploy

Push to GitHub, import in Vercel — framework auto-detects as Vite. No `vercel.json` needed.

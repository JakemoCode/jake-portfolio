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

## Adding screenshots

Replace the placeholder `.media` blocks in `ProjectCard.tsx` with `<img>` tags pointing at files in `src/assets/`. Recommended: 4:3 aspect ratio, ~1200×900 PNGs (or GIFs under ~2MB).

## Deploy

Push to GitHub, import in Vercel — framework auto-detects as Vite. No `vercel.json` needed.

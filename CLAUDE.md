# CLAUDE.md

jakemosher.dev: Jake's portfolio at `/` and the Mosher Web Development client landing at `/mosher-web-dev`. Vite + React 19 + TypeScript on Vercel.

## Site

- Production base URL is https://jakemosher.dev/. Contact is jake@jakemosher.dev.
- Treat these portfolio decisions as fixed unless Jake reopens them:
  - Section order: hero, Experience, case study, What I build, How I work with AI, Tools I recommend, contact.
  - Teal is the atmosphere color and terracotta is the accent.
  - Dark only, with no theme toggle.
  - Bricolage Grotesque stays the display face.
- For bolder or delight work, extend an existing motif before inventing an effect. The hero's synaptic field and the project cards' field wells are two.

## Copy

- Describe the general practice in method copy. Leave private project names and internal paths out of body text, and keep them to a figure at most.
- Quote only words Jake typed himself.

## Pricing

- Every displayed price must match the Notion "Canonical Pricing Structure" page (Freelance HQ), §10 anchors and §12 entry offers. Read it before changing a number.
- Never put the §2 per-page formula, the §3 multipliers, or the $100/hr floor in the repo, in code, comments, or docs.

## Dev and tests

- In a git worktree, run `npm install` before `npm run dev`, or the `@fontsource` fonts return 503. Do not change `server.fs.allow` to fix it.
- Vitest runs with `globals` off, so Testing Library never auto-cleans. Call `afterEach(cleanup)` in every test file that renders, or the DOM piles up across tests.

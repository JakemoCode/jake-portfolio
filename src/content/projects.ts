export type Screenshot = {
  src: string;
  alt: string;
  orientation: "landscape" | "phone";
};

export type Project = {
  slug: string;
  name: string;
  summary: string;
  problem: string;
  built: string;
  tech: string[];
  liveUrl: string | null;
  liveLabel?: string;
  repoUrl: string;
  status?: "live" | "coming-soon";
  screenshot?: Screenshot;
};

export const projects: Project[] = [
  {
    slug: "coffee-roast-tracker",
    name: "Coffee Roast Tracker",
    summary:
      "A web app for home coffee roasters to import, annotate, analyze, and share their Kaffelogic roast logs.",
    problem:
      "Kaffelogic roasters end up with a folder full of .klog files and no real way to use them. Comparing phase timings across beans means opening files side by side. Bean inventory and roast history live in separate worlds. Sharing a profile with another roaster means emailing a binary file with no context. The data isn't lost, but it isn't usable either.",
    built:
      "A full-stack roast tracker built around the Kaffelogic export formats. Drop a .klog or CSV in, and the app pulls temperature curves and phase markers (drying, Maillard, development), ties the roast back to a bean in your inventory, and computes DTR% and per-phase comparisons against your other roasts of the same bean. Public roast pages let other roasters download the .kpro profile and replicate the recipe on their own machine. Beans added to the library can parse supplier descriptions intelligently for Specialty Coffee Association flavor tags.",
    tech: [
      "React 19",
      "TypeScript",
      "Vite",
      "Apollo Client 4",
      "CSS Modules",
      "Playwright",
      "Node.js",
      "Apollo Server 4",
      "Prisma",
      "PostgreSQL (Neon)",
      "Clerk",
      "Cloudflare R2",
      "Vercel",
    ],
    liveUrl: "https://coffee-roast-tracker-client.vercel.app/",
    repoUrl: "https://github.com/JakemoCode/coffee-roast-tracker",
    status: "live",
  },
  {
    slug: "baby-day-planner",
    name: "Baby Day Planner",
    summary:
      "A Next.js + Firestore app that forecasts a baby's day (naps, bottles, bedtime) from what's actually happened so far, instead of dictating a fixed schedule.",
    problem:
      "Real babies don't follow rigid schedules. A baby who was supposed to wake at 9 might wake at 8:35; a 90-minute nap turns into 40; the bottle that was due in an hour gets pulled forward; suddenly bedtime is a moving target. Static planner apps either lock parents into a plan that's wrong by 9 AM or devolve into a logging tool with no forward view. What's actually needed is a planner that re-projects the rest of the day every time reality changes.",
    built:
      "A rules engine that takes recorded events as ground truth and re-projects naps, wake windows, bottles, and bedtime forward through the end of the day on every tick. The cascade is sequential; each nap's end anchors the next wake window, each wake window's length (set by you) anchors the next nap, and bottles chain at intervals you set and smartly avoid landing inside a nap. Recorded events are protected, projections fill the gaps. The fundamental assumption is \"reality wins.\" UI is a dashboard + timeline + tomorrow view, with one-off events, recurring events, and pumping blocks supported as well. Co-parents can log to the same baby, invite other family members, or just assign ownership to each event ad-hoc. Day templates save common schedules to reuse, history makes past days searchable, and you can prepare for tomorrow with a plan that automatically rolls over at midnight.",
    tech: [
      "Next.js 16",
      "React 19",
      "React Compiler",
      "TypeScript",
      "CSS Modules",
      "Firestore",
      "Firebase Auth",
      "Vitest",
      "Playwright",
      "Vercel",
    ],
    liveUrl: "https://baby-day-planner.vercel.app",
    repoUrl: "https://github.com/JakemoCode/baby-day-planner",
    status: "live",
  },
  {
    slug: "frontend-tools",
    name: "Frontend Tools",
    summary:
      "Three Claude Code commands that audit a frontend for accessibility, interaction psychology, motion, and token discipline, plus the reference files and browser tooling they run on.",
    problem:
      "Ask a coding agent to review a UI and you get taste assertions. \"Feels cramped.\" \"Consider more contrast.\" Nothing you can act on, and nothing you can argue with either, because no principle was named. A review worth reading says which rule the code broke, what the user loses because of it, and a fix specific enough to paste. That needs two things an agent does not have by default: reference material it reads at review time, and a real browser measuring the page that actually rendered rather than the source it guessed from.",
    built:
      "Three slash commands and the machinery under them. /ux-check runs a Laws of UX pass for cognition and interaction alongside a motion pass that asks whether each animation does a usability job or is decoration, measured at 1280px and 390px when a browser is available. /design-audit dispatches three subagents in parallel and drives Chromium through a small MCP server running axe-core against the rendered DOM, so violations come from the markup the user gets. The auto-fix pass for Critical and Major issues is rollback-safe. It checkpoints before editing and reverts on any new violation or failing test. /tokenize sweeps hard-coded CSS and confirms every surviving literal uses a deliberate unit. A PostToolUse hook blocks a newly written clamp() on a layout property until it carries a marker naming the width at which deleting the value would change the render. Each of the four rules files declares a paths pattern in its frontmatter, so they load on .tsx, .jsx, and .css files and stay out of context everywhere else.",
    tech: [
      "Claude Code",
      "Model Context Protocol",
      "Node.js",
      "Playwright",
      "axe-core",
      "Python",
      "Markdown",
    ],
    liveUrl: null,
    liveLabel: "Runs in Claude Code",
    repoUrl: "https://github.com/JakemoCode/frontend-tools",
    status: "live",
  },
  {
    slug: "docs-distillation-gate",
    name: "Docs Distillation Gate",
    summary:
      "A pre-push and CI check that measures how far a document fell between its draft and its final commit, and blocks the ones that never fell.",
    problem:
      "Most documentation standards are a sentence in a contributing guide asking for brevity, and nothing reads it. A repository I work in had a stated 50 per cent compression target, several agents writing documents into it, and no enforcement whatsoever. Asking a model to be concise gets you a document that sounds concise. Reading the result will not tell you whether anything was actually cut, because the draft it came from is gone. The one place that evidence survives is the commit history.",
    built:
      "The gate walks every commit on the branch, counts the prose words of each gated document at each point, and treats that series as a curve. Prose means what a reader reads: fenced blocks, inline code, HTML comments and markdown syntax are all free, and a token has to carry a letter to count, so a table of numbers costs nothing while the words in its cells still do. A document passes on one of three grounds: it reached half its baseline, its curve flattened out, or it was too short to be worth gating. The baseline is the curve's highest point rather than its first, because the grammar pass the method prescribes adds words before it removes any, and billing the writer for that would punish following the instructions. Each distilled document carries its curve in a stamp on its first line, and the check resolves the revision named there back through the history, so a squash merge cannot orphan the evidence. A commit trailer clears a block, and every override is reported against the author who wrote it. One file, no dependencies, 70 tests.",
    tech: [
      "Node.js",
      "ESM",
      "GitHub Actions",
      "husky",
      "node:test",
    ],
    liveUrl: null,
    liveLabel: "Runs in CI and pre-push",
    repoUrl: "https://github.com/JakemoCode/docs-distillation-gate",
    status: "live",
  },
];

const screenshotModules = import.meta.glob<{ default: string }>(
  "../assets/*.{png,jpg,jpeg,webp,gif}",
  { eager: true },
);

const screenshotOrientations: Record<string, Screenshot["orientation"]> = {
  "coffee-roast-tracker": "landscape",
  "baby-day-planner": "phone",
  "frontend-tools": "landscape",
};

// Product screenshots describe themselves well enough from the project name.
// A diagram does not, so it supplies its own alt.
const screenshotAlts: Record<string, string> = {
  "frontend-tools":
    "Diagram: the /ux-check, /design-audit, and /tokenize commands read .tsx, .jsx, and .css files and score them against 30 UX laws and WCAG 2.2 AA at 1280px and 390px. What comes back is a finding that names the principle, states the consequence, and gives the fix.",
};

function resolveScreenshot(slug: string, name: string): Screenshot | undefined {
  const orientation = screenshotOrientations[slug];
  if (!orientation) return undefined;

  const entry = Object.entries(screenshotModules).find(([path]) =>
    path.includes(`/${slug}.`),
  );
  if (!entry) return undefined;

  const alt = screenshotAlts[slug] ?? `${name} screenshot`;
  return { src: entry[1].default, alt, orientation };
}

for (const project of projects) {
  project.screenshot = resolveScreenshot(project.slug, project.name);
}

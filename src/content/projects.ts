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
      "Home roasters using Kaffelogic machines accumulate .klog profile files but have no good way to organize them, compare phase timings across beans, track bean inventory through roast history, or share roast profiles with other roasters — the data lives trapped in per-batch files on disk.",
    built:
      "A full-stack roast tracker that ingests Kaffelogic .klog (JSON) and CSV exports, parses temperature curves and phase markers (drying / Maillard / development), associates each roast with a bean in the user's inventory, computes DTR% and phase comparisons, and exposes public roast pages with optional .kpro profile downloads so roasters can share recipes. Auth-scoped writes, public reads, Celsius-native storage with per-user °C/°F preference.",
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
      "A Next.js + Firestore app that forecasts a baby's day — naps, bottles, bedtime — from what's actually happened so far, instead of dictating a fixed schedule.",
    problem:
      "Real babies don't follow rigid schedules: wake windows shift, naps run short, bottles drift, and bedtime moves with everything else. Static planner apps either lock parents into a plan that's wrong by 9 AM or devolve into a logging tool with no forward view. Parents need a planner that re-projects the rest of the day every time reality changes.",
    built:
      "A V3 rules engine that takes recorded events as ground truth and re-projects naps, wake windows, bottles, and bedtime forward through midnight on every tick. The cascade is sequential — each nap's end anchors the next wake window, each wake window's end anchors the next nap, and bottles chain at interval inside the no-feed regions naps carve out. Recorded events are protected (\"reality wins\"); projections fill the gaps. UI is a dashboard + timeline + tomorrow view, with FAB-driven event entry. Multi-parent ownership, day templates, history, and tomorrow-rollover round it out.",
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
    liveUrl: null,
    liveLabel: "Live demo coming soon",
    repoUrl: "https://github.com/JakemoCode/baby-day-planner",
    status: "coming-soon",
  },
];

const screenshotModules = import.meta.glob<{ default: string }>(
  "../assets/*.{png,jpg,jpeg,webp,gif}",
  { eager: true },
);

const screenshotOrientations: Record<string, Screenshot["orientation"]> = {
  "coffee-roast-tracker": "landscape",
  "baby-day-planner": "phone",
};

function resolveScreenshot(slug: string, name: string): Screenshot | undefined {
  const orientation = screenshotOrientations[slug];
  if (!orientation) return undefined;

  const entry = Object.entries(screenshotModules).find(([path]) =>
    path.includes(`/${slug}.`),
  );
  if (!entry) return undefined;

  return { src: entry[1].default, alt: `${name} screenshot`, orientation };
}

for (const project of projects) {
  project.screenshot = resolveScreenshot(project.slug, project.name);
}

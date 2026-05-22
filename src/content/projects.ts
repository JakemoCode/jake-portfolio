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
      "A full-stack roast tracker built around the Kaffelogic export formats. Drop a .klog or CSV in, and the app pulls temperature curves and phase markers (drying, Maillard, development), ties the roast back to a bean in your inventory, and computes DTR% and per-phase comparisons against your other roasts of the same bean. Public roast pages let other roasters download the .kpro profile and replicate the recipe on their own machine. Writes are auth-scoped, reads are public; storage is Celsius-native with a per-user °C/°F display preference.",
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
      "A V3 rules engine that takes recorded events as ground truth and re-projects naps, wake windows, bottles, and bedtime forward through midnight on every tick. The cascade is sequential; each nap's end anchors the next wake window, each wake window's end anchors the next nap, and bottles chain at interval inside the no-feed regions naps carve out. Recorded events are protected, projections fill the gaps. The fundamental assumption is \"reality wins.\" UI is a dashboard + timeline + tomorrow view, with FAB-driven event entry. Multi-parent ownership lets both parents log to the same baby. Day templates save common schedules to reuse, history makes past days searchable, and you can prepare for tomorrow with a plan that automatically rolls over at midnight.",
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

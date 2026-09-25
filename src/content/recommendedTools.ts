// "Tools I recommend" on /portfolio. Distilled from how-i-work-with-ai-tools.md
// in the Workspace docs (outside this repo), which counts use from session logs
// and records where each of my own tools came from. Every note traces to it.

export type RecommendedTool = {
  name: string;
  by: string;
  href: string;
  note: string;
  /** A smaller line under the note. */
  aside?: string;
  /** A public tool of mine this one went into. */
  became?: { name: string; href: string };
};

const frontendTools = { name: "frontend-tools", href: "https://github.com/JakemoCode/frontend-tools" };

export const toolsIUse: RecommendedTool[] = [
  {
    name: "mattpocock-skills",
    by: "Matt Pocock",
    href: "https://github.com/mattpocock/skills",
    note: "/tdd runs the red-green loop, /grill-me questions a plan before I build it, /wayfinder maps the decisions before the tasks, and codebase-design takes over when a review says a module's shape is wrong.",
  },
  {
    name: "Impeccable",
    by: "Paul Bakaus",
    href: "https://impeccable.style",
    note: "A design skill for agents. I run it on every frontend build, including this page, and my /tokenize cleanup pass is built on its extract and polish commands.",
    aside:
      "If you run Impeccable on this site, it will flag a few things. Those were all deliberate calls on my part, and the flags show how much it catches on a real build.",
  },
  {
    name: "Greptile",
    by: "Greptile",
    href: "https://www.greptile.com",
    note: "An AI reviewer for pull requests. On a team project it caught the bug a full run of green checks missed, and of the review bots I've compared, it's the one I'd recommend.",
  },
  {
    name: "career-ops",
    by: "santifer",
    href: "https://github.com/santifer/career-ops",
    note: "A multi-agent job search system that runs in Claude Code. I run my own layer on top of it.",
  },
];

export const toolsIBuiltOn: RecommendedTool[] = [
  {
    name: "Laws of UX",
    by: "Jon Yablonski",
    href: "https://lawsofux.com",
    note: "The 30 principles my /ux-check scores an interface against, so every finding names the law it breaks.",
    became: frontendTools,
  },
  {
    name: "axe-core",
    by: "Deque",
    href: "https://github.com/dequelabs/axe-core",
    note: "Runs through Playwright in my /design-audit, which checks WCAG 2.2 AA on the rendered page at every breakpoint.",
    became: frontendTools,
  },
  {
    name: "The Nine Dark Arts of Building Effective AI Skills",
    by: "Paul Bakaus",
    href: "https://www.youtube.com/watch?v=SQMCtZX3trg",
    note: "\"Make them argue\" is why my design reviews use independent reviewers who report before anyone synthesizes. With Matt Pocock's writing-for-agents, it's also the basis of distill-prose.",
    became: { name: "distill-prose", href: "https://github.com/JakemoCode/distill-prose" },
  },
  {
    name: "ASD-STE100",
    by: "ASD",
    href: "https://www.asd-ste100.org",
    note: "Simplified Technical English, the controlled language behind the doc gate's conversion step.",
    became: { name: "docs-distillation-gate", href: "https://github.com/JakemoCode/docs-distillation-gate" },
  },
  {
    name: "Radiant",
    by: "radiant-shaders.com",
    href: "https://radiant-shaders.com",
    note: "A gallery of generative shaders. The field behind my name started from its Aurora Veil, Kinetic Grid and Flow Field.",
  },
];

// Copy for the "How I work with AI" section on /portfolio. Distilled from the
// evidence doc (docs/how-i-work-with-ai.md in the Workspace root, outside this
// repo). Every figure and quote traces to that doc or to the repo it cites;
// numbers were checked on 2026-09-23 and move weekly.
import { minimapLengths } from "./methodologyMinimap";

export type FigureKey =
  | "harden"
  | "authority"
  | "decisions"
  | "friction"
  | "provenance"
  | "red"
  | "principle"
  | "distill"
  | "split"
  | "budget"
  | "redline"
  | "page"
  | "why"
  | "funnel"
  | "extract";

export type Quote = {
  text: string;
  /** When I typed it to Claude Code, as YYYY-MM-DD. */
  date: string;
};

export type Theme = {
  /** The theme's number in the evidence doc, which orders the minimap. */
  docNumber: number;
  slug: string;
  title: string;
  body: string;
  quote: Quote;
  figure: FigureKey;
};

export type Act = {
  slug: string;
  title: string;
  line: string;
  themes: Theme[];
};

export const methodologyActs: Act[] = [
  {
    slug: "before-code",
    title: "Decide before building",
    line: "The design gets argued with before any code exists.",
    themes: [
      {
        docNumber: 1,
        slug: "harden-the-design",
        title: "Harden the design before writing code",
        body: "Before a big build, the design docs go through rounds of review across different models, each with a narrow brief: one document at a time, a pre-mortem, a blind read with earlier reviews withheld. Every brief carries one filter: only report what would change the design.",
        quote: {
          text: "I passed [the four design docs] back and forth between [three models] to harden the s#!t out of each of those documents before I even started thinking about building.",
          date: "2026-09-16",
        },
        figure: "harden",
      },
      {
        docNumber: 5,
        slug: "one-source-of-truth",
        title: "Declare one source of truth",
        body: "Agents drift when two files both claim to be current, so each project names which document outranks which. When two disagree, one gets fixed, and neither keeps a note about what the other used to say.",
        quote: {
          text: "I'm curious why the doc needs 'X previously said Y' rather than just changing it and treating it as source-of-truth",
          date: "2026-09-18",
        },
        figure: "authority",
      },
      {
        docNumber: 9,
        slug: "quick-decisions",
        title: "I make the decisions. The agent makes them quick.",
        body: "A grilling skill turns open questions into numbered options, each with a recommendation, so I can answer a dozen in one line. Permission is explicit and scoped, like \"merge it when it's green,\" and once given it isn't re-checked.",
        quote: {
          text: "When you tell me there's a decision for me, please state the decision clearly, don't make me infer it from general scenarios",
          date: "2026-09-23",
        },
        figure: "decisions",
      },
    ],
  },
  {
    slug: "compile-judgment",
    title: "Compile the judgment",
    line: "If I've reasoned through something twice, it should be a script.",
    themes: [
      {
        docNumber: 2,
        slug: "reasoning-into-code",
        title: "Turn repeated reasoning into code",
        body: "The agent handles cases nobody has seen before. Once something repeats, it should become a script, hook, or check that costs nothing to run again. My builds keep a friction log that counts every recurring snag, so repeats get flagged for a permanent fix instead of another workaround.",
        quote: {
          text: "The goal here has been to 'outsource' agent work to scripts and packages that can be run infinitely for no agentic cost.",
          date: "2026-09-13",
        },
        figure: "friction",
      },
      {
        docNumber: 3,
        slug: "fix-the-gap",
        title: "Fix the gap that let a mistake through",
        body: "A miss rarely gets only a point fix. I ask how it got through, then how to enforce it, and the answer lands one level up: in a rule, a check, or a hook. Each of my agent rules records the incident that created it.",
        quote: {
          text: "How do we enforce this so the same slip/miss doesn't continue happening?",
          date: "2026-09-04",
        },
        figure: "provenance",
      },
      {
        docNumber: 4,
        slug: "fail-for-the-right-reason",
        title: "Tests have to fail for the right reason",
        body: "I build test-first with a /tdd skill, and a new test doesn't count until I've watched it fail for the right reason. One that passes with the defect put back is a vacuous pass. Unit, integration and system tests cover the behavior, and recorded mutations prove the suite still catches what it should.",
        quote: {
          text: "I want the 'must go red' to be enforced on a meaningful, directly applicable failure, not a broken module import.",
          date: "2026-09-22",
        },
        figure: "red",
      },
      {
        docNumber: 7,
        slug: "named-principles",
        title: "Judge against named principles, not taste",
        body: "\"Feels off\" isn't a finding. My UI audit commands only accept one that names the principle, shows how it breaks, says what the user loses, and gives a fix specific enough to paste.",
        quote: {
          text: "Every site I've built I've looked at it and said 'I don't think that passes wcag' and run a scan and, behold, it doesn't.",
          date: "2026-09-11",
        },
        figure: "principle",
      },
    ],
  },
  {
    slug: "keep-it-small",
    title: "Keep it small",
    line: "Fewer words, smaller PRs, and the cheapest model that does the job.",
    themes: [
      {
        docNumber: 6,
        slug: "less-text",
        title: "Less text, fewer rules",
        body: "My doc gate asks each document to halve its prose, and accepts less once the cuts stop coming, so real detail survives. Rules get the same pressure: I audit my agent rules for overlap and dead weight, and a job-scoring setup that had grown to 23 rules became one engine that scores each criterion in turn.",
        quote: {
          text: "Agents love prose. Prose rots brains.",
          date: "2026-09-22",
        },
        figure: "distill",
      },
      {
        docNumber: 10,
        slug: "small-named-units",
        title: "Work in small, named units from a clean start",
        body: "Work moves through three commands: work package, checkpoint, milestone. Large packages split into numbered sub-PRs at planning time, independent ones run in parallel, and each starts from a fresh main branch and a cleared session. My current build merged 124 PRs in its first ten days this way.",
        quote: {
          text: "The larger a PR is the more likely code-review misses something and the harder/more expensive it is to reason through",
          date: "2026-09-17",
        },
        figure: "split",
      },
      {
        docNumber: 11,
        slug: "budget-models",
        title: "Budget models like any other resource",
        body: "Every task shape has an assigned model and effort level. Search and pass/fail screening run on the smallest model, and escalation means more effort on the same model before reaching for a bigger one.",
        quote: {
          text: "Have I/we been using the appropriate model and effort for all the work we've done thus far?",
          date: "2026-09-21",
        },
        figure: "budget",
      },
    ],
  },
  {
    slug: "human-in-it",
    title: "Keep a human in it",
    line: "The agent does the volume. What goes out under my name, I check.",
    themes: [
      {
        docNumber: 8,
        slug: "accurate-and-mine",
        title: "Anything with my name on it is accurate and sounds like me",
        body: "Resume lines and application answers get checked for claims I can't back up, and anything invented comes out. I'd rather say plainly what I haven't shipped than build a side project to fill the gap.",
        quote: {
          text: "No, I don't have expertise, I have experience. Vastly different.",
          date: "2026-09-21",
        },
        figure: "redline",
      },
      {
        docNumber: 12,
        slug: "pages-for-humans",
        title: "Design pages for humans, write markdown for agents",
        body: "Anything I read to make a decision gets built as a page: a dependency map instead of a ticket list, a brief for a collaborator, an accessibility report for a friend's component library. Each is shaped for its reader, so that report dropped a section that only mattered to me.",
        quote: {
          text: "Looking at markdown makes my soul bleed",
          date: "2026-09-08",
        },
        figure: "page",
      },
      {
        docNumber: 13,
        slug: "always-ask-why",
        title: "Always ask why and how",
        body: "Every recommendation gets questioned, and every new tool gets a written evaluation before I install it. The ones that don't earn their place get uninstalled.",
        quote: {
          text: "I know things, but I will never assume I know everything about anything",
          date: "2026-09-09",
        },
        figure: "why",
      },
      {
        docNumber: 15,
        slug: "volume-and-calls",
        title: "The agent handles the volume. I make the calls.",
        body: "My job-search pipeline reads full job descriptions, scores roles against my criteria, and drafts a resume for each application. I set the direction: frontend roles once the job data backed it, IC work over roadmap ownership, and only products I care about.",
        quote: {
          text: "The nice thing is that I'm always going to poke when something seems off.",
          date: "2026-09-22",
        },
        figure: "funnel",
      },
      {
        docNumber: 14,
        slug: "extract-for-everyone",
        title: "Build it for one project, then extract it for everyone",
        body: "task-map started as the dashboard for one project and went from a screenshot to its first merged PR in under three hours. The same day it learned to read any issue tracker. My doc gate and UI audit commands took the same path into public repos.",
        quote: {
          text: "Live server is the best option because I want it to do that automatically for anyone who uses it.",
          date: "2026-09-22",
        },
        figure: "extract",
      },
    ],
  },
];

/** Lines in the evidence doc, for the opener's count-down. Read from the
    generated minimap so a regenerated doc can't leave it stale. */
export const evidenceLineCount = minimapLengths.length;

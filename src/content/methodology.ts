// Copy for the "How I work with AI" section on /portfolio. Distilled from the
// evidence docs (docs/how-i-work-with-ai*.md in the Workspace root, outside
// this repo). Every claim and quote traces to those docs or the repos they
// cite; quotes are messages I typed, never text another model drafted.
import { minimapLengths } from "./methodologyMinimap";

export type FigureKey = "harden" | "principle" | "red" | "split" | "gate" | "gauntlet" | "budget";

export type Habit = {
  slug: string;
  title: string;
  /** The evidence doc heading this habit grew from; places its mark in the opener. */
  docHeading: string;
  body: string;
  quote?: string;
  figure: FigureKey;
};

export const methodologyIntro =
  "I mostly build solo, so the agent is the only other set of hands on the code. I build my own layer on top of it: skills, a rules architecture, and subagents that run real workflows, with accessibility and responsive layout required from the first commit. These habits are the checks a team would normally give me: design review, test discipline, small reviewable changes, and rules that enforce themselves. The final calls stay mine. Quotes are verbatim from my sessions.";

export const methodologyHabits: Habit[] = [
  {
    slug: "harden-the-design",
    title: "Harden the design before the code",
    docHeading: "1. Harden the design before writing code",
    body: "Before a build, and whenever a hard problem surfaces partway through one, the design goes through rounds of review: blind reads with earlier reviews withheld, adversarial reviews where competing proposals argue against each other, and research before anyone commits to an answer. Each round gets a narrow brief and a named lens. Right now that means several adversarial rounds converging on fixes for problems that came from a constraint nobody had investigated, because it had been quietly left for later. Once a design settles, one document outranks the rest, and open questions come back to me as numbered options with a recommendation.",
    quote:
      "I passed [the four design docs] back and forth between [three models] to harden the s#!t out of each of those documents before I even started thinking about building.",
    figure: "harden",
  },
  {
    slug: "named-principles",
    title: "Judge against named principles, not taste",
    docHeading: "7. Judge against named principles, not taste",
    body: "\"Feels off\" isn't a finding. My UI audits only accept one that names the principle it breaks, shows how it breaks, says what the user loses, and gives a fix specific enough to paste. The principles come from published sources: WCAG 2.2, Laws of UX, Nielsen Norman Group.",
    figure: "principle",
  },
  {
    slug: "fail-for-the-right-reason",
    title: "A test has to fail for the right reason",
    docHeading: "4. Tests have to fail for the right reason",
    body: "I build test-first, and a new test doesn't count until I've watched it fail on the behavior it covers. A red from a broken import proves nothing, and neither does a test that still passes with the defect put back. I don't skip this, because it gets skipped exactly when confidence is highest. Unit, integration and system tests cover the behavior, and recorded mutations prove the suite still catches what it should.",
    figure: "red",
  },
  {
    slug: "small-named-units",
    title: "Small, reviewable units from a clean start",
    docHeading: "10. Work in small, named units from a clean start",
    body: "Work moves through three commands: work package, checkpoint, milestone. Large packages split into numbered PRs at planning time, independent ones run in parallel, and each starts from a fresh main branch and a cleared session. The larger a PR is, the more likely review misses something and the harder it is to reason through, so when a change blows its test budget, the answer is to split it, not raise the budget. My current build has merged over 120 PRs this way.",
    figure: "split",
  },
  {
    slug: "miss-becomes-guardrail",
    title: "Every miss becomes a guardrail",
    docHeading: "3. Fix the gap that let a mistake through",
    body: "When something repeats or slips through, the fix goes one level up: a script, a hook, or a check that runs without me. A friction log counts recurring snags so repeats get a permanent fix, and every rule file records the incident that created it. A new gate runs in shadow mode first, logging what it would block, because a gate that cries wolf gets switched off.",
    quote:
      "The goal here has been to 'outsource' agent work to scripts and packages that can be run infinitely for no agentic cost.",
    figure: "gate",
  },
  {
    slug: "confidently-wrong",
    title: "Catch the agent when it's confidently wrong",
    docHeading: "Where it still slips",
    body: "Green checks aren't proof. One change went through two independent design proposals, an adversarial breaker, an arbiter, two rounds of code review and six acceptance checks, all green. An outside AI reviewer found a serious bug in about a minute, then a second one in the fix minutes later. Two lessons came out of it: a fix that satisfies a finding is the most likely place for the next bug, and a check I have to remember to run gets skipped on the busy day. The review skill I built that night proved it: it hasn't run since, which is why it needs a hook, not my memory.",
    quote: "So we planned around async then picked an async-rejecting package? Love that for us.",
    figure: "gauntlet",
  },
  {
    slug: "budget-models",
    title: "Budget the agent like any other resource",
    docHeading: "11. Budget models like any other resource",
    body: "Every task shape has an assigned model and effort level, so cost tracks the work. Search and pass/fail screening run on the smallest model, and escalating means more effort on the same model before a bigger one. When an audit of 167 subagent dispatches showed my \"default to the cheaper model\" rule was a coin flip in practice, the rule became named agents with the model fixed in their definitions.",
    figure: "budget",
  },
];

export const publicTools: Array<{ name: string; href: string }> = [
  { name: "docs-distillation-gate", href: "https://github.com/JakemoCode/docs-distillation-gate" },
  { name: "distill-prose", href: "https://github.com/JakemoCode/distill-prose" },
  { name: "task-map", href: "https://github.com/JakemoCode/task-map" },
  { name: "frontend-tools", href: "https://github.com/JakemoCode/frontend-tools" },
];

/** Lines in the evidence doc, for the opener's count-down. Read from the
    generated minimap so a regenerated doc can't leave it stale. */
export const evidenceLineCount = minimapLengths.length;

// One evidence figure per habit. Each shows the artifact the habit produced,
// and its scroll animation plays the change that habit made. The markup is the
// finished state; Figures.module.css only adds the scroll-scrubbed "before".
// --i on a child is a small delay for siblings that share a row.
import type { CSSProperties, ReactNode } from "react";
import type { FigureKey } from "../../../content/methodology";
import styles from "./Figures.module.css";

type PlateProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

function Plate({ label, children, className }: PlateProps) {
  return (
    <figure className={`${styles.plate} ${className ?? ""}`}>
      <figcaption className={styles.label}>{label}</figcaption>
      {children}
    </figure>
  );
}

/** Stagger index for a child's scroll range. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

function Harden() {
  const passes = [
    ["Architecture only", "09-11"],
    ["Runtime only", "09-11"],
    ["Plan and DAG only", "09-11"],
    ["Cross-document audit", "09-11"],
    ["Six-month pre-mortem", "09-11"],
    ["Were accepted fixes really made?", "09-12"],
    ["Blind review, prior reviews withheld", "09-13"],
    ["Final review, then a delta on v0.2.7", "09-14"],
  ];
  return (
    <Plate label="EngOS design reviews, before any code">
      <ol className={styles.passes}>
        {passes.map(([name, date]) => (
          <li key={name} className={styles.pass}>
            <span className={styles.passTick} aria-hidden="true" />
            <span>{name}</span>
            <time className={styles.passDate} dateTime={`2026-${date}`}>
              {date}
            </time>
          </li>
        ))}
      </ol>
      <div className={styles.versions}>
        <p>
          Architecture v0.5.1 <span aria-hidden="true">&rarr;</span>
          <span className={styles.srOnly}>to</span> v0.7
        </p>
        <p>
          Runtime spec v0.1.1 <span aria-hidden="true">&rarr;</span>
          <span className={styles.srOnly}>to</span> v0.2.6
        </p>
        <p className={styles.stamp}>Frozen</p>
      </div>
    </Plate>
  );
}

function Authority() {
  const chain = ["Architecture", "Runtime spec", "Plan", "DAG (YAML)", "Mermaid"];
  return (
    <Plate label="EngOS, highest authority first">
      <ol className={styles.chain} aria-label="Order of authority, highest first">
        {chain.map((node) => (
          <li key={node} className={styles.node}>
            {node}
          </li>
        ))}
      </ol>
      <p className={styles.note}>
        The YAML graph outranks the diagram drawn from it. A contradiction stops the
        work until one side is fixed.
      </p>
    </Plate>
  );
}

function Decisions() {
  const questions = Array.from({ length: 49 }, (_, i) => i + 1);
  return (
    <Plate label="One design grill, 49 questions">
      <ol
        className={styles.questions}
        aria-label="49 numbered design questions, each answered"
      >
        {questions.map((n) => (
          <li key={n} className={styles.question} style={at((n - 1) % 7)}>
            <span>{n}</span>
          </li>
        ))}
      </ol>
      <p className={styles.reply}>
        <span className={styles.replyWho}>Me</span>
        <code>8 - a, 9 - b, 10 - c</code>
      </p>
    </Plate>
  );
}

const friction: Array<["compiled" | "in-progress" | "open", string]> = [
  ["in-progress", "F-001"],
  ["compiled", "F-002"],
  ["compiled", "F-003"],
  ["compiled", "F-004"],
  ["compiled", "F-005"],
  ["open", "F-006"],
  ["compiled", "F-007"],
  ["compiled", "F-008"],
  ["open", "F-009"],
  ["compiled", "F-010"],
  ["compiled", "F-011"],
  ["open", "F-012"],
  ["compiled", "F-013"],
  ["compiled", "F-014"],
  ["compiled", "F-015"],
];

const statusText = {
  compiled: "compiled into tooling",
  "in-progress": "in progress",
  open: "open",
} as const;

function Friction() {
  return (
    <Plate label="Friction log on my current build">
      <ol className={styles.ledger}>
        {friction.map(([status, id], i) => (
          <li key={id} className={styles.entry} data-status={status} style={at(i)}>
            <span aria-hidden="true">{id.slice(2)}</span>
            <span className={styles.srOnly}>
              {id}, {statusText[status]}
            </span>
          </li>
        ))}
      </ol>
      <p className={styles.legend} aria-hidden="true">
        <span data-status="compiled">11 compiled</span>
        <span data-status="in-progress">1 in progress</span>
        <span data-status="open">3 open</span>
      </p>
      <p className={styles.note}>
        F-004: docs kept pointing at files a reorganization had moved. The second
        time, it became a CI check that fails on any stale reference.
      </p>
    </Plate>
  );
}

function Provenance() {
  return (
    <Plate label="From my agent rules">
      <p className={styles.incident}>
        <span className={styles.incidentTag}>The miss</span>
        Four commits on one branch carried four-paragraph bodies recounting a
        debugging session. I asked what they were for.
      </p>
      <div className={styles.ruleFile}>
        <p className={styles.ruleHeading}>
          <span aria-hidden="true">## </span>Commit message length
        </p>
        <ul className={styles.ruleLines}>
          <li>One body paragraph is usually right. Three is the hard ceiling.</li>
          <li>Do not narrate the investigation.</li>
        </ul>
        <p className={styles.established}>Established 2026-08-17</p>
      </div>
      <p className={styles.note}>
        The incident stays in the rule file, so the reason outlives the conversation
        that produced it.
      </p>
    </Plate>
  );
}

function Red() {
  const runs: Array<{ state: "red" | "green"; output: string; verdict: string; counts: boolean }> = [
    {
      state: "red",
      output: "Cannot find module './budget-report'",
      verdict: "Doesn't count. Nothing was tested.",
      counts: false,
    },
    {
      state: "red",
      output: "expected 'runner-error', received 'within-budget'",
      verdict: "Counts. It fails on the behavior.",
      counts: true,
    },
    {
      state: "green",
      output: "treats an unknown exit as a runner error",
      verdict: "Passes, and goes red again with the defect put back.",
      counts: true,
    },
  ];
  const kinds = ["Unit", "Integration", "System", "Mutation guarantees"];
  return (
    <Plate label="/tdd, red before green">
      <ol className={styles.runs}>
        {runs.map((run) => (
          <li
            key={run.output}
            className={styles.run}
            data-state={run.state}
            data-counts={run.counts ? "" : undefined}
          >
            <span className={styles.runState}>{run.state}</span>
            <code className={styles.runOutput}>
              {run.counts ? run.output : <s>{run.output}</s>}
            </code>
            <span className={styles.verdict}>{run.verdict}</span>
          </li>
        ))}
      </ol>
      <ul className={styles.kinds} aria-label="Test types">
        {kinds.map((kind, i) => (
          <li key={kind} style={at(i)}>
            {kind}
          </li>
        ))}
      </ul>
    </Plate>
  );
}

function Principle() {
  const finding = [
    ["Principle", "Von Restorff effect"],
    ["Breaks", "On touch, the \"See it live\" button stayed muted. Its accent was hover-only."],
    ["Costs", "The primary action read as the least prominent thing on the tile."],
    ["Fix", "Persistent accent under @media (hover: none)."],
  ];
  return (
    <Plate label="A /ux-check finding">
      <p className={styles.taste}>
        <s>Feels a little off on mobile.</s>
      </p>
      <dl className={styles.finding}>
        {finding.map(([term, detail]) => (
          <div key={term} className={styles.findingRow}>
            <dt>{term}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>
    </Plate>
  );
}

function Distill() {
  const docs: Array<[string, number, string]> = [
    ["_profile.md", 37.3, "59 to 22"],
    ["SOURCE-OF-TRUTH.md", 42.3, "78 to 33"],
    ["_custom.md", 44.9, "89 to 40"],
    ["EngOS AGENTS.md", 46.1, "128 to 59"],
    ["CONTEXT.md", 47.6, "84 to 40"],
  ];
  return (
    <Plate label="distillation stamps on disk">
      <ul className={styles.bars}>
        {docs.map(([name, pct, words]) => (
          <li key={name} className={styles.bar} style={{ "--pct": pct / 100 } as CSSProperties}>
            <span className={styles.barName}>{name}</span>
            <span className={styles.barTrack} aria-hidden="true">
              <span className={styles.barFill} />
            </span>
            <span className={styles.barValue}>
              {pct}%<span className={styles.srOnly}> of its starting prose</span>
            </span>
            <span className={styles.barWords}>{words} words</span>
          </li>
        ))}
      </ul>
      <p className={styles.note}>
        Counts are prose words. Code, markdown syntax and tables of numbers are
        free.
      </p>
    </Plate>
  );
}

function Split() {
  const parts = ["17.1", "17.2", "17.3", "17.4"];
  return (
    <Plate label="One work package, split at planning time">
      <div className={styles.split}>
        <p className={styles.whole} aria-hidden="true">
          WP-17 as one PR
        </p>
        <ol className={styles.parts} aria-label="WP-17 split into four PRs">
          {parts.map((part, i) => (
            <li key={part} className={styles.part} style={at(i)}>
              <code>/wp {part}</code>
            </li>
          ))}
        </ol>
      </div>
      <p className={styles.note}>
        Each unit branches from a fresh <code>main</code> in a cleared session, and
        independent ones run in parallel.
      </p>
    </Plate>
  );
}

function Budget() {
  const rows: Array<[string, string, string, number]> = [
    ["locate", "Haiku 4.5", "low", 1],
    ["prescreen", "Haiku 4.5", "low", 1],
    ["browser-check", "Haiku 4.5", "low", 1],
    ["research", "Sonnet 5", "xhigh", 4],
    ["investigate", "Opus 5.5", "high", 3],
    ["investigate-deep", "Opus 5.5", "max", 5],
  ];
  return (
    <Plate label="subagent-model-selection.md">
      <table className={styles.matrix}>
        <caption className={styles.srOnly}>Model and effort for each subagent</caption>
        <thead>
          <tr>
            <th scope="col">Agent</th>
            <th scope="col">Model</th>
            <th scope="col">Effort</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([agent, model, effort, level]) => (
            <tr key={agent}>
              <th scope="row">
                <code>{agent}</code>
              </th>
              <td>{model}</td>
              <td>
                <span className={styles.meter} aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <span
                      key={step}
                      className={styles.meterStep}
                      style={at(step - 1)}
                      data-on={step <= level ? "" : undefined}
                    />
                  ))}
                </span>
                {effort}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Plate>
  );
}

function Redline() {
  return (
    <Plate label="corrections from real drafts">
      <ul className={styles.draft}>
        <li>
          Built <del>the</del> <ins>a layer on top of an existing</ins> job-search
          system
        </li>
        <li>
          <del>Co-led Job Form</del>
          <span className={styles.margin}>manufactured</span>
        </li>
        <li>
          <del>Expertise</del> <ins>Experience</ins> with Prism<del>a</del>
          <ins>ic</ins>
        </li>
        <li>
          Cut to 50 <del>per cent</del>
          <ins>%</ins>
        </li>
      </ul>
    </Plate>
  );
}

function Page() {
  const steps = ["Rewrite in Simplified Technical English", "Cut filler", "Reshape into tables", "Cut again"];
  return (
    <Plate label="A brief for a collaborator, as markdown and as a page">
      <div className={styles.page}>
        <pre className={styles.markdown} aria-hidden="true">
          {`## How distillation works

1. Rewrite in Simplified Technical English
2. Cut filler
3. Reshape into tables
4. Cut again

Passes at half its prose, or once
the cuts stop coming.`}
        </pre>
        <div className={styles.rendered}>
          <p className={styles.renderedTitle}>How distillation works</p>
          <ol className={styles.renderedSteps}>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className={styles.renderedNote}>
            Passes at half its prose, or once the cuts stop coming.
          </p>
        </div>
      </div>
    </Plate>
  );
}

function Why() {
  const questions = [
    "Why do they require worktrees if there's no overlap?",
    "Why is a full replay needed vs a targeted replay?",
    "How do we keep this mutations file from just growing and growing?",
    "uhh so, why is EngOS already 600 MB?",
    "How do you arrive at the conclusion of \"favorite?\"",
  ];
  return (
    <Plate label="questions I typed, verbatim">
      <ul className={styles.asks}>
        {questions.map((q) => (
          <li key={q} className={styles.ask}>
            {q}
          </li>
        ))}
      </ul>
      <p className={styles.uninstalled}>
        Uninstalled: <del>feature-dev</del> <del>code-simplifier</del>{" "}
        <del>seo-*</del>
      </p>
    </Plate>
  );
}

function Funnel() {
  const stages: Array<[string, number]> = [
    ["Scan open roles", 24],
    ["Pass the initial filters", 12],
    ["Score against the full JD", 6],
    ["Score the company, if the role clears 3.0", 3],
    ["My read", 1],
  ];
  return (
    <Plate label="career-context pipeline">
      <ol className={styles.stages}>
        {stages.map(([stage, dots]) => (
          <li key={stage} className={styles.stage}>
            <span className={styles.stageName}>{stage}</span>
            <span className={styles.dots} aria-hidden="true">
              {Array.from({ length: dots }, (_, d) => (
                <span key={d} className={styles.dot} />
              ))}
            </span>
          </li>
        ))}
      </ol>
      <p className={styles.note}>Dot counts are illustrative, not real volumes.</p>
    </Plate>
  );
}

function Extract() {
  const repos = [
    ["task-map", "https://github.com/JakemoCode/task-map"],
    ["docs-distillation-gate", "https://github.com/JakemoCode/docs-distillation-gate"],
    ["frontend-tools", "https://github.com/JakemoCode/frontend-tools"],
    ["distill-prose", "https://github.com/JakemoCode/distill-prose"],
  ];
  const steps: Array<[string, string]> = [
    ["17:31", "Screenshot of a friend's dashboard: can we build one?"],
    ["20:19", "First PR merged"],
    ["Same day", "Tracker-agnostic: GitHub, Linear, Jira, spreadsheets"],
    ["Next day", "Live refresh server"],
  ];
  return (
    <Plate label="task-map, 2026-09-22" className={styles.extractPlate}>
      <p className={styles.clock} aria-hidden="true">
        <span className={styles.clockTime} />
      </p>
      <ol className={styles.timeline}>
        {steps.map(([when, what]) => (
          <li key={when} className={styles.tick}>
            <span className={styles.tickWhen}>{when}</span>
            <span>{what}</span>
          </li>
        ))}
      </ol>
      <ul className={styles.repos} aria-label="Public repos">
        {repos.map(([name, href]) => (
          <li key={name}>
            <a href={href} target="_blank" rel="noreferrer">
              {name}
              <span className={styles.srOnly}> on GitHub (opens in a new tab)</span>
              <span aria-hidden="true"> &#8599;</span>
            </a>
          </li>
        ))}
      </ul>
    </Plate>
  );
}

const figures: Record<FigureKey, () => ReactNode> = {
  harden: Harden,
  authority: Authority,
  decisions: Decisions,
  friction: Friction,
  provenance: Provenance,
  red: Red,
  principle: Principle,
  distill: Distill,
  split: Split,
  budget: Budget,
  redline: Redline,
  page: Page,
  why: Why,
  funnel: Funnel,
  extract: Extract,
};

export function EvidenceFigure({ figure }: { figure: FigureKey }) {
  const Figure = figures[figure];
  return <Figure />;
}

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
};

function Plate({ label, children }: PlateProps) {
  return (
    <figure className={styles.plate}>
      <figcaption className={styles.label}>{label}</figcaption>
      {children}
    </figure>
  );
}

/** Stagger index for a child's scroll range. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

function Harden() {
  const lenses = [
    "Blind review, earlier reviews withheld",
    "Adversarial review: rival proposals and an arbiter",
    "One document at a time",
    "Were the accepted fixes really made?",
    "Research before committing to an answer",
  ];
  return (
    <Plate label="Review lenses, before and during a build">
      <ul className={styles.passes}>
        {lenses.map((lens, i) => (
          <li key={lens} className={styles.pass} style={at(i)}>
            <span className={styles.passTick} aria-hidden="true" />
            <span>{lens}</span>
          </li>
        ))}
      </ul>
      <p className={styles.stamp}>Frozen</p>
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
        {finding.map(([term, detail], i) => (
          <div key={term} className={styles.findingRow} style={at(i)}>
            <dt>{term}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>
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
        {runs.map((run, i) => (
          <li
            key={run.output}
            className={styles.run}
            style={at(i)}
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
              <code>
                <span className={styles.partCommand}>/wp </span>
                {part}
              </code>
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

function Gate() {
  return (
    <Plate label="One ask, one guardrail">
      <p className={styles.incident}>
        <span className={styles.incidentTag}>The ask</span>
        <span className={styles.incidentText}>
          "can you put a hard enforced gate that you must pull main before starting any
          new work?"
        </span>
      </p>
      <div className={styles.ruleFile}>
        <p className={styles.ruleHeading}>The guardrail, a hook</p>
        <ul className={styles.ruleLines}>
          <li style={at(0)}>Before any branch or worktree is created, it fast-forwards main.</li>
          <li style={at(1)}>If main can't fast-forward, it blocks the action.</li>
        </ul>
      </div>
      <p className={styles.note}>Nobody has to remember it. It runs before every new piece of work.</p>
    </Plate>
  );
}

function Gauntlet() {
  const checks: Array<[string, boolean]> = [
    ["Two independent design proposals", true],
    ["An adversarial breaker", true],
    ["An arbiter", true],
    ["Code review, two rounds", true],
    ["Six acceptance checks", true],
    ["Outside AI reviewer: a serious bug in about a minute", false],
    ["Its fix: a second serious bug, minutes later", false],
  ];
  return (
    <Plate label="One change, every check">
      <ol className={styles.checks}>
        {checks.map(([name, passed], i) => (
          <li
            key={name}
            className={styles.check}
            data-passed={passed ? "" : undefined}
            style={at(i)}
          >
            <span className={styles.checkMark} aria-hidden="true">
              {passed ? "\u2713" : "\u2715"}
            </span>
            <span>
              {name}
              <span className={styles.srOnly}>{passed ? ", passed" : ", missed by every check above"}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className={styles.lesson}>
        A fix that satisfies a finding is the most likely place for the next bug.
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
    <Plate label="Model and effort, by task">
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
          {rows.map(([agent, model, effort, level], row) => (
            <tr key={agent} style={{ "--row": row } as CSSProperties}>
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

const figures: Record<FigureKey, () => ReactNode> = {
  harden: Harden,
  principle: Principle,
  red: Red,
  split: Split,
  gate: Gate,
  gauntlet: Gauntlet,
  budget: Budget,
};

export function EvidenceFigure({ figure }: { figure: FigureKey }) {
  const Figure = figures[figure];
  return <Figure />;
}

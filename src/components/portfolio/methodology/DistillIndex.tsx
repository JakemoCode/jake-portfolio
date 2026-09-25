// The section opener: the evidence doc drawn as a minimap, distilled on scroll
// into the index of the habits. Markup is the finished index; the
// pinned, scroll-scrubbed distillation lives entirely in the stylesheet.
import type { CSSProperties } from "react";
import {
  evidenceLineCount,
  methodologyHabits,
  methodologyIntro,
} from "../../../content/methodology";
import {
  minimapLengths,
  minimapHeadingLines,
  minimapStarts,
} from "../../../content/methodologyMinimap";
import styles from "./DistillIndex.module.css";

/** The doc wraps near 78 columns; the few long table rows are clipped to it. */
const COLUMNS = 80;
/** The doc is drawn as a four-column spread so individual lines stay visible. */
const SPREAD = 4;
const LINES_PER_COLUMN = Math.ceil(evidenceLineCount / SPREAD);
/** Spread geometry in viewBox units: 100 wide, a 4-unit gutter between columns. */
const GUTTER = 4;
const COLUMN_WIDTH = (100 - GUTTER * (SPREAD - 1)) / SPREAD;
/** Final width of an index mark, as a share of the sheet. Keep in sync with --mark-width. */
const MARK_SHARE = 0.06;

function place(line: number) {
  const column = Math.floor(line / LINES_PER_COLUMN);
  return {
    x: column * (COLUMN_WIDTH + GUTTER),
    y: (line % LINES_PER_COLUMN) + 0.5,
  };
}

const charWidth = COLUMN_WIDTH / COLUMNS;

const minimapPath = minimapLengths
  .map((length, line) => {
    if (length === 0) return "";
    const start = Math.min(minimapStarts[line] ?? 0, COLUMNS);
    const run = Math.min(length, COLUMNS - start);
    const { x, y } = place(line);
    return `M${(x + start * charWidth).toFixed(2)} ${y}h${(run * charWidth).toFixed(2)}`;
  })
  .join("");

const habitCount = methodologyHabits.length;

const rows = methodologyHabits.map((habit, row) => {
  const docLine = minimapHeadingLines[habit.docHeading] ?? 0;
  const docLength = Math.min(minimapLengths[docLine] ?? 0, COLUMNS);
  const { x, y } = place(docLine);
  return {
    habit,
    style: {
      "--y1": (row + 0.5) / habitCount,
      "--x0": x / 100,
      "--y0": y / LINES_PER_COLUMN,
      "--sx0": (docLength * charWidth) / 100 / MARK_SHARE,
    } as CSSProperties,
  };
});

export function DistillIndex() {
  return (
    <div className={styles.distill}>
      <span id="habit-index" className={styles.indexAnchor} />
      <div className={styles.stage}>
        <div className={styles.intro}>
          <h2 id="how-i-work-heading" className={styles.heading}>
            How I work with AI
          </h2>
          <p className={styles.lede}>
            Seven habits, and the rules I've built around them.
          </p>
          <p className={styles.framing}>{methodologyIntro}</p>
          <p className={styles.count} aria-hidden="true">
            <span
              className={styles.countNum}
              style={{ "--lines": habitCount, "--lines-from": evidenceLineCount } as CSSProperties}
            />
            <span className={styles.countUnits}>
              <span className={styles.unitLines}>lines of evidence</span>
              <span className={styles.unitHabits}>habits</span>
            </span>
          </p>
          <p className={styles.note}>
            The evidence behind these habits came from auditing my Claude Code session history
            and pulling out the themes and principles that kept showing up.
          </p>
        </div>

        <nav className={styles.sheet} aria-label="The seven habits">
          <svg
            className={styles.minimap}
            viewBox={`0 0 100 ${LINES_PER_COLUMN}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d={minimapPath} />
          </svg>
          <ol className={styles.index}>
            {rows.map(({ habit, style }) => (
              <li key={habit.slug} className={styles.habit} style={style}>
                <a href={`#${habit.slug}`} className={styles.link}>
                  <span className={styles.mark} aria-hidden="true" />
                  <span className={styles.title}>{habit.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

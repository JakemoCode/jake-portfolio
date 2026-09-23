// The section opener: the evidence doc drawn as a minimap, distilled on scroll
// into the index of the fifteen habits. Markup is the finished index; the
// pinned, scroll-scrubbed distillation lives entirely in the stylesheet.
import type { CSSProperties } from "react";
import { evidenceLineCount, methodologyActs } from "../../../content/methodology";
import {
  minimapLengths,
  minimapStarts,
  minimapThemeLines,
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

// Rows in the finished index: one per act label, one per habit.
const rowCount = methodologyActs.reduce((rows, act) => rows + 1 + act.themes.length, 0);

const groups = (() => {
  let row = 0;
  return methodologyActs.map((act) => {
    const actRow = row++;
    return {
      act,
      style: { "--y1": (actRow + 0.5) / rowCount } as CSSProperties,
      habits: act.themes.map((theme) => {
        const habitRow = row++;
        const docLine = minimapThemeLines[theme.docNumber] ?? 0;
        const docLength = Math.min(minimapLengths[docLine] ?? 0, COLUMNS);
        const { x, y } = place(docLine);
        return {
          theme,
          style: {
            "--y1": (habitRow + 0.5) / rowCount,
            "--x0": x / 100,
            "--y0": y / LINES_PER_COLUMN,
            "--sx0": (docLength * charWidth) / 100 / MARK_SHARE,
          } as CSSProperties,
        };
      }),
    };
  });
})();

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
            Fifteen habits, pulled from a month of my own Claude Code sessions.
          </p>
          <p className={styles.count} aria-hidden="true">
            <span className={styles.countNum} />
            <span className={styles.countUnits}>
              <span className={styles.unitLines}>lines of evidence</span>
              <span className={styles.unitHabits}>habits</span>
            </span>
          </p>
          <p className={styles.note}>
            The evidence file behind this section ran {evidenceLineCount.toLocaleString("en-US")}{" "}
            lines, with a source for every claim. This is what survived distilling it.
          </p>
        </div>

        <nav className={styles.sheet} aria-label="The fifteen habits">
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
            {groups.map(({ act, style, habits }) => (
              <li key={act.slug}>
                <span className={styles.act} style={style}>
                  {act.title}
                </span>
                <ol className={styles.habits}>
                  {habits.map(({ theme, style: habitStyle }) => (
                    <li key={theme.slug} className={styles.habit} style={habitStyle}>
                      <a href={`#${theme.slug}`} className={styles.link}>
                        <span className={styles.mark} aria-hidden="true" />
                        <span className={styles.title}>{theme.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

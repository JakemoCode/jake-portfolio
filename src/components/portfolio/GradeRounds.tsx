// The pr-grade card's visual: the four grades pr-grade's own 0.16.0 release
// took to reach 5/5, from the grade notes on its PR. The rounds hang on one
// line because each fix was graded again, and twice the fix carried the next
// finding.
import type { CSSProperties } from "react";
import styles from "./GradeRounds.module.css";

const rounds: Array<[number, string]> = [
  [3, "Five problems, among them test processes left running after a timeout."],
  [4, "The fix missed a path. A crash still left the test command running."],
  [4, "Same leak again, this time on SIGTERM."],
  [5, "Clean. Three minor notes left for later."],
];

export function GradeRounds() {
  return (
    <figure className={styles.rounds}>
      <figcaption className={styles.caption}>pr-grade grading its own release</figcaption>
      <ol className={styles.list}>
        {rounds.map(([score, note], i) => (
          <li
            key={i}
            className={styles.round}
            data-pass={score === 5 || undefined}
            style={{ "--i": i } as CSSProperties}
          >
            <span className={styles.score}>
              {score}
              <span className={styles.outOf}>/5</span>
            </span>
            <span className={styles.rail} aria-hidden="true" />
            <span className={styles.text}>
              <span className={styles.label}>Round {i + 1}</span>
              <span className={styles.note}>{note}</span>
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

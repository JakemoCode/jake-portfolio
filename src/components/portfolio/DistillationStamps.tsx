// The docs-distillation-gate card's visual: five real documents the gate has
// stamped, each cut toward the halfway mark it asks for. The markup is the
// finished state; the stylesheet scrubs each bar down from whole on scroll.
import type { CSSProperties } from "react";
import styles from "./DistillationStamps.module.css";

const stamps: Array<[string, number, string]> = [
  ["_profile.md", 37.3, "59 to 22"],
  ["SOURCE-OF-TRUTH.md", 42.3, "78 to 33"],
  ["_custom.md", 44.9, "89 to 40"],
  ["AGENTS.md", 46.1, "128 to 59"],
  ["CONTEXT.md", 47.6, "84 to 40"],
];

export function DistillationStamps() {
  return (
    <figure className={styles.stamps}>
      <figcaption className={styles.caption}>Five documents the gate has stamped</figcaption>
      <ul className={styles.bars}>
        {stamps.map(([name, pct, words], i) => (
          <li key={name} className={styles.bar} style={{ "--pct": pct / 100, "--i": i } as CSSProperties}>
            <span className={styles.name}>{name}</span>
            <span className={styles.value}>
              {pct}%<span className={styles.srOnly}> of its starting prose</span>
            </span>
            <span className={styles.track} aria-hidden="true">
              <span className={styles.fill} />
            </span>
            <span className={styles.words}>{words} prose words</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

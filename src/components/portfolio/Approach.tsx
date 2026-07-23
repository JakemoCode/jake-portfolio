import styles from "./Approach.module.css";

export function Approach() {
  return (
    <section className={styles.section} aria-labelledby="approach-heading">
      <h2 id="approach-heading" className={styles.heading}>
        How I build
      </h2>
      <p className={styles.lead}>
        I lean on agentic coding tools daily and build my own layer on top of them.
      </p>
      <p className={styles.body}>
        <span className={styles.artifact}>Custom skills</span>, a{" "}
        <span className={styles.artifact}>workspace rules architecture</span>, and{" "}
        <span className={styles.artifact}>subagent orchestration</span> that runs real
        workflows, with <span className={styles.artifact}>WCAG</span>,{" "}
        <span className={styles.artifact}>a11y</span>, and{" "}
        <span className={styles.artifact}>responsive development</span> as first-class
        concerns. Frontend craft plus the tooling to move fast without dropping quality.
      </p>
    </section>
  );
}

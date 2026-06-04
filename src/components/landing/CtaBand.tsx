import styles from "./CtaBand.module.css";

export function CtaBand() {
  return (
    <section className={styles.band} aria-labelledby="cta-band-line">
      <div className={`${styles.inner} r-up`}>
        <p id="cta-band-line" className={styles.line}>
          Like what you see? Let&rsquo;s build yours.
        </p>
        <a className={styles.button} href="#contact">
          Start a project
        </a>
      </div>
    </section>
  );
}

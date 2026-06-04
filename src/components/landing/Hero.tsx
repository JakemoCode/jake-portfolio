import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.inner}>
        <p className={`${styles.avail} ${styles.reveal} ${styles.d0}`}>
          <span className={styles.dot} aria-hidden="true" />
          Available for new projects
        </p>

        <h1 id="hero-heading" className={`${styles.heading} ${styles.reveal} ${styles.d1}`}>
          <span>You bring the idea.</span>
          <span className={styles.em}>I bring the craft.</span>
        </h1>

        <p className={`${styles.sub} ${styles.reveal} ${styles.d2}`}>
          I build and fix websites for small businesses and people with something
          to share. Modern, fast, and yours to keep.
        </p>

        <div className={`${styles.actions} ${styles.reveal} ${styles.d3}`}>
          <a className={styles.primary} href="#contact">
            Start a project
          </a>
          <a className={styles.ghost} href="#work">
            See recent work
          </a>
        </div>
      </div>
    </section>
  );
}

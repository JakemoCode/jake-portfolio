import styles from "./FoundingNote.module.css";

export function FoundingNote() {
  return (
    <aside className={styles.wrap} aria-label="Founding client offer">
      <p className={`${styles.note} r-up`}>
        <span className={styles.msg}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.text}>
            I&rsquo;m booking <strong>a few founding clients</strong> at a
            reduced rate while I build my portfolio.
          </span>
        </span>
        <a className={styles.link} href="#contact">
          Get in touch
        </a>
      </p>
    </aside>
  );
}

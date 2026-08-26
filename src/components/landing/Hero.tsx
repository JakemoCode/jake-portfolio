import { useState } from "react";
import { DeclinedNotice } from "./DeclinedNotice";
import { EvasiveCta } from "./EvasiveCta";
import { BOUNDS_ATTRIBUTE } from "./useEvasiveCta";
import styles from "./Hero.module.css";

export function Hero() {
  const [declined, setDeclined] = useState(false);

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.inner} {...{ [BOUNDS_ATTRIBUTE]: "" }}>
        <h1 id="hero-heading" className={styles.heading}>
          <span className={`${styles.reveal} ${styles.line1}`}>You bring the idea.</span>
          <span className={`${styles.em} ${styles.line2}`}>I bring the craft.</span>
        </h1>

        <p className={`${styles.sub} ${styles.reveal} ${styles.d2}`}>
          I build and fix websites for small businesses and people with something
          to share. Modern, fast, and yours to keep.
        </p>

        <div className={`${styles.actions} ${styles.reveal} ${styles.d3}`}>
          <EvasiveCta
            className={styles.primary}
            evadingClassName={styles.evading}
            onCaught={() => setDeclined(true)}
          >
            Punt a project
          </EvasiveCta>
          <a className={styles.ghost} href="#work">
            See recent work
          </a>
        </div>

        <DeclinedNotice shown={declined} />
      </div>
    </section>
  );
}

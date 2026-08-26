import { useState } from "react";
import { DeclinedNotice } from "./DeclinedNotice";
import { EvasiveCta } from "./EvasiveCta";
import { BOUNDS_ATTRIBUTE } from "./useEvasiveCta";
import styles from "./CtaBand.module.css";

export function CtaBand() {
  const [declined, setDeclined] = useState(false);

  return (
    <section className={styles.band} aria-labelledby="cta-band-line">
      <div className={`${styles.inner} r-up`} {...{ [BOUNDS_ATTRIBUTE]: "" }}>
        <p id="cta-band-line" className={styles.line}>
          Like what you see? Let&rsquo;s build yours.
        </p>
        <EvasiveCta
          className={styles.button}
          evadingClassName={styles.evading}
          onCaught={() => setDeclined(true)}
        >
          Punt a project
        </EvasiveCta>
        <DeclinedNotice shown={declined} />
      </div>
    </section>
  );
}

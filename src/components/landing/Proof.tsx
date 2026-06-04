import { testimonials } from "../../content/testimonials";
import styles from "./Proof.module.css";

export function Proof() {
  return (
    <section className={styles.proof} aria-labelledby="proof-title">
      <div className={styles.inner}>
        <h2 id="proof-title" className={`${styles.title} r-rise`}>
          What people say.
        </h2>

        <div className={styles.quotes}>
          {testimonials.map((t) => (
            <figure className={`${styles.quote} r-up`} key={t.id}>
              <blockquote className={styles.text}>{t.quote}</blockquote>
              <figcaption className={styles.cite}>
                <span className={styles.name}>{t.name}</span>
                <span className={styles.role}>{t.role}</span>
                {t.link && (
                  <a
                    className={styles.link}
                    href={t.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    See it live
                    <span aria-hidden="true"> &rarr;</span>
                  </a>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

import styles from "./ExperienceStrip.module.css";
import { experience } from "../../content/experience";
import { useScrollTick } from "./scrollTick/useScrollTick";

/* A timeline whose tick runs down the line as the reader scrolls past each
   stint, the same tick the section rail uses */
export function ExperienceStrip() {
  const { trackRef, tickRef, markerRef, tickClassName } = useScrollTick({ hold: 0.35 });

  return (
    <section className={styles.section} aria-labelledby="experience-heading">
      <h2 id="experience-heading" className={styles.heading}>
        Experience
      </h2>
      <div ref={trackRef} className={styles.track}>
        <ol className={styles.list}>
          {experience.map((stint, i) => (
            // The heading comes first so each stint's dates belong to it when
            // read as text; the CSS moves the dates back beside or above it
            <li key={stint.title} className={styles.stint}>
              <h3 ref={markerRef(i)} className={styles.title}>
                {stint.title}
              </h3>
              <p className={styles.period}>{stint.period}</p>
              {stint.role && <p className={styles.role}>{stint.role}</p>}
              {stint.details && (
                <ul className={styles.details}>
                  {stint.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
        <span ref={tickRef} className={`${tickClassName} ${styles.tick}`} aria-hidden="true" />
      </div>
    </section>
  );
}

import { methodologyActs } from "../../../content/methodology";
import { DistillIndex } from "./DistillIndex";
import { EvidenceFigure } from "./Figures";
import styles from "./Methodology.module.css";

const quoteDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function Methodology() {
  return (
    <section className={styles.section} aria-labelledby="how-i-work-heading">
      <DistillIndex />

      {methodologyActs.map((act) => (
        <section key={act.slug} className={styles.act} aria-labelledby={`act-${act.slug}`}>
          <header className={styles.actHeader}>
            <h3 id={`act-${act.slug}`} className={styles.actTitle}>
              {act.title}
            </h3>
            <p className={styles.actLine}>{act.line}</p>
          </header>

          {act.themes.map((theme) => (
            <article
              key={theme.slug}
              id={theme.slug}
              className={styles.theme}
              aria-labelledby={`${theme.slug}-title`}
            >
              <div className={styles.copy}>
                <h4 id={`${theme.slug}-title`} className={styles.title}>
                  {theme.title}
                </h4>
                <p className={styles.body}>{theme.body}</p>
                <figure className={styles.quote}>
                  <blockquote>
                    <p>{theme.quote.text}</p>
                  </blockquote>
                  <figcaption className={styles.source}>
                    To Claude Code,{" "}
                    <time dateTime={theme.quote.date}>
                      {quoteDate.format(new Date(theme.quote.date))}
                    </time>
                  </figcaption>
                </figure>
              </div>
              <EvidenceFigure figure={theme.figure} />
            </article>
          ))}

          <p className={styles.backLink}>
            <a href="#habit-index">Back to the fifteen habits</a>
          </p>
        </section>
      ))}
    </section>
  );
}

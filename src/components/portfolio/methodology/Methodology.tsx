import { methodologyHabits, publicTools } from "../../../content/methodology";
import { DistillIndex } from "./DistillIndex";
import { EvidenceFigure } from "./Figures";
import styles from "./Methodology.module.css";

export function Methodology() {
  return (
    <section className={styles.section} aria-labelledby="how-i-work-heading">
      <DistillIndex />

      <div className={styles.habits}>
        {methodologyHabits.map((habit) => (
          <article
            key={habit.slug}
            id={habit.slug}
            className={styles.habit}
            aria-labelledby={`${habit.slug}-title`}
          >
            <div className={styles.copy}>
              <h3 id={`${habit.slug}-title`} className={styles.title}>
                {habit.title}
              </h3>
              <p className={styles.body}>{habit.body}</p>
              {habit.quote && (
                <blockquote className={styles.quote}>
                  <p>{habit.quote}</p>
                </blockquote>
              )}
            </div>
            <EvidenceFigure figure={habit.figure} />
          </article>
        ))}
      </div>

      <footer className={styles.closing}>
        <p className={styles.closingLine}>Some of this tooling is public:</p>
        <ul className={styles.tools}>
          {publicTools.map((tool) => (
            <li key={tool.name}>
              <a href={tool.href} target="_blank" rel="noreferrer">
                {tool.name}
                <span className={styles.srOnly}> on GitHub (opens in a new tab)</span>
                <span aria-hidden="true"> &#8599;</span>
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.backLink}>
          <a href="#habit-index">Back to the seven habits</a>
        </p>
      </footer>
    </section>
  );
}

/* Sits high on the portfolio page so the deepest piece of work is the first
   thing a visitor can click into, rather than the last thing they scroll to. */
import { Link } from "react-router-dom";
import styles from "./CaseStudyTeaser.module.css";
import type { CaseStudy } from "../../content/caseStudies";

type Props = { study: CaseStudy };

export function CaseStudyTeaser({ study }: Props) {
  return (
    <section className={styles.wrap} aria-labelledby="case-study-teaser-title">
      <Link to={`/case-study/${study.slug}`} className={styles.card}>
        <h2 id="case-study-teaser-title" className={styles.title}>
          {study.title}
        </h2>
        <p className={styles.summary}>{study.summary}</p>
        <span className={styles.cta}>
          Read it, and spin the wheel <span aria-hidden="true">&#8594;</span>
        </span>
      </Link>
    </section>
  );
}

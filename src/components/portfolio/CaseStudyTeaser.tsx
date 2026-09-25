import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import wheelDisc from "../../assets/case-studies/nakshatra/wheel-disc.webp";
import styles from "./CaseStudyTeaser.module.css";
import type { CaseStudy } from "../../content/caseStudies";

type Props = { study: CaseStudy };

/** Keeps a hyphenated word like "ninety-one" from breaking at its hyphen */
const keepHyphenated = (text: string) =>
  text.split(" ").map((word, i) => (
    <span key={i}>
      {i > 0 && " "}
      {word.includes("-") ? <span className={styles.nowrap}>{word}</span> : word}
    </span>
  ));

/* The claim is that images made weeks apart agree, so the teaser shows them
   side by side: one piece from each deck, dealt over the wheel they live on. */
export function CaseStudyTeaser({ study }: Props) {
  const pieces = study.sections.flatMap((section) => section.gallery ?? []).filter((item) => item.src).slice(0, 3);

  return (
    <section className={styles.feature} aria-labelledby="case-study-teaser-title">
      <div className={styles.copy}>
        <p className={styles.kind}>
          Case study <span aria-hidden="true">&middot;</span> {study.client}, {study.year}
        </p>
        <h2 id="case-study-teaser-title" className={styles.title}>
          {keepHyphenated(study.title)}
        </h2>
        <p className={styles.summary}>{study.summary}</p>
        <Link to={`/case-study/${study.slug}`} className={styles.cta}>
          Read the case study <span aria-hidden="true">&#8594;</span>
        </Link>
      </div>

      <figure className={styles.art}>
        <div className={styles.table}>
          <img src={wheelDisc} alt="" className={styles.wheel} width={1024} height={1024} loading="lazy" />
          {pieces.map((piece, i) => (
            <img
              key={piece.label}
              src={piece.src}
              alt={piece.alt}
              className={styles.piece}
              style={{ "--i": i - 1 } as CSSProperties}
              loading="lazy"
            />
          ))}
        </div>
        {/* Each count sits under the card from its deck */}
        <figcaption>
          <ul className={styles.counts}>
            {pieces.map((piece) => (
              <li key={piece.label}>
                <strong>{piece.note.match(/\d+/)?.[0]}</strong> {keepHyphenated(piece.label.toLowerCase())}
              </li>
            ))}
          </ul>
        </figcaption>
      </figure>
    </section>
  );
}

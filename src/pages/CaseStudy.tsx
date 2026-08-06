import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import styles from "./CaseStudy.module.css";
import { getCaseStudy } from "../content/caseStudies";
import { NakshatraWheel } from "../components/case-study/NakshatraWheel";
import { ThemeToggle } from "../components/portfolio/ThemeToggle";
import { ContactLinks } from "../components/portfolio/ContactLinks";

export function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? getCaseStudy(slug) : undefined;

  useEffect(() => {
    if (!study) return;
    const previous = document.title;
    document.title = `${study.title} — Jake Mosher`;
    return () => {
      document.title = previous;
    };
  }, [study]);

  if (!study) return <Navigate to="/portfolio" replace />;

  return (
    <div className={styles.page}>
      <header>
        <Link to="/portfolio" className={styles.back}>
          <span aria-hidden="true">&#8592;</span> Portfolio
        </Link>
        <ThemeToggle />
      </header>

      <main className={styles.main}>
        <article>
          <div className={styles.masthead}>
            <p className={styles.eyebrow}>
              {study.client} <span aria-hidden="true">/</span> {study.year}
            </p>
            <h1 className={styles.title}>{study.title}</h1>
            <p className={styles.lede}>{study.lede}</p>
            <dl className={styles.meta}>
              <div>
                <dt>Role</dt>
                <dd>{study.role}</dd>
              </div>
              <div>
                <dt>Built with</dt>
                <dd>{study.stack.join(", ")}</dd>
              </div>
              {study.liveUrl && (
                <div>
                  <dt>Live</dt>
                  <dd>
                    <a href={study.liveUrl} target="_blank" rel="noreferrer">
                      {study.liveUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {study.sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2 className={styles.heading}>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className={styles.para}>
                  {paragraph}
                </p>
              ))}

              {section.pullQuote && (
                <blockquote className={styles.pull}>{section.pullQuote}</blockquote>
              )}

              {section.gallery && (
                <figure className={styles.gallery}>
                  <ul className={styles.galleryGrid}>
                    {section.gallery.map((item) => (
                      <li key={item.label} className={styles.galleryItem}>
                        <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
                        <p className={styles.galleryLabel}>{item.label}</p>
                        <p className={styles.galleryNote}>{item.note}</p>
                      </li>
                    ))}
                  </ul>
                  <figcaption>
                    One piece from each family. Different subjects, different
                    rules, same hand.
                  </figcaption>
                </figure>
              )}

              {section.demo === "nakshatra-wheel" && (
                <div className={styles.demo}>
                  <NakshatraWheel />
                </div>
              )}

              {section.code && (
                <figure className={styles.codeFigure}>
                  <pre className={styles.code}>
                    <code>{section.code.source}</code>
                  </pre>
                  <figcaption>{section.code.caption}</figcaption>
                </figure>
              )}
            </section>
          ))}
        </article>

        <ContactLinks
          github="https://github.com/JakemoCode"
          linkedin="https://www.linkedin.com/in/the-real-jake-mosher/"
          email="jake@jakemosher.dev"
        />
      </main>
    </div>
  );
}

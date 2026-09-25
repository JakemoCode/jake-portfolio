import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import styles from "./CaseStudy.module.css";
import { getCaseStudy } from "../content/caseStudies";
import { NakshatraWheel } from "../components/case-study/NakshatraWheel";
import { JuteMount } from "../components/case-study/JuteMount";
import { ContactLinks } from "../components/portfolio/ContactLinks";

export const sectionId = (heading: string, index: number) => {
  const slugified = heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  // A heading with no ASCII alphanumerics slugifies to "", which would give
  // every such section the same empty id.
  return slugified || `section-${index + 1}`;
};

export function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? getCaseStudy(slug) : undefined;

  useEffect(() => {
    if (!study) return;
    const previous = document.title;
    document.title = `${study.title} · Jake Mosher`;
    return () => {
      document.title = previous;
    };
  }, [study]);

  if (!study) return <Navigate to="/" replace />;

  return (
    <div className={styles.page}>
      <div className={styles.progress} aria-hidden="true" />

      <header>
        <Link to="/" className={styles.back}>
          <span aria-hidden="true">&#8592;</span> Back to portfolio
        </Link>
      </header>

      <main className={styles.main}>
        <article>
          <div className={styles.masthead}>
            <div className={styles.mastheadText}>
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
                      <span aria-hidden="true"> &#8599;</span>
                      <span className={styles.srOnly}> (opens in a new tab)</span>
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            <nav className={styles.contents} aria-label="Contents">
              {study.sections.map((section, i) => (
                <a
                  key={section.heading}
                  href={`#${sectionId(section.heading, i)}`}
                  className={section.demo ? styles.contentsDemo : undefined}
                >
                  {section.demo ? "Spin the wheel" : section.heading}
                </a>
              ))}
            </nav>
            </div>
            {study.masthead && (
              <JuteMount
                className={styles.mastheadArt}
                src={study.masthead.art}
                alt={study.masthead.alt}
              />
            )}
          </div>

          {study.sections.map((section, i) => (
            <section
              key={section.heading}
              id={sectionId(section.heading, i)}
              className={`${styles.section} ${section.variant === "card" ? styles.sectionCard : ""}`}
            >
              <h2 className={styles.heading}>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className={styles.para}>
                  {paragraph}
                </p>
              ))}

              {section.principles && (
                <dl className={styles.principles}>
                  {section.principles.map((item) => (
                    <div key={item.title} className={styles.principle}>
                      <dt className={styles.principleTitle}>{item.title}</dt>
                      <dd className={styles.principleBody}>{item.body}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {section.gallery && (
                <figure className={styles.gallery}>
                  <ul className={styles.galleryGrid}>
                    {section.gallery.map((item) => (
                      <li key={item.label} className={styles.galleryItem}>
                        {item.svg ? (
                          <span
                            className={styles.galleryGlyph}
                            role="img"
                            aria-label={item.alt}
                            dangerouslySetInnerHTML={{ __html: item.svg }}
                          />
                        ) : (
                          <img
                            src={item.src}
                            alt={item.alt}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              // Leave the framed tile and its label standing
                              // rather than a broken-image glyph.
                              e.currentTarget.style.visibility = "hidden";
                            }}
                          />
                        )}
                        <p className={styles.galleryLabel}>{item.label}</p>
                        <p className={styles.galleryNote}>{item.note}</p>
                      </li>
                    ))}
                  </ul>
                  <figcaption>
                    One piece from each family. The subjects differ and so do the
                    rules; the hand behind them does not.
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
                  <figcaption>
                    {section.code.caption}{" "}
                    {section.code.sourceUrl && (
                      <a href={section.code.sourceUrl} target="_blank" rel="noreferrer">
                        Read the whole engine
                        <span aria-hidden="true"> &#8599;</span>
                        <span className={styles.srOnly}> (opens in a new tab)</span>
                      </a>
                    )}
                  </figcaption>
                </figure>
              )}
            </section>
          ))}
        </article>

        <ContactLinks
          resume="/jake-mosher-resume.pdf"
          github="https://github.com/JakemoCode"
          linkedin="https://www.linkedin.com/in/the-real-jake-mosher/"
          email="jake@jakemosher.dev"
        />
      </main>
    </div>
  );
}

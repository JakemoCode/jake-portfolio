import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { testimonials } from "../../content/testimonials";
import styles from "./Proof.module.css";

// How far the glow drifts per swipe (px). The glow is an infinitely repeated
// pattern, so the value can accumulate unbounded without ever exposing an edge.
const GLOW_STEP = 180;

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduce;
}

export function Proof() {
  const [active, setActive] = useState(0);
  // Drift offset for the glow. Same sign as the film's travel so the blobs
  // move with the swipe; wraps for free because the glow pattern repeats.
  const [glowX, setGlowX] = useState(0);
  // Mobile only: the long quote is clamped behind "Read more" to keep the
  // section compact. No effect on desktop (the clamp/button are display:none).
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  function select(index: number) {
    if (index === active) return;
    const direction = Math.sign(index - active);
    setActive(index);
    setGlowX((x) => x - direction * GLOW_STEP);
    setExpanded(false);
  }

  return (
    <section className={styles.proof} id="work" aria-labelledby="proof-title">
      <div
        className={styles.glow}
        aria-hidden="true"
        style={{ "--glow-x": `${glowX}px` } as CSSProperties}
      />

      <div className={styles.inner}>
        <h2 id="proof-title" className={`${styles.title} r-rise`}>
          What people say.
        </h2>
        <p className={`${styles.sub} r-up`}>
          Real businesses I&rsquo;ve built and fixed sites for. Pick any client to read theirs.
        </p>

        <div className={styles.stage}>
          <div
            className={styles.track}
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {testimonials.map((t, i) => {
              const isActive = i === active;
              return (
                <article
                  className={styles.slide}
                  key={t.id}
                  // Keep off-screen slides out of the tab order and a11y tree.
                  inert={!isActive}
                  aria-hidden={!isActive}
                >
                  <div className={styles.media}>
                    <figure className={styles.frame}>
                      <div className={styles.bar}>
                        <span className={styles.dot} />
                        <span className={styles.dot} />
                        <span className={styles.dot} />
                        {t.link && <span className={styles.url}>{hostOf(t.link)}</span>}
                      </div>
                      {t.preview && (
                        <video
                          className={styles.vid}
                          poster={t.preview.poster}
                          aria-label={t.preview.alt}
                          autoPlay={!reduceMotion}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        >
                          <source src={t.preview.webm} type="video/webm" />
                          <source src={t.preview.mp4} type="video/mp4" />
                        </video>
                      )}
                    </figure>
                    {t.platforms && t.platforms.length > 0 && (
                      <p className={styles.stack}>
                        Built on{" "}
                        {t.platforms.map((p, pi) => (
                          <span key={p}>
                            <b className={styles.tech}>{p}</b>
                            {pi < t.platforms!.length - 1 ? " · " : ""}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>

                  <div className={styles.body}>
                    <blockquote
                      className={`${styles.quote} ${expanded ? "" : styles.clamped}`}
                    >
                      {t.quote}
                    </blockquote>
                    <button
                      type="button"
                      className={styles.readMore}
                      aria-expanded={expanded}
                      onClick={() => setExpanded((e) => !e)}
                    >
                      {expanded ? "Read less" : "Read more"}
                    </button>
                    <figcaption className={styles.cite}>
                      <span className={styles.name}>{t.name}</span>
                      <span className={styles.role}>{t.role}</span>
                      {t.link && (
                        <a
                          className={styles.live}
                          href={t.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          See it live
                          <span aria-hidden="true"> &rarr;</span>
                        </a>
                      )}
                    </figcaption>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className={styles.film} role="group" aria-label="Clients">
          {testimonials.map((t, i) => (
            <button
              type="button"
              key={t.id}
              className={styles.thumb}
              aria-pressed={i === active}
              onClick={() => select(i)}
            >
              <span className={styles.tbar} aria-hidden="true">
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </span>
              <span
                className={styles.tshot}
                style={
                  t.preview
                    ? { backgroundImage: `url(${t.preview.poster})` }
                    : undefined
                }
              />
              <span className={styles.tmeta}>
                <span className={styles.tname}>{t.client}</span>
                <span className={styles.ttag}>{t.tag ?? t.platforms?.join(" · ")}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className={styles.apps}>
        I build apps from scratch, too.{" "}
        <Link className={styles.appsLink} to="/portfolio">
          See the engineering side of my work
          <span aria-hidden="true"> &rarr;</span>
        </Link>
      </p>
    </section>
  );
}

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { testimonials } from "../../content/testimonials";
import styles from "./Proof.module.css";

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
  // Drift step count for the glow (±1 per swipe). The px distance per step is
  // a CSS var, so it can differ per breakpoint; the repeating pattern means the
  // count can accumulate unbounded without ever exposing an edge.
  const [glowSteps, setGlowSteps] = useState(0);
  // Mobile only: the long quote is clamped behind "Read more" to keep the
  // section compact. No effect on desktop (the clamp/button are display:none).
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const filmRef = useRef<HTMLDivElement>(null);
  // Whether the filmstrip overflows, and which scroll-arrows are live.
  const [scroll, setScroll] = useState({ overflows: false, atStart: true, atEnd: false });

  const syncScroll = () => {
    const el = filmRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScroll({
      overflows: max > 2,
      atStart: el.scrollLeft <= 2,
      atEnd: el.scrollLeft >= max - 2,
    });
  };

  function scrollFilm(direction: number) {
    const el = filmRef.current;
    if (!el || typeof el.scrollBy !== "function") return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduceMotion ? "auto" : "smooth" });
  }

  // Track overflow on mount and on resize so the arrows show only when needed.
  useEffect(() => {
    syncScroll();
    if (typeof window === "undefined") return;
    window.addEventListener("resize", syncScroll);
    return () => window.removeEventListener("resize", syncScroll);
  }, []);

  // Keep the active client centered in the horizontally-scrolling filmstrip.
  useEffect(() => {
    const film = filmRef.current;
    const el = film?.children[active] as HTMLElement | undefined;
    if (!film || !el || typeof film.scrollTo !== "function") return;
    const offset = el.getBoundingClientRect().left - film.getBoundingClientRect().left;
    film.scrollTo({
      left: film.scrollLeft + offset - (film.clientWidth - el.clientWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [active, reduceMotion]);

  function select(index: number) {
    if (index === active) return;
    const direction = Math.sign(index - active);
    setActive(index);
    setGlowSteps((s) => s - direction);
    setExpanded(false);
  }

  return (
    <section className={styles.proof} id="work" aria-labelledby="proof-title">
      <div
        className={styles.glow}
        aria-hidden="true"
        style={{ "--glow-steps": glowSteps } as CSSProperties}
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

        <div className={styles.filmRow}>
          {scroll.overflows && (
            <button
              type="button"
              className={`${styles.scrollBtn} ${styles.scrollPrev}`}
              onClick={() => scrollFilm(-1)}
              disabled={scroll.atStart}
              aria-label="Scroll clients left"
            >
              <span aria-hidden="true">&lsaquo;</span>
            </button>
          )}
          <div
            className={styles.film}
            role="group"
            aria-label="Clients"
            ref={filmRef}
            onScroll={syncScroll}
          >
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
          {scroll.overflows && (
            <button
              type="button"
              className={`${styles.scrollBtn} ${styles.scrollNext}`}
              onClick={() => scrollFilm(1)}
              disabled={scroll.atEnd}
              aria-label="Scroll clients right"
            >
              <span aria-hidden="true">&rsaquo;</span>
            </button>
          )}
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

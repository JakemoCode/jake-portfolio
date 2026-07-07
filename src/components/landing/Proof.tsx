import { useRef, useState, type CSSProperties } from "react";
import { testimonials, type Testimonial } from "../../content/testimonials";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import styles from "./Proof.module.css";

/** Thin right-pointing chevron; the prev button flips it via CSS. */
function Chevron() {
  return (
    <svg className={styles.chev} viewBox="0 0 185.343 185.343" aria-hidden="true">
      <path
        fill="currentColor"
        d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"
      />
    </svg>
  );
}

function Slide({
  t,
  className,
  style,
  hidden,
  expanded,
  onToggleExpanded,
  onAnimationEnd,
}: {
  t: Testimonial;
  className: string;
  style?: CSSProperties;
  hidden?: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  onAnimationEnd?: () => void;
}) {
  return (
    <article
      className={className}
      style={style}
      inert={hidden || undefined}
      aria-hidden={hidden || undefined}
      onAnimationEnd={onAnimationEnd}
    >
      <div className={styles.body}>
        <blockquote className={`${styles.quote} ${expanded ? "" : styles.clamped}`}>
          {t.quote}
        </blockquote>
        <button
          type="button"
          className={styles.readMore}
          aria-expanded={expanded}
          onClick={onToggleExpanded}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
        <figcaption className={styles.cite}>
          <span className={styles.name}>{t.name}</span>
          <span className={styles.role}>{t.role}</span>
          {t.link && (
            <a className={styles.live} href={t.link} target="_blank" rel="noopener noreferrer">
              See it live
              <span aria-hidden="true"> &rarr;</span>
            </a>
          )}
        </figcaption>
      </div>
    </article>
  );
}

export function Proof() {
  const reduceMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  // Glow drift step count (±1 per switch). The px per step is a CSS var, so the
  // repeating pattern can accumulate unbounded without ever exposing an edge.
  const [glowSteps, setGlowSteps] = useState(0);
  // Mobile only: the long quote is clamped behind "Read more" to stay compact.
  const [expanded, setExpanded] = useState(false);
  // Last click direction (+1 next / -1 prev). Drives the swipe so it always
  // travels the way the chevron points, even across the wrap boundary.
  const [dir, setDir] = useState(1);
  const [navigated, setNavigated] = useState(false);
  // The outgoing slide during a swipe (absolute overlay that animates off).
  const [leaving, setLeaving] = useState<{ index: number; key: number } | null>(null);
  const count = testimonials.length;
  const animId = useRef(0);

  function go(direction: number) {
    if (!reduceMotion) setLeaving({ index: active, key: animId.current++ });
    setDir(direction);
    setNavigated(true);
    setActive((a) => (a + direction + count) % count);
    setGlowSteps((s) => s - direction);
    setExpanded(false);
  }

  const enterX = `${dir * 100}%`;
  const leaveX = `${dir * -100}%`;
  const current = testimonials[active]!;
  const outgoing = leaving ? testimonials[leaving.index] : null;

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
          Real businesses I&rsquo;ve built and fixed sites for.
        </p>

        <div className={styles.spotlight}>
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navPrev}`}
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
          >
            <Chevron />
          </button>

          <div className={styles.stage}>
            {/* Invisible stack of every quote — reserves the tallest height so
                the section never jumps as you swipe between quotes. */}
            <div className={styles.sizer} aria-hidden="true">
              {testimonials.map((t) => (
                <Slide
                  key={t.id}
                  t={t}
                  className={`${styles.slide}`}
                  hidden
                  expanded={expanded}
                  onToggleExpanded={() => {}}
                />
              ))}
            </div>

            {outgoing && leaving && (
              <Slide
                key={`out-${leaving.key}`}
                t={outgoing}
                className={`${styles.slide} ${styles.current} ${styles.leaving}`}
                style={{ "--x": leaveX } as CSSProperties}
                hidden
                expanded={expanded}
                onToggleExpanded={() => {}}
                onAnimationEnd={() =>
                  setLeaving((l) => (l?.key === leaving.key ? null : l))
                }
              />
            )}

            <Slide
              key={`in-${active}`}
              t={current}
              className={`${styles.slide} ${styles.current} ${navigated ? styles.enter : ""}`}
              style={{ "--x": enterX } as CSSProperties}
              expanded={expanded}
              onToggleExpanded={() => setExpanded((e) => !e)}
            />
          </div>

          <button
            type="button"
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={() => go(1)}
            aria-label="Next testimonial"
          >
            <Chevron />
          </button>
        </div>

        <p className={styles.counter} aria-live="polite">
          <span className={styles.srOnly}>
            Testimonial {active + 1} of {count}
          </span>
          <span aria-hidden="true">
            {active + 1} / {count}
          </span>
        </p>
      </div>
    </section>
  );
}

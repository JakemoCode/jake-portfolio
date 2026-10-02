import { useEffect, useRef, useState, type CSSProperties } from "react";
import { methodologyHabits, publicTools } from "../../../content/methodology";
import { useScrollTick } from "../scrollTick/useScrollTick";
import { DistillIndex } from "./DistillIndex";
import { EvidenceFigure } from "./Figures";
import styles from "./Methodology.module.css";

const habitCount = methodologyHabits.length;

/* On a desktop with motion allowed, the habits become an evidence stage. The
   copy scrolls on the left while one framed plate holds still on the right and
   re-forms into each habit's figure as that habit reaches the middle of the
   viewport. The markup is the stacked layout every other reader gets; the
   stage is all stylesheet, fed two things from here: which habit is current,
   and how tall its plate is, so the frame can glide to fit it. */
export function Methodology() {
  const habitsRef = useRef<HTMLDivElement>(null);
  const slots = useRef<Array<HTMLDivElement | null>>([]);
  const { active: current, trackRef, tickRef, markerRef, tickClassName } = useScrollTick({
    targets: () => methodologyHabits.map(({ slug }) => document.getElementById(slug)),
    hold: 0.15,
    axis: "x",
  });
  // Until the first habit reaches the middle, it is already on the stage
  const active = Math.max(current, 0);

  // The first plate holds its sequence until the stage scrolls into view, or
  // it would play at page load, far below the fold
  const [waiting, setWaiting] = useState(() => typeof IntersectionObserver !== "undefined");
  useEffect(() => {
    const habits = habitsRef.current;
    if (!waiting || !habits) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setWaiting(false);
    });
    observer.observe(habits);
    return () => observer.disconnect();
  }, [waiting]);

  // JavaScript because the frame glides to a height only the rendered figure knows
  useEffect(() => {
    const habits = habitsRef.current;
    const slot = slots.current[active];
    if (!habits || !slot) return;
    const fit = () => habits.style.setProperty("--plate-height", `${slot.offsetHeight}px`);
    fit();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(fit);
    observer.observe(slot);
    return () => observer.disconnect();
  }, [active]);

  return (
    <section className={styles.section} aria-labelledby="how-i-work-heading">
      <DistillIndex />

      <div
        ref={habitsRef}
        className={styles.habits}
        data-waiting={waiting || undefined}
        style={{ "--habit-count": habitCount } as CSSProperties}
      >
        <div className={styles.stage}>
          <nav className={styles.strip} aria-label="Jump to a habit">
            <div ref={trackRef} className={styles.track}>
              <ol className={styles.marks}>
                {methodologyHabits.map((habit, i) => (
                  <li key={habit.slug}>
                    <a
                      href={`#${habit.slug}`}
                      className={styles.markLink}
                      aria-current={i === active ? "step" : undefined}
                    >
                      <span ref={markerRef(i)} className={styles.mark} />
                      <span className={styles.markTitle}>{habit.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <p className={styles.counter} aria-hidden="true">
                <span className={styles.counterNow}>{active + 1}</span> / {habitCount}
              </p>
              <span ref={tickRef} className={`${tickClassName} ${styles.tick}`} aria-hidden="true" />
            </div>
          </nav>
        </div>

        {methodologyHabits.map((habit, i) => (
          <article key={habit.slug} className={styles.habit} aria-labelledby={`${habit.slug}-title`}>
            {/* The anchor sits on the copy, because on the stage the article
                itself has no box to scroll to */}
            <div id={habit.slug} className={styles.copy}>
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
            <div
              ref={(el) => {
                slots.current[i] = el;
              }}
              className={styles.slot}
              data-place={i < active ? "past" : i === active ? "active" : "next"}
            >
              <EvidenceFigure figure={habit.figure} />
            </div>
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

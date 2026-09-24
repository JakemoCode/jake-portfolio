import { useEffect, useRef, useState } from "react";
import styles from "./SectionRail.module.css";
import { railState } from "./railState";

export type RailSection = { id: string; label: string };

/* The tick marks the current section and stretches toward the next entry as
   the reader moves through it. JavaScript, not scroll-driven CSS, because the
   hand-off has to glide: the leading edge follows the scroll while the
   trailing edge catches up on a transition. The script writes an index, a
   progress fraction and a direction; the geometry lives in the CSS. */
export function SectionRail({ sections }: { sections: readonly RailSection[] }) {
  const tickRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const tick = tickRef.current!;
    let frame = 0;
    let last = -1;

    const update = () => {
      frame = 0;
      const tops = sections.map(({ id }) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) + scrollY);
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      const { index, progress } = railState(scrollY, tops, innerHeight, maxScroll);
      tick.style.setProperty("--progress", String(progress));
      if (index === last) return;
      // Moving down, the bottom edge leads and the top glides after it; moving
      // up, the reverse. Cleared when the glide ends (onTransitionEnd), so
      // scrolling within a section never lags.
      tick.dataset.glide = index > last ? "down" : "up";
      tick.style.setProperty("--index", String(Math.max(index, 0)));
      last = index;
      setActive(index);
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };

    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [sections]);

  return (
    <nav className={styles.rail} aria-label="On this page">
      <div className={styles.track}>
        <ol className={styles.list}>
          {sections.map((section, i) => (
            <li key={section.id}>
              <a className={styles.link} href={`#${section.id}`} aria-current={i === active ? "location" : undefined}>
                {section.label}
              </a>
            </li>
          ))}
        </ol>
        <span
          ref={tickRef}
          className={styles.tick}
          aria-hidden="true"
          onTransitionEnd={(event) => delete event.currentTarget.dataset.glide}
        />
      </div>
    </nav>
  );
}

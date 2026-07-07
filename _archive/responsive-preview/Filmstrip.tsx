import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import styles from "./Filmstrip.module.css";

export type FilmstripItem = {
  id: string;
  name: string;
  tag?: string;
  poster?: string;
};

/** A horizontally-scrolling row of thumbnail cards used to pick one item.
 *  Scroll arrows appear only when the strip overflows (mouse users without a
 *  horizontal wheel); touch users swipe. */
export function Filmstrip({
  items,
  activeIndex,
  onSelect,
  label,
}: {
  items: FilmstripItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  label: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const filmRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    syncScroll();
    if (typeof window === "undefined") return;
    window.addEventListener("resize", syncScroll);
    return () => window.removeEventListener("resize", syncScroll);
  }, []);

  // Keep the active card in view as the selection changes elsewhere.
  useEffect(() => {
    const film = filmRef.current;
    const el = film?.children[activeIndex] as HTMLElement | undefined;
    if (!film || !el || typeof film.scrollTo !== "function") return;
    const offset = el.getBoundingClientRect().left - film.getBoundingClientRect().left;
    film.scrollTo({
      left: film.scrollLeft + offset - (film.clientWidth - el.clientWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeIndex, reduceMotion]);

  return (
    <div className={styles.filmRow}>
      {scroll.overflows && (
        <button
          type="button"
          className={`${styles.scrollBtn} ${styles.scrollPrev}`}
          onClick={() => scrollFilm(-1)}
          disabled={scroll.atStart}
          aria-label="Scroll left"
        >
          <span aria-hidden="true">&lsaquo;</span>
        </button>
      )}

      <div
        className={styles.film}
        role="group"
        aria-label={label}
        ref={filmRef}
        onScroll={syncScroll}
      >
        {items.map((item, i) => (
          <button
            type="button"
            key={item.id}
            className={styles.thumb}
            aria-pressed={i === activeIndex}
            onClick={() => onSelect(i)}
          >
            <span className={styles.tbar} aria-hidden="true">
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </span>
            <span
              className={styles.tshot}
              style={item.poster ? { backgroundImage: `url(${item.poster})` } : undefined}
            />
            <span className={styles.tmeta}>
              <span className={styles.tname}>{item.name}</span>
              {item.tag && <span className={styles.ttag}>{item.tag}</span>}
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
          aria-label="Scroll right"
        >
          <span aria-hidden="true">&rsaquo;</span>
        </button>
      )}
    </div>
  );
}

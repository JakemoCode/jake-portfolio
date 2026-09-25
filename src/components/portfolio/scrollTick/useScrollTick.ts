import { useEffect, useRef, useState } from "react";
import styles from "./scrollTick.module.css";
import { scrollTick } from "./scrollTick";

/* A tick on a track that marks the item the reader is in and stretches toward
   the next item's marker as they scroll through it. JavaScript, not
   scroll-driven CSS, because the hand-off has to glide: the leading edge
   follows the scroll while the trailing edge catches up on a transition.

   Attach the returned refs to the track, the tick, and one marker per item,
   and add tickClassName to the tick. An item becomes current when its target
   crosses the middle of the viewport; the targets are the markers themselves
   unless getTargets names others (the rail watches page sections). hold is
   the share of each item the tick rests before it grows. */
export function useScrollTick({
  targets: getTargets,
  hold = 0,
}: { targets?: () => ReadonlyArray<Element | null>; hold?: number } = {}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<HTMLSpanElement>(null);
  const markers = useRef<Array<HTMLElement | null>>([]);
  const targets = useRef(getTargets);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    targets.current = getTargets;
  });

  useEffect(() => {
    const track = trackRef.current!;
    const tick = tickRef.current!;
    let frame = 0;
    let last = -1;
    let lastScroll = scrollY;

    const update = () => {
      frame = 0;
      const origin = track.getBoundingClientRect().top;
      const { index, top, bottom } = scrollTick({
        scroll: scrollY,
        viewport: innerHeight,
        maxScroll: document.documentElement.scrollHeight - innerHeight,
        targets: (targets.current?.() ?? markers.current).map((el) => (el?.getBoundingClientRect().top ?? Infinity) + scrollY),
        markers: markers.current.map((el) => {
          const box = el?.getBoundingClientRect();
          return box ? { top: box.top - origin, bottom: box.bottom - origin } : { top: 0, bottom: 0 };
        }),
        hold,
      });
      const jumpedUp = index < last && Math.abs(scrollY - lastScroll) > innerHeight / 2;
      lastScroll = scrollY;
      // A jump back up the page (a rail click) glides the bottom edge too, so
      // the tick slides instead of turning inside out. That transition has to
      // exist before the edges move, or it never starts, hence the flush.
      // Cleared when the glide ends, so scrolling never lags.
      if (jumpedUp) {
        tick.dataset.glide = "jump-up";
        void getComputedStyle(tick).transitionProperty;
      }
      tick.style.setProperty("--tick-top", `${top}px`);
      tick.style.setProperty("--tick-bottom", `${bottom}px`);
      if (index === last) return;
      last = index;
      setActive(index);
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };
    const settle = (event: TransitionEvent) => {
      if (event.propertyName === "bottom") delete tick.dataset.glide;
    };

    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    tick.addEventListener("transitionend", settle);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      tick.removeEventListener("transitionend", settle);
    };
  }, [hold]);

  const markerRef = (i: number) => (el: HTMLElement | null) => {
    markers.current[i] = el;
  };

  return { active, trackRef, tickRef, markerRef, tickClassName: styles.tick };
}

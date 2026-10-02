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
   the share of each item the tick rests before it grows. axis "x" runs the
   same tick along a horizontal track, its start and end edges becoming its
   left and right. */
export function useScrollTick({
  targets: getTargets,
  hold = 0,
  axis = "y",
}: { targets?: () => ReadonlyArray<Element | null>; hold?: number; axis?: "x" | "y" } = {}) {
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
      const trackBox = track.getBoundingClientRect();
      const origin = axis === "y" ? trackBox.top : trackBox.left;
      const { index, top, bottom } = scrollTick({
        scroll: scrollY,
        viewport: innerHeight,
        maxScroll: document.documentElement.scrollHeight - innerHeight,
        targets: (targets.current?.() ?? markers.current).map((el) => (el?.getBoundingClientRect().top ?? Infinity) + scrollY),
        // scrollTick is axis-free, so on x a marker's top and bottom are its left and right
        markers: markers.current.map((el) => {
          const box = el?.getBoundingClientRect();
          if (!box) return { top: 0, bottom: 0 };
          const [start, end] = axis === "y" ? [box.top, box.bottom] : [box.left, box.right];
          return { top: start - origin, bottom: end - origin };
        }),
        hold,
      });
      const jumpedUp = index < last && Math.abs(scrollY - lastScroll) > innerHeight / 2;
      lastScroll = scrollY;
      // A jump back up the page (a rail click) glides the bottom edge too, so
      // the tick slides instead of turning inside out. That transition has to
      // exist before the edges move, or it never starts, hence the flush.
      // Cleared when the glide ends or is cancelled, so scrolling never lags.
      // A hidden tick (the rail below its breakpoint) never transitions, so
      // it never gets the attribute, or nothing would ever clear it.
      if (jumpedUp && tick.getClientRects().length > 0) {
        tick.dataset.glide = "jump-up";
        void getComputedStyle(tick).transitionProperty;
      }
      tick.style.setProperty("--tick-start", `${top}px`);
      tick.style.setProperty("--tick-end", `${bottom}px`);
      if (index === last) return;
      last = index;
      setActive(index);
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };
    const settle = (event: TransitionEvent) => {
      if (event.propertyName === (axis === "y" ? "bottom" : "right")) delete tick.dataset.glide;
    };

    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    tick.addEventListener("transitionend", settle);
    tick.addEventListener("transitioncancel", settle);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      tick.removeEventListener("transitionend", settle);
      tick.removeEventListener("transitioncancel", settle);
    };
  }, [hold, axis]);

  const markerRef = (i: number) => (el: HTMLElement | null) => {
    markers.current[i] = el;
  };

  return { active, trackRef, tickRef, markerRef, tickClassName: axis === "y" ? styles.tick : styles.tickX };
}

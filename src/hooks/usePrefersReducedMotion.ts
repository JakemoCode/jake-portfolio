import { useEffect, useState } from "react";

/** Tracks the user's `prefers-reduced-motion` setting, guarded for SSR/jsdom
 *  (no `matchMedia`), so callers can swap motion for a static fallback. */
export function usePrefersReducedMotion(): boolean {
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

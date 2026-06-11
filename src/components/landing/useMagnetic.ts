import { useEffect, useRef } from "react";

type Options = {
  /** Fraction of the cursor's offset the element follows (0–1). */
  strength?: number;
  /** Extra px beyond the element's edge where the pull begins. */
  radius?: number;
  /** Max px the element will travel from rest. */
  max?: number;
};

/**
 * Magnetic pull: the returned ref's element eases toward the cursor while it's
 * within reach, and springs back when it leaves. Writes --mx / --my custom
 * properties (the element's CSS owns the transform + easing). No-op on touch
 * and reduced-motion. Listens on window so the pull begins on approach, not
 * just on hover.
 */
export function useMagnetic<T extends HTMLElement>(options?: Options) {
  const { strength = 0.3, radius = 90, max = 22 } = options ?? {};
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    let raf = 0;
    const clamp = (v: number) => Math.max(-max, Math.min(max, v));

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const reach = Math.max(r.width, r.height) / 2 + radius;
        const inReach = Math.hypot(dx, dy) < reach;
        el.style.setProperty("--mx", inReach ? `${clamp(dx * strength)}px` : "0px");
        el.style.setProperty("--my", inReach ? `${clamp(dy * strength)}px` : "0px");
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };
  }, [strength, radius, max]);

  return ref;
}

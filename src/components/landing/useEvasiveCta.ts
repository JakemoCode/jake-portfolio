import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import {
  ATTEMPT_LIMIT,
  RETREAT_FACTOR,
  computeEvasion,
  evasionDuration,
  evasionRadius,
  type Point,
} from "./evasion";

const NO_OFFSET: Point = { x: 0, y: 0 };

/** Marks the ancestor the button may not escape. */
export const BOUNDS_ATTRIBUTE = "data-evasion-bounds";

/** Touch has no hover, so a dodge there just eats the tap with no visible
 *  cause. Restrict the whole gag to pointers that can be seen chasing it. */
function hasFinePointer(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(pointer: fine)").matches;
}

/** Whether the element is faded fully out, counting the ancestors up to
 *  `root`. The reveal animations put `opacity: 0` on the row rather than on
 *  the button, so reading the button's own value alone always sees 1. */
function isFadedOut(element: Element, root: Element): boolean {
  let node: Element | null = element;
  while (node) {
    if (getComputedStyle(node).opacity === "0") return true;
    if (node === root) return false;
    node = node.parentElement;
  }
  return false;
}

/** Translation the browser is painting this frame, mid-transition included. */
function translationOf(transform: string): Point {
  if (!transform || transform === "none") return NO_OFFSET;
  const matrix = new DOMMatrixReadOnly(transform);
  return { x: matrix.m41, y: matrix.m42 };
}

/**
 * Makes an element back away from the pointer, harder each time, then give up
 * after `ATTEMPT_LIMIT` passes so the click can finally land. Keyboard and
 * touch activation are never intercepted.
 */
export function useEvasiveCta(active: boolean) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState<Point>(NO_OFFSET);

  const offsetRef = useRef<Point>(NO_OFFSET);
  const attemptsRef = useRef(0);
  const insideRef = useRef(false);
  const frameRef = useRef(0);
  const reduceMotion = usePrefersReducedMotion();

  const [fine, setFine] = useState(false);
  useEffect(() => setFine(hasFinePointer()), []);

  // The listener is on the window, so most frames resolve to "stay home".
  // Bailing on an unchanged offset keeps those frames from re-rendering.
  const settle = useCallback((next: Point) => {
    const previous = offsetRef.current;
    if (previous.x === next.x && previous.y === next.y) return;
    offsetRef.current = next;
    setOffset(next);
  }, []);

  const enabled = active && fine && !reduceMotion;

  useEffect(() => {
    if (!enabled) {
      settle(NO_OFFSET);
      return;
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      // Nothing left to compute once the gag is spent, and measuring on every
      // frame for the rest of the page's life forces a layout each time.
      if (attemptsRef.current > ATTEMPT_LIMIT) return;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        const button = buttonRef.current;
        // The cage is whichever ancestor opts in, so each call site picks how
        // far its button may roam without threading a ref through.
        const container = button?.closest(`[${BOUNDS_ATTRIBUTE}]`);
        if (!button || !container) return;

        // The row fades in on a delay. A pointer wandering past the button
        // while it is still invisible would spend the allowance unseen.
        if (isFadedOut(button, container)) return;

        const computed = getComputedStyle(button);

        // getBoundingClientRect reports the box as painted, and the CSS
        // transition on transform means that lags the offset last asked for.
        // Back out what the browser is applying now, not the target.
        const live = button.getBoundingClientRect();
        const applied = translationOf(computed.transform);
        const home = {
          left: live.left - applied.x,
          top: live.top - applied.y,
          width: live.width,
          height: live.height,
        };

        const pointer = { x: event.clientX, y: event.clientY };
        const distance = Math.hypot(
          home.left + home.width / 2 - pointer.x,
          home.top + home.height / 2 - pointer.y,
        );

        // One attempt per approach, counted on the way in. The pointer has to
        // retreat well clear before the next one counts, so a single wobbly
        // approach can't burn through the limit.
        const radius = evasionRadius(attemptsRef.current);
        if (insideRef.current) {
          if (distance > radius * RETREAT_FACTOR) insideRef.current = false;
        } else if (distance < radius) {
          insideRef.current = true;
          attemptsRef.current += 1;
        }

        if (attemptsRef.current > ATTEMPT_LIMIT) {
          settle(NO_OFFSET);
          return;
        }

        const box = container.getBoundingClientRect();
        settle(
          computeEvasion({
            pointer,
            home,
            bounds: {
              left: box.left,
              top: box.top,
              width: box.width,
              height: box.height,
            },
            attempts: attemptsRef.current - 1,
          }),
        );
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, [enabled, settle]);

  const moved = offset.x !== 0 || offset.y !== 0;
  return {
    buttonRef,
    evading: moved,
    // Leave transform unset at rest so the CSS hover lift still applies.
    style: moved
      ? {
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transitionDuration: `${evasionDuration(attemptsRef.current - 1)}ms`,
        }
      : undefined,
  };
}

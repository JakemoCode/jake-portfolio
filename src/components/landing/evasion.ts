/** Geometry for the hero CTA that backs away from the pointer. Kept pure and
 *  DOM-free so the escalation curve is testable without a layout engine. */

export type Point = { x: number; y: number };
export type Rect = { left: number; top: number; width: number; height: number };

/** Dodges allowed before the button gives up and lets itself be clicked. */
export const ATTEMPT_LIMIT = 5;

/** The pointer has to retreat past this multiple of the radius before the next
 *  approach counts. Without it, homing in on the button crosses the boundary
 *  several times and burns the whole limit in one pass. */
export const RETREAT_FACTOR = 1.4;

const BASE_RADIUS = 140;
const RADIUS_STEP = 40;

/** Travel has to beat the button's own width or the dodge reads as a wobble
 *  rather than an escape, and it never gets far enough to cover its neighbour. */
const BASE_PUSH = 210;
const PUSH_STEP = 95;

/** Vertical range is the button's own, not the row's, so a button sitting in a
 *  one-line row can still flinch up and down. The container is still a hard
 *  stop: the nav bar is barely taller than its button, and the page clips
 *  overflow, so an unbounded flinch would slice the top off the button. */
const VERTICAL_SLACK = 44;

/** Travel time. The first pass is a lazy drift, the last one bolts, which is
 *  what actually sells the escalation. Displacement alone doesn't. */
const BASE_DURATION = 420;
const DURATION_STEP = 75;
const MIN_DURATION = 90;

/** How close the pointer has to get before the button notices. */
export function evasionRadius(attempts: number): number {
  return BASE_RADIUS + attempts * RADIUS_STEP;
}

/** Furthest the button will travel from its home position. */
export function evasionPush(attempts: number): number {
  return BASE_PUSH + attempts * PUSH_STEP;
}

/** Milliseconds the button takes to reach its displaced position. */
export function evasionDuration(attempts: number): number {
  return Math.max(MIN_DURATION, BASE_DURATION - attempts * DURATION_STEP);
}

function clamp(value: number, min: number, max: number): number {
  if (min > max) return 0;
  return Math.min(Math.max(value, min), max);
}

/**
 * Offset to apply to the button, given where the pointer is and where the
 * button sits at rest. Returns {0,0} outside the radius so the button springs
 * home on its own transition.
 *
 * Distance is measured from the button's home position rather than its current
 * one, so chasing it can't settle into a standoff at a fixed range.
 *
 * @param home    the button's rect with no offset applied
 * @param bounds  the box the button may not leave
 */
export function computeEvasion({
  pointer,
  home,
  bounds,
  attempts,
}: {
  pointer: Point;
  home: Rect;
  bounds: Rect;
  attempts: number;
}): Point {
  const centerX = home.left + home.width / 2;
  const centerY = home.top + home.height / 2;
  const dx = centerX - pointer.x;
  const dy = centerY - pointer.y;
  const distance = Math.hypot(dx, dy);
  const radius = evasionRadius(attempts);
  if (distance >= radius) return { x: 0, y: 0 };

  // Squared falloff: barely reacts at the edge of the radius, bolts up close.
  const falloff = 1 - distance / radius;
  const push = evasionPush(attempts) * falloff * falloff;

  // Pointer dead-centre gives no direction to flee, so pick one.
  const [unitX, unitY] =
    distance === 0 ? [1, 0] : [dx / distance, dy / distance];

  return {
    x: clamp(
      unitX * push,
      bounds.left - home.left,
      bounds.left + bounds.width - (home.left + home.width),
    ),
    y: clamp(
      unitY * push,
      Math.max(-VERTICAL_SLACK, bounds.top - home.top),
      Math.min(VERTICAL_SLACK, bounds.top + bounds.height - (home.top + home.height)),
    ),
  };
}

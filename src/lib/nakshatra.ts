/* Spin/landing math for the Nakshatra wheel, ported from the engine running on
   zendeb.com. Pure and framework-free so the feel can be unit-tested: the whole
   point of this component is that "satisfying" is expressible as bounds.

   The wheel is a spin-and-stop draw, not a lookup. The glyph under the 12 o'clock
   needle at the moment you press Stop is the result, and the wheel then coasts to
   rest exactly on it. */

export type DecelPlan = {
  /** Absolute angle to rest at. */
  aFinal: number;
  /** Degrees travelled from the current angle. */
  D: number;
  /** Duration in ms. */
  T: number;
  /** Index of the glyph it will land on. */
  index: number;
};

export type DecelOptions = {
  /** Deceleration in deg/ms^2. Higher means fewer extra turns. */
  decel?: number;
  /** Timing reference in deg/ms (roughly cruise speed). Higher spins down quicker. */
  refVel?: number;
};

export function norm360(a: number): number {
  return ((a % 360) + 360) % 360;
}

/** Glyph index sitting under the 12 o'clock needle for a given wheel rotation.
 *  Glyph i is placed at base angle i*step clockwise from top, so rotating the
 *  wheel by `angle` puts glyph i at the top when i*step + angle is a multiple of 360. */
export function topIndex(angle: number, n: number): number {
  const step = 360 / n;
  return Math.round(norm360(-angle) / step) % n;
}

/**
 * Plan the slow-down from the moment Stop is pressed.
 *
 * Three constraints have to hold at once, and they fight each other:
 *   1. It must land on the glyph that was under the needle when you clicked.
 *   2. It must always coast at least one full turn, so an early tap still feels
 *      like a spin rather than a stop.
 *   3. It must take a bounded, human amount of time at ANY input speed.
 *
 * The third is the one that bit. Deriving duration from the actual velocity meant
 * a near-zero-speed tap planned a slow-down of about 58 seconds. Tying T to
 * `refVel` instead decouples how long it takes from how fast it happened to be
 * moving, so a gentle tap still spins a full turn in a few seconds.
 *
 * Folding the realignment into the turn count, rather than adding a separate full
 * turn, keeps a slow stop at about one turn instead of a coin flip between one and
 * two depending on which side of the needle it stopped.
 */
export function decelTarget(
  angle: number,
  vel: number,
  n: number,
  opts: DecelOptions = {},
): DecelPlan {
  const decel = opts.decel ?? 0.00034;
  const refVel = opts.refVel ?? 0.5;
  const step = 360 / n;
  const v0 = Math.max(vel, 0.05);

  const chosen = topIndex(angle, n);
  const aligned = norm360(-chosen * step);

  // Natural coast distance at the real speed: faster spins genuinely travel further.
  const physical = (v0 * v0) / (2 * decel);
  const target = Math.max(360, physical);

  const aFinal = aligned + 360 * Math.round((angle + target - aligned) / 360);
  const D = aFinal - angle;

  return { aFinal, D, T: (3 * D) / refVel, index: chosen };
}

/** Cubic ease-out. Decisive slow-down, gentle readable final approach. */
export function easeOutCubic(p: number): number {
  return 1 - Math.pow(1 - p, 3);
}

/** Smoothstep, used to ramp up to cruise speed instead of snapping to it. */
export function smoothstep(k: number): number {
  return k * k * (3 - 2 * k);
}

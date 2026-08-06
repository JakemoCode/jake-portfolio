/* Ported from the zendeb.com engine tests. These assert the *feel* as bounds:
   where it rests, how far it coasts, and how long that takes. */
import { describe, it, expect } from "vitest";
import { topIndex, decelTarget, norm360 } from "./nakshatra";

const N = 27;
const STEP = 360 / N;
const CRUISE = 0.54;

describe("topIndex", () => {
  it("puts glyph i under the needle when the wheel is rotated -i*step", () => {
    for (let i = 0; i < N; i++) {
      expect(topIndex(-i * STEP, N)).toBe(i);
    }
  });

  it("is stable across full-turn offsets", () => {
    expect(topIndex(-3 * STEP + 720, N)).toBe(3);
    expect(topIndex(-3 * STEP - 1080, N)).toBe(3);
  });

  it("rounds to the nearest glyph rather than truncating", () => {
    const justPast = -3 * STEP - STEP * 0.4;
    expect(topIndex(justPast, N)).toBe(3);
  });
});

describe("decelTarget", () => {
  it("rests exactly on the glyph that was at top-dead-center when Stop was pressed", () => {
    for (const start of [0, 12.5, -47, 219.9, 1000]) {
      const plan = decelTarget(start, CRUISE, N, { refVel: CRUISE });
      expect(topIndex(plan.aFinal, N)).toBe(plan.index);
      // and it lands aligned, not merely nearest
      expect(norm360(plan.aFinal + plan.index * STEP)).toBeCloseTo(0, 6);
    }
  });

  it("always coasts at least one full turn", () => {
    for (const vel of [0, 0.001, 0.05, CRUISE, 2]) {
      const plan = decelTarget(37, vel, N, { refVel: CRUISE });
      expect(plan.D).toBeGreaterThanOrEqual(360);
    }
  });

  it("at or below cruise speed the coast is about one turn, never a double spin", () => {
    for (const vel of [0.001, 0.05, 0.2, CRUISE]) {
      const plan = decelTarget(0, vel, N, { refVel: CRUISE });
      expect(plan.D).toBeLessThan(720);
    }
  });

  it("a quick tap still spins about a full turn in bounded time, not instantly and not for a minute", () => {
    const plan = decelTarget(0, 0.0001, N, { refVel: CRUISE });
    expect(plan.T).toBeGreaterThan(1000);
    expect(plan.T).toBeLessThan(5000);
  });

  it("above cruise, faster spins add more turns", () => {
    const slow = decelTarget(0, CRUISE, N, { refVel: CRUISE });
    const fast = decelTarget(0, CRUISE * 4, N, { refVel: CRUISE });
    expect(fast.D).toBeGreaterThan(slow.D);
  });

  it("never plans a backwards coast", () => {
    for (let a = -720; a <= 720; a += 17) {
      expect(decelTarget(a, CRUISE, N, { refVel: CRUISE }).D).toBeGreaterThan(0);
    }
  });
});

import { describe, expect, it } from "vitest";
import {
  ATTEMPT_LIMIT,
  computeEvasion,
  evasionDuration,
  evasionPush,
  evasionRadius,
  type Rect,
} from "./evasion";

/** A 200x50 button centred on y=100, in a container with room to spare. */
const home: Rect = { left: 400, top: 75, width: 200, height: 50 };
const bounds: Rect = { left: 100, top: 20, width: 900, height: 160 };

const evade = (pointer: { x: number; y: number }, attempts = 0) =>
  computeEvasion({ pointer, home, bounds, attempts });

describe("computeEvasion", () => {
  it("stays put while the pointer is outside the radius", () => {
    expect(evade({ x: 500 - evasionRadius(0) - 1, y: 100 })).toEqual({ x: 0, y: 0 });
  });

  it("pushes away from the pointer, not toward it", () => {
    expect(evade({ x: 460, y: 100 }).x).toBeGreaterThan(0);
    expect(evade({ x: 540, y: 100 }).x).toBeLessThan(0);
  });

  it("pushes harder the closer the pointer gets", () => {
    const near = Math.abs(evade({ x: 480, y: 100 }).x);
    const far = Math.abs(evade({ x: 440, y: 100 }).x);
    expect(near).toBeGreaterThan(far);
  });

  it("escalates radius and push on later attempts", () => {
    expect(evasionRadius(2)).toBeGreaterThan(evasionRadius(0));
    expect(evasionPush(2)).toBeGreaterThan(evasionPush(0));

    const edge = { x: 500 - evasionRadius(0) - 10, y: 100 };
    expect(evade(edge, 0)).toEqual({ x: 0, y: 0 });
    expect(evade(edge, 2).x).not.toBe(0);
  });

  it("travels further and faster on later attempts", () => {
    expect(evasionPush(ATTEMPT_LIMIT)).toBeGreaterThan(evasionPush(0));
    expect(evasionDuration(ATTEMPT_LIMIT)).toBeLessThan(evasionDuration(0));
    expect(evasionDuration(ATTEMPT_LIMIT)).toBeGreaterThan(0);
  });

  it("clears the button's own width once, so it can cover its neighbour", () => {
    expect(evasionPush(0)).toBeGreaterThan(home.width);
  });

  it("flinches vertically, using the slack above and below the row", () => {
    expect(evade({ x: 500, y: 130 }).y).toBeLessThan(0);
    expect(evade({ x: 500, y: 70 }).y).toBeGreaterThan(0);
  });

  it("never leaves the container", () => {
    const tight: Rect = { left: 400, top: 75, width: 200, height: 50 };
    const boxed = computeEvasion({
      pointer: { x: 420, y: 100 },
      home,
      bounds: tight,
      attempts: ATTEMPT_LIMIT,
    });
    expect(boxed.x).toBe(0);
    expect(boxed.y).toBe(0);
  });

  /* The nav bar is barely taller than its button, and the page clips overflow,
     so a full-slack flinch there would slice the top off the button. */
  it("gives up vertical slack the short container does not have", () => {
    const shallow: Rect = { left: 100, top: 65, width: 900, height: 70 };
    const boxed = computeEvasion({
      pointer: { x: 500, y: 130 },
      home,
      bounds: shallow,
      attempts: 0,
    });
    expect(boxed.y).toBeLessThan(0);
    expect(boxed.y).toBeGreaterThanOrEqual(shallow.top - home.top);
  });

  it("picks a direction when the pointer is dead centre", () => {
    expect(evade({ x: 500, y: 100 }).x).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from "vitest";
import { createSynapseField, FIELD_DEFAULTS, type FieldPalette } from "./synapseField";

const palette: FieldPalette = {
  bg: [4, 22, 21],
  bgDeep: [6, 32, 30],
  well: [8, 90, 84],
  glow: [20, 184, 166],
  signal: [94, 232, 207],
  spark: [235, 255, 250],
  ember: [232, 120, 86],
};

// Deterministic stand-in for Math.random
const seeded = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32);

/** A canvas context that records where each pulse starts, and every ring:
    a circle that is stroked rather than filled. A fresh pulse's trail begins
    exactly on the node that sent it. */
function recordingContext() {
  const pulseStarts: Array<[number, number]> = [];
  const rings: Array<[number, number]> = [];
  let stroke = "";
  let circle: [number, number] | null = null;
  const gradient = { addColorStop: () => {} };
  const ctx = {
    set strokeStyle(value: string) {
      stroke = value;
    },
    fillStyle: "",
    lineWidth: 1,
    globalCompositeOperation: "",
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
    fillRect: () => {},
    beginPath: () => {
      circle = null;
    },
    moveTo: (x: number, y: number) => {
      if (stroke === "rgba(94,232,207,0.8)") pulseStarts.push([x, y]);
    },
    lineTo: () => {},
    stroke: () => {
      if (circle) rings.push(circle);
    },
    arc: (x: number, y: number) => {
      circle = [x, y];
    },
    fill: () => {},
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, pulseStarts, rings };
}

describe("createSynapseField", () => {
  it("sends a click's signal out from the node nearest the pointer", () => {
    const field = createSynapseField(800, 600, palette, { ...FIELD_DEFAULTS, emberClick: 0 }, seeded(7));
    const { ctx, pulseStarts } = recordingContext();
    field.draw(ctx, 0.5, 0.016); // the first ambient firing happens here
    pulseStarts.length = 0;

    field.fireAt(400, 300);
    field.draw(ctx, 0.52, 0.016);

    const fromClick = pulseStarts.filter(([x, y]) => Math.hypot(x - 400, y - 300) < 78);
    expect(fromClick.length).toBeGreaterThanOrEqual(3);
    // Every one of them leaves from the same node
    expect(new Set(fromClick.map(([x, y]) => `${x},${y}`)).size).toBe(1);
  });

  it("carries a clicked signal several links out, as one wave", () => {
    const field = createSynapseField(1600, 1200, palette, { ...FIELD_DEFAULTS, emberClick: 0 }, seeded(3));
    const { ctx, pulseStarts } = recordingContext();
    field.draw(ctx, 0, 0.016);
    field.fireAt(800, 600);
    // Five hops at about a second each, then time for the last to land
    let peakInFlight = 0;
    for (let t = 0.016; t < 9; t += 0.016) {
      const before = pulseStarts.length;
      field.draw(ctx, t, 0.016);
      peakInFlight = Math.max(peakInFlight, pulseStarts.length - before);
    }

    const reach = Math.max(...pulseStarts.map(([x, y]) => Math.hypot(x - 800, y - 600)));
    expect(reach).toBeGreaterThan(78 * 3);
    // Each node relays a wave once. Without that cooldown the wave bounces
    // between neighbours and peaks near 1,200 pulses at once.
    expect(peakInFlight).toBeLessThan(200);
  });

  it("draws the nodes near the cursor toward it, and leaves distant ones alone", () => {
    // Two identical fields, one with a cursor resting at (400, 300)
    const nodesAfter = (withCursor: boolean) => {
      const field = createSynapseField(800, 600, palette, FIELD_DEFAULTS, seeded(11));
      if (withCursor) field.pointer({ x: 400, y: 300 });
      const centers: Array<[number, number]> = [];
      let fill = "";
      const gradient = { addColorStop: () => {} };
      const ctx = {
        set fillStyle(value: string) {
          fill = value;
        },
        strokeStyle: "",
        lineWidth: 1,
        globalCompositeOperation: "",
        createLinearGradient: () => gradient,
        createRadialGradient: () => gradient,
        fillRect: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        stroke: () => {},
        arc: (x: number, y: number) => {
          if (fill.startsWith("rgba(94,232,207")) centers.push([x, y]);
        },
        fill: () => {},
      } as unknown as CanvasRenderingContext2D;
      // Three seconds, for the cursor to ease in, then one recorded frame
      for (let t = 0; t < 3; t += 0.016) field.draw(ctx, t, 0.016);
      centers.length = 0;
      field.draw(ctx, 3, 0.016);
      return centers;
    };
    const still = nodesAfter(false);
    const drawn = nodesAfter(true);
    const distance = ([x, y]: [number, number]) => Math.hypot(x - 400, y - 300);

    const nearest = still.reduce((best, node, i) => (distance(node) < distance(still[best]!) ? i : best), 0);
    expect(distance(still[nearest]!) - distance(drawn[nearest]!)).toBeGreaterThan(4);
    const far = still.findIndex((node) => distance(node) > 300);
    expect(drawn[far]).toEqual(still[far]);
  });

  it("rings the node a click would fire, while the cursor rests on the field", () => {
    const ringsAt = (aimRing: number) => {
      const field = createSynapseField(800, 600, palette, { ...FIELD_DEFAULTS, emberClick: 0, aimRing }, seeded(7));
      const recorder = recordingContext();
      field.pointer({ x: 400, y: 300 });
      for (let t = 0; t < 2; t += 0.016) field.draw(recorder.ctx, t, 0.016);
      recorder.rings.length = 0;
      field.draw(recorder.ctx, 2, 0.016);
      return { field, ...recorder };
    };

    expect(ringsAt(0).rings).toHaveLength(0);

    const { field, ctx, rings, pulseStarts } = ringsAt(0.6);
    expect(rings).toHaveLength(1);
    pulseStarts.length = 0;
    field.fireAt(400, 300);
    field.draw(ctx, 2.016, 0.016);
    const [rx, ry] = rings[0]!;
    expect(pulseStarts.some(([x, y]) => Math.hypot(x - rx, y - ry) < 2)).toBe(true);
  });

  it("fires each node a drag sweeps across, and not again on the way back", () => {
    const field = createSynapseField(800, 600, palette, { ...FIELD_DEFAULTS, emberClick: 0 }, seeded(5));
    const { ctx, pulseStarts } = recordingContext();
    field.draw(ctx, 0.5, 0.016); // the first ambient firing happens here
    pulseStarts.length = 0;

    for (let x = 100; x <= 700; x += 10) field.sweep({ x, y: 300 });
    field.draw(ctx, 0.52, 0.016);
    const origins = new Set(pulseStarts.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`));
    // 600px of drag crosses about seven nodes 90px apart
    expect(origins.size).toBeGreaterThanOrEqual(4);

    // Pulses already in flight redraw every frame, so a second pass that
    // fired nothing leaves the count unchanged
    pulseStarts.length = 0;
    field.draw(ctx, 0.53, 0.016);
    const inFlight = pulseStarts.length;
    pulseStarts.length = 0;
    for (let x = 700; x >= 100; x -= 10) field.sweep({ x, y: 300 });
    field.sweep(null);
    field.draw(ctx, 0.54, 0.016);
    expect(pulseStarts).toHaveLength(inFlight);
  });

  it("fires the nodes between two far-apart points of a fast drag", () => {
    const field = createSynapseField(800, 600, palette, { ...FIELD_DEFAULTS, emberClick: 0 }, seeded(5));
    const { ctx, pulseStarts } = recordingContext();
    field.draw(ctx, 0.5, 0.016);
    pulseStarts.length = 0;

    field.sweep({ x: 100, y: 300 });
    field.sweep({ x: 700, y: 300 });
    field.draw(ctx, 0.52, 0.016);
    const origins = new Set(pulseStarts.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`));
    expect(origins.size).toBeGreaterThanOrEqual(4);
  });

  it("ignores drag points past the field's edge", () => {
    const field = createSynapseField(800, 600, palette, { ...FIELD_DEFAULTS, emberClick: 0 }, seeded(5));
    const { ctx, pulseStarts } = recordingContext();
    field.draw(ctx, 0.5, 0.016);
    field.draw(ctx, 0.51, 0.016);
    pulseStarts.length = 0;
    field.draw(ctx, 0.52, 0.016);
    const inFlight = pulseStarts.length;

    for (let x = 100; x <= 700; x += 10) field.sweep({ x, y: 700 });
    pulseStarts.length = 0;
    field.draw(ctx, 0.53, 0.016);
    expect(pulseStarts).toHaveLength(inFlight);
  });
});

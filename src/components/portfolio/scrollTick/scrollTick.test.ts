import { describe, expect, it } from "vitest";
import { scrollTick } from "./scrollTick";

// Three items whose tops sit at 1000, 3000 and 5000 in an 800px viewport, so
// each takes over at 600, 2600 and 4600. Their markers are uneven heights,
// as timeline entries are.
const targets = [1000, 3000, 5000];
const markers = [
  { top: 0, bottom: 40 },
  { top: 60, bottom: 76 },
  { top: 96, bottom: 150 },
];
const at = (scroll: number) => scrollTick({ scroll, viewport: 800, maxScroll: 10_000, targets, markers });

describe("scrollTick", () => {
  it("spans the current marker and stretches toward the next one's bottom", () => {
    // A quarter of the way from 600 to 2600: the bottom is a quarter of the way from 40 to 76
    expect(at(1100)).toEqual({ index: 0, top: 0, bottom: 49 });
  });

  it("sits on the first marker, with no current item, above the first one", () => {
    expect(at(0)).toEqual({ index: -1, top: 0, bottom: 40 });
  });

  it("hands over at the next start with no jump in the bottom edge", () => {
    expect(at(2599).bottom).toBeCloseTo(76, 1);
    expect(at(2600)).toEqual({ index: 1, top: 60, bottom: 76 });
  });

  it("holds the last item on its own marker", () => {
    expect(at(9000)).toEqual({ index: 2, top: 96, bottom: 150 });
  });

  it("lets short items at the end of the page take over before it runs out", () => {
    // Neither of the last two tops can reach the middle of the viewport
    const input = { viewport: 800, maxScroll: 4000, targets: [1000, 4700, 4900], markers };
    expect(scrollTick({ ...input, scroll: 3999 }).index).toBe(1);
    expect(scrollTick({ ...input, scroll: 4000 }).index).toBe(2);
  });

  it("rests on the current marker for the held share of the span, then grows over the rest", () => {
    const held = (scroll: number) => scrollTick({ scroll, viewport: 800, maxScroll: 10_000, targets, markers, hold: 0.5 });
    // A quarter of the way from 600 to 2600 is inside the held half: no growth yet
    expect(held(1100)).toEqual({ index: 0, top: 0, bottom: 40 });
    // Three quarters of the way is halfway through the growing half: halfway from 40 to 76
    expect(held(2100)).toEqual({ index: 0, top: 0, bottom: 58 });
  });
});

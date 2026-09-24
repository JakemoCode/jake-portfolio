import { describe, expect, it } from "vitest";
import { railState } from "./railState";

// Sections at 1000, 3000 and 5000 in an 800px viewport start at 600, 2600 and 4600
const at = (scroll: number) => railState(scroll, [1000, 3000, 5000], 800, 10_000);

describe("railState", () => {
  it("has no current section above the first one", () => {
    expect(at(0)).toEqual({ index: -1, progress: 0 });
  });

  it("measures progress toward the next section's start", () => {
    expect(at(1100)).toEqual({ index: 0, progress: 0.25 });
  });

  it("hands over at the next start with no gap", () => {
    expect(at(2599).progress).toBeCloseTo(0.9995);
    expect(at(2600)).toEqual({ index: 1, progress: 0 });
  });

  it("holds the last section at its starting size", () => {
    expect(at(9000)).toEqual({ index: 2, progress: 0 });
  });

  it("lets short sections at the end of the page take over before it runs out", () => {
    // Neither of the last two tops can reach the middle of the viewport
    const tops = [1000, 4700, 4900];
    expect(railState(3999, tops, 800, 4000).index).toBe(1);
    expect(railState(4000, tops, 800, 4000).index).toBe(2);
  });
});

import { describe, it, expect } from "vitest";
import { neighborSet } from "./previewLayers";

describe("neighborSet", () => {
  it("includes the active index and its immediate neighbours", () => {
    expect([...neighborSet(1, 4)].sort()).toEqual([0, 1, 2]);
  });

  it("clamps at the start", () => {
    expect([...neighborSet(0, 4)].sort()).toEqual([0, 1]);
  });

  it("clamps at the end", () => {
    expect([...neighborSet(3, 4)].sort()).toEqual([2, 3]);
  });

  it("handles a single item", () => {
    expect([...neighborSet(0, 1)]).toEqual([0]);
  });
});

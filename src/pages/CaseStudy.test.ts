import { describe, it, expect } from "vitest";
import { sectionId } from "./CaseStudy";

describe("sectionId", () => {
  it("slugifies ordinary headings", () => {
    expect(sectionId("Prompts became a design system", 0)).toBe("prompts-became-a-design-system");
  });

  it("strips punctuation without leaving stray dashes", () => {
    expect(sectionId("The problem was consistency, not quality", 1)).toBe(
      "the-problem-was-consistency-not-quality",
    );
  });

  it("falls back to position when a heading has no ASCII alphanumerics", () => {
    // Without the fallback every such heading collapses to the same empty id,
    // so the anchors collide and none of them scroll anywhere.
    expect(sectionId("設計システム", 4)).toBe("section-5");
    expect(sectionId("★", 0)).toBe("section-1");
  });

  it("never returns an empty or dash-only id", () => {
    for (const h of ["", "---", "!!!", "Café", "設計システム", "A"]) {
      const id = sectionId(h, 0);
      expect(id).not.toBe("");
      expect(id).not.toMatch(/^-+$/);
    }
  });
});

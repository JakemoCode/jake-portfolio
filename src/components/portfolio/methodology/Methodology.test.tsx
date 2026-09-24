import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { methodologyHabits } from "../../../content/methodology";
import { minimapHeadingLines } from "../../../content/methodologyMinimap";
import { Methodology } from "./Methodology";

afterEach(cleanup);

describe("Methodology", () => {
  it("places every habit's mark on its own heading in the evidence doc", () => {
    const headings = methodologyHabits.map((habit) => habit.docHeading);
    for (const heading of headings) expect(minimapHeadingLines[heading], heading).toBeTypeOf("number");
    expect(new Set(headings).size).toBe(headings.length);
  });

  it("links every index entry to a habit article on the page", () => {
    const { container } = render(<Methodology />);
    const index = screen.getByRole("navigation", { name: "The seven habits" });
    const links = within(index).getAllByRole("link");
    expect(links).toHaveLength(methodologyHabits.length);
    for (const link of links) {
      const id = link.getAttribute("href")!.slice(1);
      const article = container.querySelector(`article#${id}`);
      expect(article, id).not.toBeNull();
      expect(within(article as HTMLElement).getByRole("heading", { level: 3 }).textContent).toBe(
        link.textContent,
      );
    }
  });

  it("keeps the heading order section, then habit", () => {
    render(<Methodology />);
    expect(screen.getByRole("heading", { level: 2, name: "How I work with AI" })).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(methodologyHabits.length);
  });
});

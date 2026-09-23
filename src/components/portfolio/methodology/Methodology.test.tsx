import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { methodologyActs } from "../../../content/methodology";
import { minimapThemeLines } from "../../../content/methodologyMinimap";
import { Methodology } from "./Methodology";

const themes = methodologyActs.flatMap((act) => act.themes);

afterEach(cleanup);

describe("Methodology", () => {
  it("covers each of the fifteen themes in the evidence doc exactly once", () => {
    const numbers = themes.map((theme) => theme.docNumber).sort((a, b) => a - b);
    expect(numbers).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
    for (const n of numbers) expect(minimapThemeLines[n]).toBeTypeOf("number");
  });

  it("links every index entry to a habit article on the page", () => {
    const { container } = render(<Methodology />);
    const index = screen.getByRole("navigation", { name: "The fifteen habits" });
    const links = within(index).getAllByRole("link");
    expect(links).toHaveLength(15);
    for (const link of links) {
      const id = link.getAttribute("href")!.slice(1);
      const article = container.querySelector(`article#${id}`);
      expect(article, id).not.toBeNull();
      expect(within(article as HTMLElement).getByRole("heading", { level: 4 }).textContent).toBe(
        link.textContent,
      );
    }
  });

  it("keeps the heading order section, act, habit", () => {
    render(<Methodology />);
    expect(screen.getByRole("heading", { level: 2, name: "How I work with AI" })).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(methodologyActs.length);
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(15);
  });
});

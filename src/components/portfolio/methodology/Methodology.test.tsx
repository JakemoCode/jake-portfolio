import { act, cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { methodologyHabits } from "../../../content/methodology";
import { minimapHeadingLines } from "../../../content/methodologyMinimap";
import { fakeLayout, scrollTo } from "../scrollTick/fakeLayout";
import { Methodology } from "./Methodology";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const titles = methodologyHabits.map((habit) => habit.title);

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
      const article = container.querySelector(`#${id}`)?.closest("article");
      expect(article, id).toBeTruthy();
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

  it("puts the habit in the middle of the viewport on the evidence stage", async () => {
    // Each habit's copy starts 2000px below the last, so in an 800px viewport
    // they take over at 600, 2600, 4600 and so on
    fakeLayout(
      Object.fromEntries(
        methodologyHabits.map(({ slug }, i) => [slug, { top: 1000 + i * 2000, bottom: 2500 + i * 2000 }]),
      ),
      { height: 20_000 },
    );
    render(<Methodology />);
    const strip = screen.getByRole("navigation", { name: "Jump to a habit" });
    const current = () =>
      within(strip)
        .getAllByRole("link")
        .filter((link) => link.getAttribute("aria-current") === "step")
        .map((link) => link.textContent);
    const places = () => screen.getAllByRole("figure").map((figure) => figure.parentElement!.dataset.place);

    // Above the first habit, it is already on stage
    expect(current()).toEqual([titles[0]]);
    expect(places()).toEqual(["active", "next", "next", "next", "next", "next", "next"]);

    await act(() => scrollTo(2700));
    expect(current()).toEqual([titles[1]]);
    expect(places()).toEqual(["past", "active", "next", "next", "next", "next", "next"]);

    // A jump back up hands the stage back
    await act(() => scrollTo(700));
    expect(current()).toEqual([titles[0]]);
    expect(places()[1]).toBe("next");
  });

  it("names each mark on the stage's strip after the habit it jumps to", () => {
    render(<Methodology />);
    const strip = screen.getByRole("navigation", { name: "Jump to a habit" });
    const links = within(strip).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(titles);
    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      methodologyHabits.map(({ slug }) => `#${slug}`),
    );
  });
});

import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { Portfolio } from "./Portfolio";

afterEach(cleanup);

const renderPage = () =>
  render(
    <MemoryRouter>
      <Portfolio />
    </MemoryRouter>,
  );

describe("Portfolio", () => {
  it("links every rail entry to a section on the page, in page order", () => {
    const { container } = renderPage();
    const rail = screen.getByRole("navigation", { name: "On this page" });
    const targets = within(rail)
      .getAllByRole("link")
      .map((link) => container.querySelector(link.getAttribute("href")!));

    expect(targets).toHaveLength(6);
    targets.forEach((target, i) => {
      expect(target, `rail entry ${i}`).not.toBeNull();
      const previous = targets[i - 1];
      if (previous) {
        expect(previous.compareDocumentPosition(target!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      }
    });
  });

  it("gives each rail section a top-level heading", () => {
    renderPage();
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(
      expect.arrayContaining(["Experience", "How I work with AI", "What I build", "Tools I recommend"]),
    );
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

// jsdom has no scrolling, so record where each page was asked to open
let scrolledTo: string[] = [];
beforeEach(() => {
  scrolledTo = [];
  Element.prototype.scrollIntoView = function (this: Element) {
    scrolledTo.push(this.id);
  };
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  delete (Element.prototype as Partial<Element>).scrollIntoView;
});

// BrowserRouter reads the real location, so each test starts from a URL
const visit = (url: string) => {
  window.history.replaceState(null, "", url);
  render(<App />);
};

describe("routes", () => {
  it("serves the portfolio at the root", () => {
    visit("/");
    expect(screen.getByRole("navigation", { name: "On this page" })).toBeTruthy();
  });

  it("sends the old /portfolio address to the root, keeping the section", () => {
    visit("/portfolio#experience");
    expect(window.location.pathname).toBe("/");
    expect(window.location.hash).toBe("#experience");
    expect(screen.getByRole("navigation", { name: "On this page" })).toBeTruthy();
  });

  it("opens a deep link at its section rather than the top of the page", () => {
    visit("/portfolio#experience");
    expect(scrolledTo).toEqual(["experience"]);
  });

  it("serves the client landing at /mosher-web-dev, linking back to the portfolio", () => {
    visit("/mosher-web-dev");
    expect(screen.getByRole("link", { name: "Engineering portfolio" }).getAttribute("href")).toBe("/");
    expect(document.title).toBe("Jake Mosher · Crafted websites");
  });
});

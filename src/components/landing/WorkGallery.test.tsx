import { describe, it, expect, afterEach, beforeAll, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { WorkGallery } from "./WorkGallery";
import { work } from "../../content/work";

beforeAll(() => {
  // jsdom doesn't implement media playback; stub so hover handlers are no-ops.
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(cleanup);

describe("WorkGallery", () => {
  it("renders every site as a link to its live URL, opening in a new tab", () => {
    render(<WorkGallery />);
    for (const site of work) {
      const link = screen.getByRole("link", { name: new RegExp(`Visit ${site.name}`, "i") });
      expect(link.getAttribute("href")).toBe(site.url);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    }
  });

  it("labels each tile with the business name and its industry tag", () => {
    render(<WorkGallery />);
    for (const site of work) {
      expect(screen.getByRole("heading", { name: site.name })).toBeTruthy();
      expect(screen.getAllByText(site.tag).length).toBeGreaterThan(0);
    }
  });

  it("plays the hero on hover and pauses on leave", () => {
    render(<WorkGallery />);
    const link = screen.getByRole("link", { name: new RegExp(`Visit ${work[0]!.name}`, "i") });
    fireEvent.mouseEnter(link);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    fireEvent.mouseLeave(link);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });
});

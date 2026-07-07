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
      const link = screen.getByRole("link", { name: new RegExp(site.name, "i") });
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
    // jsdom can't apply :hover CSS, so play()/pause() firing is the
    // observable proxy for the reveal — prove it's the mouseEnter handler
    // (not mount) that triggers it by clearing the spy and checking first.
    vi.mocked(HTMLMediaElement.prototype.play).mockClear();
    render(<WorkGallery />);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();

    const link = screen.getByRole("link", { name: new RegExp(work[0]!.name, "i") });
    fireEvent.mouseEnter(link);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    fireEvent.mouseLeave(link);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it("on a no-hover device, tapping the frame plays the hero (reveal on) instead of navigating", () => {
    const original = window.matchMedia;
    // Query-aware: the no-hover gate matches, reduced-motion doesn't (video renders).
    window.matchMedia = ((q: string) => ({
      matches: q.includes("hover: none"),
      media: q,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
    try {
      render(<WorkGallery />);
      const site = work[0]!;
      const link = screen.getByRole("link", { name: new RegExp(site.name, "i") });
      vi.mocked(HTMLMediaElement.prototype.play).mockClear();

      // The host label lives inside the frame; clicking it bubbles to the tap
      // handler. fireEvent.click returns false when the event's default was
      // prevented — i.e. the tile link would NOT navigate.
      const proceeded = fireEvent.click(screen.getByText(site.host));

      expect(proceeded).toBe(false); // navigation suppressed
      expect(link.getAttribute("data-playing")).toBe("true"); // reveal on
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalled(); // hero plays
    } finally {
      window.matchMedia = original;
    }
  });
});

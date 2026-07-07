import { describe, it, expect, afterEach, beforeAll, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ResponsivePreview } from "./ResponsivePreview";
import type { Demo } from "../../content/demos";

beforeAll(() => {
  // jsdom doesn't implement media playback; stub so the sync engine is a no-op.
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(cleanup);

const demo: Demo = {
  clientId: "x",
  label: "Test Co",
  url: "https://example.com/",
  alt: "A test site adapting across widths.",
  layers: [
    { key: "desktop", label: "Desktop", webm: "d.webm", poster: "d.jpg" },
    { key: "tablet", label: "Tablet", webm: "t.webm", poster: "t.jpg" },
    { key: "mobile", label: "Mobile", webm: "m.webm", poster: "m.jpg" },
  ],
};

describe("ResponsivePreview", () => {
  it("starts on desktop and reports its emulated width", () => {
    render(<ResponsivePreview demo={demo} />);
    expect(screen.getByRole("button", { name: "Desktop" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText(/1280px/)).toBeTruthy();
  });

  it("switches device (and reported width) when a size pill is clicked", () => {
    render(<ResponsivePreview demo={demo} />);
    fireEvent.click(screen.getByRole("button", { name: "Mobile" }));
    expect(screen.getByRole("button", { name: "Mobile" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Desktop" }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByText(/390px/)).toBeTruthy();
  });
});

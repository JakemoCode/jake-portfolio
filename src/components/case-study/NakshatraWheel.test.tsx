import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { NakshatraWheel } from "./NakshatraWheel";
import { nakshatras } from "../../content/nakshatras";

// vitest runs without `globals`, so RTL's auto-cleanup never registers and the
// DOM would accumulate across tests. No jest-dom either, so plain assertions.
afterEach(cleanup);

describe("NakshatraWheel", () => {
  it("renders one glyph per nakshatra", () => {
    const { container } = render(<NakshatraWheel />);
    expect(nakshatras).toHaveLength(27);
    expect(container.querySelectorAll("svg[viewBox='0 0 64 64']")).toHaveLength(27);
  });

  it("starts idle, inviting a spin", () => {
    render(<NakshatraWheel />);
    const button = screen.getByRole("button");
    expect(button.textContent).toBe("Spin the wheel");
    expect((button as HTMLButtonElement).disabled).toBe(false);
  });

  it("exposes the result region to assistive tech before anything lands", () => {
    const { container } = render(<NakshatraWheel />);
    const live = container.querySelector("[aria-live='polite']");
    expect(live).toBeTruthy();
    expect(live?.textContent).toMatch(/lands where you stopped it/i);
  });

  it("labels the wheel itself", () => {
    render(<NakshatraWheel />);
    expect(screen.getByRole("img", { name: /27 nakshatras/i })).toBeTruthy();
  });

  it("survives an environment without matchMedia", () => {
    const original = window.matchMedia;
    // @ts-expect-error deliberately removing it to prove the guard holds
    delete window.matchMedia;
    expect(() => render(<NakshatraWheel />)).not.toThrow();
    window.matchMedia = original;
  });
});

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
    // Keyed on the mechanic, not the sentence: copy gets revised, the
    // requirement (tell the user the wheel lands where they stop it) does not.
    expect(live?.textContent?.trim()).not.toBe("");
    expect(live?.textContent).toMatch(/stop/i);
  });

  it("labels the wheel itself", () => {
    render(<NakshatraWheel />);
    expect(screen.getByRole("img", { name: /27 nakshatras/i })).toBeTruthy();
  });

  it("does not fetch any painting before the wheel is used", () => {
    const { container } = render(<NakshatraWheel />);
    // The 27 paintings are pulled one at a time during the slow-down, so a
    // reader who never spins pays nothing for them.
    const srcs = [...container.querySelectorAll("img")].map((i) => i.getAttribute("src") ?? "");
    expect(srcs.some((s) => s.includes("/case-study/nakshatra/"))).toBe(false);
  });

  it("shows no reveal until something has landed", () => {
    const { container } = render(<NakshatraWheel />);
    expect(container.querySelector("[class*='reveal']")).toBeNull();
  });

  it("survives an environment without matchMedia", () => {
    const original = window.matchMedia;
    // @ts-expect-error deliberately removing it to prove the guard holds
    delete window.matchMedia;
    expect(() => render(<NakshatraWheel />)).not.toThrow();
    window.matchMedia = original;
  });
});

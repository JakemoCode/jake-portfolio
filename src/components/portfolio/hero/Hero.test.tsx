import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Hero } from "./Hero";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const props = {
  name: "Jake Mosher",
  title: "Front-end and product engineer.",
  availability: { status: "Open to front-end roles", detail: ["Seven years"] },
  resume: "/jake-mosher-resume.pdf",
  next: { href: "#how-i-work", label: "Start with how I work with AI" },
  email: "jake@jakemosher.dev",
  github: "https://github.com/JakemoCode",
  linkedin: "https://www.linkedin.com/in/the-real-jake-mosher/",
};

const stubReducedMotion = (reduce: boolean) =>
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query.includes("reduce"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));

describe("Hero", () => {
  it("starts the field paused for visitors who ask for reduced motion", () => {
    stubReducedMotion(true);
    render(<Hero {...props} />);
    expect(screen.getByRole("button").textContent).toBe("Play animation");
  });

  it("lets anyone stop the field, since it moves for longer than five seconds (WCAG 2.2.2)", () => {
    stubReducedMotion(false);
    render(<Hero {...props} />);
    const toggle = screen.getByRole("button", { name: "Pause animation" });
    fireEvent.click(toggle);
    expect(toggle.textContent).toBe("Play animation");
  });
});

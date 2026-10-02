import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HeroSeries } from "./HeroSeries";

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
});

const props = {
  name: "Jake Mosher",
  title: "Front-end engineer. I hold code to a standard: review, tests, and rules.",
  availability: { status: "Open to roles", detail: ["Seven years", "US Mountain Time"] },
  resume: "/resume.pdf",
  email: "jake@example.com",
  github: "https://github.com/example",
  linkedin: "https://linkedin.com/in/example",
  next: { href: "#experience", label: "Start with where I've worked" },
};

const moar = () => screen.getByRole("button", { name: /^Show hero version/ });

describe("HeroSeries", () => {
  it("steps to the next version with MOAR! and remembers it in the address", () => {
    render(<HeroSeries {...props} />);
    expect(moar().textContent).toContain("Show hero version 2 of 2");

    fireEvent.click(moar());

    expect(new URLSearchParams(window.location.search).get("hero")).toBe("2");
    expect(moar().textContent).toContain("Show hero version 1 of 2");
    // Every version keeps the name as the page's one top-level heading
    expect(screen.getByRole("heading", { level: 1, name: "Jake Mosher" })).toBeTruthy();
  });

  it("opens on the version named in the address, and on the first for anything else", () => {
    window.history.replaceState(null, "", "/?hero=2");
    render(<HeroSeries {...props} />);
    // The last version wraps back to the first
    expect(moar().textContent).toContain("Show hero version 1 of 2");
    cleanup();

    window.history.replaceState(null, "", "/?hero=9");
    render(<HeroSeries {...props} />);
    expect(moar().textContent).toContain("Show hero version 2 of 2");
  });
});

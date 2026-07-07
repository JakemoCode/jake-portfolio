import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Sprints } from "./Sprints";
import { AUDIT, FIXES, FEATURE } from "../../content/offers";

// This project's vitest config doesn't set `globals`, so RTL's automatic
// afterEach cleanup never registers — unmount explicitly between tests.
afterEach(cleanup);

describe("Sprints", () => {
  it("renders every offer in the ladder", () => {
    render(<Sprints />);
    for (const name of [AUDIT.name, FEATURE.name, ...FIXES.map((o) => o.name)]) {
      expect(screen.getByRole("heading", { name })).toBeTruthy();
    }
  });

  it("shows the audit as the fixed-price entry point, credited", () => {
    render(<Sprints />);
    expect(screen.getByText("$497")).toBeTruthy();
    expect(screen.getByText("credited toward any fix")).toBeTruthy();
  });

  it("prices the feature sprint from $1,200 (never below a full site)", () => {
    render(<Sprints />);
    expect(screen.getByText("$1,200")).toBeTruthy();
    expect(screen.getAllByText("from").length).toBeGreaterThan(0);
  });

  it("keeps the audit-gated fixes free of a flat price", () => {
    render(<Sprints />);
    // Both Rescue and Conversion Tune-Up defer pricing to the audit (§5).
    expect(screen.getAllByText("Quoted after your audit").length).toBe(
      FIXES.length,
    );
  });
});

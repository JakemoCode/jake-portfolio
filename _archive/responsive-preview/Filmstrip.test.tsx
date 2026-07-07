import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Filmstrip } from "./Filmstrip";

afterEach(cleanup);

const items = [
  { id: "a", name: "Arbor Gymnastics" },
  { id: "b", name: "Jyotish Tarot" },
];

describe("Filmstrip", () => {
  it("renders every item and marks the active one", () => {
    render(<Filmstrip items={items} activeIndex={0} onSelect={() => {}} label="Sites" />);
    expect(
      screen.getByRole("button", { name: /Arbor Gymnastics/ }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      screen.getByRole("button", { name: /Jyotish Tarot/ }).getAttribute("aria-pressed"),
    ).toBe("false");
  });

  it("calls onSelect with the clicked index", () => {
    const onSelect = vi.fn();
    render(<Filmstrip items={items} activeIndex={0} onSelect={onSelect} label="Sites" />);
    fireEvent.click(screen.getByRole("button", { name: /Jyotish Tarot/ }));
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});

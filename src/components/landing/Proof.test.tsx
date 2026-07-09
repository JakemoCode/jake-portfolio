import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, within, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Proof } from "./Proof";
import { testimonials } from "../../content/testimonials";

// This project's Vitest config doesn't enable `globals`, so RTL's automatic
// per-test cleanup isn't registered — unmount explicitly between tests.
afterEach(cleanup);

function renderProof() {
  return render(
    <MemoryRouter>
      <Proof />
    </MemoryRouter>,
  );
}

describe("Proof", () => {
  it("starts on the first testimonial", () => {
    renderProof();
    expect(within(screen.getByRole("article")).getByText(testimonials[0]!.name)).toBeTruthy();
  });

  it("advances to the next testimonial with the next arrow", () => {
    renderProof();
    fireEvent.click(screen.getByRole("button", { name: "Next testimonial" }));
    expect(within(screen.getByRole("article")).getByText(testimonials[1]!.name)).toBeTruthy();
  });

  it("wraps from the last testimonial back to the first via next", () => {
    renderProof();
    const next = screen.getByRole("button", { name: "Next testimonial" });
    // Walk to the last testimonial, then one more click wraps back to the first.
    for (let i = 0; i < testimonials.length - 1; i++) fireEvent.click(next);
    fireEvent.click(next);
    expect(within(screen.getByRole("article")).getByText(testimonials[0]!.name)).toBeTruthy();
  });

  it("wraps from the first testimonial to the last via prev", () => {
    renderProof();
    fireEvent.click(screen.getByRole("button", { name: "Previous testimonial" }));
    expect(within(screen.getByRole("article")).getByText(testimonials[testimonials.length - 1]!.name)).toBeTruthy();
  });

  it("toggles the mobile read-more control on the quote", () => {
    renderProof();
    const toggle = screen.getByRole("button", { name: "Read more" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Read less" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("no longer renders the retired Kelly testimonial", () => {
    renderProof();
    expect(screen.queryByText(/Kelly Mosher/)).toBeNull();
  });
});

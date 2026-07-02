import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, within, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Proof } from "./Proof";

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
    expect(within(screen.getByRole("article")).getByText("Morgan Berry")).toBeTruthy();
  });

  it("advances to the next testimonial with the next arrow", () => {
    renderProof();
    fireEvent.click(screen.getByRole("button", { name: "Next testimonial" }));
    expect(within(screen.getByRole("article")).getByText("Debora Bowley")).toBeTruthy();
  });

  it("wraps from the last testimonial back to the first via next", () => {
    renderProof();
    const next = screen.getByRole("button", { name: "Next testimonial" });
    fireEvent.click(next); // → Debora (last of two)
    fireEvent.click(next); // wraps → Morgan
    expect(within(screen.getByRole("article")).getByText("Morgan Berry")).toBeTruthy();
  });

  it("wraps from the first testimonial to the last via prev", () => {
    renderProof();
    fireEvent.click(screen.getByRole("button", { name: "Previous testimonial" }));
    expect(within(screen.getByRole("article")).getByText("Debora Bowley")).toBeTruthy();
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

  it("relocates the engineering link to /portfolio", () => {
    renderProof();
    const link = screen.getByRole("link", { name: /engineering side of my work/ });
    expect(link.getAttribute("href")).toBe("/portfolio");
  });

  it("no longer renders the retired Kelly testimonial", () => {
    renderProof();
    expect(screen.queryByText(/Kelly Mosher/)).toBeNull();
  });
});

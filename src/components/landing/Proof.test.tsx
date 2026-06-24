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
  it("lists every client in the filmstrip", () => {
    renderProof();
    expect(screen.getByRole("button", { name: /Arbor Gymnastics/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Jyotish Tarot/ })).toBeTruthy();
  });

  it("starts on the first client and exposes only its testimonial", () => {
    renderProof();
    expect(
      screen.getByRole("button", { name: /Arbor Gymnastics/ }).getAttribute("aria-pressed"),
    ).toBe("true");
    // inactive slides are aria-hidden, so only the active one is in the a11y tree
    const active = screen.getByRole("article");
    expect(within(active).getByText("Morgan Berry")).toBeTruthy();
  });

  it("switches the spotlight when another client is chosen", () => {
    renderProof();
    fireEvent.click(screen.getByRole("button", { name: /Jyotish Tarot/ }));

    expect(
      screen.getByRole("button", { name: /Jyotish Tarot/ }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      screen.getByRole("button", { name: /Arbor Gymnastics/ }).getAttribute("aria-pressed"),
    ).toBe("false");
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

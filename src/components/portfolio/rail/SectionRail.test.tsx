import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fakeLayout, scrollTo } from "../scrollTick/fakeLayout";
import { SectionRail } from "./SectionRail";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const sections = [
  { id: "one", label: "One" },
  { id: "two", label: "Two" },
  { id: "three", label: "Three" },
];

describe("SectionRail", () => {
  it("marks the section in view and stretches the tick toward the next entry", async () => {
    // Sections at 1000, 3000 and 5000 in an 800px viewport take over at 600,
    // 2600 and 4600. The labels are the tick's markers, in track coordinates;
    // the track sits at the top of the page, so page and track coincide.
    fakeLayout(
      {
        one: { top: 1000, bottom: 2900 },
        two: { top: 3000, bottom: 4900 },
        three: { top: 5000, bottom: 6000 },
        One: { top: 8, bottom: 24 },
        Two: { top: 44, bottom: 60 },
        Three: { top: 80, bottom: 96 },
      },
      { height: 20_000 },
    );
    render(
      <>
        <SectionRail sections={sections} />
        {sections.map(({ id }) => (
          <div key={id} id={id} />
        ))}
      </>,
    );

    await act(() => scrollTo(1750));

    expect(screen.getByRole("link", { name: "One" }).getAttribute("aria-current")).toBe("location");
    const tick = document.querySelector<HTMLElement>("nav span[aria-hidden]")!;
    // 57.5% of the way from 600 to 2600. The rail rests for the first 15%, so
    // that is halfway through the growing part: halfway from 24 to 60
    expect(tick.style.getPropertyValue("--tick-top")).toBe("8px");
    expect(tick.style.getPropertyValue("--tick-bottom")).toBe("42px");
  });
});

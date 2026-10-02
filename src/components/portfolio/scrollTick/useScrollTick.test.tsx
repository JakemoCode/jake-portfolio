import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fakeLayout, scrollTo } from "./fakeLayout";
import { useScrollTick } from "./useScrollTick";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const items = ["a", "b", "c"];

/** A horizontal track of three markers, one per target section */
function Strip() {
  const { trackRef, tickRef, markerRef, tickClassName } = useScrollTick({
    targets: () => items.map((id) => document.getElementById(id)),
    hold: 0.15,
    axis: "x",
  });
  return (
    <>
      <div ref={trackRef} id="track">
        {items.map((id, i) => (
          <span key={id} ref={markerRef(i)}>{`mark ${id}`}</span>
        ))}
        <span ref={tickRef} className={tickClassName} data-testid="tick" />
      </div>
      {items.map((id) => (
        <div key={id} id={id} />
      ))}
    </>
  );
}

describe("useScrollTick on the x axis", () => {
  it("measures markers left to right from the track's left edge", async () => {
    // Same scroll geometry as the rail's test; the markers sit side by side
    // on a track that starts 100px in
    fakeLayout(
      {
        a: { top: 1000, bottom: 2900 },
        b: { top: 3000, bottom: 4900 },
        c: { top: 5000, bottom: 6000 },
        track: { top: 0, bottom: 0, left: 100, right: 400 },
        "mark a": { top: 0, bottom: 0, left: 108, right: 124 },
        "mark b": { top: 0, bottom: 0, left: 144, right: 160 },
        "mark c": { top: 0, bottom: 0, left: 180, right: 196 },
      },
      { height: 20_000 },
    );
    const { getByTestId } = render(<Strip />);

    await act(() => scrollTo(1750));

    // Halfway through the growing part, so halfway from mark a's right edge
    // to mark b's, in track coordinates
    const tick = getByTestId("tick");
    expect(tick.style.getPropertyValue("--tick-start")).toBe("8px");
    expect(tick.style.getPropertyValue("--tick-end")).toBe("42px");
  });
});

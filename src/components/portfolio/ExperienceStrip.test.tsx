import { act, cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fakeLayout, scrollTo } from "./scrollTick/fakeLayout";
import { ExperienceStrip } from "./ExperienceStrip";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ExperienceStrip", () => {
  it("lists every stretch of work newest first, each with its dates", () => {
    render(<ExperienceStrip />);
    // The stints are the outer list's items; each has its own list of details
    const [timeline] = screen.getAllByRole("list");
    const stints = [...timeline!.children] as HTMLElement[];

    // From the résumé and the family-leave dates Jake confirmed
    expect(stints.map((stint) => within(stint).getByRole("heading", { level: 3 }).textContent)).toEqual([
      "Mosher Web Development",
      "Family leave",
      "Handshake",
      "Demoflow",
      "Uplight (Simple Energy)",
    ]);
    expect(within(stints[1]!).getByText("Oct 2025 to Apr 2026")).toBeTruthy();
    expect(within(stints[2]!).getByText("Jan 2022 to Oct 2025")).toBeTruthy();
    expect(within(stints[0]!).getByText(/solo, freelance/i)).toBeTruthy();
  });

  it("puts each stint's dates after its title, so read as text they belong to it", () => {
    render(<ExperienceStrip />);
    const [timeline] = screen.getAllByRole("list");
    // Two reviewers read the leave's dates as the stint above's when the dates came first
    for (const stint of [...timeline!.children] as HTMLElement[]) {
      const title = within(stint).getByRole("heading", { level: 3 });
      const period = within(stint).getByText(/\d{4}/, { selector: "p" });
      expect(title.compareDocumentPosition(period) & Node.DOCUMENT_POSITION_FOLLOWING, title.textContent!).toBeTruthy();
    }
  });

  it("stretches the tick from the current stint's title toward the next one", async () => {
    // Titles at 1000, 1200 and so on, in an 800px viewport, take over at 600,
    // 800, 1000, 1200 and 1400. The track sits at the top of the page, so
    // page and track coordinates coincide.
    fakeLayout(
      {
        "Mosher Web Development": { top: 1000, bottom: 1030 },
        "Family leave": { top: 1200, bottom: 1230 },
        Handshake: { top: 1400, bottom: 1430 },
        Demoflow: { top: 1600, bottom: 1630 },
        "Uplight (Simple Energy)": { top: 1800, bottom: 1830 },
      },
      { height: 20_000 },
    );
    render(<ExperienceStrip />);

    await act(() => scrollTo(935));

    // 67.5% of the way from 800 to 1000. The strip rests for the first 35%, so
    // that is halfway through the growing part: halfway from Family leave's
    // 1230 to Handshake's 1430
    const tick = document.querySelector<HTMLElement>("section span[aria-hidden]")!;
    expect(tick.style.getPropertyValue("--tick-top")).toBe("1200px");
    expect(tick.style.getPropertyValue("--tick-bottom")).toBe("1330px");
  });
});

import { vi } from "vitest";

/* Fakes the one thing jsdom can't do, layout, at the browser boundary: element
   boxes, the scroll position, and the page height. Boxes are looked up by an
   element's id or its text, so a test names them the way a reader would. */
export function fakeLayout(boxes: Record<string, { top: number; bottom: number }>, page: { height: number }) {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    const box = boxes[this.id] ?? boxes[this.textContent?.trim() ?? ""] ?? { top: 0, bottom: 0 };
    return { top: box.top - window.scrollY, bottom: box.bottom - window.scrollY } as DOMRect;
  });
  Object.defineProperty(document.documentElement, "scrollHeight", { value: page.height, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
}

/** Scrolls to a position and waits for the frame the tick updates on. */
export async function scrollTo(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  window.dispatchEvent(new Event("scroll"));
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

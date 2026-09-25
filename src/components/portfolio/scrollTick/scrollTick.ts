/* Where a scroll tick sits: which item the reader is in, and the span the tick
   covers on its track. Free of the DOM so it can be tested. */

export type Span = { top: number; bottom: number };
export type TickInput = {
  scroll: number;
  viewport: number;
  maxScroll: number;
  /** Each item's top, in page coordinates. */
  targets: number[];
  /** Each item's marker on the track, in track coordinates. */
  markers: Span[];
  /** Share of each item's span (0 to 1) the tick rests before it grows. */
  hold?: number;
};
export type Tick = { index: number } & Span;

export function scrollTick({ scroll, viewport, maxScroll, targets, markers, hold = 0 }: TickInput): Tick {
  // An item takes over when its top reaches the middle of the viewport. One
  // that can't get that high (a short last one) takes over at the end of the
  // page, and walking back from the end keeps every start before the next, so
  // each item is reachable.
  const starts = targets.map((top) => Math.min(top - viewport / 2, maxScroll));
  for (let i = starts.length - 2; i >= 0; i--) starts[i] = Math.min(starts[i]!, starts[i + 1]! - 1);

  const index = starts.filter((start) => scroll >= start).length - 1;
  const marker = markers[Math.max(index, 0)] ?? { top: 0, bottom: 0 };
  const start = starts[index];
  const next = starts[index + 1];
  const nextMarker = markers[index + 1];
  if (start === undefined || next === undefined || !nextMarker) return { index, ...marker };

  // Progress runs to the next item's start, not this one's bottom, so the tick
  // reaches the next marker at the moment that item takes over
  const through = Math.min(1, (scroll - start) / (next - start));
  const progress = Math.max(0, (through - hold) / (1 - hold));
  return { index, top: marker.top, bottom: marker.bottom + progress * (nextMarker.bottom - marker.bottom) };
}

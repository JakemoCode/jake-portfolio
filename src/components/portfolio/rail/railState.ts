/* Which section the reader is in, and how far through it. Free of the DOM so
   it can be tested. */

export type RailState = { index: number; progress: number };

export function railState(scroll: number, tops: number[], viewport: number, maxScroll: number): RailState {
  // A section takes over when its top reaches the middle of the viewport. One
  // that can't get that high (the short last one) takes over at the end of the
  // page, and walking back from the end keeps every start before the next, so
  // each section is reachable.
  const starts = tops.map((top) => Math.min(top - viewport / 2, maxScroll));
  for (let i = starts.length - 2; i >= 0; i--) starts[i] = Math.min(starts[i]!, starts[i + 1]! - 1);

  const index = starts.filter((start) => scroll >= start).length - 1;
  const start = starts[index];
  const next = starts[index + 1];
  // Progress runs to the next section's start, not this one's bottom, so it
  // reaches 1 at the moment the next section takes over
  if (start === undefined || next === undefined) return { index, progress: 0 };
  return { index, progress: Math.min(1, (scroll - start) / (next - start)) };
}

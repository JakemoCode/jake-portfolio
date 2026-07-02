/** The active layer plus its immediate neighbours — the set kept playing so a
 *  crossfade to an adjacent breakpoint has a warm, already-running target. */
export function neighborSet(active: number, count: number): Set<number> {
  const set = new Set<number>();
  for (let d = -1; d <= 1; d++) {
    const i = active + d;
    if (i >= 0 && i < count) set.add(i);
  }
  return set;
}

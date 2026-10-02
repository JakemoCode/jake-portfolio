// A project card's media well: the hero's dark teal atmosphere with a still of
// its synaptic field behind the work. Each card's network is seeded by its
// slug, so it is its own and never changes between visits. On a mouse the
// glow leans toward the pointer and the nodes near it light up, the way the
// hero's nodes brighten under the cursor.
import type { PointerEvent, ReactNode } from "react";
import styles from "./FieldWell.module.css";

const WIDTH = 480;
const HEIGHT = 900;
const GAP = 90; // the hero's spacing between nodes, in CSS px at the well's usual size
const JITTER = 0.7; // how far a node strays from its grid point, as a share of GAP
const REACH = 1.5; // link any two nodes closer than GAP × this
const LARGE_ODDS = 0.15;

/** FNV-1a into mulberry32: the same seed always draws the same network */
function seededRandom(seed: string) {
  let state = 2166136261;
  for (const char of seed) state = Math.imul(state ^ char.charCodeAt(0), 16777619);
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawNetwork(seed: string) {
  const random = seededRandom(seed);
  const nodes: Array<{ x: number; y: number; large: boolean }> = [];
  for (let y = -GAP / 2; y < HEIGHT + GAP; y += GAP) {
    for (let x = -GAP / 2; x < WIDTH + GAP; x += GAP) {
      nodes.push({
        x: x + (random() - 0.5) * GAP * JITTER,
        y: y + (random() - 0.5) * GAP * JITTER,
        large: random() < LARGE_ODDS,
      });
    }
  }
  const links = nodes.flatMap((a, i) =>
    nodes.slice(i + 1).flatMap((b) =>
      Math.hypot(a.x - b.x, a.y - b.y) < GAP * REACH
        ? [`M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`]
        : [],
    ),
  );
  return (
    <>
      <path className={styles.links} d={links.join("")} />
      {nodes.map((node, i) => (
        <circle key={i} className={styles.node} cx={node.x} cy={node.y} r={node.large ? 3 : 1.75} />
      ))}
    </>
  );
}

type Props = { seed: string; className?: string; children: ReactNode };

export function FieldWell({ seed, className, children }: Props) {
  const network = drawNetwork(seed);

  const lean = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--lean-x", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--lean-y", `${event.clientY - box.top}px`);
  };
  // The glow drifts back to where it rests
  const rest = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.removeProperty("--lean-x");
    event.currentTarget.style.removeProperty("--lean-y");
  };

  return (
    <div className={[styles.well, className].filter(Boolean).join(" ")} onPointerMove={lean} onPointerLeave={rest}>
      <div className={styles.field} aria-hidden="true">
        <svg className={styles.base} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid slice">
          {network}
        </svg>
        <svg className={styles.lit} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid slice">
          {network}
        </svg>
      </div>
      {children}
    </div>
  );
}

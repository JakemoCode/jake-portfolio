/* The name, drawn as a mesh of the field's own nodes. Each node has a home on
   the letterforms and a spring pulling it there. On arrival they fly in from
   wherever they were scattered, left to right, so the name is written in.
   The cursor pushes nodes aside and a click blows a hole in the letters;
   either way the springs put the name back. Every few seconds a wave of light
   travels through the letters from a random node. */
import type { FieldPalette } from "../synapseField";

type Rgb = readonly [number, number, number];

export type GlyphPoint = { x: number; y: number };

export type GlyphField = {
  draw: (ctx: CanvasRenderingContext2D, t: number, dt: number) => void;
  /** Where the cursor is, or null once it leaves. */
  pointer: (at: GlyphPoint | null) => void;
  /** A shockwave from a point: nodes nearby are thrown outward and a wave lights the rest. */
  burst: (x: number, y: number) => void;
};

type Node = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  wake: number; // seconds after which the spring takes hold
  glow: number;
  ember: number; // share of the glow that is terracotta
};

type Wave = { x: number; y: number; t0: number; speed: number; power: number; ember: boolean };

const SPRING = 38; // pull toward home, per second squared per px
const DAMPING = 7.5; // share of velocity lost per second, as an exponent
const REPEL_RADIUS = 110;
const REPEL = 5200;
const BURST_RADIUS = 240;
const BURST = 1100;
const WAVE_BAND = 46; // px thickness of a travelling wave
const WAVE_LIFE = 2.6; // seconds a wave lasts
const MAX_LINKS = 3;
const GLOW_FADE = 0.06; // share of a node's glow left after one second
const KNIT_STRETCH = 3; // a link shows once its nodes are within this many rest lengths

const rgba = (c: Rgb, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const mix = (a: Rgb, b: Rgb, k: number): Rgb => [
  Math.round(a[0] + (b[0] - a[0]) * k),
  Math.round(a[1] + (b[1] - a[1]) * k),
  Math.round(a[2] + (b[2] - a[2]) * k),
];

/** Links each node to its nearest neighbours within reach, through a spatial hash. */
function linkNodes(nodes: Node[], reach: number): Array<[number, number, number]> {
  const cells = new Map<string, number[]>();
  const key = (x: number, y: number) => `${Math.floor(x / reach)},${Math.floor(y / reach)}`;
  nodes.forEach((n, i) => {
    const k = key(n.hx, n.hy);
    cells.set(k, [...(cells.get(k) ?? []), i]);
  });
  const seen = new Set<string>();
  const links: Array<[number, number, number]> = [];
  nodes.forEach((a, i) => {
    const cx = Math.floor(a.hx / reach);
    const cy = Math.floor(a.hy / reach);
    const near: Array<[number, number]> = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (const j of cells.get(`${cx + dx},${cy + dy}`) ?? []) {
          if (j === i) continue;
          const d = Math.hypot(a.hx - nodes[j]!.hx, a.hy - nodes[j]!.hy);
          if (d < reach) near.push([j, d]);
        }
      }
    }
    near.sort((p, q) => p[1] - q[1]);
    for (const [j, d] of near.slice(0, MAX_LINKS)) {
      const id = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (seen.has(id)) continue;
      seen.add(id);
      links.push([i, j, d]);
    }
  });
  return links;
}

export function createGlyphField(
  points: GlyphPoint[],
  size: { w: number; h: number; step: number },
  palette: FieldPalette,
  { assembled = false, random = Math.random }: { assembled?: boolean; random?: () => number } = {},
): GlyphField {
  const { w, h, step } = size;
  const left = Math.min(...points.map((p) => p.x));
  const right = Math.max(...points.map((p) => p.x));
  const span = Math.max(1, right - left);

  const nodes: Node[] = points.map((p) => {
    // Written left to right over about a second, with a little scatter so
    // the pen doesn't read as a straight vertical edge
    const wake = assembled ? 0 : 0.25 + ((p.x - left) / span) * 0.95 + random() * 0.2;
    return {
      hx: p.x,
      hy: p.y,
      x: assembled ? p.x : random() * w,
      y: assembled ? p.y : random() * h,
      vx: 0,
      vy: 0,
      wake,
      glow: assembled ? 0 : 0.6,
      ember: 0,
    };
  });
  const links = linkNodes(nodes, step * 1.9);

  const waves: Wave[] = [];
  let nextWave = assembled ? 1.5 : 2.4;
  // The first wave follows the pen, so the finished name lights up once
  if (!assembled && nodes.length) waves.push({ x: left - 60, y: h / 2, t0: 1.15, speed: 900, power: 0.9, ember: false });

  const cursor = { x: 0, y: 0, tx: 0, ty: 0, presence: 0, target: 0 };
  let now = 0;

  const pointer: GlyphField["pointer"] = (at) => {
    if (!at) {
      cursor.target = 0;
      return;
    }
    if (cursor.presence < 0.01) Object.assign(cursor, at);
    Object.assign(cursor, { tx: at.x, ty: at.y, target: 1 });
  };

  const burst: GlyphField["burst"] = (x, y) => {
    for (const n of nodes) {
      const d = Math.hypot(n.x - x, n.y - y) || 1;
      if (d > BURST_RADIUS) continue;
      const force = BURST * (1 - d / BURST_RADIUS) ** 1.5;
      n.vx += ((n.x - x) / d) * force;
      n.vy += ((n.y - y) / d) * force;
    }
    waves.push({ x, y, t0: now, speed: 760, power: 1, ember: random() < 0.35 });
  };

  const draw: GlyphField["draw"] = (ctx, t, dt) => {
    now = t;
    const ease = 1 - Math.pow(0.02, dt);
    cursor.x += (cursor.tx - cursor.x) * ease;
    cursor.y += (cursor.ty - cursor.y) * ease;
    cursor.presence += (cursor.target - cursor.presence) * ease;

    if (t > nextWave && nodes.length) {
      const from = nodes[Math.floor(random() * nodes.length)]!;
      waves.push({ x: from.hx, y: from.hy, t0: t, speed: 520 + random() * 220, power: 0.75, ember: random() < 0.18 });
      nextWave = t + 3.2 + random() * 1.6;
    }
    for (let k = waves.length - 1; k >= 0; k--) {
      if (t - waves[k]!.t0 > WAVE_LIFE) waves.splice(k, 1);
    }

    const damp = Math.exp(-DAMPING * dt);
    const fade = Math.pow(GLOW_FADE, dt);
    for (const n of nodes) {
      if (t >= n.wake) {
        let ax = (n.hx - n.x) * SPRING;
        let ay = (n.hy - n.y) * SPRING;
        const d = Math.hypot(n.x - cursor.x, n.y - cursor.y) || 1;
        if (cursor.presence > 0.01 && d < REPEL_RADIUS) {
          const push = REPEL * cursor.presence * (1 - d / REPEL_RADIUS) ** 2;
          ax += ((n.x - cursor.x) / d) * push;
          ay += ((n.y - cursor.y) / d) * push;
        }
        n.vx = (n.vx + ax * dt) * damp;
        n.vy = (n.vy + ay * dt) * damp;
      } else {
        // Still waiting for the pen: a slow drift where it was scattered
        n.vx *= damp;
        n.vy *= damp;
      }
      n.x += n.vx * dt;
      n.y += n.vy * dt;

      // A node in motion catches the light, so a disturbed patch flares
      let glow = Math.min(0.7, Math.hypot(n.vx, n.vy) / 900);
      let ember = 0;
      for (const wave of waves) {
        const age = t - wave.t0;
        if (age < 0) continue;
        const r = age * wave.speed;
        const off = Math.abs(Math.hypot(n.hx - wave.x, n.hy - wave.y) - r);
        if (off > WAVE_BAND) continue;
        const lit = (1 - off / WAVE_BAND) * wave.power * (1 - age / WAVE_LIFE);
        if (lit > glow) {
          glow = lit;
          ember = wave.ember ? 1 : 0;
        }
      }
      n.glow = Math.max(n.glow * fade, glow);
      n.ember = glow >= n.glow ? ember : n.ember;
    }

    // Links in four brightness buckets, one stroke each, rather than one per
    // link. A link stretched far past its rest length isn't drawn, so while
    // the nodes fly in the mesh knits together instead of spanning the band.
    const buckets: Array<Array<[Node, Node]>> = [[], [], [], []];
    for (const [i, j, rest] of links) {
      const a = nodes[i]!;
      const b = nodes[j]!;
      if (Math.hypot(a.x - b.x, a.y - b.y) > rest * KNIT_STRETCH) continue;
      const g = Math.max(a.glow, b.glow);
      buckets[Math.min(3, Math.floor(g * 4))]!.push([a, b]);
    }
    ctx.lineWidth = 1.1;
    buckets.forEach((bucket, level) => {
      if (!bucket.length) return;
      ctx.strokeStyle = rgba(level ? palette.spark : palette.signal, [0.42, 0.55, 0.7, 0.88][level]!);
      ctx.beginPath();
      for (const [a, b] of bucket) {
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();
    });

    for (const n of nodes) {
      const base = n.ember > 0.5 ? palette.ember : palette.signal;
      ctx.fillStyle = rgba(mix(base, palette.spark, n.ember > 0.5 ? n.glow * 0.3 : n.glow), 0.7 + n.glow * 0.3);
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6 + n.glow * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return { draw, pointer, burst };
}

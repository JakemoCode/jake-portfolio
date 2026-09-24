/* The hero's generative field: a loose grid of nodes drifting on a slow flow
   field, joined to near neighbours. A random node fires every second or so and
   the signal hops two or three links before it dies out. */

type Rgb = readonly [number, number, number];

export type FieldPalette = {
  bg: Rgb;
  bgDeep: Rgb;
  well: Rgb;
  glow: Rgb;
  signal: Rgb;
  spark: Rgb;
  ember: Rgb;
};

export type DrawFrame = (ctx: CanvasRenderingContext2D, t: number, dt: number) => void;

type Node = { bx: number; by: number; x: number; y: number; act: number; links: number[] };
type Pulse = { from: number; to: number; p: number; speed: number; depth: number; color: Rgb };

const GAP = 78; // node spacing in CSS px
const LINK_REACH = GAP * 1.45;
const DRIFT = 14; // how far a node wanders from its home, in CSS px
const MAX_DEPTH = 3; // hops a signal can travel before it dies out
const EMBER_SHARE = 0.08; // share of firings that run in the accent

const rgba = (c: Rgb, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

export function parseHex(hex: string): Rgb {
  const n = parseInt(hex.trim().replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Reads the --color-hero-* tokens, so tokens.css stays the only palette. */
export function readPalette(el: Element): FieldPalette {
  const style = getComputedStyle(el);
  const token = (name: string) => parseHex(style.getPropertyValue(`--color-hero-${name}`));
  return {
    bg: token("bg"),
    bgDeep: token("bg-deep"),
    well: token("well"),
    glow: token("glow"),
    signal: token("signal"),
    spark: token("spark"),
    ember: token("ember"),
  };
}

// A slow, smooth flow field: the drift angle at (x, y, t)
const flow = (x: number, y: number, t: number) =>
  Math.sin(x * 0.0021 + t * 0.07) * Math.cos(y * 0.0024 - t * 0.05) * Math.PI * 1.4 +
  Math.sin((x + y) * 0.0009 + t * 0.03);

function drawVeils(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, c: FieldPalette) {
  const ground = ctx.createLinearGradient(0, 0, w, h);
  ground.addColorStop(0, rgba(c.bg, 1));
  ground.addColorStop(1, rgba(c.bgDeep, 1));
  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "screen";
  const veils: Array<[number, number, number, Rgb, number]> = [
    [0.72, 0.3, 0.55, c.glow, 0.16],
    [0.9, 0.75, 0.45, c.signal, 0.08],
    [0.45, 0.9, 0.5, c.well, 0.2],
  ];
  veils.forEach(([vx, vy, radius, color, alpha], i) => {
    const x = w * (vx + 0.06 * Math.sin(t * 0.05 + i * 2));
    const y = h * (vy + 0.05 * Math.cos(t * 0.04 + i));
    const r = Math.max(w, h) * radius;
    const veil = ctx.createRadialGradient(x, y, 0, x, y, r);
    veil.addColorStop(0, rgba(color, alpha));
    veil.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, w, h);
  });
  ctx.globalCompositeOperation = "source-over";
}

export function createSynapseField(w: number, h: number, palette: FieldPalette, random = Math.random): DrawFrame {
  const nodes: Node[] = [];
  for (let y = -GAP / 2; y < h + GAP; y += GAP) {
    for (let x = -GAP / 2; x < w + GAP; x += GAP) {
      const bx = x + (random() - 0.5) * GAP * 0.7;
      const by = y + (random() - 0.5) * GAP * 0.7;
      nodes.push({ bx, by, x: bx, y: by, act: 0, links: [] });
    }
  }
  nodes.forEach((a, i) => {
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j]!;
      if (Math.hypot(a.bx - b.bx, a.by - b.by) < LINK_REACH) {
        a.links.push(j);
        b.links.push(i);
      }
    }
  });

  const pulses: Pulse[] = [];
  let nextFire = 0;

  const fire = (i: number, depth: number, color: Rgb) => {
    const node = nodes[i]!;
    node.act = 1;
    if (depth > MAX_DEPTH) return;
    for (const j of node.links) {
      if (random() < 0.55 - depth * 0.1) {
        pulses.push({ from: i, to: j, p: 0, speed: 0.55 + random() * 0.4, depth, color });
      }
    }
  };

  return (ctx, t, dt) => {
    drawVeils(ctx, w, h, t, palette);

    for (const n of nodes) {
      const angle = flow(n.bx, n.by, t);
      n.x = n.bx + Math.cos(angle) * DRIFT;
      n.y = n.by + Math.sin(angle) * DRIFT;
      n.act *= Math.pow(0.12, dt);
    }

    ctx.lineWidth = 1;
    nodes.forEach((a, i) => {
      for (const j of a.links) {
        if (j < i) continue;
        const b = nodes[j]!;
        ctx.strokeStyle = rgba(palette.signal, 0.07 + Math.max(a.act, b.act) * 0.35);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    });

    if (t > nextFire && nodes.length > 0) {
      fire(Math.floor(random() * nodes.length), 0, random() < EMBER_SHARE ? palette.ember : palette.signal);
      nextFire = t + 0.6 + random() * 0.9;
    }

    for (let k = pulses.length - 1; k >= 0; k--) {
      const q = pulses[k]!;
      q.p += dt * q.speed;
      const a = nodes[q.from]!;
      const b = nodes[q.to]!;
      if (q.p >= 1) {
        pulses.splice(k, 1);
        fire(q.to, q.depth + 1, q.color);
        continue;
      }
      const tail = Math.max(0, q.p - 0.18);
      const x = a.x + (b.x - a.x) * q.p;
      const y = a.y + (b.y - a.y) * q.p;
      ctx.strokeStyle = rgba(q.color, 0.8);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(a.x + (b.x - a.x) * tail, a.y + (b.y - a.y) * tail);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillStyle = rgba(palette.spark, 0.95);
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const n of nodes) {
      ctx.fillStyle = rgba(palette.signal, 0.25 + n.act * 0.75);
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.4 + n.act * 2.6, 0, Math.PI * 2);
      ctx.fill();
      if (n.act > 0.15) {
        const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 18 * n.act + 4);
        halo.addColorStop(0, rgba(palette.signal, 0.35 * n.act));
        halo.addColorStop(1, rgba(palette.signal, 0));
        ctx.fillStyle = halo;
        ctx.fillRect(n.x - 24, n.y - 24, 48, 48);
      }
    }
  };
}

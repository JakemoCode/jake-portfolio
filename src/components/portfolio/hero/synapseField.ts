/* The hero's generative field: a loose grid of nodes drifting on a slow flow
   field, joined to near neighbours. Every few seconds a random node fires and
   the signal hops a link or two before it dies out. Nodes within cursorRadius
   lean toward the cursor, and a click fires the nearest node with more hops
   and higher odds per link. Ambient firing stays sparse so a clicked wave is
   distinguishable from it. */

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

export type SynapseField = {
  draw: (ctx: CanvasRenderingContext2D, t: number, dt: number) => void;
  /** Fires the node nearest a point, in the field's CSS px. */
  fireAt: (x: number, y: number) => void;
  /** Where the cursor is, or null once it leaves. */
  pointer: (at: { x: number; y: number } | null) => void;
};

/** Every tunable in the field. Read live on each frame, so a change shows at
    once; gap and linkReach set the network's shape and only apply to a new
    field. Distances are CSS px, times are seconds, odds are 0 to 1. */
export type FieldParams = {
  gap: number; // spacing between nodes
  linkReach: number; // link any two nodes closer than gap × this
  drift: number; // how far a node wanders from its home
  ambientMin: number; // seconds between the field's own firings, least
  ambientMax: number; // and most
  ambientDepth: number; // hops an ambient signal can travel
  ambientOdds: number; // chance it crosses each link at the first hop
  ambientFalloff: number; // how much that chance drops per hop
  clickDepth: number;
  clickOdds: number;
  clickFalloff: number;
  refractory: number; // seconds before a node relays again, so a wave spreads instead of echoing back
  emberAmbient: number; // share of ambient firings that run in the accent
  emberClick: number; // share of clicks that do
  speedMin: number; // links crossed per second, slowest pulse
  speedSpread: number; // added at random on top of that
  glowFade: number; // share of a node's glow left after one second
  cursorRadius: number; // nodes this close to the cursor lean toward it
  cursorPull: number; // how far the closest ones move; negative pushes them away
};

export const FIELD_DEFAULTS: FieldParams = {
  gap: 78,
  linkReach: 1.45,
  drift: 14,
  ambientMin: 2,
  ambientMax: 3,
  ambientDepth: 2,
  ambientOdds: 0.45,
  ambientFalloff: 0.12,
  clickDepth: 5,
  clickOdds: 0.9,
  clickFalloff: 0.08,
  refractory: 4,
  emberAmbient: 0.08,
  emberClick: 0.2,
  speedMin: 0.55,
  speedSpread: 0.4,
  glowFade: 0.12,
  cursorRadius: 140,
  cursorPull: 12,
};

type Kind = "ambient" | "click";
type Node = { bx: number; by: number; x: number; y: number; act: number; firedAt: number; links: number[] };
type Pulse = { from: number; to: number; p: number; speed: number; depth: number; color: Rgb; kind: Kind };

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

export function createSynapseField(
  w: number,
  h: number,
  palette: FieldPalette,
  params: FieldParams = FIELD_DEFAULTS,
  random = Math.random,
): SynapseField {
  const { gap } = params;
  const nodes: Node[] = [];
  for (let y = -gap / 2; y < h + gap; y += gap) {
    for (let x = -gap / 2; x < w + gap; x += gap) {
      const bx = x + (random() - 0.5) * gap * 0.7;
      const by = y + (random() - 0.5) * gap * 0.7;
      nodes.push({ bx, by, x: bx, y: by, act: 0, firedAt: -Infinity, links: [] });
    }
  }
  nodes.forEach((a, i) => {
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j]!;
      if (Math.hypot(a.bx - b.bx, a.by - b.by) < gap * params.linkReach) {
        a.links.push(j);
        b.links.push(i);
      }
    }
  });

  const pulses: Pulse[] = [];
  let nextFire = 0;
  let now = 0;

  // The cursor eases in and out, so nodes glide toward it rather than snap
  const cursor = { x: 0, y: 0, tx: 0, ty: 0, presence: 0, target: 0 };

  const pointer: SynapseField["pointer"] = (at) => {
    if (!at) {
      cursor.target = 0;
      return;
    }
    // presence only decays toward 0, so snap once it's negligible; otherwise
    // re-entry glides the cursor over from where it last left
    if (cursor.presence < 0.01) Object.assign(cursor, at);
    Object.assign(cursor, { tx: at.x, ty: at.y, target: 1 });
  };

  const fire = (i: number, depth: number, color: Rgb, kind: Kind) => {
    const node = nodes[i]!;
    if (depth > 0 && now - node.firedAt < params.refractory) return;
    node.act = 1;
    node.firedAt = now;
    const [maxDepth, odds, falloff] =
      kind === "click"
        ? [params.clickDepth, params.clickOdds, params.clickFalloff]
        : [params.ambientDepth, params.ambientOdds, params.ambientFalloff];
    if (depth >= maxDepth) return;
    for (const j of node.links) {
      if (random() < odds - depth * falloff) {
        pulses.push({ from: i, to: j, p: 0, speed: params.speedMin + random() * params.speedSpread, depth, color, kind });
      }
    }
  };

  const colorFor = (share: number) => (random() < share ? palette.ember : palette.signal);

  const fireAt = (x: number, y: number) => {
    let nearest = -1;
    let best = Infinity;
    nodes.forEach((n, i) => {
      const d = Math.hypot(n.x - x, n.y - y);
      if (d < best) [nearest, best] = [i, d];
    });
    if (nearest >= 0) fire(nearest, 0, colorFor(params.emberClick), "click");
  };

  const draw: SynapseField["draw"] = (ctx, t, dt) => {
    now = t;
    drawVeils(ctx, w, h, t, palette);

    const ease = 1 - Math.pow(0.02, dt); // closes most of the gap in about a second
    cursor.x += (cursor.tx - cursor.x) * ease;
    cursor.y += (cursor.ty - cursor.y) * ease;
    cursor.presence += (cursor.target - cursor.presence) * ease;
    // 1 at the cursor, falling to 0 at the radius and beyond
    const nearness = (x: number, y: number) =>
      cursor.presence * Math.max(0, 1 - Math.hypot(x - cursor.x, y - cursor.y) / params.cursorRadius) ** 2;

    for (const n of nodes) {
      const angle = flow(n.bx, n.by, t);
      const hx = n.bx + Math.cos(angle) * params.drift;
      const hy = n.by + Math.sin(angle) * params.drift;
      const d = Math.hypot(cursor.x - hx, cursor.y - hy) || 1;
      // Never pulled past the cursor itself
      const lean = Math.min(nearness(hx, hy) * params.cursorPull, d * 0.6);
      n.x = hx + ((cursor.x - hx) / d) * lean;
      n.y = hy + ((cursor.y - hy) / d) * lean;
      n.act *= Math.pow(params.glowFade, dt);
    }

    // Unlit links share one path and one stroke; only lit ones need their own
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(palette.signal, 0.07);
    ctx.beginPath();
    const lit: Array<[Node, Node, number]> = [];
    nodes.forEach((a, i) => {
      for (const j of a.links) {
        if (j < i) continue;
        const b = nodes[j]!;
        const glow = Math.max(a.act, b.act, nearness((a.x + b.x) / 2, (a.y + b.y) / 2) * 0.4);
        if (glow > 0.01) {
          lit.push([a, b, glow]);
          continue;
        }
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
    });
    ctx.stroke();
    for (const [a, b, glow] of lit) {
      ctx.strokeStyle = rgba(palette.signal, 0.07 + glow * 0.35);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    if (t > nextFire && nodes.length > 0) {
      fire(Math.floor(random() * nodes.length), 0, colorFor(params.emberAmbient), "ambient");
      nextFire = t + params.ambientMin + random() * Math.max(0, params.ambientMax - params.ambientMin);
    }

    for (let k = pulses.length - 1; k >= 0; k--) {
      const q = pulses[k]!;
      q.p += dt * q.speed;
      const a = nodes[q.from]!;
      const b = nodes[q.to]!;
      if (q.p >= 1) {
        pulses.splice(k, 1);
        fire(q.to, q.depth + 1, q.color, q.kind);
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
      const glow = Math.max(n.act, nearness(n.x, n.y) * 0.3);
      ctx.fillStyle = rgba(palette.signal, 0.25 + glow * 0.75);
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.4 + glow * 2.6, 0, Math.PI * 2);
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

  return { draw, fireAt, pointer };
}

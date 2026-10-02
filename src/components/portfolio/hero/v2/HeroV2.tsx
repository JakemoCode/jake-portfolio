import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { HeroProps } from "../Hero";
import { createSynapseField, FIELD_DEFAULTS, readPalette, type SynapseField } from "../synapseField";
import { createGlyphField, type GlyphField, type GlyphPoint } from "./glyphField";
import styles from "./HeroV2.module.css";

/* Version 2: the name holds its shape. The field from version 1 stays as the
   ground, and the name is set huge and drawn as a mesh of the same nodes,
   sampled from the real letterforms. The text underneath is laid out but
   transparent, so the canvas is what's seen; if the canvas can't draw, the
   text shows instead. */

const MAX_DPR = 1.5;
const RESIZE_SETTLE_MS = 150;
/** Sampling step as a share of the name's font size: about three nodes across a stroke */
const STEP_SHARE = 1 / 21;
/** A sparser ground than version 1, so the name carries the band */
const GROUND = { ...FIELD_DEFAULTS, gap: 120, cursorPull: 6, aimRing: 0, dragFire: 0 };

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

/** The name's letterforms as points, in the hero's coordinates, from each line's real box and font */
function sampleName(lines: HTMLElement[], host: HTMLElement): { points: GlyphPoint[]; step: number } {
  const origin = host.getBoundingClientRect();
  const points: GlyphPoint[] = [];
  let step = 8;
  for (const line of lines) {
    const box = line.getBoundingClientRect();
    const style = getComputedStyle(line);
    const fontSize = parseFloat(style.fontSize);
    step = Math.max(5, fontSize * STEP_SHARE);
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(box.width);
    canvas.height = Math.ceil(box.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx || !canvas.width || !canvas.height) continue;
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = style.letterSpacing;
    const text = line.textContent ?? "";
    const metrics = ctx.measureText(text);
    // CSS centers the font's ascent plus descent in the line box
    const ascent = metrics.fontBoundingBoxAscent;
    const baseline = (box.height - (ascent + metrics.fontBoundingBoxDescent)) / 2 + ascent;
    ctx.fillText(text, 0, baseline);
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // A jittered grid, so the mesh reads as grown rather than ruled
    let seed = 1;
    const jitter = () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5) * step * 0.7;
    for (let y = step / 2; y < height; y += step) {
      for (let x = step / 2; x < width; x += step) {
        const px = Math.round(x + jitter());
        const py = Math.round(y + jitter());
        if (px < 0 || py < 0 || px >= width || py >= height) continue;
        if (data[(py * width + px) * 4 + 3]! > 140) {
          points.push({ x: box.left - origin.left + px, y: box.top - origin.top + py });
        }
      }
    }
  }
  return { points, step };
}

export function HeroV2({ name, title, availability, resume, email, github, linkedin, next }: HeroProps) {
  const hostRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<Array<HTMLSpanElement | null>>([]);
  const [paused, setPaused] = useState(prefersReducedMotion);
  const [fallback, setFallback] = useState(false);
  const pausedRef = useRef(paused);
  const groundRef = useRef<SynapseField | null>(null);
  const glyphsRef = useRef<GlyphField | null>(null);
  const wakeRef = useRef<() => void>(() => {});

  useEffect(() => {
    pausedRef.current = paused;
    wakeRef.current();
  }, [paused]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!host || !canvas) return;
    if (!ctx) {
      setFallback(true);
      return;
    }

    const palette = readPalette(host);
    const still = prefersReducedMotion();
    let t = 0;
    let last = performance.now();
    let visible = false;
    let frame = 0;
    let running = false;
    let built = false;
    let resizeTimer = 0;
    let cancelled = false;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const { width, height } = host.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      groundRef.current = createSynapseField(width, height, palette, GROUND);
      const lines = linesRef.current.filter((el): el is HTMLSpanElement => el !== null);
      const { points, step } = sampleName(lines, host);
      // A rebuild after a resize keeps the name in place; only the first one writes it in
      glyphsRef.current = createGlyphField(points, { w: width, h: height, step }, palette, {
        assembled: built || still,
      });
      if (still) for (let i = 0; i < 90; i++) groundRef.current.draw(ctx, (t += 1 / 30), 1 / 30);
      built = true;
      setFallback(points.length === 0);
      draw(1 / 60);
    };

    const draw = (dt: number) => {
      t += dt;
      groundRef.current?.draw(ctx, t, dt);
      glyphsRef.current?.draw(ctx, t, dt);
    };

    const shouldRun = () => visible && !pausedRef.current && document.visibilityState === "visible";

    const loop = (now: number) => {
      if (!shouldRun()) {
        running = false;
        return;
      }
      draw(Math.min(0.05, (now - last) / 1000));
      last = now;
      frame = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (running || !built || !shouldRun()) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    wakeRef.current = wake;

    // Sampled after the display face loads, or the mesh traces the fallback font
    document.fonts.ready.then(() => {
      if (cancelled) return;
      build();
      wake();
    });

    const resize = new ResizeObserver(() => {
      if (!built) return;
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, RESIZE_SETTLE_MS);
    });
    resize.observe(host);
    const onScreen = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      wake();
    });
    onScreen.observe(host);
    document.addEventListener("visibilitychange", wake);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      resize.disconnect();
      onScreen.disconnect();
      document.removeEventListener("visibilitychange", wake);
      wakeRef.current = () => {};
    };
  }, []);

  const point = (event: MouseEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  };

  // Decorative, pointer only: a click anywhere but a control blows the name apart
  const burst = (event: MouseEvent<HTMLElement>) => {
    if (pausedRef.current || (event.target as Element).closest("a, button")) return;
    const at = point(event);
    glyphsRef.current?.burst(at.x, at.y);
    groundRef.current?.fireAt(at.x, at.y);
  };

  const follow = (event: MouseEvent<HTMLElement>) => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const over = (event.target as Element).closest("a, button") ? null : point(event);
    glyphsRef.current?.pointer(over);
    groundRef.current?.pointer(over);
  };

  const leave = () => {
    glyphsRef.current?.pointer(null);
    groundRef.current?.pointer(null);
  };

  const [first, ...rest] = name.split(" ");
  // The promise after the colon is what the band is about, so it takes the signal color
  const [lead, list] = title.split(/:\s(.+)/s);

  return (
    <header
      ref={hostRef}
      className={styles.hero}
      data-paused={paused || undefined}
      data-fallback={fallback || undefined}
      onClick={burst}
      onMouseMove={follow}
      onMouseLeave={leave}
    >
      <canvas ref={canvasRef} className={styles.field} aria-hidden="true" />

      <h1 className={styles.name}>
        <span className={styles.srOnly}>{name}</span>
        <span className={styles.nameArt} aria-hidden="true">
          <span ref={(el) => void (linesRef.current[0] = el)} className={styles.line}>
            {first}
          </span>
          <span ref={(el) => void (linesRef.current[1] = el)} className={styles.line}>
            {rest.join(" ")}
          </span>
        </span>
      </h1>

      <div className={styles.lower}>
        <p className={styles.title}>
          {lead}
          {list && (
            <>
              : <span className={styles.titleList}>{list}</span>
            </>
          )}
        </p>
        <div className={styles.contact}>
          <p className={styles.availability}>
            <span className={styles.status}>{availability.status}</span>
            <span className={styles.detail}>{availability.detail.join(" · ")}</span>
          </p>
          <ul className={styles.links} aria-label="Contact">
            <li>
              <a className={styles.resume} href={resume} target="_blank" rel="noreferrer">
                Résumé <span className={styles.fileType}>PDF</span>
              </a>
            </li>
            <li>
              <a className={styles.link} href={`mailto:${email}`}>
                {email}
              </a>
            </li>
            <li>
              <a className={styles.link} href={github} target="_blank" rel="noreferrer">
                GitHub<span aria-hidden="true"> ↗</span>
              </a>
            </li>
            <li>
              <a className={styles.link} href={linkedin} target="_blank" rel="noreferrer">
                LinkedIn<span aria-hidden="true"> ↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.foot}>
        <a className={styles.next} href={next.href}>
          {next.label}{" "}
          <span className={styles.nudge} aria-hidden="true">
            ↓
          </span>
        </a>
        <button type="button" className={styles.motion} onClick={() => setPaused((p) => !p)}>
          <svg className={styles.motionIcon} viewBox="0 0 16 16" aria-hidden="true">
            {paused ? <path d="M4 2.5v11l9.5-5.5z" /> : <path d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z" />}
          </svg>
          <span className={styles.motionLabel}>{paused ? "Play animation" : "Pause animation"}</span>
        </button>
      </div>
    </header>
  );
}

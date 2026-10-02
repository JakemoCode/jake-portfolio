import { useEffect, useRef, useState, type RefObject } from "react";
import { createSynapseField, FIELD_DEFAULTS, readPalette, type SynapseField } from "../synapseField";
import { createGlyphField, type GlyphField } from "./glyphField";
import { sampleName } from "./sampleText";

const MAX_DPR = 1.5;
const RESIZE_SETTLE_MS = 150;
/** A sparser ground than version 1, so the name carries the band */
const GROUND = { ...FIELD_DEFAULTS, gap: 120, cursorPull: 6, aimRing: 0, dragFire: 0 };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

/* The canvas behind versions 2 and up: version 1's field as the ground, and
   the name as a glyph mesh sampled from its laid-out lines once the display
   face has loaded. The loop stops itself when the band is paused, off screen
   or in a hidden tab. A resize rebuilds both fields with the name already in
   place; only the first build writes it in. */
export function useNameField({
  hostRef,
  canvasRef,
  linesRef,
  arrival,
}: {
  hostRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  linesRef: RefObject<Array<HTMLSpanElement | null>>;
  /** The name waits, scattered, until this settles: a MOAR! reveal would hide its write-in */
  arrival?: Promise<unknown>;
}) {
  const arrivalRef = useRef(arrival);
  const [paused, setPaused] = useState(prefersReducedMotion);
  const [fallback, setFallback] = useState(false);
  const pausedRef = useRef(paused);
  const groundRef = useRef<SynapseField | null>(null);
  const glyphsRef = useRef<GlyphField | null>(null);
  const wakeRef = useRef<() => void>(() => {});
  const drawRef = useRef<(dt: number) => void>(() => {});

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
    let builtSize = "";

    const draw = (dt: number) => {
      t += dt;
      groundRef.current?.draw(ctx, t, dt);
      glyphsRef.current?.draw(ctx, t, dt);
    };
    drawRef.current = draw;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const { width, height } = host.getBoundingClientRect();
      builtSize = `${width}x${height}`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      groundRef.current = createSynapseField(width, height, palette, GROUND);
      const lines = (linesRef.current ?? []).filter((el): el is HTMLSpanElement => el !== null);
      const { points, step } = sampleName(lines, host);
      glyphsRef.current = createGlyphField(points, { w: width, h: height, step }, palette, {
        assembled: built || still,
        held: true,
      });
      if (still) for (let i = 0; i < 90; i++) groundRef.current.draw(ctx, (t += 1 / 30), 1 / 30);
      built = true;
      setFallback(points.length === 0);
      draw(1 / 60);
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
    const ready = document.fonts.ready.then(() => {
      if (cancelled) return;
      build();
      wake();
    });
    Promise.all([ready, arrivalRef.current]).then(() => {
      if (!cancelled) glyphsRef.current?.release();
    });

    // Observing reports the starting size once; only a real change rebuilds,
    // or that first report would land the name before its write-in
    const resize = new ResizeObserver(([entry]) => {
      const box = entry?.target.getBoundingClientRect();
      if (!built || !box || `${box.width}x${box.height}` === builtSize) return;
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
      drawRef.current = () => {};
    };
  }, [hostRef, canvasRef, linesRef]);

  return {
    groundRef,
    glyphsRef,
    pausedRef,
    paused,
    setPaused,
    fallback,
    /** One frame, for a change made while the loop is stopped */
    drawOnce: () => drawRef.current(0),
  };
}

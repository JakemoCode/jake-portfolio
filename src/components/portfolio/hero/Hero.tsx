import { lazy, Suspense, useEffect, useRef, useState, type MouseEvent } from "react";
import styles from "./Hero.module.css";
import { createSynapseField, FIELD_DEFAULTS, readPalette, type FieldParams, type SynapseField } from "./synapseField";

// Sliders for every field parameter, in dev only. Vite replaces DEV with
// false in a production build, so the panel's code never ships.
const FieldTuner = import.meta.env.DEV ? lazy(() => import("./FieldTuner")) : null;

type Props = {
  name: string;
  title: string;
  /** A status line and the facts behind it, set on two lines. */
  availability: { status: string; detail: string[] };
  resume: string;
  email: string;
  github: string;
  linkedin: string;
  /** Where the hero hands off: the first section, which the band otherwise hides. */
  next: { href: string; label: string };
};

const MAX_DPR = 1.5; // the field is soft; full retina resolution buys nothing but fill cost
const WARM_UP_FRAMES = 60; // so a still frame shows signals in flight, not an idle grid
const RESIZE_SETTLE_MS = 150;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

export function Hero({ name, title, availability, resume, email, github, linkedin, next }: Props) {
  const hostRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(prefersReducedMotion);
  const pausedRef = useRef(paused);
  const fieldRef = useRef<SynapseField | null>(null);
  const paramsRef = useRef<FieldParams>({ ...FIELD_DEFAULTS });
  const rebuildRef = useRef<() => void>(() => {});
  const wakeRef = useRef<() => void>(() => {});

  useEffect(() => {
    pausedRef.current = paused;
    wakeRef.current();
  }, [paused]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!host || !canvas || !ctx) return;

    const palette = readPalette(host);
    let t = Math.random() * 100;
    let last = performance.now();
    let visible = false;
    let frame = 0;
    let running = false;
    let sized = false;
    let resizeTimer = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const { width, height } = host.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const field = createSynapseField(width, height, palette, paramsRef.current);
      for (let i = 0; i < WARM_UP_FRAMES; i++) field.draw(ctx, (t += 1 / 30), 1 / 30);
      fieldRef.current = field;
    };

    const shouldRun = () => visible && !pausedRef.current && document.visibilityState === "visible";

    // The loop stops itself when the field is paused, off screen, or in a
    // hidden tab, and wake restarts it, so an idle hero schedules no frames
    const loop = (now: number) => {
      if (!shouldRun()) {
        running = false;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (fieldRef.current) {
        t += dt;
        fieldRef.current.draw(ctx, t, dt);
      }
      frame = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (running || !shouldRun()) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };

    // The first size is immediate. Later ones wait for the resize to settle,
    // since each rebuild reseeds the field and runs every warm-up frame.
    const onResize = () => {
      if (!sized) {
        sized = true;
        size();
        return;
      }
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(size, RESIZE_SETTLE_MS);
    };

    rebuildRef.current = size;
    wakeRef.current = wake;
    // Observing fires once straight away, which does the first size and draw
    const resize = new ResizeObserver(onResize);
    resize.observe(host);
    const onScreen = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      wake();
    });
    onScreen.observe(host);
    document.addEventListener("visibilitychange", wake);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      resize.disconnect();
      onScreen.disconnect();
      document.removeEventListener("visibilitychange", wake);
      wakeRef.current = () => {};
    };
  }, []);

  // Pointer only, and decorative: the field answers a click near it, but
  // nothing on the page depends on it. A paused field stays still.
  const fireAtPointer = (event: MouseEvent<HTMLElement>) => {
    if (pausedRef.current || (event.target as Element).closest("a, button")) return;
    const box = event.currentTarget.getBoundingClientRect();
    fieldRef.current?.fireAt(event.clientX - box.left, event.clientY - box.top);
  };

  const follow = (event: MouseEvent<HTMLElement>) => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    fieldRef.current?.pointer({ x: event.clientX - box.left, y: event.clientY - box.top });
  };

  return (
    <header
      ref={hostRef}
      className={styles.hero}
      data-paused={paused || undefined}
      onClick={fireAtPointer}
      onMouseMove={follow}
      onMouseLeave={() => fieldRef.current?.pointer(null)}
    >
      <canvas ref={canvasRef} className={styles.field} aria-hidden="true" />
      <div className={styles.inner}>
        <h1 className={styles.name}>{name}</h1>
        <p className={styles.title}>{title}</p>
        <p className={styles.availability}>
          <span className={styles.status}>{availability.status}</span>
          <span className={styles.detail}>
            <span className={styles.facts}>
              {availability.detail.map((fact) => (
                <span key={fact} className={styles.fact}>
                  {fact}
                </span>
              ))}
            </span>
          </span>
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
      <div className={styles.foot}>
        <a className={styles.next} href={next.href}>
          {next.label}{" "}
          <span className={styles.nudge} aria-hidden="true">
            ↓
          </span>
        </a>
        <button
          type="button"
          className={styles.motion}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? "Play animation" : "Pause animation"}
        </button>
      </div>
      {FieldTuner && (
        <Suspense fallback={null}>
          <FieldTuner params={paramsRef.current} onRebuild={() => rebuildRef.current()} />
        </Suspense>
      )}
    </header>
  );
}

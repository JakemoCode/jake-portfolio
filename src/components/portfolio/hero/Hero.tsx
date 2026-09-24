import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import { createSynapseField, readPalette, type DrawFrame } from "./synapseField";

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

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

export function Hero({ name, title, availability, resume, email, github, linkedin, next }: Props) {
  const hostRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(prefersReducedMotion);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!host || !canvas || !ctx) return;

    const palette = readPalette(host);
    let draw: DrawFrame | null = null;
    let t = Math.random() * 100;
    let last = performance.now();
    let visible = false;
    let frame = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const { width, height } = host.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw = createSynapseField(width, height, palette);
      for (let i = 0; i < WARM_UP_FRAMES; i++) draw(ctx, (t += 1 / 30), 1 / 30);
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (draw && visible && !pausedRef.current && document.visibilityState === "visible") {
        t += dt;
        draw(ctx, t, dt);
      }
      frame = requestAnimationFrame(loop);
    };

    // Observing fires once straight away, which does the first size and draw
    const resize = new ResizeObserver(size);
    resize.observe(host);
    const onScreen = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
    });
    onScreen.observe(host);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      onScreen.disconnect();
    };
  }, []);

  return (
    <header ref={hostRef} className={styles.hero}>
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
            <a href={`mailto:${email}`}>{email}</a>
          </li>
          <li>
            <a href={github} target="_blank" rel="noreferrer">
              GitHub<span aria-hidden="true"> ↗</span>
            </a>
          </li>
          <li>
            <a href={linkedin} target="_blank" rel="noreferrer">
              LinkedIn<span aria-hidden="true"> ↗</span>
            </a>
          </li>
        </ul>
      </div>
      <div className={styles.foot}>
        <a className={styles.next} href={next.href}>
          {next.label} <span aria-hidden="true">↓</span>
        </a>
        <button type="button" className={styles.motion} onClick={() => setPaused((p) => !p)}>
          {paused ? "Play animation" : "Pause animation"}
        </button>
      </div>
    </header>
  );
}

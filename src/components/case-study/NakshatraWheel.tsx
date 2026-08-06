/* Live port of the Nakshatra wheel built for zendeb.com. The spin/landing math
   lives in ../../lib/nakshatra (pure, unit-tested); this file is DOM and motion
   only, the same split the original used.

   The rotor's transform is written imperatively on each frame rather than through
   state, so a spin costs zero React renders. Only the landed result re-renders. */
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./NakshatraWheel.module.css";
import { nakshatras } from "../../content/nakshatras";
import { decelTarget, easeOutCubic, smoothstep, type DecelPlan } from "../../lib/nakshatra";
import discSrc from "../../assets/case-studies/nakshatra/wheel-disc.webp";
import hubSrc from "../../assets/case-studies/nakshatra/hub.webp";
import pointerSrc from "../../assets/case-studies/nakshatra/pointer.webp";

/* Glyph files are complete <svg viewBox="0 0 64 64"> documents using
   fill="currentColor". Strip the outer element so each one can be nested at a
   position we control. */
const glyphFiles = import.meta.glob(
  "../../assets/case-studies/nakshatra/glyphs/*.svg",
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

const glyphInner: Record<string, string> = {};
for (const [path, raw] of Object.entries(glyphFiles)) {
  const slug = path.split("/").pop()!.replace(".svg", "");
  glyphInner[slug] = raw.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
}

/* Geometry matches wheel-disc.webp (1024 square, alpha-bbox centre and radius).
   The pointer sits inside the disc, so the viewBox is the full square. */
const W = 1024;
const CX = 512;
const CY = 503;
const OUTER_R = 426;
const RING = OUTER_R * 0.73;
const GLYPH_SIZE = OUTER_R * 0.155;
const HUB_R = OUTER_R * 0.3;

const N = nakshatras.length;
const STEP = 360 / N;

type Phase = "idle" | "accel" | "cruise" | "decel" | "landed";

export function NakshatraWheel() {
  const rotorRef = useRef<SVGGElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const angleRef = useRef(0);
  const velRef = useRef(0);
  const lastRef = useRef<number | null>(null);
  const accelTRef = useRef(0);
  const planRef = useRef<(DecelPlan & { t: number; a0: number }) | null>(null);
  const phaseRef = useRef<Phase>("idle");

  const [phase, setPhase] = useState<Phase>("idle");
  const [landed, setLanded] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // Guarded: not every environment implements matchMedia (jsdom does not).
    const mq = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    if (!mq) return;
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const cruise = reduced ? 0.2 : 0.54;
  const accelMs = reduced ? 250 : 1200;

  const setAngle = useCallback((a: number) => {
    angleRef.current = a;
    rotorRef.current?.setAttribute("transform", `rotate(${a} ${CX} ${CY})`);
  }, []);

  const enter = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const frame = useCallback(
    (ts: number) => {
      if (lastRef.current === null) lastRef.current = ts;
      const dt = Math.min(ts - lastRef.current, 50);
      lastRef.current = ts;

      const phaseNow = phaseRef.current;

      if (phaseNow === "accel") {
        accelTRef.current += dt;
        const k = Math.min(accelTRef.current / accelMs, 1);
        velRef.current = cruise * smoothstep(k);
        setAngle(angleRef.current + velRef.current * dt);
        if (k >= 1) {
          velRef.current = cruise;
          enter("cruise");
        }
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      if (phaseNow === "cruise") {
        velRef.current = cruise;
        setAngle(angleRef.current + cruise * dt);
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      if (phaseNow === "decel") {
        const plan = planRef.current;
        if (!plan) return;
        plan.t += dt;
        const p = plan.T > 0 ? Math.min(plan.t / plan.T, 1) : 1;
        setAngle(plan.a0 + plan.D * easeOutCubic(p));
        if (p >= 1) {
          setAngle(plan.aFinal);
          velRef.current = 0;
          setLanded(plan.index);
          enter("landed");
          return;
        }
        rafRef.current = requestAnimationFrame(frame);
      }
    },
    [accelMs, cruise, enter, setAngle],
  );

  // Never leave a frame scheduled behind.
  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const start = () => {
    accelTRef.current = 0;
    lastRef.current = null;
    enter("accel");
    rafRef.current = requestAnimationFrame(frame);
  };

  const stop = () => {
    const plan = decelTarget(angleRef.current, velRef.current, N, { refVel: cruise });
    planRef.current = { ...plan, t: 0, a0: angleRef.current };
    lastRef.current = null;
    enter("decel");
    rafRef.current = requestAnimationFrame(frame);
  };

  const reset = () => {
    setLanded(null);
    enter("idle");
  };

  const onAction = () => {
    if (phase === "idle") start();
    else if (phase === "accel" || phase === "cruise") stop();
    else if (phase === "landed") reset();
  };

  const landedNak = landed !== null ? nakshatras[landed] : undefined;

  const label =
    phase === "idle"
      ? "Spin the wheel"
      : phase === "decel"
        ? "Landing"
        : phase === "landed"
          ? "Spin again"
          : "Stop";

  return (
    <figure className={styles.wrap}>
      <div className={styles.stage}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${W} ${W}`}
          role="img"
          aria-label="A wheel of the 27 nakshatras with a pointer at the top"
        >
          <g ref={rotorRef} transform={`rotate(0 ${CX} ${CY})`}>
            <image href={discSrc} width={W} height={W} />
            {nakshatras.map((nak, i) => (
              <g key={nak.slug} transform={`rotate(${STEP * i} ${CX} ${CY})`}>
                <svg
                  className={styles.glyph}
                  x={CX - GLYPH_SIZE / 2}
                  y={CY - RING - GLYPH_SIZE / 2}
                  width={GLYPH_SIZE}
                  height={GLYPH_SIZE}
                  viewBox="0 0 64 64"
                  dangerouslySetInnerHTML={{ __html: glyphInner[nak.slug] ?? "" }}
                />
              </g>
            ))}
          </g>
          <image
            href={hubSrc}
            x={CX - HUB_R}
            y={CY - HUB_R}
            width={2 * HUB_R}
            height={2 * HUB_R}
          />
          <image href={pointerSrc} x={487} y={20} width={69} height={150} />
        </svg>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.action}
          onClick={onAction}
          disabled={phase === "decel"}
        >
          {label}
        </button>
        <p className={styles.result} aria-live="polite">
          {landedNak ? (
            <>
              Landed on <strong>{landedNak.name}</strong>
            </>
          ) : (
            <span className={styles.hint}>Stop it wherever you like. It lands where you stopped it.</span>
          )}
        </p>
      </div>

      <figcaption className={styles.caption}>
        The real wheel from zendeb.com, running the same engine. Reduced-motion
        preferences slow the spin rather than removing it.
      </figcaption>
    </figure>
  );
}

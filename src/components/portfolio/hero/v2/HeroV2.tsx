import { useRef, type MouseEvent } from "react";
import type { HeroProps } from "../Hero";
import { useNameField } from "./useNameField";
import styles from "./HeroV2.module.css";

/* Version 2: the name holds its shape. The field from version 1 stays as the
   ground, and the name is set huge and drawn as a mesh of the same nodes,
   sampled from the real letterforms. The text underneath is laid out but
   transparent, so the canvas is what's seen; if the canvas can't draw, the
   text shows instead. */

export function HeroV2({ name, title, availability, resume, email, github, linkedin, next, arrival }: HeroProps) {
  const hostRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<Array<HTMLSpanElement | null>>([]);
  const { groundRef, glyphsRef, pausedRef, paused, setPaused, fallback } = useNameField({
    hostRef,
    canvasRef,
    linesRef,
    arrival,
  });

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

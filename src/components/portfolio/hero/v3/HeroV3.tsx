import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import type { HeroProps } from "../Hero";
import type { Tint } from "../v2/glyphField";
import { sampleName, sampleWord } from "../v2/sampleText";
import { useNameField } from "../v2/useNameField";
import styles from "../v2/HeroV2.module.css";
import own from "./HeroV3.module.css";

/* Version 3: the mesh talks back. Everything in version 2, and the name's
   nodes can be sent to other words. Pointing at one of the three standards
   in the pitch turns the name into it. Typing anywhere while the band is on
   screen rewrites the name as what's typed, in the terracotta accent, until
   the typing stops for a few seconds or Escape is pressed. All of it is
   decoration: the heading, the pitch and every control read the same. */

/** The words in the pitch the name can turn into */
const STANDARDS = /\b(review|tests|rules)\b/;
const TYPED_MAX = 14;
const IDLE_MS = 2800;

export function HeroV3({ name, title, availability, resume, email, github, linkedin, next }: HeroProps) {
  const hostRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<Array<HTMLSpanElement | null>>([]);
  const { groundRef, glyphsRef, pausedRef, paused, setPaused, fallback, drawOnce } = useNameField({
    hostRef,
    canvasRef,
    linesRef,
  });
  const [typed, setTyped] = useState(false);

  const lines = () => (linesRef.current ?? []).filter((el): el is HTMLSpanElement => el !== null);

  const become = (word: string | null, tint: Tint = "signal") => {
    const host = hostRef.current;
    const glyphs = glyphsRef.current;
    if (!host || !glyphs) return;
    const { points, step } = word ? sampleWord(word, lines(), host) : sampleName(lines(), host);
    // Paused or reduced motion: the name changes in one step, with no flight
    glyphs.retarget(points, step, { tint, snap: pausedRef.current });
    if (pausedRef.current) drawOnce();
  };
  const becomeRef = useRef(become);
  becomeRef.current = become;

  // Typing rewrites the name. Plain printable keys only, never inside a
  // field, and only while the band is on screen, so nothing else on the
  // page loses a keystroke it would have used.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Without an observer to ask, assume the band is in view
    let onScreen = typeof IntersectionObserver === "undefined";
    let buffer = "";
    let idle = 0;
    const seen = onScreen
      ? null
      : new IntersectionObserver(([entry]) => {
          onScreen = entry?.isIntersecting ?? false;
        });
    seen?.observe(host);

    const settle = () => {
      buffer = "";
      becomeRef.current(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (!onScreen || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key === "Escape" && buffer) {
        clearTimeout(idle);
        settle();
        return;
      }
      let changed = false;
      if (event.key === "Backspace" && buffer) {
        buffer = buffer.slice(0, -1);
        changed = true;
      } else if (/^[\p{L}\p{N}!?&@#]$/u.test(event.key) && buffer.length < TYPED_MAX) {
        buffer += event.key;
        changed = true;
      }
      if (!changed) return;
      setTyped(true);
      clearTimeout(idle);
      if (buffer) {
        becomeRef.current(buffer, "ember");
        idle = window.setTimeout(settle, IDLE_MS);
      } else {
        settle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      seen?.disconnect();
      clearTimeout(idle);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const point = (event: MouseEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  };

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
  const [lead, list] = title.split(/:\s(.+)/s);

  // Each standard in the pitch turns the name into itself while it's pointed at
  const standards = (text: string): ReactNode[] =>
    text.split(STANDARDS).map((part, i) =>
      i % 2 ? (
        <span
          key={i}
          className={own.standard}
          onMouseEnter={() => becomeRef.current(part)}
          onMouseLeave={() => becomeRef.current(null)}
        >
          {part}
        </span>
      ) : (
        part
      ),
    );

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
        {!fallback && (
          <span className={own.hint} data-gone={typed || undefined} aria-hidden="true">
            Go on, type something.
          </span>
        )}
      </h1>

      <div className={styles.lower}>
        <p className={styles.title}>
          {lead}
          {list && (
            <>
              : <span className={styles.titleList}>{standards(list)}</span>
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

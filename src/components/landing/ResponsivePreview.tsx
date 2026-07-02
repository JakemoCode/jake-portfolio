import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { Demo, DemoLayerKey } from "../../content/demos";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { neighborSet } from "./previewLayers";
import styles from "./ResponsivePreview.module.css";

/** Each device's real aspect ratio (w/h) and the viewport width it emulates.
 *  The frame is sized to a common content height, so its SHAPE changes per
 *  device (wide-short monitor → tall-narrow phone) rather than just its width;
 *  the readout reports the emulated width, not the on-screen scaled px. */
const CONTENT_H = 480;
const MAX_W = 1280;
const DEVICE: Record<DemoLayerKey, { ar: number; nominal: number }> = {
  desktop: { ar: 16 / 9, nominal: 1440 },
  tablet: { ar: 3 / 4, nominal: 768 },
  mobile: { ar: 9 / 19.5, nominal: 390 },
};

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ResponsivePreview({ demo }: { demo: Demo }) {
  const reduceMotion = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const prevActiveRef = useRef(0);
  const [active, setActive] = useState(0);

  // Upper bound tracks the container: the frame can't display wider than what's
  // available, and the px readout must match — CSS can't feed that back to JS.
  const [maxW, setMaxW] = useState(MAX_W);
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => setMaxW(Math.min(MAX_W, Math.round(el.clientWidth)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const activeLayer = demo.layers[active];
  const spec = DEVICE[activeLayer?.key ?? "desktop"];
  // Fit the device's aspect ratio to the common content height, then clamp to
  // the container width (shrinking height to keep the ratio) when it won't fit.
  let frameW = CONTENT_H * spec.ar;
  let viewH = CONTENT_H;
  if (frameW > maxW) {
    frameW = maxW;
    viewH = maxW / spec.ar;
  }
  frameW = Math.round(frameW);
  viewH = Math.round(viewH);

  // Sync engine: keep active + adjacent layers playing (warm crossfade targets),
  // pause the rest. A (re)warmed or newly promoted layer seeks to the outgoing
  // layer's timestamp so the swap continues rather than restarts.
  useEffect(() => {
    if (reduceMotion) return;
    const vids = videoRefs.current;
    const prev = prevActiveRef.current;
    const master = vids[prev] ?? vids[active];
    const t = master ? master.currentTime : 0;
    const neighbors = neighborSet(active, demo.layers.length);
    vids.forEach((v, i) => {
      if (!v) return;
      if (neighbors.has(i)) {
        if (i !== prev && (i === active || v.paused)) {
          try {
            v.currentTime = t;
          } catch {
            /* seeking before metadata — resyncs on its next promotion */
          }
        }
        void v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
    prevActiveRef.current = active;
  }, [active, reduceMotion, demo.layers.length]);

  return (
    <div className={styles.preview}>
      <div className={styles.controls} role="group" aria-label="Preview at a viewport size">
        {demo.layers.map((layer, i) => (
          <button
            key={layer.key}
            type="button"
            className={styles.sizeBtn}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            {layer.label}
          </button>
        ))}
      </div>

      <div className={styles.stage} ref={stageRef}>
        <div
          className={styles.frame}
          data-reduce={reduceMotion}
          style={{ "--frame-w": frameW, "--view-h": viewH } as CSSProperties}
        >
          <div className={styles.bar}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.url}>{hostOf(demo.url)}</span>
            <span className={styles.mode} aria-hidden="true">
              {activeLayer?.label} · {spec.nominal}px
            </span>
          </div>

          <div className={styles.viewport}>
            {demo.layers.map((layer, i) =>
              reduceMotion ? (
                <img
                  key={layer.key}
                  className={styles.media}
                  data-active={i === active}
                  src={layer.poster}
                  alt=""
                />
              ) : (
                <video
                  key={layer.key}
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  className={styles.media}
                  data-active={i === active}
                  poster={layer.poster}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                >
                  <source src={layer.webm} type="video/webm" />
                  <source src={layer.mp4} type="video/mp4" />
                </video>
              ),
            )}
            <span className={styles.srOnly}>{demo.alt}</span>
          </div>
        </div>
      </div>

      {demo.platforms && demo.platforms.length > 0 && (
        <p className={styles.stack}>
          Built on{" "}
          {demo.platforms.map((p, pi) => (
            <span key={p}>
              <b className={styles.tech}>{p}</b>
              {pi < demo.platforms!.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

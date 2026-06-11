import type { CSSProperties } from "react";
import stone1 from "../../assets/textures/stone-1.jpg";
import stone2 from "../../assets/textures/stone-2.jpg";
import styles from "./FacetBanner.module.css";

/**
 * Between-section "moment": small geometric facets scattered over a pale stone
 * field, deliberately asymmetric (denser left, sparser right) with mixed sizes
 * and orientations. A few facets straddle the top/bottom edge and bleed out of
 * frame into the cream above/below.
 *
 * Parallax (FacetBanner.module.css): the banner declares a named view-timeline
 * (--scroll-over); the facet layer leads and the stone field lags against it
 * over the `cover` range. Static under reduced motion / where unsupported.
 */

type Role = "teal" | "pine" | "tealDeep" | "rust" | "stoneDark";
type Shape = "up" | "down" | "left" | "right";

type Facet = { x: number; y: number; w: string; role: Role; shape: Shape };

const FACETS: Facet[] = [
  { x: 1, y: 36, w: "clamp(64px, 10vw, 158px)", role: "teal", shape: "up" },
  { x: 9, y: 8, w: "clamp(30px, 4vw, 62px)", role: "pine", shape: "down" },
  { x: 3, y: 74, w: "clamp(40px, 5.5vw, 92px)", role: "tealDeep", shape: "right" },
  { x: 20, y: 30, w: "clamp(22px, 3vw, 44px)", role: "rust", shape: "down" },
  { x: 25, y: 56, w: "clamp(28px, 3.5vw, 56px)", role: "teal", shape: "up" },
  { x: 56, y: 30, w: "clamp(22px, 3vw, 46px)", role: "teal", shape: "up" },
  { x: 30, y: 70, w: "clamp(18px, 2.6vw, 38px)", role: "tealDeep", shape: "down" },
  { x: 39, y: 20, w: "clamp(48px, 7vw, 116px)", role: "pine", shape: "up" },
  { x: 48, y: 58, w: "clamp(20px, 2.6vw, 40px)", role: "teal", shape: "left" },
  { x: 64, y: 34, w: "clamp(38px, 5vw, 84px)", role: "teal", shape: "down" },
  { x: 70, y: 10, w: "clamp(26px, 3.4vw, 52px)", role: "tealDeep", shape: "up" },
  { x: 77, y: 30, w: "clamp(24px, 3.2vw, 50px)", role: "pine", shape: "up" },
  { x: 83, y: 50, w: "clamp(32px, 4.2vw, 70px)", role: "stoneDark", shape: "down" },
  { x: 90, y: 24, w: "clamp(44px, 6.5vw, 108px)", role: "teal", shape: "up" },
  // edge-straddlers: bleed out of the band into the cream above/below
  { x: 34, y: -11, w: "clamp(40px, 5.5vw, 92px)", role: "teal", shape: "down" },
  { x: 17, y: 82, w: "clamp(34px, 4.5vw, 72px)", role: "tealDeep", shape: "up" },
  { x: 70, y: 92, w: "clamp(50px, 7vw, 112px)", role: "pine", shape: "up" },
];

export function FacetBanner() {
  const style = {
    "--stone-1": `url(${stone1})`,
    "--stone-2": `url(${stone2})`,
  } as CSSProperties;

  return (
    <div className={styles.banner} style={style} aria-hidden="true">
      <div className={styles.stoneClip}>
        <div className={styles.stoneLayer} />
      </div>
      <div className={styles.facetLayer}>
        {FACETS.map((f, i) => (
          <span
            key={i}
            className={`${styles.facet} ${styles[f.shape]} ${styles[f.role]}`}
            style={{ left: `${f.x}%`, top: `${f.y}%`, width: f.w }}
          />
        ))}
      </div>
    </div>
  );
}

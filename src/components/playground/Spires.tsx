import styles from "./Spires.module.css";
import {
  SPIRES_FACETS,
  SPIRES_VIEWBOX,
  type FacetRole,
} from "./spiresData";

// role → CSS custom property (defined in Spires.module.css). Kept as a lookup so
// the palette is tunable in one place without touching the generated data.
const ROLE_VAR: Record<FacetRole, string> = {
  ink: "var(--sp-ink)",
  slate: "var(--sp-slate)",
  pine: "var(--sp-pine)",
  tealDeep: "var(--sp-teal-deep)",
  teal: "var(--sp-teal)",
  greyMid: "var(--sp-grey-mid)",
  grey: "var(--sp-grey)",
  white: "var(--sp-white)",
};

export function Spires() {
  return (
    <svg
      className={styles.spires}
      viewBox={`0 0 ${SPIRES_VIEWBOX} ${SPIRES_VIEWBOX}`}
      role="img"
      aria-label="Low-poly geometric composition recreated from spires artwork"
      shapeRendering="crispEdges"
    >
      {SPIRES_FACETS.map((f, i) => (
        <polygon key={i} points={f.points} fill={ROLE_VAR[f.role]} />
      ))}
    </svg>
  );
}

import styles from "./SectionRail.module.css";
import { useScrollTick } from "../scrollTick/useScrollTick";

export type RailSection = { id: string; label: string };

export function SectionRail({ sections }: { sections: readonly RailSection[] }) {
  const { active, trackRef, tickRef, markerRef, tickClassName } = useScrollTick({
    targets: () => sections.map(({ id }) => document.getElementById(id)),
    hold: 0.15,
  });

  return (
    <nav className={styles.rail} aria-label="On this page">
      <div ref={trackRef} className={styles.track}>
        <ol className={styles.list}>
          {sections.map((section, i) => (
            <li key={section.id}>
              <a className={styles.link} href={`#${section.id}`} aria-current={i === active ? "location" : undefined}>
                {/* The tick spans the label, not the link's padded box */}
                <span ref={markerRef(i)}>{section.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <span ref={tickRef} className={`${tickClassName} ${styles.tick}`} aria-hidden="true" />
      </div>
    </nav>
  );
}

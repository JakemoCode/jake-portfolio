/* The jute panel from zendeb.com. Used twice on this page: static in the
   masthead, and as the payoff when the wheel lands. The frame geometry lives
   here so the two can't drift apart. */
import styles from "./JuteMount.module.css";
import mountSrc from "../../assets/case-studies/zendeb-art/jute-mount.webp";

type Props = {
  /** Painting to mount. */
  src: string;
  alt: string;
  /** Adds the gold bloom the live site applies to a landed reading. */
  glow?: boolean;
  className?: string;
};

export function JuteMount({ src, alt, glow = false, className }: Props) {
  return (
    <figure
      className={`${styles.panel} ${glow ? styles.glow : ""} ${className ?? ""}`}
      style={{ backgroundImage: `url(${mountSrc})` }}
    >
      <span className={styles.frame}>
        <img src={src} alt={alt} />
      </span>
    </figure>
  );
}

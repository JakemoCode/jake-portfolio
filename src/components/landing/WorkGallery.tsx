import { useRef, useState, type MouseEvent } from "react";
import type { WorkSite } from "../../content/work";
import { work } from "../../content/work";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import styles from "./WorkGallery.module.css";

/** One client site. The still is the resting state; on hover (or a tap on
 *  tablet-down) the real hero entrance plays in place, and the phone inset shows
 *  the same site's mobile layout. The whole tile links to the live site. */
function Tile({ site, reduceMotion }: { site: WorkSite; reduceMotion: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tapped, setTapped] = useState(false);

  // Replay the entrance from its true first frame on each hover; reset on leave
  // so the still can fade back over the (last) frame.
  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play().catch(() => {});
  };
  const stop = () => videoRef.current?.pause();

  // Tablet-down / any no-hover device: tapping the frame plays the hero in place
  // (and reveals it, since there's no hover to trigger the CSS reveal) instead
  // of navigating. "Visit site" stays the tap target for opening the live site;
  // desktop is unchanged (hover plays, whole tile navigates).
  const onFrameTap = (e: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !window.matchMedia("(hover: none), (max-width: 64em)").matches) return;
    e.preventDefault();
    setTapped(true);
    play();
  };

  return (
    <a
      className={`${styles.tile} ${site.feature ? styles.feature : ""}`}
      href={site.url}
      target="_blank"
      rel="noopener"
      aria-label={`Visit ${site.name} (opens in a new tab)`}
      data-playing={tapped || undefined}
      onMouseEnter={reduceMotion ? undefined : play}
      onMouseLeave={reduceMotion ? undefined : stop}
      onFocus={reduceMotion ? undefined : play}
      onBlur={reduceMotion ? undefined : stop}
    >
      <div className={styles.frame} onClick={onFrameTap}>
        <div className={styles.chrome}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.host}>{site.host}</span>
        </div>
        <div className={styles.screen}>
          <img className={styles.still} src={site.heroStill} alt="" />
          {!reduceMotion && (
            <video
              ref={videoRef}
              className={styles.motion}
              src={site.heroWebm}
              muted
              playsInline
              preload="none"
              aria-hidden="true"
            />
          )}
          <span className={styles.phone}>
            <img src={site.mobileStill} alt={`${site.name} on a phone`} />
          </span>
        </div>
      </div>
      <div className={styles.meta}>
        <h3 className={styles.name}>{site.name}</h3>
        <span className={styles.tag}>{site.tag}</span>
        <span className={styles.visit}>
          Visit site
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>
      </div>
    </a>
  );
}

export function WorkGallery() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section className={styles.section} aria-labelledby="work-gallery-title">
      <div className={styles.inner}>
        <h2 id="work-gallery-title" className={`${styles.title} r-rise`}>
          The work, in motion.
        </h2>
        <p className={`${styles.sub} r-up`}>
          <span className={styles.onHover}>Hover</span>
          <span className={styles.onTouch}>Tap</span> a project to watch its hero animate the way it
          does live. The small screen is the same site on a phone. Click through for the real thing.
        </p>

        <div className={styles.gallery}>
          {work.map((site) => (
            <Tile key={site.clientId} site={site} reduceMotion={reduceMotion} />
          ))}
        </div>
      </div>
    </section>
  );
}

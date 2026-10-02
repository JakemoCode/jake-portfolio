import { useState, type ComponentType, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Hero, type HeroProps } from "./Hero";
import { HeroV2 } from "./v2/HeroV2";
import styles from "./HeroSeries.module.css";

/* The hero as a series of versions, stepped through with a small "MOAR!"
   button in its top-right corner. The version lives in ?hero=N, so a reload
   or a shared link lands on the same one. Each step is revealed as a circle
   growing out of the button. */

const versions: Array<ComponentType<HeroProps>> = [Hero, HeroV2];

const readVersion = () => {
  if (typeof window === "undefined") return 0;
  const n = Number(new URLSearchParams(window.location.search).get("hero"));
  return Number.isInteger(n) && n >= 1 && n <= versions.length ? n - 1 : 0;
};

export function HeroSeries(props: HeroProps) {
  const [version, setVersion] = useState(readVersion);
  const Version = versions[version]!;
  const nextVersion = (version + 1) % versions.length;

  const moar = (event: MouseEvent<HTMLButtonElement>) => {
    const swap = () => {
      setVersion(nextVersion);
      const url = new URL(window.location.href);
      url.searchParams.set("hero", String(nextVersion + 1));
      window.history.replaceState(window.history.state, "", url);
    };
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      swap();
      return;
    }
    // The reveal grows from the button's centre
    const box = event.currentTarget.getBoundingClientRect();
    const root = document.documentElement.style;
    root.setProperty("--moar-x", `${box.left + box.width / 2}px`);
    root.setProperty("--moar-y", `${box.top + box.height / 2}px`);
    document.startViewTransition(() => flushSync(swap));
  };

  return (
    <div className={styles.series}>
      <Version key={version} {...props} />
      <p className={styles.control}>
        <span className={styles.version} aria-hidden="true">
          v{version + 1}
        </span>
        <button type="button" className={styles.moar} onClick={moar}>
          <span aria-hidden="true">MOAR!</span>
          <span className={styles.srOnly}>
            Show hero version {nextVersion + 1} of {versions.length}
          </span>
        </button>
      </p>
    </div>
  );
}

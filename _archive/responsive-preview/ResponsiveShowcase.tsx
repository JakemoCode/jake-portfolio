import { useState } from "react";
import { demos } from "../../content/demos";
import { Filmstrip } from "./Filmstrip";
import { ResponsivePreview } from "./ResponsivePreview";
import styles from "./ResponsiveShowcase.module.css";

export function ResponsiveShowcase() {
  const [active, setActive] = useState(0);
  const demo = demos[active];
  if (!demo) return null;

  const items = demos.map((d) => ({
    id: d.clientId,
    name: d.label,
    poster: d.layers[0]?.poster,
  }));

  return (
    <section className={styles.showcase} aria-labelledby="adapt-title">
      <div className={styles.inner}>
        <h2 id="adapt-title" className={`${styles.title} r-rise`}>
          See it adapt.
        </h2>
        <p className={`${styles.sub} r-up`}>
          Pick a screen size and watch the layout adapt across desktop, tablet, and mobile.
        </p>

        {demos.length > 1 && (
          <div className={styles.picker}>
            <Filmstrip
              items={items}
              activeIndex={active}
              onSelect={setActive}
              label="Choose a client site"
            />
          </div>
        )}

        <ResponsivePreview key={demo.clientId} demo={demo} />
      </div>
    </section>
  );
}

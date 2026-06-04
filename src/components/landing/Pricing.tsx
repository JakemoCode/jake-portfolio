import styles from "./Pricing.module.css";

export function Pricing() {
  return (
    <section className={styles.section} aria-labelledby="pricing-title">
      <div className={styles.inner}>
        <h2 id="pricing-title" className={`${styles.title} r-rise`}>
          What it costs.
        </h2>
        <p className={`${styles.lede} r-up`}>
          Every project&rsquo;s a little different, so these are starting points.
          After a quick chat, I&rsquo;ll give you one honest, fixed price. No
          surprises, no hourly meter running.
        </p>

        <div className={styles.grid}>
          <div className={`${styles.col} r-up`}>
            <h3 className={styles.colHead}>
              <span className={styles.tri} aria-hidden="true" />
              Build something new
            </h3>
            <p className={styles.priceRow}>
              <span className={styles.label}>One-page site</span>
              <span className={styles.price}>
                <span className={styles.from}>from</span> $1,200
              </span>
            </p>
            <p className={styles.priceRow}>
              <span className={styles.label}>Full multi-page site</span>
              <span className={styles.price}>
                <span className={styles.from}>from</span> $3,000
              </span>
            </p>
          </div>

          <div className={`${styles.col} r-up`}>
            <h3 className={styles.colHead}>
              <span className={styles.tri} aria-hidden="true" />
              Fix what&rsquo;s there
            </h3>
            <p className={styles.priceRow}>
              <span className={styles.label}>Repairs and refreshes</span>
              <span className={styles.price}>
                <span className={styles.from}>from</span> $500
              </span>
            </p>
            <p className={styles.priceNote}>
              I&rsquo;ll take a look, then quote one flat price to make it right.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

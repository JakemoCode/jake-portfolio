import { AUDIT, FIXES, FEATURE, type Offer } from "../../content/offers";
import styles from "./Sprints.module.css";

function OfferCard({ offer, lead }: { offer: Offer; lead?: boolean }) {
  return (
    <article className={`${styles.card} ${lead ? styles.lead : ""} r-up`}>
      {offer.badge && <span className={styles.badge}>{offer.badge}</span>}
      <div className={styles.cardHead}>
        <h3 className={styles.name}>
          <span className={styles.icon} aria-hidden="true">
            {offer.icon}
          </span>
          {offer.name}
        </h3>
        <p className={offer.quoted ? styles.priceQuote : styles.price}>
          {offer.from && <span className={styles.from}>from</span>}
          {offer.price}
        </p>
      </div>
      {offer.priceNote && <p className={styles.priceNote}>{offer.priceNote}</p>}
      <p className={styles.pitch}>{offer.pitch}</p>

      <details className={styles.details}>
        <summary className={styles.summary}>
          <span className={styles.tri} aria-hidden="true" />
          See what&rsquo;s included
        </summary>
        <ul className={styles.includes}>
          {offer.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}

export function Sprints() {
  return (
    <section
      id="ways-to-start"
      className={styles.section}
      aria-labelledby="sprints-title"
    >
      <div className={styles.inner}>
        <h2 id="sprints-title" className={`${styles.title} r-rise`}>
          Smaller ways to start.
        </h2>
        <p className={`${styles.lede} r-up`}>
          Not ready for a full build, or already have a site that needs help?
          These are smaller, fixed-scope ways to work together &mdash; most start
          with a quick audit and grow from there.
        </p>

        <div className={styles.ladder}>
          <OfferCard offer={AUDIT} lead />

          <div className={styles.pairGroup}>
            <p className={`${styles.pairHead} r-up`}>
              Is your site broken, or just not converting?
            </p>
            <div className={styles.pair}>
              {FIXES.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>

          <OfferCard offer={FEATURE} />
        </div>

        <p className={`${styles.closing} r-up`}>
          <strong>Ready for the whole thing?</strong>{" "}
          <a href="#pricing-title">Full websites start at $1,200 &rarr;</a>
        </p>
      </div>
    </section>
  );
}

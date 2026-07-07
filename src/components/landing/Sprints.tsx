import { AUDIT, FIXES, FEATURE, type Offer } from "../../content/offers";
import styles from "./Sprints.module.css";

function Price({ offer }: { offer: Offer }) {
  if (offer.quoted)
    return <span className={styles.priceQuote}>{offer.price}</span>;
  return (
    <span className={styles.price}>
      {offer.from && <span className={styles.from}>from </span>}
      {offer.price}
    </span>
  );
}

// One offer as a row. `lead` gives the audit a raised surface + its fuller pitch;
// the rest are quiet rows separated by hairlines.
function OfferRow({ offer, lead }: { offer: Offer; lead?: boolean }) {
  return (
    <article className={`${styles.row} ${lead ? styles.lead : ""} r-up`}>
      <div className={styles.head}>
        <h4 className={styles.name}>
          <span className={styles.icon} aria-hidden="true">
            {offer.icon}
          </span>
          {offer.name}
        </h4>
        <p className={styles.priceWrap}>
          <Price offer={offer} />
          {offer.priceNote && (
            <span className={styles.priceNote}>{offer.priceNote}</span>
          )}
        </p>
      </div>

      <p className={styles.blurb}>{lead ? offer.pitch : offer.blurb}</p>

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

// The entry-offer tier. Renders *inside* the Pricing section (no <section>/<h2>
// of its own) on a tinted band, so the whole pricing area reads as one section:
// the full builds are the primary tier, these are the lighter one.
export function Sprints() {
  return (
    <div id="smaller-ways" className={styles.tier}>
      <div className={styles.tierHead}>
        <h3 className={styles.tierTitle}>Smaller ways to start</h3>
        <p className={styles.tierLede}>
          Already have a site, or not ready for a full build? These are smaller,
          fixed-scope ways in, and most begin with a quick audit.
        </p>
      </div>

      <OfferRow offer={AUDIT} lead />

      <p className={styles.selector}>
        Is your site broken, or just not converting?
      </p>
      <div className={styles.rows}>
        {FIXES.map((offer) => (
          <OfferRow key={offer.id} offer={offer} />
        ))}
      </div>

      <div className={styles.rows}>
        <OfferRow offer={FEATURE} />
      </div>
    </div>
  );
}

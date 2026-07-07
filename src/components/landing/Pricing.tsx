import { Sprints } from "./Sprints";
import styles from "./Pricing.module.css";

type Package = {
  name: string;
  price: string;
  from?: boolean;
  pitch: string;
  includes: string[];
};

// Public pricing copy — source of truth is the "Canonical Pricing Structure"
// doc (Notion / Freelance HQ), section 10. Keep the internal per-page formula
// and premium multipliers OUT of here.
const PACKAGES: Package[] = [
  {
    name: "One-page website",
    price: "$1,200",
    pitch:
      "Your whole story on one beautiful, scrolling page. Perfect if you need a strong, simple online home that gets people to reach out.",
    includes: [
      "Custom design in your colors and style",
      "Up to 6 sections (intro, about, services, gallery, testimonials, contact)",
      "Looks great on every device",
      "Contact form, click-to-call, email, and social links",
      "Set up so Google can find you",
      "Three rounds of changes, plus 90 days of tweaks after launch",
    ],
  },
  {
    name: "Multi-page website",
    price: "$3,000",
    from: true,
    pitch:
      "A complete website with room to grow. Several custom pages and real navigation, for when one page isn't enough.",
    includes: [
      "Everything in the one-page site, across all your pages",
      "Starting at 5 custom-designed pages",
      "A cohesive design carried across your whole site",
      "Real navigation that works on every page",
      "Three rounds of changes, plus 90 days of tweaks after launch",
    ],
  },
];

const OWNERSHIP =
  "You provide the words, visual inspiration, and photos. You own it outright, no monthly platform rent.";

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
          {PACKAGES.map((pkg) => (
            <article key={pkg.name} className={`${styles.card} r-up`}>
              <div className={styles.cardHead}>
                <h3 className={styles.name}>{pkg.name}</h3>
                <p className={styles.price}>
                  {pkg.from && <span className={styles.from}>from</span>}
                  {pkg.price}
                </p>
              </div>
              <p className={styles.pitch}>{pkg.pitch}</p>

              <details className={styles.details}>
                <summary className={styles.summary}>
                  <span className={styles.tri} aria-hidden="true" />
                  See what&rsquo;s included
                </summary>
                <ul className={styles.includes}>
                  {pkg.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className={styles.owns}>{OWNERSHIP}</p>
              </details>
            </article>
          ))}
        </div>

        <div className={`${styles.rest} r-up`}>
          <p>
            <strong>Not sure which fits?</strong> Most people start with the
            one-page site and grow into more pages later. Either way, I&rsquo;ll
            point you to the right one, no upsell.
          </p>
        </div>

        <Sprints />
      </div>
    </section>
  );
}

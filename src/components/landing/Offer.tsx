import styles from "./Offer.module.css";

export function Offer() {
  return (
    <section className={styles.section} aria-labelledby="offer-title">
      <div className={styles.inner}>
        <h2 id="offer-title" className={`${styles.title} r-rise`}>
          Two ways I can help.
        </h2>

        <div className={styles.grid}>
          <article className={`${styles.item} r-up`}>
            <h3 className={styles.head}>
              <span className={styles.tri} aria-hidden="true" />
              Build something new
            </h3>
            <p className={styles.body}>
              A website designed around your business: quick to load, easy to read
              on any phone, and simple for you to update once it&rsquo;s live.
            </p>
            <ul className={styles.list}>
              <li>Designed and built start to finish</li>
              <li>Looks right on phones, tablets, and laptops</li>
              <li>Quick updates whenever you need them</li>
            </ul>
          </article>

          <article className={`${styles.item} r-up`}>
            <h3 className={styles.head}>
              <span className={styles.tri} aria-hidden="true" />
              Fix what&rsquo;s there
            </h3>
            <p className={styles.body}>
              Already have a site that feels slow, dated, or broken? I&rsquo;ll
              repair it or rebuild it so it finally works the way you want.
            </p>
            <ul className={styles.list}>
              <li>Track down bugs and broken links</li>
              <li>Refresh the look without a full rebuild</li>
              <li>Add what&rsquo;s missing, like a contact form or booking</li>
              <li>Happy to work with WordPress, Squarespace, or whatever you&rsquo;re on</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

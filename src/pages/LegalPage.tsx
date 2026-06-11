import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { LegalDoc } from "../content/legal";
import styles from "./LegalPage.module.css";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  useEffect(() => {
    document.title = `${doc.title} · Jake Mosher`;
  }, [doc.title]);

  return (
    // Forced light so legal pages stay consistent with the (always-light)
    // landing, regardless of the visitor's OS theme.
    <div className={styles.page} data-theme="light">
      <Link to="/" className={styles.home}>
        ← Jake Mosher
      </Link>

      <main className={styles.main}>
        <h1 className={styles.title}>{doc.title}</h1>
        <p className={styles.effective}>Effective date: {doc.effectiveDate}</p>
        <p className={styles.intro}>{doc.intro}</p>

        {doc.sections.map((section) => (
          <section key={section.heading} className={styles.section}>
            <h2 className={styles.heading}>{section.heading}</h2>
            {section.blocks.map((block, i) =>
              block.type === "ul" ? (
                <ul key={i} className={styles.list}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p key={i} className={styles.para}>
                  {block.text}
                </p>
              ),
            )}
          </section>
        ))}
      </main>

      <footer className={styles.foot}>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/">Home</Link>
      </footer>
    </div>
  );
}

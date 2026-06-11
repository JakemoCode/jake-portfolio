import { Link } from "react-router-dom";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <span className={styles.brand}>Jake Mosher</span>
          <p className={styles.tagline}>Websites built and fixed, without the tech headache.</p>
        </div>

        <nav className={styles.links} aria-label="Footer">
          <a href="mailto:jake@jakemosher.dev">Email</a>
          <a href="https://github.com/JakemoCode" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/the-real-jake-mosher/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <Link to="/portfolio">Engineering portfolio</Link>
        </nav>
      </div>

      <div className={styles.fine}>
        <span>&copy; {new Date().getFullYear()} Jake Mosher</span>
        <span className={styles.legalLinks}>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </span>
      </div>
    </footer>
  );
}

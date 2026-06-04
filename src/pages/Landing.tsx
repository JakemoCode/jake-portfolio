import { Hero } from "../components/landing/Hero";
import { FacetBanner } from "../components/landing/FacetBanner";
import { Offer } from "../components/landing/Offer";
import { Process } from "../components/landing/Process";
import { Proof } from "../components/landing/Proof";
import { Work } from "../components/landing/Work";
import { Contact } from "../components/landing/Contact";
import { SiteFooter } from "../components/landing/SiteFooter";
import styles from "./Landing.module.css";

export function Landing() {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>

      <header className={styles.nav}>
        <span className={styles.brand}>Jake Mosher</span>
        <nav className={styles.navLinks} aria-label="Primary">
          <a href="#work">Work</a>
          <a className={styles.navCta} href="#contact">
            Start a project
          </a>
        </nav>
      </header>

      <main id="main" className={styles.main}>
        <Hero />
        <FacetBanner />
        <Offer />
        <Process />
        <Proof />
        <Work />
        <Contact />
      </main>

      <SiteFooter />
    </div>
  );
}

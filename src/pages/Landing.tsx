import { Hero } from "../components/landing/Hero";
import { FacetBanner } from "../components/landing/FacetBanner";
import { Offer } from "../components/landing/Offer";
import { Process } from "../components/landing/Process";
import { Proof } from "../components/landing/Proof";
import { WorkGallery } from "../components/landing/WorkGallery";
import { CtaBand } from "../components/landing/CtaBand";
import { About } from "../components/landing/About";
import { Contact } from "../components/landing/Contact";
import { SiteFooter } from "../components/landing/SiteFooter";
import { EvasiveCta } from "../components/landing/EvasiveCta";
import { BOUNDS_ATTRIBUTE } from "../components/landing/useEvasiveCta";
import { CONTACT_EMAIL } from "../components/landing/contactForm";
import styles from "./Landing.module.css";

export function Landing() {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>

      <header className={styles.nav} {...{ [BOUNDS_ATTRIBUTE]: "" }}>
        <span className={styles.brand}>Jake Mosher</span>
        <nav className={styles.navLinks} aria-label="Primary">
          <a href="#work">Work</a>
          {/* No punchline here: catching it does what the label promises,
              which is the whole of what is still on offer. */}
          <EvasiveCta
            className={styles.navCta}
            evadingClassName={styles.navCtaEvading}
            onCaught={() => {
              window.location.href = `mailto:${CONTACT_EMAIL}`;
            }}
          >
            Get in touch
          </EvasiveCta>
        </nav>
      </header>

      <main id="main" className={styles.main}>
        <Hero />
        <FacetBanner />
        <Offer />
        <Process />
        <Proof />
        <WorkGallery />
        <CtaBand />
        <About />
        <Contact />
      </main>

      <SiteFooter />
    </div>
  );
}

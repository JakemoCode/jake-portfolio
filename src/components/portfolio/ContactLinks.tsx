import styles from "./ContactLinks.module.css";

type Props = {
  resume: string;
  github: string;
  linkedin: string;
  email: string;
};

export function ContactLinks({ resume, github, linkedin, email }: Props) {
  return (
    <footer className={styles.footer}>
      <p className={styles.eyebrow}>Get in touch</p>
      <nav className={styles.links} aria-label="Contact">
        <a href={`mailto:${email}`} className={styles.link}>
          {email}
        </a>
        <a href={resume} target="_blank" rel="noreferrer" className={styles.link}>
          Résumé (PDF)
        </a>
        <a href={github} target="_blank" rel="noreferrer" className={styles.link}>
          GitHub
          <span aria-hidden="true"> ↗</span>
        </a>
        <a href={linkedin} target="_blank" rel="noreferrer" className={styles.link}>
          LinkedIn
          <span aria-hidden="true"> ↗</span>
        </a>
      </nav>
    </footer>
  );
}

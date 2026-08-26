import { CONTACT_EMAIL } from "./contactForm";
import styles from "./DeclinedNotice.module.css";

/**
 * The punchline, and the only way through. Lives in a live region that mounts
 * empty so it is announced when it lands: screen readers never see the dodge,
 * so the joke has to be in the words.
 */
export function DeclinedNotice({ shown }: { shown: boolean }) {
  return (
    <div role="status" className={styles.region}>
      {shown && (
        <p className={styles.notice}>
          <span className={styles.hal}>
            I&rsquo;m sorry, Dave. I&rsquo;m afraid I can&rsquo;t do that.
          </span>{" "}
          I&rsquo;m not taking on new projects. If you need me anyway, I&rsquo;m at{" "}
          <a className={styles.link} href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      )}
    </div>
  );
}

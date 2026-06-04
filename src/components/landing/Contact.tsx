import meHeadshot from "../../assets/me-headshot.jpg";
import { CONTACT_EMAIL } from "./contactForm";
import { useContactForm } from "./useContactForm";
import styles from "./Contact.module.css";

export function Contact() {
  const { fields, errors, status, setField, submit } = useContactForm();

  return (
    <section className={styles.section} id="contact" aria-labelledby="contact-title">
      <div className={styles.inner}>
        <div className={`${styles.intro} r-up`}>
          <img
            className={styles.avatar}
            src={meHeadshot}
            alt="Jake Mosher"
            width={120}
            height={120}
            loading="lazy"
            decoding="async"
          />
          <h2 id="contact-title" className={styles.title}>
            Let&rsquo;s build something.
          </h2>
          <p className={styles.lede}>
            Tell me what you have in mind. I read every message and reply within a
            day or two.
          </p>
          <p className={styles.direct}>
            Prefer email?{" "}
            <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        {status === "success" ? (
          <div className={styles.success} role="status">
            <p className={styles.successTitle}>Thanks, {fields.name.split(" ")[0]}.</p>
            <p>Your message is on its way. I&rsquo;ll reply within a day or two.</p>
          </div>
        ) : (
          <form
            className={`${styles.form} r-up`}
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            noValidate
          >
            <div className={styles.field}>
              <label htmlFor="cf-name">Your name</label>
              <input
                id="cf-name"
                name="name"
                type="text"
                value={fields.name}
                onChange={(e) => setField("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "cf-name-err" : undefined}
              />
              {errors.name && (
                <p className={styles.err} id="cf-name-err">
                  {errors.name}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="cf-email">Email</label>
              <input
                id="cf-email"
                name="email"
                type="email"
                value={fields.email}
                onChange={(e) => setField("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "cf-email-err" : undefined}
              />
              {errors.email && (
                <p className={styles.err} id="cf-email-err">
                  {errors.email}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="cf-message">What do you need?</label>
              <textarea
                id="cf-message"
                name="message"
                rows={5}
                value={fields.message}
                onChange={(e) => setField("message", e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "cf-message-err" : undefined}
              />
              {errors.message && (
                <p className={styles.err} id="cf-message-err">
                  {errors.message}
                </p>
              )}
            </div>

            {status === "error" && (
              <p className={styles.formError} role="alert">
                Something went wrong sending that. Email me directly at{" "}
                <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            )}

            <button className={styles.submit} type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

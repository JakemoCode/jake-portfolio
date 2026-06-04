import { useState, type ChangeEvent, type FormEvent } from "react";
import meHeadshot from "../../assets/me-headshot.jpg";
import styles from "./Contact.module.css";

const EMAIL = "jake@jakemosher.dev";

// Formspree endpoint (free hosted form handler). Submissions POST here and land
// in Jake's inbox; the visitor never leaves the page.
const FORM_ENDPOINT = "https://formspree.io/f/mqeoaawe";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "submitting" | "success" | "error";

function validate(f: Fields): Errors {
  const errors: Errors = {};
  if (!f.name.trim()) errors.name = "Let me know who you are.";
  if (!f.email.trim()) errors.email = "I'll need an email to reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = "That email looks off.";
  if (!f.message.trim()) errors.message = "Tell me a little about what you need.";
  return errors;
}

export function Contact() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function update(key: keyof Fields) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

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
            <a className={styles.email} href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
        </div>

        {status === "success" ? (
          <div className={styles.success} role="status">
            <p className={styles.successTitle}>Thanks, {fields.name.split(" ")[0]}.</p>
            <p>Your message is on its way. I&rsquo;ll reply within a day or two.</p>
          </div>
        ) : (
          <form className={`${styles.form} r-up`} onSubmit={onSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="cf-name">Your name</label>
              <input
                id="cf-name"
                name="name"
                type="text"
                value={fields.name}
                onChange={update("name")}
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
                onChange={update("email")}
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
                onChange={update("message")}
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
                <a className={styles.email} href={`mailto:${EMAIL}`}>
                  {EMAIL}
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

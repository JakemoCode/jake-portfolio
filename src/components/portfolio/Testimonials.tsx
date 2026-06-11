import styles from "./Testimonials.module.css";
import { testimonials } from "../../content/testimonials";

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading" className={styles.eyebrow}>
        Testimonials
      </h2>

      <ul className={styles.grid}>
        {testimonials.map((testimonial) => (
          <li key={testimonial.id}>
            <figure className={styles.card}>
              <blockquote className={styles.quote}>{testimonial.quote}</blockquote>
              <figcaption className={styles.attribution}>
                <cite className={styles.name}>{testimonial.name}</cite>
                <span className={styles.role}>
                  {testimonial.link ? (
                    <a href={testimonial.link} target="_blank" rel="noreferrer">
                      {testimonial.role}
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  ) : (
                    testimonial.role
                  )}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

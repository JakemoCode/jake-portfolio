import styles from "./Process.module.css";

const STEPS = [
  {
    n: "01",
    title: "We talk",
    body: "Tell me what you need. No jargon, no pressure. I'll tell you honestly what it takes and what it costs.",
  },
  {
    n: "02",
    title: "I design and build",
    body: "You watch it come together, with check-ins along the way so nothing is a surprise at the end.",
  },
  {
    n: "03",
    title: "You go live",
    body: "I launch it, make sure everything works, and show you how to run it. It's yours to keep.",
  },
  {
    n: "04",
    title: "I stick around",
    body: "Need a fix or a tweak later? I'm still here. No disappearing act once the invoice clears.",
  },
];

export function Process() {
  return (
    <section className={styles.section} aria-labelledby="process-title">
      <div className={styles.inner}>
        <h2 id="process-title" className={`${styles.title} r-rise`}>
          How it works.
        </h2>

        <ol className={styles.steps}>
          {STEPS.map((s) => (
            <li className={`${styles.step} r-up`} key={s.n}>
              <span className={styles.num} aria-hidden="true">
                {s.n}
              </span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepBody}>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

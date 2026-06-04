import { Link } from "react-router-dom";
import { projects } from "../../content/projects";
import styles from "./Work.module.css";

// Client-facing blurbs (outcome first). The engineering detail lives on /portfolio.
const BLURBS: Record<string, string> = {
  "coffee-roast-tracker":
    "A web app that lets home coffee roasters track their roasts, compare them, and share recipes with other roasters. I built the whole thing: the site, the accounts, the database, file uploads, and all.",
  "baby-day-planner":
    "An app that plans a baby's day, then quietly re-plans it the moment real life happens. Built for tired parents who needed one less thing to keep track of.",
};

export function Work() {
  return (
    <section className={styles.section} id="work" aria-labelledby="work-title">
      <div className={styles.inner}>
        <h2 id="work-title" className={`${styles.title} r-rise`}>
          Recent work.
        </h2>
        <p className={`${styles.lede} r-up`}>
          A couple of things I have designed and built end to end.
        </p>

        <div className={styles.list}>
          {projects.map((project) => (
            <article className={`${styles.project} r-up`} key={project.slug}>
              {project.screenshot && (
                <div
                  className={`${styles.shotWrap} ${
                    project.screenshot.orientation === "phone" ? styles.phone : styles.landscape
                  }`}
                >
                  <img
                    className={styles.shot}
                    src={project.screenshot.src}
                    alt={project.screenshot.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className={styles.detail}>
                <h3 className={styles.name}>{project.name}</h3>
                <p className={styles.blurb}>{BLURBS[project.slug] ?? project.summary}</p>
                {project.liveUrl && (
                  <a
                    className={styles.visit}
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit the site
                    <span aria-hidden="true"> &rarr;</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <p className={`${styles.more} r-up`}>
          <Link to="/portfolio" className={styles.moreLink}>
            See the engineering side of my work
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </p>
      </div>
    </section>
  );
}

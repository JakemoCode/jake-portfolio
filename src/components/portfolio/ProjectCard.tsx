import styles from "./ProjectCard.module.css";
import type { Project, Screenshot } from "../../content/projects";

type Props = {
  project: Project;
};

function renderScreenshot(screenshot: Screenshot) {
  if (screenshot.orientation === "phone") {
    return (
      <div className={styles.phoneFrame}>
        <img src={screenshot.src} alt={screenshot.alt} className={styles.phoneImage} />
      </div>
    );
  }
  return <img src={screenshot.src} alt={screenshot.alt} className={styles.landscapeImage} />;
}

export function ProjectCard({ project }: Props) {
  const isComingSoon = project.status === "coming-soon";
  const { screenshot } = project;
  const mediaClass = [styles.media, screenshot?.orientation === "phone" && styles.mediaPhone]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={styles.card}>
      <div className={mediaClass}>
        {screenshot ? (
          renderScreenshot(screenshot)
        ) : (
          <span className={styles.mediaLabel} aria-hidden="true">
            Screenshot
          </span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <h2 className={styles.name}>{project.name}</h2>
          {isComingSoon && <span className={styles.badge}>Coming soon</span>}
        </div>

        <p className={styles.summary}>{project.summary}</p>

        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Problem</h3>
          <p className={styles.sectionBody}>{project.problem}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>What I built</h3>
          <p className={styles.sectionBody}>{project.built}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Tech</h3>
          <ul className={styles.techList}>
            {project.tech.map((item) => (
              <li key={item} className={styles.tech}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.links}>
          {project.liveUrl ? (
            <a
              className={styles.linkPrimary}
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              Live site
              <span aria-hidden="true"> ↗</span>
            </a>
          ) : (
            <span className={styles.linkDisabled}>
              {project.liveLabel ?? "Live demo coming soon"}
            </span>
          )}
          <a
            className={styles.linkSecondary}
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
          >
            Repo
            <span aria-hidden="true"> ↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

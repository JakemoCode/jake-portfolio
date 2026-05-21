import styles from "./App.module.css";
import { Hero } from "./components/Hero";
import { ProjectCard } from "./components/ProjectCard";
import { ContactLinks } from "./components/ContactLinks";
import { ThemeToggle } from "./components/ThemeToggle";
import { projects } from "./content/projects";

export function App() {
  return (
    <div className={styles.page}>
      <ThemeToggle />
      <main className={styles.main}>
        <Hero
          name="Jake Mosher"
          tagline={
            <>
              UI/UX engineer building calm, opinionated product software.
              <br />
              Full-stack when it matters, frontend by default.
            </>
          }
        />

        <section className={styles.projects} aria-label="Projects">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </section>

        <ContactLinks
          github="https://github.com/JakemoCode"
          linkedin="https://www.linkedin.com/in/the-real-jake-mosher/"
          email="jake136@yahoo.com"
        />
      </main>
    </div>
  );
}

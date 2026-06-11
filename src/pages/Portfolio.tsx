import { Link } from "react-router-dom";
import styles from "./Portfolio.module.css";
import { Hero } from "../components/portfolio/Hero";
import { ProjectCard } from "../components/portfolio/ProjectCard";
import { Testimonials } from "../components/portfolio/Testimonials";
import { ContactLinks } from "../components/portfolio/ContactLinks";
import { ThemeToggle } from "../components/portfolio/ThemeToggle";
import { projects } from "../content/projects";

export function Portfolio() {
  return (
    <div className={styles.page}>
      {/* Fixed utility controls, wrapped in a banner landmark so all content
          lives inside a landmark (a11y: axe "region"). The children are
          position:fixed, so the header itself takes no layout space. */}
      <header>
        <Link to="/" className={styles.home} aria-label="Jake Mosher — home">
          <span aria-hidden="true">&#10022;</span>
        </Link>
        <ThemeToggle />
      </header>
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

        <Testimonials />

        <ContactLinks
          github="https://github.com/JakemoCode"
          linkedin="https://www.linkedin.com/in/the-real-jake-mosher/"
          email="jake@jakemosher.dev"
        />
      </main>
    </div>
  );
}

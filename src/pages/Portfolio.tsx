import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./Portfolio.module.css";
import { Hero } from "../components/portfolio/hero/Hero";
import { ProjectCard } from "../components/portfolio/ProjectCard";
import { ExperienceStrip } from "../components/portfolio/ExperienceStrip";
import { Recommendations } from "../components/portfolio/Recommendations";
import { ContactLinks } from "../components/portfolio/ContactLinks";
import { ThemeToggle } from "../components/portfolio/ThemeToggle";
import { projects } from "../content/projects";
import { CaseStudyTeaser } from "../components/portfolio/CaseStudyTeaser";
import { caseStudies } from "../content/caseStudies";
import { Methodology } from "../components/portfolio/methodology/Methodology";
import { SectionRail, type RailSection } from "../components/portfolio/rail/SectionRail";

const contact = {
  email: "jake@jakemosher.dev",
  github: "https://github.com/JakemoCode",
  linkedin: "https://www.linkedin.com/in/the-real-jake-mosher/",
  // A copy of career-context/resumes; replace the file when the résumé changes
  resume: "/jake-mosher-resume.pdf",
};

const sections = [
  { id: "experience", label: "Experience" },
  { id: "case-study", label: "Case study" },
  { id: "what-i-build", label: "What I build" },
  { id: "how-i-work", label: "How I work with AI" },
  { id: "tools", label: "Tools I recommend" },
  { id: "contact", label: "Contact" },
] as const satisfies readonly RailSection[];

type SectionId = (typeof sections)[number]["id"];

/** A rail stop: the anchor target the rail links to and measures. */
function Stop({ id, children }: { id: SectionId; children: ReactNode }) {
  return (
    <div id={id} className={styles.stop}>
      {children}
    </div>
  );
}

export function Portfolio() {
  const caseStudy = caseStudies[0];
  // The rail lists only the stops that render, or a missing one is a dead link
  const stops = caseStudy ? sections : sections.filter(({ id }) => id !== "case-study");

  return (
    <div className={styles.page}>
      {/* Fixed utility controls, wrapped in a banner landmark so all content
          lives inside a landmark (a11y: axe "region"). The children are
          position:fixed, so the header itself takes no layout space. */}
      <header>
        <Link to="/" className={styles.home} aria-label="Jake Mosher, home">
          <span aria-hidden="true">&#10022;</span>
        </Link>
        <ThemeToggle />
      </header>
      <main>
        <Hero
          name="Jake Mosher"
          title="Front-end and product engineer. I hold AI-written code to the standards we set for human teammates: review, tests, and rules that enforce themselves."
          availability={{
            status: "Open to front-end, product and software engineering roles",
            detail: ["Seven years on React and TypeScript", "US Mountain Time"],
          }}
          next={{ href: "#experience", label: "Start with where I've worked" }}
          {...contact}
        />

        <div className={styles.layout}>
          <SectionRail sections={stops} />

          <div className={styles.content}>
            <Stop id="experience">
              <ExperienceStrip />
            </Stop>

            {caseStudy && (
              <Stop id="case-study">
                <CaseStudyTeaser study={caseStudy} />
              </Stop>
            )}

            <Stop id="what-i-build">
              <section className={styles.projects} aria-labelledby="what-i-build-heading">
                <h2 id="what-i-build-heading" className={styles.sectionHeading}>
                  What I build
                </h2>
                {projects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </section>
            </Stop>

            <Stop id="how-i-work">
              <Methodology />
            </Stop>

            <Stop id="tools">
              <Recommendations />
            </Stop>

            <Stop id="contact">
              <ContactLinks {...contact} />
            </Stop>
          </div>
        </div>
      </main>
    </div>
  );
}

// The experience strip on /portfolio, newest first: a sparse résumé. Facts
// come from the résumé in career-context; the family-leave dates are Jake's.
// Shared systems are "worked with" or "contributed", never sole ownership.

export type Stint = {
  period: string;
  title: string;
  role?: string;
  details?: string[];
};

export const experience: Stint[] = [
  {
    period: "2026",
    title: "Mosher Web Development",
    role: "Founder · solo, freelance",
    details: [
      "Designed and built three client sites end to end, including a full-custom React and TypeScript build.",
      "Every project runs through an AI-assisted pipeline with a WCAG 2.2 AA audit as a gate.",
    ],
  },
  {
    period: "Oct 2025 to Apr 2026",
    title: "Family leave",
  },
  {
    period: "Jan 2022 to Oct 2025",
    title: "Handshake",
    role: "Software Engineer",
    details: [
      "Led front end for the Employer Brand page, a product generating $9.5M in revenue across about 500 customers and seen by students across a network of about 20 million.",
      "Built to render across multiple permission and content contexts, working closely with the backend engineers and the Feed team.",
      "Built the analytics UI for the company's first ads product, on Rails and GraphQL with Apollo.",
      "Rebuilt Employers Search, moving legacy React and Redux onto hooks and Apollo in TypeScript, working with Design on accessibility.",
      "Worked with the Front-End Platform team to standardize card patterns in the shared component libraries.",
      "Tested across the stack on nearly everything shipped: Jest and React Testing Library on the front end, RSpec and Capybara end to end.",
    ],
  },
  {
    period: "Aug 2021 to Dec 2021",
    title: "Demoflow",
    role: "Software Engineer",
  },
  {
    period: "Jun 2019 to Aug 2021",
    title: "Uplight (Simple Energy)",
    role: "Associate Software Engineer",
    details: ["Rebuilt the rebate enrollment flows on utility marketplaces serving 30 million energy customers, which drove 100K+ redemptions in their first month."],
  },
];

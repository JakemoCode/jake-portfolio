export type Testimonial = {
  id: string;
  /** Joins to a live site in work.ts when the client also has a gallery tile. */
  clientId: string;
  /** Business name. */
  client: string;
  quote: string;
  /** The person quoted. */
  name: string;
  role: string;
  /** Live site, surfaced as the "See it live" link under the quote. */
  link?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-arbor",
    clientId: "arbor",
    client: "Arbor Gymnastics",
    quote:
      "Jake helped improve the user experience on my Squarespace website for my business, Arbor Gymnastics. He streamlined both the home page and class registration pages, with one of the biggest improvements being the reorganization of our class listings into age-specific sections. This makes it much easier for parents to quickly find the right class for their child. He was communicative, responsive to feedback, and did a great job preserving the look, feel, and color palette that reflect our brand. The process felt collaborative, and the final result is a cleaner, more professional website that's easier for families to navigate.",
    name: "Morgan Berry",
    role: "Owner, Arbor Gymnastics LLC",
    link: "https://www.arborgymnastics.com/",
  },
  {
    id: "testimonial-jyotish",
    clientId: "jyotish",
    client: "Jyotish Tarot",
    quote:
      "I had an idea for an online reader for my Jyotish Tarot deck, and Jake had it programmed almost immediately. Within a day, he created a system that shuffles the 36 cards, lays out the spread, and displays the card descriptions so visitors can interact with the deck directly on my website. I was amazed at how quickly he took an abstract concept and turned it into a smooth, professional tool that works exactly the way I envisioned.",
    name: "Debora Bowley",
    role: "Founder/Author, Jyotish Tarot",
    link: "https://jyotishtarot.com/free-jyotish-tarot-reading/",
  },
];

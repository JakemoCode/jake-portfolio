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
    id: "testimonial-zendeb",
    clientId: "zendeb",
    client: "Zendeb",
    quote:
      "Jake took a dream and a few scribbled notes and turned them into a work of art. The Nakshatra wheel is remarkable: the symbols, the color, the way it spins and then slowly comes to rest when you click to stop it, feels like exploring something timeless. He was always coming up with ideas that delighted me, and the result went far beyond what I pictured. I highly recommend Jake for your own website dreams.",
    name: "Debora Bowley",
    role: "Founder, Zendeb",
    link: "https://zendeb.com/",
  },
  {
    id: "testimonial-victoria",
    clientId: "victoria",
    client: "Victoria Grace Real Estate",
    quote:
      "I had been playing around with the idea of personalizing a website for years, but I was never happy with the pricing or concepts offered to me from previous designers. I reached out to Jake to discuss building a site that was simple, easy to navigate, and true to my brand. Within a day we were collaborating and discussing content ideas. Jake is passionate about his work and it shows. From start to finish, I had a live website in less than a week. He involves you as a client and makes sure you are happy with the finished results.",
    name: "Victoria Grace",
    role: "Realtor, Victoria Grace Real Estate",
    link: "https://victoriagracerealestate.com/",
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

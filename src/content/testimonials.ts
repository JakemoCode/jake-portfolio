import arborWebm from "../assets/clients/arbor-loop.webm";
import arborMp4 from "../assets/clients/arbor-loop.mp4";
import arborPoster from "../assets/clients/arbor-poster.jpg";
import jyotishWebm from "../assets/clients/jyotish-loop.webm";
import jyotishMp4 from "../assets/clients/jyotish-loop.mp4";
import jyotishPoster from "../assets/clients/jyotish-poster.jpg";

export type ClientPreview = {
  /** Looping, muted, autoplaying capture of the live client site. */
  webm: string;
  mp4: string;
  /** Shown before the video plays and as the still under prefers-reduced-motion. */
  poster: string;
  alt: string;
};

export type Testimonial = {
  id: string;
  /** Business name — used in the filmstrip and the frame's URL pill context. */
  client: string;
  quote: string;
  /** The person quoted. */
  name: string;
  role: string;
  link?: string;
  /** Captions the preview frame: "Built on X · Y". */
  platforms?: string[];
  /** Short filmstrip descriptor; falls back to platforms joined with " · ". */
  tag?: string;
  preview?: ClientPreview;
};

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-arbor",
    client: "Arbor Gymnastics",
    quote:
      "Jake helped improve the user experience on my Squarespace website for my business, Arbor Gymnastics. He streamlined both the home page and class registration pages, with one of the biggest improvements being the reorganization of our class listings into age-specific sections. This makes it much easier for parents to quickly find the right class for their child. He was communicative, responsive to feedback, and did a great job preserving the look, feel, and color palette that reflect our brand. The process felt collaborative, and the final result is a cleaner, more professional website that's easier for families to navigate.",
    name: "Morgan Berry",
    role: "Owner, Arbor Gymnastics LLC",
    link: "https://www.arborgymnastics.com/",
    platforms: ["Squarespace", "Jackrabbit"],
    preview: {
      webm: arborWebm,
      mp4: arborMp4,
      poster: arborPoster,
      alt: "The Arbor Gymnastics site scrolling through its class listings, reorganized into age-specific sections.",
    },
  },
  {
    id: "testimonial-jyotish",
    client: "Jyotish Tarot",
    quote:
      "I had an idea for an online reader for my Jyotish Tarot deck, and Jake had it programmed almost immediately. Within a day, he created a system that shuffles the 36 cards, lays out the spread, and displays the card descriptions so visitors can interact with the deck directly on my website. I was amazed at how quickly he took an abstract concept and turned it into a smooth, professional tool that works exactly the way I envisioned.",
    name: "Debora Bowley",
    role: "Founder/Author, Jyotish Tarot",
    link: "https://jyotishtarot.com/free-jyotish-tarot-reading/",
    platforms: ["WordPress"],
    tag: "Custom card reader",
    preview: {
      webm: jyotishWebm,
      mp4: jyotishMp4,
      poster: jyotishPoster,
      alt: "The custom Jyotish Tarot reader shuffling the deck and laying out a spread of cards.",
    },
  },
];

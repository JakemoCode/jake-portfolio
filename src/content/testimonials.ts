export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  link?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-01",
    quote:
      "I had an idea for an online reader for my Jyotish Tarot deck, and Jake had it programmed almost immediately. Within a day, he created a system that shuffles the 36 cards, lays out the spread, and displays the card descriptions so visitors can interact with the deck directly on my website. I was amazed at how quickly he took an abstract concept and turned it into a smooth, professional tool that works exactly the way I envisioned.",
    name: "Debora Bowley",
    role: "Founder/Author @ Jyotish Tarot",
    link: "https://jyotishtarot.com/free-jyotish-tarot-reading/"
  },
  {
    id: "testimonial-02",
    quote:
      "For months with our new baby, I spent a ton of time every day manually creating and updating a google doc with our baby's projected schedule for the day. Jake saved me hours every week by creating an app that does all this work for me, while also significantly improving upon the manual process. The timeline view makes it so easy to visualize the day, the ability to add custom activities helps us plan around our other life events, and the ownership feature eliminated lengthy conversations about division of labor.",
    name: "Kelly Mosher",
    role: "Wife, Key Stakeholder in Baby Day Planner",
  },
];

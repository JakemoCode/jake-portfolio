import birthCard from "../assets/case-studies/zendeb-art/birth-card.webp";
import sunCard from "../assets/case-studies/zendeb-art/sun-card.webp";
import nakshatraPainting from "../assets/case-studies/zendeb-art/nakshatra-painting.webp";
import nakshatraGlyph from "../assets/case-studies/zendeb-art/nakshatra-glyph.svg";

/* Long-form case studies. Body sections are rendered in order by
   pages/CaseStudy.tsx; a section may pull in a live demo by id. */

export type CaseStudySection = {
  heading: string;
  /** Paragraphs of body copy. */
  body: string[];
  /** Optional pull quote shown after the body. */
  pullQuote?: string;
  /** Renders an interactive demo after the body. */
  demo?: "nakshatra-wheel";
  /** Optional annotated code excerpt. */
  code?: { caption: string; language: string; source: string };
  /** One representative asset per family, shown as visual proof of coherence. */
  gallery?: { src: string; alt: string; label: string; note: string }[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  role: string;
  year: string;
  /** One line, used on the card and as the meta description. */
  summary: string;
  /** The opening statement. Two or three sentences at most. */
  lede: string;
  stack: string[];
  liveUrl?: string;
  sections: CaseStudySection[];
};

const zendeb: CaseStudy = {
  slug: "zendeb",
  title: "Teaching a machine to have one opinion",
  client: "Zendeb",
  role: "Design engineer, sole builder",
  year: "2026",
  summary:
    "Building a repeatable system for AI-generated artwork across three decks and 91 illustrations, then hand-tuning the interaction physics of the wheel it lives on.",
  lede: "Two problems sat at opposite ends of the same site. Hundreds of illustrations had to look like they came from one artist, and a spinning wheel had to feel good enough that people would use it twice. Neither was solved by writing better prompts or reaching for an easing curve.",
  stack: ["WordPress", "PHP", "Vanilla JS", "SVG", "AI image generation"],
  liveUrl: "https://zendeb.com",
  sections: [
    {
      heading: "The problem was consistency, not quality",
      body: [
        "Early on I was generating images one at a time and judging each one on its own merits. Individually they were fine. Together they were a disaster. Colors shifted between pieces, compositions drifted, symbols changed meaning, and the site started to look like it had been illustrated by twenty different artists who had never spoken.",
        "That is the failure mode nobody warns you about. Any single output can be good while the set is incoherent, and a visitor experiences the set. I wanted someone landing on the site to feel that every piece came from one creative vision, which is a property of the whole body of work rather than any image in it.",
        "Writing better prompts could not fix that, because the unit of work was wrong. So I stopped treating it as a writing problem and started treating it like a software problem.",
      ],
    },
    {
      heading: "Prompts became a design system",
      body: [
        "Instead of describing pictures, I built reusable templates that encoded a visual language: composition, color palette, lighting, symbolism, negative space, and an explicit list of things the model should avoid. Each template was a contract for a category of asset rather than a description of one image.",
        "The loop was the important part. Every iteration taught me something, and whenever a pattern reliably produced better results, I folded it back into the template rather than keeping it in my head. Over time the templates accumulated the judgment I had been applying manually, which is exactly what a design system does for a team.",
        "Three separate decks came out of it: 52 birth cards, 12 sun-in-signs cards, and 27 nakshatra paintings, plus a matching set of 27 glyphs and the site's hero and editorial imagery. Each family got rules specific to its purpose while inheriting the same underlying language. A playing card and a nakshatra painting need different compositions, but they should not look like they were made by different people.",
        "That is the part the system had to earn. One good image proves nothing. Ninety-one of them, made weeks apart, across three decks, still agreeing with each other is the only real evidence that the process worked.",
      ],
      pullQuote:
        "It felt much less like prompt engineering and much more like building a design system.",
      gallery: [
        { src: birthCard, alt: "Ace of hearts birth card", label: "Birth cards", note: "52 pieces" },
        { src: sunCard, alt: "Leo sun-in-signs card", label: "Sun in signs", note: "12 pieces" },
        { src: nakshatraPainting, alt: "Revati nakshatra painting", label: "Nakshatra paintings", note: "27 pieces" },
        { src: nakshatraGlyph, alt: "Revati nakshatra glyph", label: "Glyphs", note: "27 pieces, SVG" },
      ],
    },
    {
      heading: "Telling it what not to do",
      body: [
        "The single biggest gain came from removing ambiguity. Saying what to avoid turned out to be as important as saying what to make. Vague artistic description invites the model to fill gaps with whatever it likes, and it likes something different every time.",
        "Replacing that with concrete constraints on composition, visual complexity, color, historical reference, and symbolic accuracy made the output dramatically more predictable. The prompts got longer and less poetic, and the results got more consistent.",
        "The glyphs are the clearest example. Generating a finished glyph in one shot was unreliable, so I split it into stages: first a simple black-and-white silhouette optimized purely for legibility at small UI sizes, then a conversion of the approved silhouette into a clean production SVG. Breaking the problem into stages, with a human decision between them, beat any single prompt I could write.",
      ],
    },
    {
      heading: "Then it had to feel right",
      body: [
        "The 27 glyphs live on a wheel you spin. It draws a nakshatra by letting you stop it wherever you like: the glyph under the needle when you press stop is the result, and the wheel coasts to rest exactly on it.",
        "That sounds simple and it is not. Three constraints have to hold at once, and they actively fight each other. It has to land on the glyph you stopped it on. It has to coast at least a full turn, so an early tap still reads as a spin rather than a halt. And it has to take a believable amount of time no matter how fast the wheel happened to be moving.",
        "Try it. Stop it early, stop it late, stop it the instant it starts moving.",
      ],
      demo: "nakshatra-wheel",
    },
    {
      heading: "The bug that taught me the most",
      body: [
        "My first version derived the slow-down duration from the actual angular velocity, which is what the physics says to do. It was correct and it was unusable. Stopping the wheel almost immediately after starting it planned a deceleration of roughly 58 seconds, because the velocity was near zero and the math dutifully stretched the coast to match.",
        "The fix was to decouple duration from real speed and tie it to a reference velocity near cruise instead. Distance still respects the actual momentum, so a fast spin genuinely travels further, but time stays in a human range. A gentle tap now spins a full turn in a few seconds.",
        "There was a second, smaller version of the same lesson. Folding the realignment into the turn count, rather than adding a separate full turn, stopped a slow stop from being a coin flip between one turn and two depending on which side of the needle it happened to be on.",
      ],
      code: {
        caption:
          "The line that matters. Duration is bounded by refVel, not by how fast it was actually going.",
        language: "ts",
        source: `const physical = (v0 * v0) / (2 * decel);
const target = Math.max(360, physical);   // always at least one turn

const aFinal = aligned + 360 * Math.round((angle + target - aligned) / 360);
const D = aFinal - angle;

return { aFinal, D, T: (3 * D) / refVel, index: chosen };`,
      },
    },
    {
      heading: "Unit-testing a feeling",
      body: [
        "Because the landing math is pure, the parts of it that are subjective could be pinned down as bounds. The suite asserts that the wheel rests exactly on the glyph that was under the needle, that at or below cruise speed the coast is about one turn and never a double spin, and that a quick tap takes longer than a second and less than five.",
        "None of those numbers are objectively correct. They are taste, written down. But once written down they stop being re-litigated every time the easing changes, and a regression that makes the wheel feel wrong fails a test instead of shipping.",
        "That is the part I would defend hardest. The interesting question is never whether AI can produce a thing. It is whether you have built a process dependable enough to produce hundreds of them, and a way to know when the result stops being good.",
      ],
    },
    {
      heading: "What I took from it",
      body: [
        "AI did not remove the design work. It moved it. The effort shifted away from making individual artifacts and toward defining systems, establishing constraints, and iterating until the process itself was dependable.",
        "The same shape showed up on both halves of this project. The artwork needed a template system with explicit negative constraints. The wheel needed a model with explicit bounds on how it should feel. In both cases the work was encoding judgment so it could be applied repeatedly, rather than applying it by hand every time.",
      ],
    },
  ],
};

export const caseStudies: CaseStudy[] = [zendeb];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

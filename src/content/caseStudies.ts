import ashwini from "../assets/case-studies/zendeb-art/ashwini.webp";
import birthCard from "../assets/case-studies/zendeb-art/birth-card.webp";
import sunCard from "../assets/case-studies/zendeb-art/sun-card.webp";
import nakshatraPainting from "../assets/case-studies/zendeb-art/nakshatra-painting.webp";
import nakshatraGlyph from "../assets/case-studies/zendeb-art/nakshatra-glyph.svg?raw";

/* Long-form case studies. Body sections are rendered in order by
   pages/CaseStudy.tsx; a section may pull in a live demo by id. */

export type CaseStudySection = {
  heading: string;
  /** Paragraphs of body copy. */
  body: string[];
  /** Renders the whole section as a self-contained card, so an aside reads as
      an aside and the narrative resumes cleanly after it. */
  variant?: "card";
  /** Transferable principles, rendered as a list. Deliberately unnumbered:
      they are independent, not a sequence. */
  principles?: { title: string; body: string }[];
  /** Renders an interactive demo after the body. */
  demo?: "nakshatra-wheel";
  /** Optional annotated code excerpt. */
  code?: { caption: string; language: string; source: string; sourceUrl?: string };
  /** One representative asset per family, shown as visual proof of coherence. */
  /** One representative asset per family. `svg` inlines the markup so the art
      can inherit a color; an <img> can't, and the glyph is currentColor. */
  gallery?: { src?: string; svg?: string; alt: string; label: string; note: string }[];
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
  /** Sits beside the title. The mount and the painting stay separate so the
      frame geometry is reproduced in CSS exactly as the live site does it. */
  masthead?: { art: string; alt: string };
  sections: CaseStudySection[];
};

const zendeb: CaseStudy = {
  slug: "zendeb",
  title: "Making ninety-one images agree",
  client: "Zendeb",
  role: "Design engineer, sole builder",
  year: "2026",
  summary:
    "Building a repeatable system for AI-generated artwork across three decks, then hand-tuning the interaction physics of the wheel it lives on.",
  lede: "Two problems sat at opposite ends of the same site. Hundreds of illustrations had to look like they came from one artist, and a spinning wheel had to feel good enough that people would use it twice. Neither was solved by writing better prompts or reaching for an easing curve.",
  stack: ["WordPress", "PHP", "Vanilla JS", "SVG", "AI image generation"],
  liveUrl: "https://zendeb.com",
  masthead: {
    art: ashwini,
    alt: "The Ashwini painting on its jute mount, as it appears on the site: a white horse stepping out of a stone gateway at dusk, a crescent moon in the upper sky.",
  },
  sections: [
    {
      heading: "The problem was consistency, not quality",
      body: [
        "I started by generating one image, getting it looking good, then seeing if I could replicate it with different content. It didn't work very well, so I started investigating how to get a cohesive art style across multiple images.",
        "It's easy to get one image looking pretty good. Getting dozens of images to look nearly professional is an entirely different task. I stopped approaching it as a writing problem and started approaching it as a software problem. What emerged was a design system based in prompt engineering.",
      ],
    },
    {
      heading: "Prompts became a design system",
      body: [
        "I was given a full set of content describing the message each image needed to convey and the general style they should be created in. I collaborated with AI to generate reusable templates that encoded a visual language: composition, color palette, lighting, symbolism, negative space, and an explicit list of things the model should avoid. Written by the model, for the model, in exactly the right way to produce consistent, repeatable results. Each template was a contract for a category of asset rather than a description of one image.",
        "Every iteration taught me something, and whenever a pattern reliably produced better results, I folded it back into the template. After several rounds of critique and feedback the templates encoded more judgment and refinement, allowing for flexibility within a set of rules, which is exactly what a design system does for a team.",
        "Different asset classes got their own rules while sharing the same underlying principles. Card illustrations, nakshatra glyphs, the nakshatra wheel, and the visual presentation components each had specific constraints, but none of them drifted from the common language.",
        "Three decks came out of it: 52 birth cards, 12 sun-in-signs cards, and 27 nakshatra paintings, alongside the 27 glyphs. The evidence that the system worked is not any single image, it is that ninety-one of them, made weeks apart across three decks, still agree with each other.",
      ],
      gallery: [
        { src: birthCard, alt: "Ace of hearts birth card", label: "Birth cards", note: "52 pieces" },
        { src: sunCard, alt: "Leo sun-in-signs card", label: "Sun-in-signs", note: "12 pieces" },
        { src: nakshatraPainting, alt: "Revati nakshatra painting", label: "Nakshatra paintings", note: "27 pieces" },
        { svg: nakshatraGlyph, alt: "Revati nakshatra glyph", label: "Glyphs", note: "27 pieces, SVG" },
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
      heading: "What transfers",
      variant: "card",
      body: [
        "The palette and the symbolism belong to this deck and are no use to anyone else. The method is the part that travels, so here is what I would carry to any project that needs a machine to produce a lot of things that agree with each other.",
      ],
      principles: [
        {
          title: "Fixed contract, per-item brief",
          body: "One document that never changes, one that changes every time. It is the same relationship as tokens and instances in a design system, applied to prompts, and it is what holds ninety-one images together.",
        },
        {
          title: "Constrain by exclusion",
          body: "Naming what you want gets you the average of what the model already believes. The gains came from enumerating every neighbor of the failure I kept hitting. One banned color is a suggestion; naming the whole family it drifts toward is a constraint.",
        },
        {
          title: "Name every way it can be faked",
          body: "Listing the renderings a thing must never look like does more work than naming the medium, because the model will happily produce something that claims the medium and reads as none of it.",
        },
        {
          title: "Decide what stays fixed",
          body: "Hold a few elements constant in scale and placement across the whole set, and let everything else move. Without that decision you have a collection of individually fine images rather than a series.",
        },
        {
          title: "One hero, always",
          body: "One dominant subject, two or three supporting motifs, nothing else. Without a cap on complexity, every image drifts toward collage.",
        },
        {
          title: "Let it write its own exclusions",
          body: "Ask the model to identify what to avoid if the obvious reading would be cliché. Negative constraints written fresh for each item, by the thing that knows its own defaults best.",
        },
        {
          title: "Return a schema, not prose",
          body: "Every brief comes back in the same shape. That is why it composes into the next stage instead of needing a human to reformat it first.",
        },
        {
          title: "Stage it, gate it",
          body: "Silhouette first, approve, then production output. One-shot generation was unreliable. The human gate between stages is what made it dependable.",
        },
        {
          title: "Acceptance criteria with numbers",
          body: "Legible at 24px, no more than two stroke weights, silhouette survives if the accent vanishes. Bounds like those can be checked, which moves quality out of the territory where every review is a fresh argument.",
        },
      ],
    },
    {
      heading: "Then it had to feel right",
      body: [
        "The 27 glyphs live on a wheel you spin, and stopping it draws one.",
        "That sounds simple and it is not. Three constraints have to hold at once, and they actively fight each other. It has to land on the glyph that was top-dead-center when you clicked stop, because that is the structural affordance for intuition, and intuition is the only way this reader meaningfully works in practice. It has to coast at least a full turn, so an early tap still reads as a spin rather than a halt. And it has to take a believable amount of time no matter how fast the wheel happened to be moving.",
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
        sourceUrl:
          "https://github.com/JakemoCode/jake-portfolio/blob/main/src/lib/nakshatra.ts",
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
        "That is the part I would defend hardest. Whether AI can produce a given thing turned out to be the least interesting question on this project. What mattered was whether the process could produce hundreds of them dependably, and whether I would notice when the output stopped being good.",
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

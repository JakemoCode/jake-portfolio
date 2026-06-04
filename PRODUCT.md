# Product

## Register

brand

## Users

Non-technical prospective clients: small-business owners and individuals
with something to share (a business, an idea, a project) who need a
website built or fixed. They arrive evaluating one question: "Can this
person make me something great, and will it be painless?" They judge
that almost entirely on how the site itself looks and feels, not on the
technical detail of any case study. This is the audience for the home
page (`/`), the primary client-facing surface.

A secondary audience (hiring managers, engineering peers) is served by
the professional/engineering portfolio, which is relocating to
`/portfolio`. That surface has a different job and a different reader;
it can keep speaking fluent engineer.

## Product Purpose

Jake Mosher's site, now two distinct surfaces:

- **`/` — the client-facing landing page (to build).** Its job is to
  convert a non-technical visitor's first impression into confidence:
  "this person will build me a modern, fast site without the tech
  headache," and prompt them to reach out. The page's own craft is the
  proof; success is a prospective client making contact because the
  site earned their trust before they read a word of spec. This is the
  immediate work.
- **`/portfolio` — the professional/engineering portfolio (exists,
  relocating).** The current home page (Hero, project case studies for
  Coffee Roast Tracker and Baby Day Planner, testimonials, contact),
  aimed at recruiters and peers. It moves from `/` to `/portfolio`
  largely as-is; its engineer-facing voice is appropriate there.

Positioning, in Jake's words: *"I build and fix websites for small
businesses and people with something to share. Modern, fast, and done
without the tech headache."*

## Brand Personality

Friendly, vibrant, confident, with restraint. The voice sounds like a
capable person who removes friction, not a developer listing
credentials. Warmth and humanity over corporate polish; taste and
precision over flash. A little quirky and personable is welcome; loud
and noisy is not.

Sensory direction (drives the landing page, `/`):
- **Soft, subtle motion** that highlights and guides, never performs.
- **Vibrant color used tastefully** — color is a strength here, not a
  risk. Timid is off-brand; garish is too.
- **Clean, clear visual impact** — one strong idea reads instantly.

UI/UX craft is the superpower being sold, so impeccable execution is
the headline. This is warmer and more energetic than "reserved," but
never busy.

## Anti-references

- **Generic-AI / templated.** Nothing that reads as a Framer/Webflow
  template, a hero-metric SaaS landing cliché, or "AI made that."
  This is the cardinal sin: the whole pitch collapses if the site looks
  auto-generated.
- **Cold corporate-tech.** No navy-and-gradient enterprise SaaS energy.
  Warmth and humanity carry client trust.
- **Loud / flashy agency.** No over-animated, maximalist "creative
  agency" theatrics that upstage the work or feel exhausting.
- **Excessive animation / motion clutter.** Specifically no
  counter-rotating dual marquees/banners and no "look what I can
  animate" reels. Motion is soft and purposeful or it's absent.
- **Visual noise.** No busy, competing-for-attention compositions.
- **Timid / too-reserved color and branding.** Washed-out, hedged
  palettes read as uncommitted here. Commit to the color.
- **Synthwave / neon-grid.** No retro-neon aesthetics or palettes.
- **The "fresh startup" look.** The mint-green, over-rounded, generic
  modern-SaaS landing template. Avoid it.

## Design Principles

1. **The site is the sample.** The craft of this page IS the pitch.
   Every detail a client notices (or doesn't) is the product demo. Hold
   it to a higher bar than the work it showcases.
2. **Speak client, not engineer.** Translate technical depth into
   outcomes a non-technical reader feels. Avoid jargon as the default
   voice; let the tech stack live in the details for those who look.
3. **Calm confidence over flash.** Reassure, don't dazzle. The
   "without the tech headache" promise should be legible in the UX
   itself: nothing confusing, nothing that makes the visitor work.
4. **Show, don't tell.** Real shipped products prove capability better
   than adjectives. The case studies do the arguing.
5. **Two surfaces, one voice.** `/portfolio` keeps its committed
   identity (terracotta accent, warm-neutral surface, established
   four-family type stack); variants there refine rather than reset it.
   The new landing page (`/`) is greenfield and may establish a bolder,
   more vibrant direction. Both must read as the same person's work:
   consistency of voice over consistency of treatment. (Two of the
   portfolio's type families sit on the skill's greenfield
   reflex-reject list; identity-preservation overrides that for
   `/portfolio`, by design.)

## Accessibility & Inclusion

WCAG 2.2 AA is the non-negotiable bar; the site currently passes axe-core
clean across 4 breakpoints × light/dark. One open gap to close: motion
does not yet respect `prefers-reduced-motion` (Minor M1 in
`docs/DESIGN_AUDIT.md`). Every future animation must ship a
reduced-motion alternative. Maintain visible focus states, semantic
landmarks, and clean heading order as the system grows.

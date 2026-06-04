---
name: Jake Mosher — Client Landing
description: A warm, tactile client landing where jewel-teal facets are cut from textured stone.
colors:
  jewel-teal: "#14b8a6"
  teal-deep: "#0f8c7e"
  teal-bright: "#4fd6c4"
  pine: "#0f5e54"
  rust: "#c2622e"
  rust-deep: "#a64f22"
  rust-soft: "#ce6c36"
  paper: "#f6f5f3"
  paper-raised: "#ffffff"
  surface: "#efece7"
  border: "#e4e1db"
  border-strong: "#d6d2ca"
  ink: "#1b201d"
  ink-soft: "#45514b"
  ink-mute: "#6c766f"
  facet-stone: "#b3ac9d"
  dark: "#13201c"
  dark-2: "#1b2a25"
  dark-ink: "#ece4d6"
  dark-soft: "#9fb3aa"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 5rem)"
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Switzer, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.05rem, 1.4vw, 1.1rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Switzer, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  sm: "10px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 5vw, 3rem)"
  section: "clamp(3.5rem, 9vh, 6.5rem)"
  maxWidth: "1140px"
components:
  button-primary:
    backgroundColor: "{colors.rust-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.9rem 1.6rem"
  button-primary-hover:
    backgroundColor: "{colors.rust-deep}"
    textColor: "#ffffff"
  link-ghost:
    textColor: "{colors.pine}"
  nav-cta:
    textColor: "{colors.pine}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
  input:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 0.9rem"
---

# Design System: Jake Mosher — Client Landing

> Scope: this documents the **client landing at `/`**. The engineering portfolio at
> `/portfolio` intentionally runs a separate, pre-existing palette (warm terracotta
> `#b8472d` on cream, with a light/dark toggle). Do not apply these tokens there.

## 1. Overview

**Creative North Star: "The Polished Facet"**

A jewel of teal, cut and set into a slab of warm, textured stone. That is the whole
system in one image. The surface is quiet, near-white paper with a whisper of real
grain; the color is committed, vibrant teal carrying the page while a single burnt
rust does the asking (the CTAs). Geometry is the signature: small triangular facets,
each filled with genuine stone texture, scattered with deliberate asymmetry and
breaking out of their frame. It should feel hand-cut and grounded, not generated.

The voice is friendly, vibrant, and confident, aimed at a non-technical client who
just wants a great site without the headache. Warmth comes from the rust accent and
the stone texture, never from a warm-cream body background. The page rejects the
2026 AI-default look entirely: no warm-beige body, no gradient text, no glass cards,
no hero-metric template, no eyebrow-on-every-section. It also rejects its opposites:
no cold navy corporate-tech, no synthwave neon, no over-animated agency theatrics.

Depth is built from tonal bands (paper → tinted surface → near-black) and a stone
field that drifts slower than the page, not from drop shadows. Motion is soft and
purposeful: content rises in as it enters; facets glide while the stone lags behind.

**Key Characteristics:**
- Committed jewel-teal lead; rust as a rare, warm accent.
- Crisp near-white paper base (never warm cream), warmed by texture and accent.
- Faceted-stone geometry as the signature motif, asymmetric and frame-breaking.
- Tactile but calm: soft lifts, real texture, generous type, nothing noisy.
- Bricolage Grotesque + Switzer; no Inter, no Fraunces, no mono.

## 2. Colors

A committed teal lead over warm-neutral stone, with one burnt-rust accent and a
green-tinted near-black for the dramatic band.

### Primary
- **Jewel Teal** (#14b8a6): The lead. Carries facets, the availability dot, focus
  rings, and accents on the dark band. Vibrant, gem-like, used freely as fill but
  never as small body text (it fails contrast on light).
- **Teal Deep** (#0f8c7e): A darker teal for facet variation and mid-tones. Not for
  small text on light.
- **Teal Bright** (#4fd6c4): Hover-only lift for teal links on the dark band.
- **Pine** (#0f5e54): The teal you can read. The text-safe member of the family
  (~6.9:1 on paper): the hero's second line, ghost links, surface-band headings, the
  process numbers, the nav pill.

### Secondary
- **Rust** (#c2622e): The accent that asks. Reserved for the one CTA pop and small
  highlights. A minority color by doctrine.
- **Rust Soft** (#ce6c36): The button's resting fill; the darkest rust that still
  clears AA (~4.6:1) with ink text on top.
- **Rust Deep** (#a64f22): The button's hover fill, paired with white text.

### Neutral
- **Paper** (#f6f5f3): The body canvas. A crisp, near-zero-chroma off-white, carried
  by a whisper of procedural grain. Never a warm cream.
- **Paper Raised** (#ffffff): Inputs and the lightest raised surfaces.
- **Surface** (#efece7): The tinted band for alternating sections (Process, About)
  and the banner base. The page's tonal rhythm comes from paper ↔ surface.
- **Border** (#e4e1db) / **Border Strong** (#d6d2ca): Hairline dividers and framed-
  media edges.
- **Ink** (#1b201d): Primary text and headings on light. Green-tinted near-black.
- **Ink Soft** (#45514b): Body copy (~7.6:1 on paper).
- **Ink Mute** (#6c766f): Reserved for the quietest meta; not for sustained reading.
- **Facet Stone** (#b3ac9d): The one neutral-grey facet on the banner.
- **Dark** (#13201c) / **Dark 2** (#1b2a25): The near-black band ("What people say")
  and the footer. Green-tinted, never pure black.
- **Dark Ink** (#ece4d6) / **Dark Soft** (#9fb3aa): Text on the dark band.

### Named Rules
**The Teal-Leads Rule.** Teal carries the surface; rust is a minority accent on
roughly the CTA and small highlights only. They never co-lead. If rust starts to
rival teal for area, you are drifting toward the cream-and-terracotta AI cliché.

**The Pine-for-Text Rule.** Bright teal (#14b8a6) and teal-deep (#0f8c7e) are fills,
never small text: both fail AA on light. Any teal-colored text uses **Pine**
(#0f5e54). On the dark band, bright teal is fine (high contrast there).

**The Texture-Carries-Warmth Rule.** Warmth lives in the rust accent and the stone
grain, never in the body background. The base stays a crisp off-white.

## 3. Typography

**Display Font:** Bricolage Grotesque Variable (with system-ui, sans-serif)
**Body Font:** Switzer (with system-ui, -apple-system, sans-serif)
**Label Font:** Switzer (shared with body)

**Character:** A characterful, slightly-wonky grotesque for display paired with a
clean, neutral-warm humanist sans for text. The contrast is expressive vs. quiet,
not serif vs. sans. Deliberately not Inter or Fraunces (the AI-default pairing).

### Hierarchy
- **Display** (700, clamp(2.75rem, 7vw, 5rem), 1.0, -0.035em): The hero only. Two
  stacked clauses.
- **Headline** (700, clamp(1.9rem, 3.5vw, 2.75rem), -0.025em): Section titles.
- **Title** (600, ~1.4rem, -0.01em): Sub-section heads (offer items, process steps,
  project names).
- **Body** (400, ~1.05–1.1rem, 1.6): Switzer prose, capped ~46ch for measure.
- **Label** (600, 0.875rem): The availability chip and small inline labels. Sentence
  case, never all-caps.

### Named Rules
**The Two-Tone Headline Rule.** The hero splits across the you/me divide: "You bring
the idea." in ink, "I bring the craft." in pine. The color carries the meaning.

**The Band-Keyed Heading Rule.** Section-heading color signals the band: **ink** on
paper sections, **pine** on tinted surface sections, **cream** (dark-ink) on the dark
band. The reader can feel which band they are in without thinking about it.

**The No-Default-Fonts Rule.** Never reach for Inter, Fraunces, or a mono "for
technical flavor." This is a client surface, not a dev tool.

## 4. Elevation

This system is **flat by default and builds depth from tonal bands, not boxes.** The
page alternates paper → tinted surface → near-black, and that layering (plus a stone
field that drifts slower than the page) is the primary depth device. Shadows are rare
and only ever a response to lift: framed media and the resting/hover state of the
primary button. There is one luminous moment: a soft teal radial glow on the dark
proof band.

### Shadow Vocabulary
- **Framed media** (`box-shadow: 0 24px 50px -32px rgba(19,32,28,0.35)`): Project
  screenshots and the About photo, lifting them off the page.
- **Button rest / hover** (`0 8px 22px -14px` → `0 16px 30px -14px` of the rust):
  A small lift that grows on hover.
- **Dark-band glow** (`radial-gradient` of teal/pine at low alpha): Atmosphere, not
  a box shadow. The "look what I can do" beat.

### Named Rules
**The Tonal-Band Rule.** Depth comes from the paper/surface/dark band rhythm and the
fixed stone slab, not from drop shadows on cards. If you are reaching for a shadow to
separate two things, try a band change or a hairline border first.

## 5. Components

The feel is **tactile and confident**: soft lifts, real texture, committed color.
Things look pressable and grounded, never glassy or flat-dead.

### Buttons
- **Shape:** Gently rounded (12px).
- **Primary:** Resting fill is rust-soft (#ce6c36) with ink text (the darkest rust
  that keeps AA on dark text); padding 0.9rem 1.6rem.
- **Hover:** Fills to rust-deep (#a64f22), text fades to white, lifts 2px. Both
  states pass AA. The ink→white text fade is a deliberate micro-moment.
- **Ghost link:** Pine text with a 2px teal-tinted underline that brightens on hover.
  Used for secondary actions ("See recent work", "Visit the site").
- **Nav CTA:** Pine text in a hairline pine pill (999px), tinted teal on hover.

### Cards / Containers
- **Corner Style:** 14–16px on framed media; the system avoids generic content cards.
- **Background:** paper-raised or surface.
- **Shadow Strategy:** Framed-media shadow only (see Elevation). No shadowed content
  cards.
- **Border:** 1px border-strong on framed media.
- **Internal Padding:** Generous; clamp-based section padding sets the rhythm.

### Inputs / Fields
- **Style:** paper-raised fill, 1px border-strong, 10px radius, Switzer text.
- **Focus:** Border shifts to teal-deep with a 3px teal glow ring (no outline
  removed without this replacement).
- **Error:** Border shifts to rust-deep; the message sits below in rust-deep, wired
  via `aria-describedby`.

### Navigation
- Minimal top bar: wordmark left, "Work" + "Start a project" (pill) right. No
  "Engineering" link up top (the portfolio is reached from the Work section and
  footer instead). The portfolio carries a quiet ✦ home mark back to `/`.

### Signature: The Faceted-Stone Banner
The defining component. A full-bleed band between sections: small triangular facets
(jewel teal, pine, teal-deep, one rust, one neutral stone), each filled with a
whisper of real stone texture, scattered asymmetrically (denser left), with a few
straddling the top/bottom edge to **bleed out of frame** into the cream above and
below. Three scroll planes via a named CSS view-timeline (`--scroll-over`) declared
on the banner: the facet layer leads (translateY ±24%) and the stone field lags
slower than the page (±25%) over the `cover` range; the page is the mid plane. The
stone layer is oversized and tiled so the drift never exposes an edge. Static under
reduced motion and where scroll-driven animations aren't supported.

## 6. Do's and Don'ts

### Do:
- **Do** let teal lead and keep rust a minority accent (CTA + small highlights only).
- **Do** use **pine** for any teal-colored text; bright teal and teal-deep are fills.
- **Do** carry warmth through the rust accent and stone texture, on a crisp off-white
  base.
- **Do** key section-heading color to the band (ink on paper, pine on surface, cream
  on dark).
- **Do** keep copy warm and contracted ("it's", "I'll", "you're"), client-language,
  no jargon.
- **Do** gate every entrance/parallax behind `prefers-reduced-motion: no-preference`
  and keep content visible by default (reveals must never blank a section).
- **Do** let facets break their frame; the bleed is intentional.

### Don't:
- **Don't** use a warm cream / sand / beige body background. It is the 2026 AI
  default; this base is crisp near-white, warmed by accent and texture.
- **Don't** ship the generic-AI / templated look: no gradient text, no glassmorphism,
  no hero-metric template, no identical icon-card grids, no tiny tracked eyebrow
  above every section.
- **Don't** drift cold and corporate (navy-and-gradient SaaS) or loud and flashy
  (over-animated agency theatrics, counter-rotating banners).
- **Don't** go synthwave / neon-grid, and don't do the mint-green "fresh startup"
  template.
- **Don't** add visual noise; the facets are sparse and asymmetric on purpose.
- **Don't** reach for Inter, Fraunces, or mono.
- **Don't** put bright teal or teal-deep on small text (both fail WCAG AA on light).
- **Don't** separate elements with drop-shadowed cards; use a tonal band or hairline.

/* Interactive responsive previews — decoupled from `testimonials` (joined by
   clientId). A demo is expensive hand-captured proof that a client's site
   adapts across widths; not every testimonial has one, and a demo needn't
   carry a quote. See ResponsivePreview for how the layers are driven.

   TODO(assets): tablet & mobile currently point at the DESKTOP clip as a
   placeholder so the scrubber/crossfade mechanics run and CI stays green.
   Record each width with the SAME scroll timeline + duration, add the
   arbor-tablet / arbor-mobile clips (and the jyotish pair), then repoint the
   imports below. The component lights up automatically once they differ. */
import arborWebm from "../assets/clients/arbor-loop.webm";
import arborMp4 from "../assets/clients/arbor-loop.mp4";
import arborPoster from "../assets/clients/arbor-poster.jpg";
import jyotishWebm from "../assets/clients/jyotish-loop.webm";
import jyotishMp4 from "../assets/clients/jyotish-loop.mp4";
import jyotishPoster from "../assets/clients/jyotish-poster.jpg";

export type DemoLayerKey = "desktop" | "laptop" | "tablet" | "mobile";

export type DemoLayer = {
  key: DemoLayerKey;
  label: string;
  webm: string;
  mp4: string;
  /** Shown before play and as the still under prefers-reduced-motion. */
  poster: string;
};

export type Demo = {
  clientId: string;
  label: string;
  /** Host shown in the frame's URL pill. */
  url: string;
  alt: string;
  /** Tech the site is built on — captioned under the preview ("Built on X · Y"). */
  platforms?: string[];
  /** Ordered widest → narrowest. */
  layers: DemoLayer[];
};

export const demos: Demo[] = [
  {
    clientId: "arbor",
    label: "Arbor Gymnastics",
    url: "https://www.arborgymnastics.com/",
    platforms: ["Squarespace", "Jackrabbit"],
    alt: "The Arbor Gymnastics site adapting across desktop, laptop, tablet, and mobile widths.",
    layers: [
      { key: "desktop", label: "Desktop", webm: arborWebm, mp4: arborMp4, poster: arborPoster },
      { key: "laptop", label: "Laptop", webm: arborWebm, mp4: arborMp4, poster: arborPoster },
      { key: "tablet", label: "Tablet", webm: arborWebm, mp4: arborMp4, poster: arborPoster },
      { key: "mobile", label: "Mobile", webm: arborWebm, mp4: arborMp4, poster: arborPoster },
    ],
  },
  {
    clientId: "jyotish",
    label: "Jyotish Tarot",
    url: "https://jyotishtarot.com/free-jyotish-tarot-reading/",
    platforms: ["WordPress"],
    alt: "The Jyotish Tarot reader adapting across desktop, laptop, tablet, and mobile widths.",
    layers: [
      { key: "desktop", label: "Desktop", webm: jyotishWebm, mp4: jyotishMp4, poster: jyotishPoster },
      { key: "laptop", label: "Laptop", webm: jyotishWebm, mp4: jyotishMp4, poster: jyotishPoster },
      { key: "tablet", label: "Tablet", webm: jyotishWebm, mp4: jyotishMp4, poster: jyotishPoster },
      { key: "mobile", label: "Mobile", webm: jyotishWebm, mp4: jyotishMp4, poster: jyotishPoster },
    ],
  },
];

/* Work gallery — completed client sites shown as living tiles. Each tile plays
   the site's real hero entrance on hover and links straight to the live site;
   a small inset shows the same site's mobile layout (the responsive proof).
   Decoupled from `testimonials` (joined by clientId). Hero clips are VP9 WebM
   per docs/MEDIA.md, captured above-the-fold with no scroll. */
import arborHero from "../assets/clients/arbor-hero.webm";
import arborStill from "../assets/clients/arbor-hero.jpg";
import arborMobile from "../assets/clients/arbor-hero-mobile.jpg";
import zendebHero from "../assets/clients/zendeb-hero.webm";
import zendebStill from "../assets/clients/zendeb-hero.jpg";
import zendebMobile from "../assets/clients/zendeb-hero-mobile.jpg";
import victoriaHero from "../assets/clients/victoria-hero.webm";
import victoriaStill from "../assets/clients/victoria-hero.jpg";
import victoriaMobile from "../assets/clients/victoria-hero-mobile.jpg";

export type WorkSite = {
  clientId: string;
  /** Business name, shown under the tile. */
  name: string;
  /** What kind of business it is — the tile's one consistent label (industry,
      never tech stack; see the gallery discussion). */
  tag: string;
  /** Host shown in the frame's URL bar and where the tile links. */
  host: string;
  url: string;
  /** VP9 WebM of the hero entrance, played on hover. */
  heroWebm: string;
  /** Settled last frame — the resting still and the reduced-motion fallback. */
  heroStill: string;
  /** Same site's mobile above-the-fold — the static responsive proof. */
  mobileStill: string;
  alt: string;
  /** The one large "flagship" tile spanning the row. */
  feature?: boolean;
};

export const work: WorkSite[] = [
  {
    clientId: "victoria",
    name: "Victoria Grace Real Estate",
    tag: "Real estate",
    host: "victoriagracerealestate.com",
    url: "https://victoriagracerealestate.com/",
    heroWebm: victoriaHero,
    heroStill: victoriaStill,
    mobileStill: victoriaMobile,
    alt: "The Victoria Grace Real Estate homepage.",
    feature: true,
  },
  {
    clientId: "zendeb",
    name: "Zendeb",
    tag: "Astrology & readings",
    host: "zendeb.com",
    url: "https://zendeb.com/",
    heroWebm: zendebHero,
    heroStill: zendebStill,
    mobileStill: zendebMobile,
    alt: "The Zendeb astrology homepage.",
  },
  {
    clientId: "arbor",
    name: "Arbor Gymnastics",
    tag: "Youth gymnastics",
    host: "arborgymnastics.com",
    url: "https://www.arborgymnastics.com/",
    heroWebm: arborHero,
    heroStill: arborStill,
    mobileStill: arborMobile,
    alt: "The Arbor Gymnastics homepage.",
  },
];

/* Interactive responsive previews — decoupled from `testimonials` (joined by
   clientId). A demo is a hand-captured proof that a client's site adapts across
   widths. See ResponsivePreview for how the layers are driven, and docs/MEDIA.md
   for the capture standard (VP9 WebM only, one clip per device width). */
import arborDesktop from "../assets/clients/arbor-desktop.webm";
import arborTablet from "../assets/clients/arbor-tablet.webm";
import arborMobile from "../assets/clients/arbor-mobile.webm";
import arborDesktopPoster from "../assets/clients/arbor-desktop-poster.jpg";
import arborTabletPoster from "../assets/clients/arbor-tablet-poster.jpg";
import arborMobilePoster from "../assets/clients/arbor-mobile-poster.jpg";
import zendebDesktop from "../assets/clients/zendeb-desktop.webm";
import zendebTablet from "../assets/clients/zendeb-tablet.webm";
import zendebMobile from "../assets/clients/zendeb-mobile.webm";
import zendebDesktopPoster from "../assets/clients/zendeb-desktop-poster.jpg";
import zendebTabletPoster from "../assets/clients/zendeb-tablet-poster.jpg";
import zendebMobilePoster from "../assets/clients/zendeb-mobile-poster.jpg";
import victoriaDesktop from "../assets/clients/victoria-desktop.webm";
import victoriaTablet from "../assets/clients/victoria-tablet.webm";
import victoriaMobile from "../assets/clients/victoria-mobile.webm";
import victoriaDesktopPoster from "../assets/clients/victoria-desktop-poster.jpg";
import victoriaTabletPoster from "../assets/clients/victoria-tablet-poster.jpg";
import victoriaMobilePoster from "../assets/clients/victoria-mobile-poster.jpg";

export type DemoLayerKey = "desktop" | "tablet" | "mobile";

export type DemoLayer = {
  key: DemoLayerKey;
  label: string;
  /** VP9 WebM only (see docs/MEDIA.md). */
  webm: string;
  /** First frame — shown before play and as the prefers-reduced-motion still. */
  poster: string;
};

export type Demo = {
  clientId: string;
  label: string;
  /** Host shown in the frame's URL pill. */
  url: string;
  /** Tech the site is built on — captioned under the preview ("Built on X · Y"). */
  platforms?: string[];
  alt: string;
  /** Ordered widest → narrowest. */
  layers: DemoLayer[];
};

export const demos: Demo[] = [
  {
    clientId: "arbor",
    label: "Arbor Gymnastics",
    url: "https://www.arborgymnastics.com/",
    platforms: ["Squarespace", "Jackrabbit"],
    alt: "The Arbor Gymnastics site adapting across desktop, tablet, and mobile widths.",
    layers: [
      { key: "desktop", label: "Desktop", webm: arborDesktop, poster: arborDesktopPoster },
      { key: "tablet", label: "Tablet", webm: arborTablet, poster: arborTabletPoster },
      { key: "mobile", label: "Mobile", webm: arborMobile, poster: arborMobilePoster },
    ],
  },
  {
    clientId: "zendeb",
    label: "Zendeb",
    url: "https://zendeb.com/",
    alt: "The Zendeb astrology site adapting across desktop, tablet, and mobile widths.",
    layers: [
      { key: "desktop", label: "Desktop", webm: zendebDesktop, poster: zendebDesktopPoster },
      { key: "tablet", label: "Tablet", webm: zendebTablet, poster: zendebTabletPoster },
      { key: "mobile", label: "Mobile", webm: zendebMobile, poster: zendebMobilePoster },
    ],
  },
  {
    clientId: "victoria",
    label: "Victoria Grace Real Estate",
    url: "https://victoriagracerealestate.com/",
    alt: "The Victoria Grace Real Estate site adapting across desktop, tablet, and mobile widths.",
    layers: [
      { key: "desktop", label: "Desktop", webm: victoriaDesktop, poster: victoriaDesktopPoster },
      { key: "tablet", label: "Tablet", webm: victoriaTablet, poster: victoriaTabletPoster },
      { key: "mobile", label: "Mobile", webm: victoriaMobile, poster: victoriaMobilePoster },
    ],
  },
];

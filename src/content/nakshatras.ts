/* The 27 nakshatras in canonical order, starting at Ashwini. Slugs match the
   glyph filenames; names are display-only. Readings are the client's content
   and deliberately not reproduced here. */
export type Nakshatra = { slug: string; name: string };

export const nakshatras: Nakshatra[] = [
  { slug: "ashwini", name: "Ashwini" },
  { slug: "bharani", name: "Bharani" },
  { slug: "krittika", name: "Krittika" },
  { slug: "rohini", name: "Rohini" },
  { slug: "mrigashira", name: "Mrigashira" },
  { slug: "ardra", name: "Ardra" },
  { slug: "punarvasu", name: "Punarvasu" },
  { slug: "pushya", name: "Pushya" },
  { slug: "ashlesha", name: "Ashlesha" },
  { slug: "magha", name: "Magha" },
  { slug: "purva-phalguni", name: "Purva Phalguni" },
  { slug: "uttara-phalguni", name: "Uttara Phalguni" },
  { slug: "hasta", name: "Hasta" },
  { slug: "chitra", name: "Chitra" },
  { slug: "svati", name: "Svati" },
  { slug: "vishakha", name: "Vishakha" },
  { slug: "anuradha", name: "Anuradha" },
  { slug: "jyeshtha", name: "Jyeshtha" },
  { slug: "mula", name: "Mula" },
  { slug: "purva-ashadha", name: "Purva Ashadha" },
  { slug: "uttara-ashadha", name: "Uttara Ashadha" },
  { slug: "shravana", name: "Shravana" },
  { slug: "dhanishtha", name: "Dhanishtha" },
  { slug: "shatabhisha", name: "Shatabhisha" },
  { slug: "purva-bhadrapada", name: "Purva Bhadrapada" },
  { slug: "uttara-bhadrapada", name: "Uttara Bhadrapada" },
  { slug: "revati", name: "Revati" },
];

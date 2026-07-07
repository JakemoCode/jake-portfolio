// Public offer copy for the "Smaller ways to start" ladder (the Sprints section).
//
// Source of truth for the prices below is the Notion "Canonical Pricing
// Structure" (Freelance HQ), §12. Publish the anchors only (§10) — keep the
// internal scoping logic OUT of here: the audit-gating, the §5 existing-site
// hourly lane, and the premium multipliers all stay in Notion.

export type Offer = {
  id: string;
  name: string;
  price: string; // a number ("$500") or a phrase ("Quoted after your audit")
  from?: boolean; // prefix the price with "from"
  quoted?: boolean; // price is a phrase, not a number — render it muted
  priceNote?: string; // small line under the price
  badge?: string; // corner tag, e.g. "Start here"
  pitch: string; // fuller copy — shown for the highlighted audit lead
  blurb: string; // one-liner — shown in the compact rows
  includes: string[];
};

// The tripwire — the one existing-site deliverable that can be flat-priced,
// because the report is bounded no matter how messy the site is.
export const AUDIT: Offer = {
  id: "audit",
  name: "Website Audit",
  price: "$500",
  priceNote: "credited toward any fix",
  pitch:
    "Not sure what’s wrong, or where to start? I’ll go through your site the way a first-time visitor, and Google, actually see it, then hand you a plain-English report: what’s slowing it down, what’s confusing people, and exactly what I’d fix first.",
  blurb:
    "A plain-English report on what’s slowing your site down and what to fix first.",
  includes: [
    "A full once-over: speed, mobile, accessibility, and search setup",
    "The real numbers, not guesses. I run the same checks Google does",
    "Every issue ranked by what actually matters for your business",
    "Clear next steps you can act on yourself or bring back to me",
    "Hire me for the fix and the $500 comes right off the top",
  ],
};

// The two audit-gated fixes — existing-site work, so no flat price is shown
// (Notion §5: never flat-price an unknown site). Split on broken vs. leaking.
export const FIXES: Offer[] = [
  {
    id: "rescue",
    name: "Website Rescue",
    price: "Quoted after your audit",
    quoted: true,
    pitch:
      "Half-built, stuck, or broken? A launch that stalled, a template that fought back, forms that don’t send, a phone layout that fell apart. I’ll get in, sort it out, and get you live.",
    blurb:
      "Stalled launches, broken forms, a layout that fell apart on phones. I’ll get it working and live.",
    includes: [
      "A focused fix on whatever’s blocking you, start to finish",
      "Broken forms, layouts, and links tracked down and repaired",
      "Your site made right on phones, not just desktop",
      "Works with whatever you’re on: WordPress, Squarespace, Wix, or hand-built",
      "A fixed price after your audit, so you always know where you stand",
    ],
  },
  {
    id: "tuneup",
    name: "Website Tune-Up",
    price: "Quoted after your audit",
    quoted: true,
    pitch:
      "Your site works, but the calls and bookings aren’t coming. Usually it’s a handful of small things: a form nobody can find, a booking flow with one step too many, a fuzzy “what next.” I’ll tighten the path from visitor to customer.",
    blurb:
      "The site works, but the calls aren’t coming. I’ll tighten the path from visitor to customer.",
    includes: [
      "A look at where people drop off before they reach out",
      "Forms and booking flows made obvious and easy on mobile",
      "Clearer buttons and next steps, so no one has to guess",
      "Small copy and layout tweaks that actually move the needle",
      "Fixed price after your audit",
    ],
  },
];

// The flagship — a self-contained build, so it's flat-priceable. Floor rhymes
// with the one-page price so a feature never appears to out-price a whole site.
export const FEATURE: Offer = {
  id: "feature",
  name: "Custom Feature Build",
  price: "$1,200",
  from: true,
  pitch:
    "Have one specific thing you want built? A price calculator, a quiz, an interactive picker, a custom booking or lead flow, a simple dashboard. This is my favorite kind of work: you’ll get one well-made feature, designed to fit your site and do its job.",
  blurb:
    "One custom-built thing (a calculator, quiz, booking flow, or dashboard), scoped and fixed before we start.",
  includes: [
    "One defined feature, scoped and priced before we start",
    "Designed to match your site and easy for visitors to use",
    "Fast, and built to work on every device",
    "Yours to keep, no monthly platform fees",
    "Simple features start here; more moving parts scale up, and you’ll know the number first",
  ],
};

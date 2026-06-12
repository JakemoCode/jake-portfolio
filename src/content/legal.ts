// Legal copy. Source of truth lives in ~/Workspace/legal/*.md; this mirrors it
// verbatim (section headings normalized from ALL-CAPS to readable case).

export type Block = { type: "p"; text: string } | { type: "ul"; items: string[] };
export type LegalSection = { heading: string; blocks: Block[] };
export type LegalDoc = {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
};

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  effectiveDate: "June 11, 2026",
  intro:
    "This policy explains what information I collect when you visit jakemosher.dev and how I use it.",
  sections: [
    {
      heading: "Who I am",
      blocks: [
        { type: "p", text: "This site is run by Mosher Web Development, LLC (Colorado, USA)." },
        { type: "p", text: "Questions about your privacy: jake@jakemosher.dev." },
      ],
    },
    {
      heading: "What I collect",
      blocks: [
        {
          type: "ul",
          items: [
            "Information you give me. When you use the contact form or email me, I receive your name, email address, and whatever you include in your message.",
            "Limited technical information. My hosting provider may automatically process limited technical information such as IP address, browser type, device type, and request logs for security and site operation.",
          ],
        },
        {
          type: "p",
          text: "I do not currently use website analytics tools, advertising pixels, or tracking cookies on this site. If that changes, I will update this policy.",
        },
      ],
    },
    {
      heading: "How I use it",
      blocks: [
        {
          type: "ul",
          items: [
            "To respond to your message and provide any services you ask about",
            "To operate, maintain, and secure the site",
            "To keep ordinary business records",
          ],
        },
        { type: "p", text: "I do not sell or rent your personal information." },
      ],
    },
    {
      heading: "Cookies and analytics",
      blocks: [
        {
          type: "p",
          text: "I do not currently use analytics cookies, advertising cookies, or tracking pixels on this site. Your browser, hosting provider, or third-party sites linked from this site may still use their own cookies or technical logs outside my control.",
        },
      ],
    },
    {
      heading: "Who I share it with",
      blocks: [
        {
          type: "p",
          text: "I do not sell your information. I may share it with service providers I use to run the site and respond to messages, such as my hosting and email provider, only as needed. I may also disclose information if required by law.",
        },
      ],
    },
    {
      heading: "Third-party links",
      blocks: [
        {
          type: "p",
          text: "The site may link to other websites. Their privacy practices are their own, and this policy does not cover them.",
        },
      ],
    },
    {
      heading: "How long I keep it",
      blocks: [
        {
          type: "p",
          text: "I keep the information you send as long as reasonably needed to respond to you, provide services, maintain ordinary business records, resolve disputes, comply with legal obligations, or protect my rights.",
        },
      ],
    },
    {
      heading: "Your rights",
      blocks: [
        {
          type: "p",
          text: "You can ask me to access, correct, or delete the personal information I have about you by emailing jake@jakemosher.dev.",
        },
      ],
    },
    {
      heading: "Security",
      blocks: [
        {
          type: "p",
          text: "I take reasonable steps to protect your information, but no method of transmission or storage online is 100% secure.",
        },
      ],
    },
    {
      heading: "Children",
      blocks: [
        {
          type: "p",
          text: "This site is not directed to children under 13, and I do not knowingly collect their personal information.",
        },
      ],
    },
    {
      heading: "Changes",
      blocks: [
        {
          type: "p",
          text: 'I may update this policy from time to time. The "Effective date" above shows the latest version.',
        },
      ],
    },
    {
      heading: "Contact",
      blocks: [
        { type: "p", text: "Mosher Web Development, LLC" },
        { type: "p", text: "jake@jakemosher.dev" },
      ],
    },
  ],
};

export const termsOfUse: LegalDoc = {
  title: "Terms of Use",
  effectiveDate: "June 11, 2026",
  intro:
    'These terms apply to your use of jakemosher.dev (the "site"), run by Mosher Web Development, LLC ("I," "me," "my"). By using the site, you agree to these terms. If you don\'t agree, please don\'t use the site.',
  sections: [
    {
      heading: "1. About the site",
      blocks: [
        {
          type: "p",
          text: "This is an informational and marketing site for my web design and development services. The content is for general information and may change at any time.",
        },
      ],
    },
    {
      heading: "2. Using the site doesn't create a client relationship",
      blocks: [
        {
          type: "p",
          text: "Browsing the site, filling out the contact form, or emailing me does not create a client, contractual, or professional relationship. A project relationship begins only when we both approve or sign a written proposal, statement of work, or services agreement.",
        },
      ],
    },
    {
      heading: "3. Intellectual property",
      blocks: [
        {
          type: "p",
          text: "The site's design, text, graphics, and code are owned by Mosher Web Development, LLC unless noted otherwise. Work shown in my portfolio or case studies may belong to the respective clients or owners and is displayed for illustration. Please don't copy, reproduce, or reuse content from the site without my written permission.",
        },
      ],
    },
    {
      heading: "4. Acceptable use",
      blocks: [
        {
          type: "p",
          text: "Don't misuse the site. That includes no attempting to hack, disrupt, overload, or gain unauthorized access to it; no scraping or automated harvesting; and no using it for unlawful or harmful purposes.",
        },
      ],
    },
    {
      heading: "5. Third-party links",
      blocks: [
        {
          type: "p",
          text: "The site may link to other websites for convenience. I don't control them and I'm not responsible for their content or practices.",
        },
      ],
    },
    {
      heading: "6. No warranties",
      blocks: [
        {
          type: "p",
          text: 'The site is provided "as is" and "as available." I don\'t guarantee it will be accurate, complete, error-free, or available without interruption.',
        },
      ],
    },
    {
      heading: "7. Limit of liability",
      blocks: [
        {
          type: "p",
          text: "To the maximum extent permitted by law, Mosher Web Development, LLC is not liable for any damages arising from your use of, or inability to use, the site.",
        },
      ],
    },
    {
      heading: "8. Changes",
      blocks: [
        {
          type: "p",
          text: 'I may update the site or these terms at any time. The "Effective date" above shows the latest version.',
        },
      ],
    },
    {
      heading: "9. Governing law",
      blocks: [
        {
          type: "p",
          text: "These terms are governed by the laws of the State of Colorado. Any dispute arising from your use of the site will be brought exclusively in the state or federal courts located in Larimer County, Colorado.",
        },
      ],
    },
    {
      heading: "10. Contact",
      blocks: [{ type: "p", text: "Mosher Web Development, LLC - jake@jakemosher.dev" }],
    },
  ],
};

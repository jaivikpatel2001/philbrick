/* =============================================================================
   PHILBRICK — SITE CONFIGURATION  (single source of truth)
   Real, publicly-verifiable business data for Philbrick Technologies India
   Pvt. Ltd. (Ahmedabad, Gujarat). Sourced from the company's public listings.

   NOTE (placeholders to confirm with the client before launch):
   • email — no public mailbox is published; `info@philbricktech.com` uses the
     company's verified domain as a sensible default. Confirm the real address.
   • social profiles — the public site exposes only share buttons, not real
     profiles, so SOCIALS is intentionally empty until verified URLs are given.
   ========================================================================== */

export const SITE = {
  name: "Philbrick",
  legalName: "Philbrick Technologies India Pvt. Ltd.",
  tagline: "Providing Elevator Solutions",
  description:
    "Philbrick Technologies is an Ahmedabad-based manufacturer, exporter and supplier of elevator control panels, integrated controllers, automatic rescue devices, door operators, cabins, displays and complete elevator components.",
  url: "https://www.philbricktech.com",
  locale: "en_IN",
  founded: 1992,
  themeColor: "#0A0E14",

  /* Contact — published virtual line routed to the Ahmedabad office. */
  email: "info@philbricktech.com",
  salesEmail: "info@philbricktech.com",
  careersEmail: "info@philbricktech.com",
  phone: "+91 80478 52949",
  phoneHref: "tel:+918047852949",

  address: {
    line1: "Plot No. 69, Road No. 6, G.I.D.C. Kathwada, Odhav",
    line2: "Ahmedabad 382430, Gujarat",
    city: "Ahmedabad",
    region: "Gujarat",
    postalCode: "382430",
    country: "India",
  },

  /* Google Maps pin for the GIDC Kathwada plant. */
  geo: { lat: 23.03676, lng: 72.68678 },
  mapUrl: "https://www.google.com/maps?q=23.03676000,72.68678000",

  hours: "Mon–Sat 09:30–18:30",

  /* Statutory identifiers (publicly displayed). */
  gst: "24AAHCP6212D1ZU",
  cin: "U31501GJ2014PTC078837",
  iec: "0814002951",

  /* Verified named contacts. */
  contacts: [
    { name: "Saransh Patel", role: "Customer Relationship (CRM)" },
    { name: "Prakash Patel", role: "Technical Support" },
  ],

  exportMarkets: ["China", "Taiwan"],
} as const;

/* No verified public social profiles yet — keep empty rather than invent links.
   Populate with real profile URLs (LinkedIn / Facebook / YouTube) when provided
   and the footer + Organization `sameAs` schema will pick them up automatically. */
export const SOCIALS: { label: string; href: string; icon: string }[] = [];

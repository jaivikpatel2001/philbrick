/* =============================================================================
   VERTIQ — SITE CONFIGURATION
   ========================================================================== */

export const SITE = {
  name: "VERTIQ",
  legalName: "Vertiq Vertical Mobility S.A.",
  tagline: "Vertical mobility, engineered.",
  description:
    "VERTIQ designs, manufactures and maintains intelligent elevators, escalators and vertical-mobility systems for the world's most ambitious buildings.",
  url: "https://www.vertiq.com",
  locale: "en_US",
  founded: 1968,
  themeColor: "#0B0F17",
  email: "hello@vertiq.com",
  salesEmail: "sales@vertiq.com",
  careersEmail: "careers@vertiq.com",
  phone: "+1 (212) 555-0190",
  phoneHref: "tel:+12125550190",
  emergency: "+1 (800) 555-0911",
  address: {
    line1: "Vertiq Tower, 8 Skyline Avenue",
    line2: "New York, NY 10018",
    country: "United States",
  },
  hours: "24 / 7 service · Mon–Fri 08:00–18:00 sales",
} as const;

export const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: "FiLinkedin" },
  { label: "X", href: "https://x.com", icon: "FiTwitter" },
  { label: "YouTube", href: "https://youtube.com", icon: "FiYoutube" },
  { label: "Instagram", href: "https://instagram.com", icon: "FiInstagram" },
] as const;

export const TRUST_LOGOS = [
  "Skanska",
  "Foster + Partners",
  "Hines",
  "Marriott",
  "Mayo Clinic",
  "Emaar",
  "Lendlease",
  "Gensler",
  "Mitsubishi Estate",
  "BlackRock",
] as const;

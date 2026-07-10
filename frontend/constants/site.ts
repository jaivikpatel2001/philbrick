/* =============================================================================
   VERTIQ — SITE CONFIGURATION  (Indian vertical-mobility brand)
   ========================================================================== */

export const SITE = {
  name: "VERTIQ",
  legalName: "Vertiq Vertical Mobility Pvt. Ltd.",
  tagline: "Vertical mobility, engineered in India.",
  description:
    "VERTIQ designs, manufactures and maintains intelligent elevators, escalators and vertical mobility systems for India's most ambitious buildings, engineered in India, for India.",
  url: "https://www.vertiq.in",
  locale: "en_IN",
  founded: 1968,
  themeColor: "#050506",
  email: "hello@vertiq.in",
  salesEmail: "sales@vertiq.in",
  careersEmail: "careers@vertiq.in",
  phone: "+91 22 6789 1968",
  phoneHref: "tel:+912267891968",
  emergency: "1800 209 1968",
  address: {
    line1: "Vertiq House, G Block, Bandra Kurla Complex",
    line2: "Mumbai 400 051, Maharashtra",
    country: "India",
  },
  hours: "24 / 7 service · Mon–Sat 09:30–18:30 sales",
} as const;

export const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: "FiLinkedin" },
  { label: "X", href: "https://x.com", icon: "FiTwitter" },
  { label: "YouTube", href: "https://youtube.com", icon: "FiYoutube" },
  { label: "Instagram", href: "https://instagram.com", icon: "FiInstagram" },
] as const;

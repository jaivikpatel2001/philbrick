/* =============================================================================
   PHILBRICK — SITE CONFIGURATION  (single source of truth)
   Real, publicly-verifiable business data for Philbrick Technologies India
   Pvt. Ltd. (Ahmedabad, Gujarat). Sourced from the company's WordPress
   website backup (acharyagroup.in / philbrickindia.com).
   ========================================================================== */

export const SITE = {
  name: "Philbrick",
  legalName: "Philbrick Technologies (India) Pvt. Ltd.",
  tagline: "Providing Elevator Solutions",
  description:
    "Philbrick Technologies is an Ahmedabad-based manufacturer, exporter and supplier of elevator control panels, integrated controllers, automatic rescue devices, door operators, cabins, displays and complete elevator components.",
  url: "https://philbrickindia.com",
  locale: "en_IN",
  founded: 1992,
  themeColor: "#0A0E14",

  /* --- Contact ------------------------------------------------------------
     Every address and number the client publishes, each tagged with what it
     is actually for, so a visitor knows where to write and where to call.
     Sources: WordPress Contact Us page (ID 3631), Career page (ID 3435),
     Privacy policy page (ID 3992) and philbrick-child-theme/footer.php.
     ---------------------------------------------------------------------- */

  /* Primary scalars (kept for structured data and single-slot UI). The main
     number is the helpline the client publishes first on the Contact page. */
  email: "philbrick@philbrickindia.com",
  salesEmail: "sales@philbrickindia.com",
  careersEmail: "hr.philbrickindia@gmail.com",
  altEmail: "philbrick_controls@yahoo.com",
  phone: "+91 84012 19941",
  phoneHref: "tel:+918401219941",

  /* Categorised inboxes, in the order they are offered to a visitor. */
  emails: [
    {
      label: "Sales",
      address: "sales@philbrickindia.com",
      purpose: "Quotations, orders and pricing",
    },
    {
      label: "General enquiries",
      address: "philbrick@philbrickindia.com",
      purpose: "Company, products and support",
    },
    {
      label: "Careers",
      address: "hr.philbrickindia@gmail.com",
      purpose: "Mail your resume to our HR team",
    },
    {
      label: "Alternate inbox",
      address: "philbrick_controls@yahoo.com",
      purpose: "Second address for general mail",
    },
  ],

  /* Every number the client publishes, labelled by what it is for. Only the
     helpline and the WhatsApp line carry a role on the client's own site; the
     rest are the office lines listed on the Contact page and in the footer. */
  phones: [
    {
      label: "Helpline",
      number: "+91 84012 19941",
      purpose: "Support and general help",
      whatsapp: false,
    },
    {
      label: "WhatsApp",
      number: "+91 99789 86631",
      purpose: "Call or chat with us on WhatsApp",
      whatsapp: true,
    },
    {
      label: "Office",
      number: "+91 93740 22660",
      purpose: "Office line",
      whatsapp: false,
    },
    {
      label: "Office",
      number: "+91 98250 09420",
      purpose: "Office line",
      whatsapp: false,
    },
    {
      label: "Office",
      number: "+91 99789 86635",
      purpose: "Office line",
      whatsapp: false,
    },
  ],

  whatsapp: "+919978986631",
  whatsappDisplay: "+91 99789 86631",
  whatsappUrl:
    "https://api.whatsapp.com/send?phone=+919978986631&text=Hello%20Sir%2C%20I%20would%20like%20to%20inquire%20about",

  address: {
    line1: "Plot No. 69, Road No. 6, G.I.D.C. Kathwada",
    line2: "Ahmedabad 382430, Gujarat",
    city: "Ahmedabad",
    region: "Gujarat",
    postalCode: "382430",
    country: "India",
  },

  /* Google Maps pin for the GIDC Kathwada plant. */
  geo: { lat: 23.03676, lng: 72.68678 },
  mapUrl: "https://www.google.com/maps?q=23.03676000,72.68678000",

  hours: "Mon to Fri, 09:00 to 18:00",

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

/* ---------------------------------------------------------------------------
   Click-to-contact hrefs (centralised so every email/phone link behaves the
   same across the site).
     • Email  → opens Gmail's web compose window in a new tab (client
       preference) instead of the OS default mail app, which is Outlook on
       Windows. Use with target="_blank" rel="noopener noreferrer".
     • Phone  → the tel: protocol, which opens the dialpad on phones.
   -------------------------------------------------------------------------- */
export const gmailHref = (email: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

/** tel: href for any displayed number ("+91 84012 19941" → "tel:+918401219941"). */
export const telHref = (number: string) => `tel:${number.replace(/\s/g, "")}`;

/* Social profiles from the WordPress child theme footer, in the order the
   client's own "Join Us:" widget lists them (footer.php, #tz_socials-4).
   WhatsApp is the first of the four and had been missing here. */
export const SOCIALS: { label: string; href: string; icon: string }[] = [
  {
    label: "WhatsApp",
    href: "https://api.whatsapp.com/send?phone=+919978986631&text=Hello%20Sir%2C%20I%20would%20like%20to%20inquire%20about",
    icon: "FaWhatsapp",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/philbrick.india",
    icon: "FiFacebook",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/philbrick.india/",
    icon: "FiInstagram",
  },
  {
    /* The account still lives on the twitter.com host, which redirects. */
    label: "X (formerly Twitter)",
    href: "https://twitter.com/SaranshPatel20",
    icon: "FaXTwitter",
  },
];

/* =============================================================================
   STRUCTURED DATA BUILDERS (JSON-LD)
   Every builder draws exclusively from the site's real content in constants/
   and data/ — no fabricated ratings, reviews, awards or business facts.
   Entity graph: Organization (#organization) ← WebSite, Products, pages.
   ========================================================================== */
import { SITE, SOCIALS } from "@/constants/site";
import { PRODUCT_TREE, categoryHref } from "@/data/products";
import { LEADERSHIP } from "@/data/company";
import { OG_IMAGE } from "@/data/images";
import type { ProductNode } from "@/types";
import type { Faq } from "@/data/faqs";

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

/** Absolute URL for the branded OG image (JSON-LD should not use root-relative). */
const OG_IMAGE_ABS = OG_IMAGE.startsWith("http") ? OG_IMAGE : `${SITE.url}${OG_IMAGE}`;

/** The company as a single, unambiguous business entity.
 *  Typed as both Organization AND LocalBusiness: philbrick is a manufacturer
 *  with a physical plant (GIDC Kathwada, Ahmedabad) that has real coordinates
 *  and opening hours, so the LocalBusiness facet (geo + hasMap + hours) feeds
 *  the local pack and gives AI answer engines a precise, verifiable entity. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    foundingDate: String(SITE.founded),
    slogan: SITE.tagline,
    logo: OG_IMAGE_ABS,
    image: OG_IMAGE_ABS,
    email: SITE.email,
    telephone: SITE.phone,
    taxID: SITE.gst,
    /* India-specific statutory IDs as generic identifiers (there is no dedicated
       schema.org property for GST/CIN/IEC). */
    identifier: [
      { "@type": "PropertyValue", propertyID: "GSTIN", value: SITE.gst },
      { "@type": "PropertyValue", propertyID: "CIN", value: SITE.cin },
      { "@type": "PropertyValue", propertyID: "IEC", value: SITE.iec },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.line1,
      addressLocality: SITE.address.city,
      postalCode: SITE.address.postalCode,
      addressRegion: SITE.address.region,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    hasMap: SITE.mapUrl,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    areaServed: { "@type": "Country", name: "India" },
    /* One point per published channel, so search engines can route a caller
       to the right desk (helpline, sales, careers) rather than one number. */
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        name: "Helpline",
        telephone: SITE.phone,
        email: SITE.email,
        availableLanguage: ["en", "hi", "gu"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: SITE.whatsappDisplay,
        email: SITE.salesEmail,
        availableLanguage: ["en", "hi", "gu"],
      },
      {
        "@type": "ContactPoint",
        contactType: "human resources",
        email: SITE.careersEmail,
        availableLanguage: ["en", "hi", "gu"],
      },
    ],
    ...(SOCIALS.length > 0 && { sameAs: SOCIALS.map((s) => s.href) }),
    knowsAbout: [
      "Elevator components",
      "Elevator control panels",
      "Automatic Rescue Device",
      ...PRODUCT_TREE.map((c) => c.name),
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE.name,
    alternateName: SITE.legalName,
    url: SITE.url,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
  };
}

/** Homepage WebPage node. Ties the page into the entity graph (WebPage →
 *  isPartOf WebSite → publisher Organization) and marks the headline speakable
 *  for voice assistants / answer engines. */
export function homePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.url}/#webpage`,
    url: SITE.url,
    name: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    inLanguage: "en-IN",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    primaryImageOfPage: OG_IMAGE_ABS,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1"],
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

/** Absolute-ise a root-relative asset path for JSON-LD (crawlers can't resolve
 *  "/images/..." — they need the full origin). */
const abs = (u?: string) => (!u ? undefined : u.startsWith("http") ? u : `${SITE.url}${u}`);

/** Product entity. `path` is the full route (nested for sub-products). */
export function productSchema(product: ProductNode, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription ?? product.description,
    url: `${SITE.url}${path}`,
    image: abs(product.image),
    category: product.category,
    brand: { "@id": ORG_ID, name: SITE.name },
    manufacturer: { "@id": ORG_ID },
    ...(product.specs && product.specs.length > 0
      ? {
          additionalProperty: product.specs.map((spec) => ({
            "@type": "PropertyValue",
            name: spec.label,
            value: spec.value,
          })),
        }
      : {}),
  };
}

/** The product catalogue (top-level categories) as an ordered list. */
export function productListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.name} product range`,
    numberOfItems: PRODUCT_TREE.length,
    itemListElement: PRODUCT_TREE.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE.url}${categoryHref(c.slug)}`,
    })),
  };
}

/** FAQPage — only ever fed with FAQs that are visibly rendered on the page. */
export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function aboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE.url}/about`,
    name: `About ${SITE.name}`,
    mainEntity: { "@id": ORG_ID },
  };
}

/** Leadership as Person entities employed by the organization. */
export function leadershipSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": LEADERSHIP.map((member) => ({
      "@type": "Person",
      name: member.name,
      jobTitle: member.role,
      description: member.bio,
      worksFor: { "@id": ORG_ID },
    })),
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${SITE.url}/contact`,
    name: `Contact ${SITE.name}`,
    mainEntity: { "@id": ORG_ID },
  };
}

/* =============================================================================
   STRUCTURED DATA BUILDERS (JSON-LD)
   Every builder draws exclusively from the site's real content in constants/
   and data/ — no fabricated ratings, reviews, awards or business facts.
   Entity graph: Organization (#organization) ← WebSite, Products, pages.
   ========================================================================== */
import { SITE, SOCIALS } from "@/constants/site";
import { PRODUCTS } from "@/data/products";
import { LEADERSHIP } from "@/data/company";
import { OG_IMAGE } from "@/data/images";
import type { Product } from "@/types";
import type { Faq } from "@/data/faqs";

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

/** The company as a single, unambiguous business entity. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    foundingDate: String(SITE.founded),
    slogan: SITE.tagline,
    image: OG_IMAGE,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.line1,
      addressLocality: "Mumbai",
      postalCode: "400051",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    areaServed: { "@type": "Country", name: "India" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: SITE.phone,
        email: SITE.salesEmail,
        availableLanguage: ["en", "hi"],
      },
      {
        "@type": "ContactPoint",
        contactType: "emergency",
        telephone: SITE.emergency,
        hoursAvailable: "Mo-Su 00:00-24:00",
      },
    ],
    sameAs: SOCIALS.map((s) => s.href),
    knowsAbout: [
      "Elevator manufacturing",
      "Vertical transportation",
      ...PRODUCTS.map((p) => p.name),
      "Elevator installation",
      "Elevator maintenance",
      "Elevator modernization",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
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

/** Product entity: specifications become machine-readable PropertyValues. */
export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription ?? product.description,
    url: `${SITE.url}/products/${product.slug}`,
    image: [product.cardImage, product.heroImage],
    category: product.category,
    brand: { "@id": ORG_ID },
    manufacturer: { "@id": ORG_ID },
    additionalProperty: product.specs.map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    })),
  };
}

/** The product catalogue as an ordered list (products index page). */
export function productListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.name} product families`,
    numberOfItems: PRODUCTS.length,
    itemListElement: PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE.url}/products/${p.slug}`,
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

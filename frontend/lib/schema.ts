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
    image: OG_IMAGE_ABS,
    email: SITE.email,
    telephone: SITE.phone,
    taxID: SITE.gst,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.line1,
      addressLocality: SITE.address.city,
      postalCode: SITE.address.postalCode,
      addressRegion: SITE.address.region,
      addressCountry: "IN",
    },
    areaServed: { "@type": "Country", name: "India" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: SITE.phone,
        email: SITE.salesEmail,
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

/** Product entity. `path` is the full route (nested for sub-products). */
export function productSchema(product: ProductNode, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription ?? product.description,
    url: `${SITE.url}${path}`,
    image: product.image,
    category: product.category,
    brand: { "@id": ORG_ID },
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

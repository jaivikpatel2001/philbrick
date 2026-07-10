/* =============================================================================
   FREQUENTLY ASKED QUESTIONS — answer-engine-ready content.
   Answer-first, factual, grounded in the product and service data published
   elsewhere on this site (capacities, speeds, standards, service scope).
   Rendered visibly by FAQSection; mirrored in FAQPage structured data.
   ========================================================================== */

export interface Faq {
  question: string;
  answer: string;
}

/** Buyer-guidance questions — shown on /products. */
export const PRODUCT_FAQS: Faq[] = [
  {
    question: "Which elevator is right for a residential building?",
    answer:
      "For individual homes and villas, a compact home elevator (250–500 kg, 0.15–1.0 m/s) fits in as little as a 900 × 900 mm footprint, with pit-less and shaft-less options. For residential towers, gearless passenger elevators (630–2,500 kg, up to 10 m/s) or machine-room-less (MRL) systems are the standard choice, sized by floor count and expected traffic.",
  },
  {
    question: "What is a machine-room-less (MRL) elevator?",
    answer:
      "An MRL elevator places a compact gearless drive inside the hoistway itself, so the building needs no rooftop machine room. That frees usable roof space, lowers construction cost and simplifies the architectural envelope. VERTIQ MRL systems carry 450–1,600 kg at up to 2.5 m/s with travel up to 75 m.",
  },
  {
    question: "What kind of elevator does a hospital need?",
    answer:
      "Hospitals use dedicated bed and stretcher elevators with deep cars (up to 2,700 mm), 1,600–2,500 kg capacity, ±3 mm levelling accuracy for safe trolley transfer, antimicrobial surfaces and a medical-priority mode that summons a car instantly for emergencies.",
  },
  {
    question: "How fast can high-speed elevators travel?",
    answer:
      "VERTIQ high-speed elevators run at 6–12+ m/s with single rises up to 600 m. Aerodynamic cars, active vibration damping and cabin pressure management keep the ride smooth and comfortable; double-deck configurations double shaft throughput in supertall towers.",
  },
  {
    question: "What factors decide which elevator a building needs?",
    answer:
      "The main factors are rated capacity (how many people or how much load), travel height and number of stops, speed class, available shaft dimensions, duty cycle (starts per hour) and the applicable safety codes — in India primarily IS 14665, alongside EN 81-20/50. Building type then refines the choice: offices favour destination dispatch, hospitals need priority modes, warehouses need forklift-rated platforms.",
  },
  {
    question: "Can an existing elevator be modernized instead of replaced?",
    answer:
      "Yes. Modernization upgrades the drive, controller, doors and cabin in phases while the shaft and rails stay in place. It typically cuts energy use significantly (regenerative drives recover braking energy), improves ride quality and brings the installation up to current safety codes with far less disruption than a full replacement.",
  },
];

/** Enquiry and service-process questions — shown on /contact. */
export const CONTACT_FAQS: Faq[] = [
  {
    question: "How do I request a quotation for an elevator?",
    answer:
      "Send the enquiry form on this page, email sales@vertiq.in, or call +91 22 6789 1968. A VERTIQ specialist responds within one business day with the next steps, usually a short call followed by a site survey.",
  },
  {
    question: "What details help us prepare an accurate proposal?",
    answer:
      "The building type, number of floors and stops, expected daily traffic, approximate shaft dimensions if already defined, and your project timeline. Drawings are welcome but not required — our engineers can survey the site.",
  },
  {
    question: "Does VERTIQ handle installation, maintenance and modernization?",
    answer:
      "Yes — VERTIQ covers the full lifecycle: installation by certified crews, preventive and predictive maintenance, phased modernization of older installations, and annual maintenance contracts (AMC). A 24/7 emergency line (1800 209 1968) backs every service agreement.",
  },
  {
    question: "Where does VERTIQ operate?",
    answer:
      "VERTIQ is headquartered at Bandra Kurla Complex, Mumbai, and manufactures in India. Sales and service coverage is pan-India through a network of service branches, with enquiries routed to the nearest office.",
  },
];

/* =============================================================================
   FREQUENTLY ASKED QUESTIONS — answer-engine-ready content.
   Answer-first and factual, grounded in Philbrick's real product range and the
   contact details in constants/site.ts. No fabricated specifications or claims.
   Rendered visibly by FAQSection; mirrored in FAQPage structured data.
   ========================================================================== */
import { SITE } from "@/constants/site";

export interface Faq {
  question: string;
  answer: string;
}

/** Buyer-guidance questions — shown on /products. */
export const PRODUCT_FAQS: Faq[] = [
  {
    question: "What does Philbrick manufacture?",
    answer:
      "Philbrick makes the components that make an elevator work: control panels and integrated controllers, the Automatic Rescue Device (ARD), the Lift Master door-operator controller, Synergy automatic door mechanisms, elevator doors and cabins, displays, COP/LOP fixtures and voice announcing systems, all engineered and built in-house.",
  },
  {
    question: "What is an Automatic Rescue Device (ARD)?",
    answer:
      "The ARD is a life-safety device. If mains power fails while the elevator is between floors, it automatically moves the car to the nearest landing on backup power and opens the doors so passengers can step out safely, rather than remaining trapped until power returns.",
  },
  {
    question: "What is the difference between a control panel and an integrated control panel?",
    answer:
      "A control panel houses the controller that manages the elevator's motion, safety and signalling. An integrated control panel combines the drive, controller and signalling in a single, space-saving cabinet, available in parallel-wired, serial CAN-bus and machine-room-less (MRL) configurations to cut wiring and installation time.",
  },
  {
    question: "Which automatic door mechanism should I choose?",
    answer:
      "Philbrick's Synergy auto doors come in centre-opening and telescopic (side-opening) layouts, in two- and four-panel configurations. Centre-opening suits standard passenger entrances; telescopic maximises the clear opening where side wall space is limited; four-panel centre-opening gives the widest entrance for hospital, freight and high-traffic use.",
  },
  {
    question: "What elevator display options are available?",
    answer:
      "The display range spans LED segment indicators, multi-line dot-matrix displays, monochrome LCD and full-colour TFT screens (the XN, XLCD and XTFT families). All show floor position and direction clearly, and higher models can carry additional information and messaging.",
  },
  {
    question: "Can Philbrick components be used to modernise an existing lift?",
    answer:
      "Yes. Older elevators can be upgraded in stages: replacing a legacy controller with a modern integrated panel, adding an ARD for safer power-failure behaviour, fitting new door operators, or refreshing COP/LOP fixtures and displays, without replacing the whole installation.",
  },
];

/** Enquiry-process questions — shown on /contact. */
export const CONTACT_FAQS: Faq[] = [
  {
    question: "How do I request a quotation?",
    answer: `Send the enquiry form on this page, write to ${SITE.salesEmail}, or call our helpline on ${SITE.phone}. Tell us what you need, whether a specific product, a component set, or advice, and the Philbrick team will get back to you.`,
  },
  {
    question: "Which number or email should I use?",
    answer: `Call the helpline on ${SITE.phone} for support and general help. To chat instead, message us on WhatsApp at ${SITE.whatsappDisplay}. For quotations, orders and pricing write to ${SITE.salesEmail}; for anything general write to ${SITE.email}; to apply for a job mail your resume to ${SITE.careersEmail}. Our office hours are ${SITE.hours}.`,
  },
  {
    question: "What details help you prepare an accurate quote?",
    answer:
      "The product or products you're interested in, the elevator's configuration (for example automatic or manual doors, drive type, number of floors), the quantity, and your location and timeline. If you're modernising an existing lift, a note on the current equipment helps.",
  },
  {
    question: "Does Philbrick supply for new installations and modernisation?",
    answer:
      "Yes. Philbrick supplies components for new elevator installations and for modernising existing ones, from a single controller or display to a complete set of panels, doors, cabins and fixtures from one source.",
  },
  {
    question: "Where is Philbrick based and where do you supply?",
    answer: `Philbrick Technologies is based at ${SITE.address.line1}, ${SITE.address.line2}. We supply customers across India and export to markets including China and Taiwan.`,
  },
];

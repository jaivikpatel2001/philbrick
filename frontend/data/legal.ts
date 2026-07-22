/* =============================================================================
   PHILBRICK — LEGAL CONTENT

   The Privacy Policy the client publishes on WordPress (page ID 3992), section
   for section. Only obvious typos in the source markup are corrected (the WP
   page has a malformed `<h4How We Use Your Information</h4>` tag, so that
   heading never rendered there); no clause is added, dropped or reworded.
   Contact details are not hard-coded here — they come from constants/site.ts.
   ========================================================================== */

export interface LegalSection {
  /** Heading as published, or null for the opening, un-headed paragraphs. */
  heading: string | null;
  paragraphs: string[];
}

export const PRIVACY_POLICY: LegalSection[] = [
  {
    heading: null,
    paragraphs: [
      'At Philbrick Technologies India Pvt Limited, we place paramount importance on safeguarding your personal data. This Privacy Policy ("Policy") is formulated by us, acting as the data controller, to provide you with insights into how we collect and process the personal data you submit or disclose. We also operate as a data controller when processing personal data obtained through third parties. The objective of this Policy is to ensure that you are well-informed about our data practices.',
      "We encourage you to read this Privacy Policy carefully. If you do not wish your personal data to be used by us as set out in this Privacy Policy, please do not provide us with your personal data. Please note that in such a case, we may not be able to provide you with our services, you may not have access to and/or be able to use some features of the Website, and your customer experience may be impacted.",
    ],
  },
  {
    heading: "Information We Collect",
    paragraphs: [
      'We may collect information that can identify you ("Personal Information"), such as your name, email address, and telephone number when you register for an account with us. We may also collect other information, such as your location, device information, and usage data, through cookies and other tracking technologies.',
    ],
  },
  {
    heading: "How We Use Your Information",
    paragraphs: [
      "We use the information we collect to provide and improve our services to you, to communicate with you, and to personalize your experience with the App. We may also use your information to comply with legal obligations or to protect our rights and interests.",
    ],
  },
  {
    heading: "Data Retention and Security",
    paragraphs: [
      "We will retain your Personal Information for as long as necessary to provide you with the services and to comply with our legal obligations. We take reasonable measures to protect your Personal Information from unauthorized access and use.",
    ],
  },
  {
    heading: "Your Rights and Choices",
    paragraphs: [
      "You have the right to access, correct, and delete your Personal Information. You may also choose to opt out of receiving certain communications from us. If you have any questions or concerns about your privacy rights or how your information is being used, please contact us using the information provided below.",
    ],
  },
  {
    heading: "Changes to this Privacy Policy",
    paragraphs: [
      "We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on the App. You are advised to review this privacy policy periodically for any changes.",
    ],
  },
];

/** Heading of the policy's final section; the details themselves come from SITE. */
export const PRIVACY_CONTACT_HEADING = "Contact Us";
export const PRIVACY_CONTACT_INTRO =
  "If you have any questions or concerns about this privacy policy, please contact us at";

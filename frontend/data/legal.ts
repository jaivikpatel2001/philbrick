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
  /** Optional bulleted items rendered after the paragraphs (e.g. Terms §3). */
  list?: string[];
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

/* =============================================================================
   TERMS & CONDITIONS

   Verbatim from the official site (philbrickindia.com/terms-condition.html).
   Wording preserved exactly; only structured for the site's prose layout.
   Contact details are not hard-coded — they come from constants/site.ts.
   ========================================================================== */
export const TERMS_OF_SERVICE: LegalSection[] = [
  {
    heading: null,
    paragraphs: [
      'Welcome to the official digital platform of Philbrick Technologies (India) Pvt. Ltd. ("philbrick", "Company", "we", "us", or "our"). These Terms & Conditions govern your access to and use of our website, product documentation, technical specifications, and online services.',
      "By accessing or using our website, requesting product quotes, or downloading technical data sheets, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please refrain from using our digital services.",
    ],
  },
  {
    heading: "Intellectual Property Rights",
    paragraphs: [
      "All contents displayed on this website—including but not limited to brand logos, trademarks, technical drawings, engineering designs, product catalogs, software, photography, graphics, and text—are the exclusive intellectual property of Philbrick Technologies (India) Pvt. Ltd. and are protected by applicable Indian and international copyright, trademark, and patent laws.",
      "You are granted a limited, non-exclusive, non-transferable license to view and download content solely for personal, non-commercial, or legitimate procurement evaluation purposes. Any reproduction, distribution, modification, or commercial exploitation without our prior written consent is strictly prohibited.",
    ],
  },
  {
    heading: "Product Specifications & Quality Assurance",
    paragraphs: [
      "While Philbrick Technologies makes every effort to present accurate engineering data and product images, technical specifications and dimensions are subject to continuous engineering enhancements. All product executions and deliveries are governed strictly by individual commercial purchase orders, approved Quality Assurance (Q.A.) plans, and relevant Indian Standard specifications.",
      "Certificates of physical and chemical analysis are issued as per the agreed order execution terms and ISO certified quality procedures.",
    ],
  },
  {
    heading: "User Obligations & Conduct",
    paragraphs: [
      "When interacting with our website and digital services, you agree that you will not:",
    ],
    list: [
      "Use the site for any unlawful, fraudulent, or unauthorized purpose.",
      "Attempt to probe, scan, or breach the security of our network infrastructure or servers.",
      "Use automated bots, scrapers, or data mining software to extract proprietary technical assets.",
      "Transmit malicious code, viruses, or disruptive digital assets.",
    ],
  },
  {
    heading: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by applicable law, Philbrick Technologies (India) Pvt. Ltd. shall not be liable for any indirect, incidental, consequential, or punitive damages arising out of your access to or use of this website. Product warranties are strictly limited to manufactured parts adhering to agreed technical purchase orders and safety compliance at customer premises.",
    ],
  },
  {
    heading: "Governing Law & Jurisdiction",
    paragraphs: [
      "These Terms & Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of India.",
    ],
  },
];

export const TERMS_CONTACT_HEADING = "Legal Contact & Inquiries";
export const TERMS_CONTACT_INTRO =
  "For any legal inquiries regarding these terms or commercial contracts, please contact Philbrick Technologies:";

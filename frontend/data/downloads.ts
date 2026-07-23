/* =============================================================================
   PHILBRICK — DOWNLOADS

   The client's WordPress site carries two download pages: a "Download" page
   that currently reads "Sorry There Id Nothing To Download Right Now. Visit
   Again Later." and a "Step Brochure" page whose single row links the STEP
   catalogue PDF. Both are represented here so the new site is a superset; the
   empty-state copy is kept (cleaned of its typo) for when the list runs dry.
   ========================================================================== */

export interface DownloadItem {
  title: string;
  /** What the file is, for the card body. */
  description: string;
  /** Absolute URL as published by the client. */
  href: string;
  /** Shown on the button, e.g. "PDF". */
  format: string;
  /** Source page on the client's WordPress site, for traceability. */
  source: string;
}

export const DOWNLOADS: DownloadItem[] = [
  {
    title: "STEP Brochure",
    description:
      "The STEP product catalogue Philbrick publishes for its integrated elevator controller range.",
    href: "https://acharyagroup.in/cdn/2023catalog.pdf",
    format: "PDF",
    source: "Step Brochure page",
  },
];

/** Shown when DOWNLOADS is empty, mirroring the client's own Download page. */
export const DOWNLOADS_EMPTY = [
  "Sorry, there is nothing to download right now.",
  "Visit again later.",
];

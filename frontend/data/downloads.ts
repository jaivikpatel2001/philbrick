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

/* No live downloads yet. The previous STEP-brochure row pointed at the old
   acharyagroup.in host (a dead/placeholder link), so it was removed 2026-07-25
   rather than shown as a dummy card. Add real, self-hosted PDFs here (e.g.
   under public/downloads/) and the list renders automatically; until then the
   page shows the friendly empty state below. */
export const DOWNLOADS: DownloadItem[] = [];

/** Shown when DOWNLOADS is empty. */
export const DOWNLOADS_EMPTY = [
  "No brochures or catalogues are available for download right now.",
  "Please check back later, or ask us and we will send what you need.",
];

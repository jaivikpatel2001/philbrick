import { Inter, Space_Grotesk } from "next/font/google";

/* =============================================================================
   TYPEFACES

   Both families load as VARIABLE fonts: `weight` is deliberately omitted so
   next/font fetches ONE variable .woff2 per family instead of one static file
   per weight. Rendering is identical (the design only uses 400/500/600/700, all
   inside each family's weight axis) but the build ships 2 font files instead of
   9 — fewer HTTP requests, and no extra download when a page mixes weights.

   `--fw-light` (300) is declared in tokens.css but used nowhere; the variable
   axis still covers it if it is ever needed.
   ========================================================================== */

/** Body / UI face — the editorial reading voice. */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Display face — the technical, architectural headline voice
 *  (an open stand-in for Clash Display). */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const fontVariables = `${inter.variable} ${spaceGrotesk.variable}`;

import { Inter, Space_Grotesk } from "next/font/google";

/** Body / UI face — the editorial reading voice. */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/** Display face — the technical, architectural headline voice
 *  (an open stand-in for Clash Display). */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const fontVariables = `${inter.variable} ${spaceGrotesk.variable}`;

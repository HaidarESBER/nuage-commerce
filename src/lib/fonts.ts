import { Inter, Cormorant_Garamond } from "next/font/google";

/**
 * Body font - Inter
 * Clean, modern sans-serif optimized for screens.
 * Used for: body text, navigation, buttons, small headings (H4+)
 */
export const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500"],
});

/**
 * Heading font - Cormorant Garamond
 * Elegant serif with French typography heritage.
 * Light, airy letterforms echo the "cloud" concept of Nuage brand.
 * Used for: H1-H3 headings, brand moments
 */
export const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["500", "600"],
});

/**
 * Combined font variables for applying to HTML element
 */
export const fontVariables = `${bodyFont.variable} ${headingFont.variable}`;

import { Space_Grotesk } from "next/font/google";

/**
 * Primary font - Space Grotesk
 * Modern, bold sans-serif with luxury appeal.
 * Used for: body text, headings, navigation, all typography
 * Provides a consistent, premium aesthetic across the entire site.
 */
export const primaryFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/**
 * Combined font variables for applying to HTML element
 */
export const fontVariables = primaryFont.variable;

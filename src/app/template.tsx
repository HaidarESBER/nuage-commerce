"use client";

import { motion } from "framer-motion";

/**
 * Page transition template for app-like navigation
 *
 * Features:
 * - Fade + slide transitions (iOS/Android native-like)
 * - 300ms duration (matches brand animation timing)
 * - Forward navigation: slide left (x: 20 → 0)
 * - Smooth easing curve (easeInOut)
 * - Applied to all route changes in App Router
 * - Client component required for motion animations
 *
 * The template wraps page content and re-renders on route changes,
 * enabling seamless transitions between pages like native apps.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

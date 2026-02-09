"use client";

import { motion } from "framer-motion";

/**
 * Page transition template for smooth route changes
 *
 * Features:
 * - Subtle fade transition (300ms) for premium feel
 * - Applied to all route changes in App Router
 * - Client component required for motion animations
 *
 * The template wraps page content and re-renders on route changes,
 * enabling smooth transitions between pages without jarring cuts.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

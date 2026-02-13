"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
}

const NUAGE_EASING = [0.21, 0.47, 0.32, 0.98] as const;
const NUAGE_DURATION = 0.4;

/**
 * Expandable accordion section for product content
 * Replaces tab navigation with stacked, expandable sections
 *
 * Features:
 * - Smooth height animation with Nuage easing
 * - Chevron rotation on expand/collapse
 * - Optional badge for counts (e.g., review count)
 * - Default open state support
 */
export function ExpandableSection({
  title,
  children,
  defaultOpen = false,
  badge,
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border last:border-b-0">
      {/* Section Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 px-2 text-left hover:bg-background-secondary/30 transition-colors group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg md:text-xl font-heading font-light text-primary tracking-wide">
            {title}
          </h3>
          {badge !== undefined && (
            <span className="text-sm text-muted bg-background-secondary px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: NUAGE_DURATION, ease: NUAGE_EASING }}
          className="text-muted group-hover:text-primary transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Section Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: NUAGE_DURATION, ease: NUAGE_EASING },
              opacity: { duration: NUAGE_DURATION * 0.5, ease: NUAGE_EASING },
            }}
            className="overflow-hidden"
          >
            <div className="pb-6 px-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

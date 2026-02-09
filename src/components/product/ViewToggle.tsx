"use client";

import { motion } from "framer-motion";

interface ViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

/**
 * Toggle between grid and list view
 */
export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 bg-background-secondary rounded-[--radius-button]">
      <button
        onClick={() => onViewChange("grid")}
        className={`relative px-3 py-2 rounded transition-colors ${
          view === "grid"
            ? "text-primary"
            : "text-muted hover:text-primary"
        }`}
        aria-label="Vue grille"
      >
        {view === "grid" && (
          <motion.div
            layoutId="activeView"
            className="absolute inset-0 bg-background rounded"
            transition={{ type: "spring", duration: 0.5 }}
          />
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`relative px-3 py-2 rounded transition-colors ${
          view === "list"
            ? "text-primary"
            : "text-muted hover:text-primary"
        }`}
        aria-label="Vue liste"
      >
        {view === "list" && (
          <motion.div
            layoutId="activeView"
            className="absolute inset-0 bg-background rounded"
            transition={{ type: "spring", duration: 0.5 }}
          />
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>
    </div>
  );
}

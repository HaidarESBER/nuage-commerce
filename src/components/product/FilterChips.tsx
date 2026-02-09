"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ProductCategory, categoryLabels } from "@/types/product";

interface FilterChipsProps {
  activeCategories: ProductCategory[];
  priceRange: [number, number];
  priceRangeLimits: { min: number; max: number };
  inStockOnly: boolean;
  onRemoveCategory: (category: ProductCategory) => void;
  onRemovePriceFilter: () => void;
  onRemoveStockFilter: () => void;
  onClearAll: () => void;
}

/**
 * Display active filters as chips
 */
export function FilterChips({
  activeCategories,
  priceRange,
  priceRangeLimits,
  inStockOnly,
  onRemoveCategory,
  onRemovePriceFilter,
  onRemoveStockFilter,
  onClearAll,
}: FilterChipsProps) {
  const hasPriceFilter =
    priceRange[0] !== priceRangeLimits.min ||
    priceRange[1] !== priceRangeLimits.max;

  const hasFilters =
    activeCategories.length > 0 || hasPriceFilter || inStockOnly;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <span className="text-sm text-muted mr-2">Filtres actifs:</span>

      <AnimatePresence mode="popLayout">
        {/* Category chips */}
        {activeCategories.map((category) => (
          <motion.button
            key={category}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onRemoveCategory(category)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium hover:bg-accent/20 transition-colors"
          >
            {categoryLabels[category]}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>
        ))}

        {/* Price filter chip */}
        {hasPriceFilter && (
          <motion.button
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onRemovePriceFilter}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium hover:bg-accent/20 transition-colors"
          >
            Prix: {(priceRange[0] / 100).toFixed(0)}€ - {(priceRange[1] / 100).toFixed(0)}€
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>
        )}

        {/* Stock filter chip */}
        {inStockOnly && (
          <motion.button
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onRemoveStockFilter}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium hover:bg-accent/20 transition-colors"
          >
            En stock uniquement
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>
        )}

        {/* Clear all button */}
        <motion.button
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={onClearAll}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary hover:text-accent transition-colors underline"
        >
          Tout effacer
        </motion.button>
      </AnimatePresence>
    </div>
  );
}

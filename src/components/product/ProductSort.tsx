"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/product";

export type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "popularity";

interface SortOptionConfig {
  value: SortOption;
  label: string;
}

const sortOptions: SortOptionConfig[] = [
  { value: "relevance", label: "Pertinence" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "newest", label: "Nouveautés" },
  { value: "popularity", label: "Popularité" },
];

/**
 * Custom hook for product sorting
 * Provides sort state and sorted products
 */
export function useProductSort(products: Product[], initialSort: SortOption = "relevance") {
  const [sortOption, setSortOption] = useState<SortOption>(initialSort);

  const sortedProducts = useMemo(() => {
    const productsToSort = [...products];

    switch (sortOption) {
      case "price-asc":
        return productsToSort.sort((a, b) => a.price - b.price);

      case "price-desc":
        return productsToSort.sort((a, b) => b.price - a.price);

      case "newest":
        // Reverse order (newest first) - assumes products array is ordered by creation
        return productsToSort.reverse();

      case "popularity":
        // Featured products first, then by order
        return productsToSort.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });

      case "relevance":
      default:
        // Featured first, then natural order
        return productsToSort.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }
  }, [products, sortOption]);

  return {
    sortOption,
    setSortOption,
    sortedProducts,
  };
}

interface ProductSortProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

/**
 * ProductSort dropdown component
 *
 * Features:
 * - Custom styled select (not native)
 * - Shows current selection: "Trier par: Prix croissant"
 * - Checkmark icon next to selected option
 * - Animated dropdown with Framer Motion (fade + slide)
 * - ChevronDown icon rotates 180° when open
 * - Click outside closes dropdown
 * - ESC key closes dropdown
 * - Premium feel with smooth animations
 */
export function ProductSort({ sortOption, onSortChange }: ProductSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = sortOptions.find((opt) => opt.value === sortOption) || sortOptions[0];

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleOptionClick = (option: SortOption) => {
    onSortChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-xs md:text-sm font-light hover:bg-background-secondary transition-colors"
      >
        <span className="hidden sm:inline text-muted">Trier:</span>
        <span>{currentOption.label}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-3 h-3 md:w-4 md:h-4 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 bg-background-card border border-primary/20 rounded-[--radius-card] shadow-lg overflow-hidden z-50"
          >
            <div className="py-2">
              {sortOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleOptionClick(option.value)}
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-background-secondary transition-colors text-left"
                >
                  {/* Checkmark Icon */}
                  <div className="w-5 h-5 flex items-center justify-center">
                    {option.value === sortOption && (
                      <svg
                        className="w-4 h-4 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Option Label */}
                  <span
                    className={`text-sm ${
                      option.value === sortOption
                        ? "text-primary font-medium"
                        : "text-muted"
                    }`}
                  >
                    {option.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

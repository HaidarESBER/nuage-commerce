"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductCategory, categoryLabels, formatPrice } from "@/types/product";

interface FilterState {
  categories: ProductCategory[];
  priceRange: [number, number];
  inStockOnly: boolean;
}

/**
 * Custom hook for product filtering
 * Provides filter state and filtered products
 */
export function useProductFilters(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 0],
    inStockOnly: false,
  });

  // Calculate price range from products
  const priceRangeLimits = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 100 };

    const prices = products.map((p) => p.price);
    const min = 0;
    const max = Math.ceil((Math.max(...prices) + 1000) / 500) * 500; // Round up to nearest 500 with buffer

    return { min, max };
  }, [products]);

  // Initialize price range when products change
  useMemo(() => {
    if (filters.priceRange[0] === 0 && filters.priceRange[1] === 0) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [priceRangeLimits.min, priceRangeLimits.max],
      }));
    }
  }, [priceRangeLimits, filters.priceRange]);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Stock filter
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      filters.priceRange[0] !== priceRangeLimits.min ||
      filters.priceRange[1] !== priceRangeLimits.max ||
      filters.inStockOnly
    );
  }, [filters, priceRangeLimits]);

  const toggleCategory = (category: ProductCategory) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const setPriceRange = (range: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
  };

  const toggleInStockOnly = () => {
    setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }));
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [priceRangeLimits.min, priceRangeLimits.max],
      inStockOnly: false,
    });
  };

  return {
    filters,
    filteredProducts,
    hasActiveFilters,
    priceRangeLimits,
    toggleCategory,
    setPriceRange,
    toggleInStockOnly,
    resetFilters,
  };
}

interface ProductFiltersProps {
  products: Product[];
  filters: FilterState;
  priceRangeLimits: { min: number; max: number };
  hasActiveFilters: boolean;
  onToggleCategory: (category: ProductCategory) => void;
  onSetPriceRange: (range: [number, number]) => void;
  onToggleInStockOnly: () => void;
  onResetFilters: () => void;
}

/**
 * Collapsible filter section component
 */
function FilterSection({
  title,
  isExpanded,
  onToggle,
  children,
}: {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-primary/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <h3 className="font-heading text-lg text-primary group-hover:text-accent transition-colors">
          {title}
        </h3>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-muted"
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

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * ProductFilters component with collapsible filter sections
 *
 * Features:
 * - Category filter with checkboxes and product count
 * - Price range filter with dual sliders
 * - Stock status filter (in stock only)
 * - Collapsible sections with animation
 * - Reset all filters button
 * - Responsive layout (sidebar desktop, panel mobile)
 */
export function ProductFilters({
  products,
  filters,
  priceRangeLimits,
  hasActiveFilters,
  onToggleCategory,
  onSetPriceRange,
  onToggleInStockOnly,
  onResetFilters,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    stock: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<ProductCategory, number> = {
      chicha: 0,
      bol: 0,
      tuyau: 0,
      charbon: 0,
      accessoire: 0,
    };

    products.forEach((product) => {
      counts[product.category]++;
    });

    return counts;
  }, [products]);

  const categories: ProductCategory[] = ["chicha", "bol", "tuyau", "charbon", "accessoire"];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-background-card rounded-[--radius-card] p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-heading text-2xl text-primary mb-2">Filtres</h2>
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onResetFilters}
            className="text-sm text-accent hover:underline"
          >
            Réinitialiser les filtres
          </motion.button>
        )}
      </div>

      {/* Category Filter */}
      <FilterSection
        title="Catégorie"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection("category")}
      >
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => onToggleCategory(category)}
                className="w-4 h-4 rounded border-primary/30 text-accent focus:ring-accent focus:ring-offset-0"
              />
              <span className="text-sm text-primary group-hover:text-accent transition-colors flex-1">
                {categoryLabels[category]}
              </span>
              <span className="text-xs text-muted">({categoryCounts[category]})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection
        title="Prix"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="space-y-4">
          {/* Price Range Display */}
          <div className="text-center text-sm text-primary font-medium">
            {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
          </div>

          {/* Dual Range Sliders */}
          <div className="relative h-10">
            {/* Min Slider */}
            <input
              type="range"
              min={priceRangeLimits.min}
              max={priceRangeLimits.max}
              step={500}
              value={filters.priceRange[0]}
              onChange={(e) => {
                const newMin = Number(e.target.value);
                if (newMin < filters.priceRange[1]) {
                  onSetPriceRange([newMin, filters.priceRange[1]]);
                }
              }}
              className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:border-0"
            />
            {/* Max Slider */}
            <input
              type="range"
              min={priceRangeLimits.min}
              max={priceRangeLimits.max}
              step={500}
              value={filters.priceRange[1]}
              onChange={(e) => {
                const newMax = Number(e.target.value);
                if (newMax > filters.priceRange[0]) {
                  onSetPriceRange([filters.priceRange[0], newMax]);
                }
              }}
              className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:border-0"
            />
            {/* Track */}
            <div className="absolute top-1/2 w-full h-1 -translate-y-1/2 bg-primary/20 rounded-full pointer-events-none">
              <div
                className="absolute h-full bg-accent rounded-full"
                style={{
                  left: `${((filters.priceRange[0] - priceRangeLimits.min) / (priceRangeLimits.max - priceRangeLimits.min)) * 100}%`,
                  right: `${100 - ((filters.priceRange[1] - priceRangeLimits.min) / (priceRangeLimits.max - priceRangeLimits.min)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Min/Max Labels */}
          <div className="flex justify-between text-xs text-muted">
            <span>{formatPrice(priceRangeLimits.min)}</span>
            <span>{formatPrice(priceRangeLimits.max)}</span>
          </div>
        </div>
      </FilterSection>

      {/* Stock Filter */}
      <FilterSection
        title="Disponibilité"
        isExpanded={expandedSections.stock}
        onToggle={() => toggleSection("stock")}
      >
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={onToggleInStockOnly}
            className="w-4 h-4 rounded border-primary/30 text-accent focus:ring-accent focus:ring-offset-0"
          />
          <span className="text-sm text-primary group-hover:text-accent transition-colors">
            En stock uniquement
          </span>
        </label>
      </FilterSection>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCategory, categoryLabels } from "@/types/product";
import type { FacetCounts } from "@/types/search";

interface ProductFiltersProps {
  facets: FacetCounts;
  selectedCategory?: ProductCategory;
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
 * ProductFilters component with URL-based state and facet counts
 */
export function ProductFilters({
  facets,
  selectedCategory,
}: ProductFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    sort: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCategory = (category: ProductCategory) => {
    const params = new URLSearchParams(searchParams);

    if (params.get('category') === category) {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  };

  const setPriceRange = (minPrice: number, maxPrice: number) => {
    const params = new URLSearchParams(searchParams);

    if (minPrice > 0 || maxPrice < Infinity) {
      params.set('minPrice', String(minPrice));
      if (maxPrice < Infinity) {
        params.set('maxPrice', String(maxPrice));
      } else {
        params.delete('maxPrice');
      }
    } else {
      params.delete('minPrice');
      params.delete('maxPrice');
    }

    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  };

  const setSort = (sort: string) => {
    const params = new URLSearchParams(searchParams);

    if (sort === 'relevance') {
      params.delete('sort');
    } else {
      params.set('sort', sort);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    const query = params.get('q');

    params.delete('category');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('sort');
    params.delete('page');

    const newParams = new URLSearchParams();
    if (query) {
      newParams.set('q', query);
    }

    replace(`${pathname}?${newParams.toString()}`);
  };

  const categories: ProductCategory[] = ["chicha", "bol", "tuyau", "charbon", "accessoire"];
  const currentSort = searchParams.get('sort') || 'relevance';
  const currentMinPrice = Number(searchParams.get('minPrice')) || undefined;
  const currentMaxPrice = Number(searchParams.get('maxPrice')) || undefined;

  const hasActiveFilters =
    selectedCategory !== undefined ||
    currentMinPrice !== undefined ||
    currentMaxPrice !== undefined ||
    currentSort !== 'relevance';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-background-card rounded-[--radius-card] p-6"
    >
      <div className="mb-6">
        <h2 className="font-heading text-2xl text-primary mb-2">Filtres</h2>
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={clearFilters}
            className="text-sm text-accent hover:underline"
          >
            Réinitialiser les filtres
          </motion.button>
        )}
      </div>

      <FilterSection
        title="Catégorie"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection("category")}
      >
        <div className="space-y-3">
          {categories.map((category) => {
            const count = facets.categories[category];
            const isDisabled = count === 0;
            const isSelected = selectedCategory === category;

            return (
              <label
                key={category}
                className={`flex items-center gap-3 cursor-pointer group ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => !isDisabled && toggleCategory(category)}
                  disabled={isDisabled}
                  className="w-4 h-4 rounded border-primary/30 text-accent focus:ring-accent focus:ring-offset-0 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-primary group-hover:text-accent transition-colors flex-1">
                  {categoryLabels[category]}
                </span>
                <span className="text-xs text-muted">({count})</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection
        title="Prix"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="space-y-3">
          {facets.priceRanges.map((range) => {
            const isDisabled = range.count === 0;
            const isSelected =
              currentMinPrice === range.min &&
              (range.max === Infinity ? currentMaxPrice === undefined : currentMaxPrice === range.max);

            return (
              <label
                key={range.label}
                className={`flex items-center gap-3 cursor-pointer group ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  type="radio"
                  name="price-range"
                  checked={isSelected}
                  onChange={() => !isDisabled && setPriceRange(range.min, range.max)}
                  disabled={isDisabled}
                  className="w-4 h-4 text-accent focus:ring-accent focus:ring-offset-0 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-primary group-hover:text-accent transition-colors flex-1">
                  {range.label}
                </span>
                <span className="text-xs text-muted">({range.count})</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection
        title="Trier par"
        isExpanded={expandedSections.sort}
        onToggle={() => toggleSection("sort")}
      >
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="sort"
              checked={currentSort === 'relevance'}
              onChange={() => setSort('relevance')}
              className="w-4 h-4 text-accent focus:ring-accent focus:ring-offset-0"
            />
            <span className="text-sm text-primary group-hover:text-accent transition-colors">
              Pertinence
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="sort"
              checked={currentSort === 'price-asc'}
              onChange={() => setSort('price-asc')}
              className="w-4 h-4 text-accent focus:ring-accent focus:ring-offset-0"
            />
            <span className="text-sm text-primary group-hover:text-accent transition-colors">
              Prix croissant
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="sort"
              checked={currentSort === 'price-desc'}
              onChange={() => setSort('price-desc')}
              className="w-4 h-4 text-accent focus:ring-accent focus:ring-offset-0"
            />
            <span className="text-sm text-primary group-hover:text-accent transition-colors">
              Prix décroissant
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="sort"
              checked={currentSort === 'name'}
              onChange={() => setSort('name')}
              className="w-4 h-4 text-accent focus:ring-accent focus:ring-offset-0"
            />
            <span className="text-sm text-primary group-hover:text-accent transition-colors">
              Nom
            </span>
          </label>
        </div>
      </FilterSection>
    </motion.div>
  );
}

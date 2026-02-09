"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Product, formatPrice } from "@/types/product";
import Image from "next/image";

interface ProductSearchProps {
  products: Product[];
  onSearchChange?: (query: string, results: Product[]) => void;
}

/**
 * Custom hook for product search functionality
 * Provides debounced search with autocomplete results
 */
export function useProductSearch(products: Product[], debounceMs = 300) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Filter products based on search query
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const searchTerm = debouncedQuery.toLowerCase().trim();
    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    });
  }, [products, debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    hasResults: results.length > 0,
    isSearching: query.length > 0,
  };
}

/**
 * ProductSearch component with instant autocomplete dropdown
 *
 * Features:
 * - Debounced search (300ms) to avoid excessive re-renders
 * - Search across product name, description, category
 * - Autocomplete dropdown with max 5 results
 * - Each result shows thumbnail, name, price
 * - Clicking result navigates to product detail page
 * - ESC key clears search and closes dropdown
 * - Click outside closes dropdown
 * - Animated dropdown with Framer Motion
 */
export function ProductSearch({ products, onSearchChange }: ProductSearchProps) {
  const { query, setQuery, results, isSearching } = useProductSearch(products);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Show dropdown when there are results and user is searching
  useEffect(() => {
    setIsOpen(isSearching && results.length > 0);
  }, [isSearching, results.length]);

  // Notify parent of search changes
  useEffect(() => {
    onSearchChange?.(query, results);
  }, [query, results, onSearchChange]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle ESC key to clear and close
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setQuery("");
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setQuery]);

  const handleResultClick = (productSlug: string) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/produits/${productSlug}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const displayResults = results.slice(0, 5);

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Rechercher un produit..."
          className="w-full pl-12 pr-4 py-3 bg-background-card border border-primary/20 rounded-[--radius-button] text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
        />
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && displayResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-background-card border border-primary/20 rounded-[--radius-card] shadow-lg overflow-hidden"
          >
            <div className="py-2">
              {displayResults.map((product, index) => (
                <motion.button
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleResultClick(product.slug)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-background-secondary transition-colors text-left"
                >
                  {/* Thumbnail */}
                  <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-background-secondary">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading text-sm text-primary truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-muted">{formatPrice(product.price)}</p>
                  </div>

                  {/* Arrow Icon */}
                  <svg
                    className="w-4 h-4 text-muted flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              ))}

              {/* Show more indicator */}
              {results.length > 5 && (
                <div className="px-4 py-2 text-xs text-muted text-center border-t border-primary/10">
                  +{results.length - 5} autres résultats
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

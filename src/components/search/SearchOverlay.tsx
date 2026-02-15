"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Product, formatPrice } from "@/types/product";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smart search with synonyms
  const getSearchTerms = (query: string): string[] => {
    const searchLower = query.toLowerCase();
    const terms = [searchLower];

    // Synonyms mapping
    const synonyms: Record<string, string[]> = {
      'hookah': ['chicha', 'narguilé', 'shisha'],
      'shisha': ['chicha', 'narguilé', 'hookah'],
      'narguilé': ['chicha', 'hookah', 'shisha'],
      'narguile': ['chicha', 'hookah', 'shisha'],
      'bowl': ['bol', 'foyer'],
      'foyer': ['bol', 'bowl'],
      'hose': ['tuyau', 'flexible'],
      'tuyau': ['hose', 'flexible'],
      'flexible': ['tuyau', 'hose'],
      'coal': ['charbon', 'charcoal'],
      'charcoal': ['charbon', 'coal'],
      'charbon': ['coal', 'charcoal'],
      'accessory': ['accessoire'],
      'accessories': ['accessoire'],
      'accessoire': ['accessory'],
    };

    // Add synonyms for the search term
    Object.entries(synonyms).forEach(([key, values]) => {
      if (searchLower.includes(key)) {
        terms.push(...values);
      }
    });

    return [...new Set(terms)]; // Remove duplicates
  };

  // Search products
  useEffect(() => {
    if (!isOpen || query.length === 0) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const products: Product[] = await response.json();

        const searchTerms = getSearchTerms(query);
        const filtered = products.filter(
          (p) =>
            searchTerms.some(term =>
              p.name.toLowerCase().includes(term) ||
              p.description.toLowerCase().includes(term) ||
              p.shortDescription.toLowerCase().includes(term) ||
              p.category.toLowerCase().includes(term)
            )
        );

        setResults(filtered.slice(0, 2)); // Show only 2 results
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query, isOpen]);

  // Handle ESC key and click outside
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile: Full screen overlay */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            onClick={onClose}
          />

          <motion.div
            key="search-container"
            ref={containerRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 md:top-24 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:max-w-2xl z-[101] md:px-4"
          >
        <div className="bg-background-dark md:bg-black/80 border-b md:border border-white/20 md:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl min-h-screen md:min-h-0">
          {/* Search Input */}
          <div className="p-4 md:p-5 border-b border-white/10 md:border-0">
            <div className="flex items-center gap-3">
              {/* Mobile back button */}
              <button
                onClick={onClose}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <span className="material-icons text-white">arrow_back</span>
              </button>

              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons text-primary/60 text-xl md:text-2xl">
                  search
                </span>
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-white/5 border-2 border-white/10 focus:border-primary/50 rounded-xl text-base md:text-lg text-text placeholder-text-muted focus:outline-none py-4 md:py-4 pl-12 md:pl-14 pr-12 transition-all"
                  placeholder="Rechercher..."
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                  >
                    <span className="material-icons text-xl text-text-muted">close</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          {query.length > 0 && (
            <div className="px-4 md:px-5 py-2 bg-white/5 border-y border-white/10">
              <p className="text-xs md:text-sm text-text-muted">
                Rechercher <span className="text-primary font-semibold">"{query}"</span>
              </p>
            </div>
          )}

          {results.length > 0 ? (
            <div className="pb-safe">
              {results.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/produits/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 md:gap-4 p-4 md:p-5 hover:bg-white/5 active:bg-white/10 transition-all border-b border-white/5 group"
                >
                  <div className="w-20 h-20 md:w-20 md:h-20 flex-shrink-0 bg-surface-dark rounded-lg overflow-hidden border border-white/10 group-hover:border-primary/30 transition-colors">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-text font-semibold text-base md:text-base mb-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                      {product.name}
                    </h4>
                    <p className="text-sm md:text-sm text-primary font-bold">{formatPrice(product.price)}</p>
                  </div>
                  <span className="material-icons text-text-muted group-hover:text-primary text-xl transition-colors">
                    arrow_forward
                  </span>
                </Link>
              ))}

              <Link
                href={`/produits?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-5 text-base md:text-base text-primary hover:text-text hover:bg-white/5 active:bg-white/10 transition-all font-medium group"
              >
                Voir plus de résultats
                <span className="material-icons text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          ) : query.length > 0 ? (
            <div className="text-center py-16 md:py-16 px-4">
              <div className="w-20 h-20 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <span className="material-icons text-4xl md:text-4xl text-text-muted">search_off</span>
              </div>
              <p className="text-text-muted text-base md:text-base mb-6">
                Aucun résultat pour <span className="text-text font-medium">"{query}"</span>
              </p>
              <Link
                href="/produits"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-8 md:px-8 py-4 md:py-3.5 bg-primary hover:bg-primary/90 active:bg-primary/80 text-background-dark rounded-full text-base md:text-base font-bold transition-all"
              >
                Voir tous les produits
                <span className="material-icons text-base">arrow_forward</span>
              </Link>
            </div>
          ) : null}
        </div>
      </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

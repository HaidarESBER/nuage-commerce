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
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed top-20 md:top-24 left-1/2 -translate-x-1/2 w-full max-w-xl md:max-w-2xl z-[100] px-4"
      >
        <div className="bg-black/80 border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl">
          {/* Search Input */}
          <div className="p-4 md:p-5">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons text-primary/60 text-xl">
                search
              </span>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white/5 border-2 border-white/10 focus:border-primary/50 rounded-xl text-base md:text-lg text-text placeholder-text-muted focus:outline-none py-3 md:py-4 pl-12 md:pl-14 pr-4 transition-all"
                placeholder="Rechercher un produit..."
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                >
                  <span className="material-icons text-xl">close</span>
                </button>
              )}
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
            <div>
              {results.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/produits/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-4 md:p-5 hover:bg-white/5 transition-all border-b border-white/5 group"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-surface-dark rounded-lg overflow-hidden border border-white/10 group-hover:border-primary/30 transition-colors">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-text font-semibold text-sm md:text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs md:text-sm text-primary font-bold">{formatPrice(product.price)}</p>
                  </div>
                  <span className="material-icons text-text-muted group-hover:text-primary text-lg transition-colors">
                    arrow_forward
                  </span>
                </Link>
              ))}

              <Link
                href={`/produits?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-4 text-sm md:text-base text-primary hover:text-text hover:bg-white/5 transition-all font-medium group"
              >
                Voir plus de résultats
                <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          ) : query.length > 0 ? (
            <div className="text-center py-12 md:py-16 px-4">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <span className="material-icons text-3xl md:text-4xl text-text-muted">search_off</span>
              </div>
              <p className="text-text-muted text-sm md:text-base mb-6">
                Aucun résultat pour <span className="text-text font-medium">"{query}"</span>
              </p>
              <Link
                href="/produits"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-primary hover:bg-primary/90 text-background-dark rounded-full text-sm md:text-base font-bold transition-all"
              >
                Voir tous les produits
                <span className="material-icons text-base">arrow_forward</span>
              </Link>
            </div>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

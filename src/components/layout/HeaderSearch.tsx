"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product, formatPrice } from "@/types/product";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderSearchProps {
  isHomepage: boolean;
}

export function HeaderSearch({ isHomepage }: HeaderSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search products
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch all products
        const response = await fetch("/api/products");
        const products: Product[] = await response.json();

        // Simple search - filter by name or description
        const searchLower = query.toLowerCase();
        const filtered = products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower)
        );

        setResults(filtered.slice(0, 5)); // Show max 5 results
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow empty search to show all products
    router.push(query.trim() ? `/produits?q=${encodeURIComponent(query)}` : '/produits');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher..."
          className={`w-full pl-9 pr-4 py-2 text-sm rounded-full border transition-all ${
            isHomepage
              ? "bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40"
              : "bg-background-secondary/50 border-border text-primary placeholder-muted focus:bg-background-secondary focus:border-primary/30"
          } focus:outline-none`}
        />
        <svg
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
            isHomepage ? "text-white/60" : "text-muted"
          }`}
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
      </form>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-background-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
          >
            {isLoading ? (
              <div className="p-4 text-center text-muted text-sm">
                Recherche...
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="max-h-[400px] overflow-y-auto">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/produits/${product.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        // Keep query so user can navigate back and see their search
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-background-secondary transition-colors"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/produits?q=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setIsOpen(false);
                    // Keep query in search bar so user sees what they searched for
                  }}
                  className="block p-3 text-center text-sm text-accent hover:bg-background-secondary transition-colors border-t border-border"
                >
                  Voir tous les produits ({results.length}+ résultats)
                </Link>
              </>
            ) : (
              <div className="p-4 text-center text-muted text-sm">
                Aucun résultat pour "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

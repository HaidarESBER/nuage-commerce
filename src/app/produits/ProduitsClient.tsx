"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product";
import { ProductSearch, useProductSearch } from "@/components/product/ProductSearch";
import { ProductFilters, useProductFilters } from "@/components/product/ProductFilters";
import { ProductSort, useProductSort } from "@/components/product/ProductSort";
import { BottomSheet } from "@/components/mobile/BottomSheet";
import { Product, ProductCategory, categoryLabels } from "@/types/product";

interface ProduitsClientProps {
  products: Product[];
  activeCategory: ProductCategory | null;
}

/**
 * Category filter button component
 */
function CategoryButton({
  category,
  label,
  isActive,
}: {
  category: string | null;
  label: string;
  isActive: boolean;
}) {
  const href = category ? `/produits?categorie=${category}` : "/produits";

  return (
    <Link
      href={href}
      className={`
        inline-flex items-center justify-center px-4 py-2 text-sm font-medium
        rounded-[--radius-button] transition-colors whitespace-nowrap
        ${
          isActive
            ? "bg-accent text-primary"
            : "bg-transparent border border-primary text-primary hover:bg-primary hover:text-background"
        }
      `}
    >
      {label}
    </Link>
  );
}

export function ProduitsClient({ products, activeCategory }: ProduitsClientProps) {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search functionality
  const { query: searchQuery, setQuery: setSearchQuery, results: searchResults } = useProductSearch(products);

  // Filter functionality
  const {
    filters,
    filteredProducts: filteredByFilters,
    hasActiveFilters,
    priceRangeLimits,
    toggleCategory,
    setPriceRange,
    toggleInStockOnly,
    resetFilters,
  } = useProductFilters(products);

  // Sort functionality
  const initialSort = (searchParams.get("sort") as any) || "relevance";
  const { sortOption, setSortOption, sortedProducts } = useProductSort(filteredByFilters, initialSort);

  // Combine search, filters, and sort
  // Apply in order: search → filter → sort
  const displayProducts = useMemo(() => {
    // Start with all products
    let result = products;

    // Apply search if query exists
    if (searchQuery.trim()) {
      result = searchResults;
    }

    // Apply filters
    result = result.filter((product) => {
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

    // Apply sort
    const productsToSort = [...result];
    switch (sortOption) {
      case "price-asc":
        return productsToSort.sort((a, b) => a.price - b.price);
      case "price-desc":
        return productsToSort.sort((a, b) => b.price - a.price);
      case "newest":
        return productsToSort.reverse();
      case "popularity":
        return productsToSort.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
      case "relevance":
      default:
        return productsToSort.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }
  }, [products, searchQuery, searchResults, filters, sortOption]);

  // Sync sort to URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortOption !== "relevance") {
      params.set("sort", sortOption);
    } else {
      params.delete("sort");
    }
    const newUrl = params.toString() ? `?${params.toString()}` : "/produits";
    router.replace(newUrl, { scroll: false });
  }, [sortOption, router, searchParams]);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const validCategories: ProductCategory[] = [
    "chicha",
    "bol",
    "tuyau",
    "charbon",
    "accessoire",
  ];

  const handleApplyFilters = () => {
    setIsFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    resetFilters();
    setIsFilterSheetOpen(false);
  };

  const activeFilterCount =
    filters.categories.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[0] !== priceRangeLimits.min || filters.priceRange[1] !== priceRangeLimits.max ? 1 : 0);

  return (
    <>
      {/* Page header */}
      <div className="mb-8 lg:mb-12">
        <h1 className="text-4xl lg:text-5xl text-primary mb-4">
          Nos Produits
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Une sélection raffinée de chichas et accessoires pour les amateurs
          exigeants.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <ProductSearch products={products} />
      </div>

      {/* Category filters */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
          <CategoryButton
            category={null}
            label="Tous"
            isActive={!activeCategory}
          />
          {validCategories.map((cat) => (
            <CategoryButton
              key={cat}
              category={cat}
              label={categoryLabels[cat]}
              isActive={activeCategory === cat}
            />
          ))}
        </div>
      </div>

      {/* Sort and Result Count */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm text-muted">
          {displayProducts.length} produit{displayProducts.length !== 1 ? "s" : ""}
        </div>
        <ProductSort sortOption={sortOption} onSortChange={setSortOption} />
      </div>

      {/* Desktop: Sidebar layout */}
      <div className="hidden md:grid md:grid-cols-[280px_1fr] gap-8">
        {/* Filters sidebar */}
        <aside>
          <ProductFilters
            products={products}
            filters={filters}
            priceRangeLimits={priceRangeLimits}
            hasActiveFilters={hasActiveFilters}
            onToggleCategory={toggleCategory}
            onSetPriceRange={setPriceRange}
            onToggleInStockOnly={toggleInStockOnly}
            onResetFilters={resetFilters}
          />
        </aside>

        {/* Products grid */}
        <div>
          {displayProducts.length > 0 ? (
            <ProductGrid products={displayProducts} columns={3} />
          ) : (
            <div className="text-center py-16">
              <p className="text-muted text-lg mb-2">
                Aucun produit ne correspond à vos critères
              </p>
              {(searchQuery.trim() || hasActiveFilters) && (
                <p className="text-sm text-muted mb-4">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  resetFilters();
                }}
                className="inline-flex items-center justify-center mt-4 px-6 py-3 text-sm font-medium bg-primary text-background rounded-[--radius-button] hover:bg-accent hover:text-primary transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Products with filter button */}
      <div className="md:hidden">
        {/* Products grid */}
        {displayProducts.length > 0 ? (
          <ProductGrid products={displayProducts} columns={2} />
        ) : (
          <div className="text-center py-16">
            <p className="text-muted text-lg mb-2">
              Aucun produit ne correspond à vos critères
            </p>
            {(searchQuery.trim() || hasActiveFilters) && (
              <p className="text-sm text-muted mb-4">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                handleResetFilters();
              }}
              className="inline-flex items-center justify-center mt-4 px-6 py-3 text-sm font-medium bg-primary text-background rounded-[--radius-button] hover:bg-accent hover:text-primary transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Floating filter button */}
        <button
          onClick={() => setIsFilterSheetOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-primary text-background rounded-full shadow-lg hover:bg-accent hover:text-primary transition-colors z-30 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5"
            />
          </svg>
          <span className="font-medium">Filtres</span>
          {activeFilterCount > 0 && (
            <span className="min-w-5 h-5 flex items-center justify-center bg-accent text-primary text-xs font-medium rounded-full px-1.5">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Filter bottom sheet */}
        <BottomSheet
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          title="Filtres"
          footer={
            <div className="flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 px-6 py-3 text-sm font-medium border border-primary text-primary rounded-[--radius-button] hover:bg-primary hover:text-background transition-colors"
              >
                Réinitialiser
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-6 py-3 text-sm font-medium bg-primary text-background rounded-[--radius-button] hover:bg-accent hover:text-primary transition-colors"
              >
                Appliquer les filtres
              </button>
            </div>
          }
        >
          <ProductFilters
            products={products}
            filters={filters}
            priceRangeLimits={priceRangeLimits}
            hasActiveFilters={hasActiveFilters}
            onToggleCategory={toggleCategory}
            onSetPriceRange={setPriceRange}
            onToggleInStockOnly={toggleInStockOnly}
            onResetFilters={resetFilters}
          />
        </BottomSheet>
      </div>
    </>
  );
}

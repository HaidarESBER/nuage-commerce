"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ProductGrid } from "@/components/product";
import { ProductFilters, useProductFilters } from "@/components/product/ProductFilters";
import { ProductSort, useProductSort } from "@/components/product/ProductSort";
import { ViewToggle } from "@/components/product/ViewToggle";
import { FilterChips } from "@/components/product/FilterChips";
import { BottomSheet } from "@/components/mobile/BottomSheet";
import { PullToRefresh } from "@/components/mobile/PullToRefresh";
import { Product, ProductCategory, categoryLabels } from "@/types/product";
import { FracturedCategories } from "@/components/home/FracturedCategories";

interface ProduitsClientEnhancedProps {
  products: Product[];
  activeCategory: ProductCategory | null;
  searchQuery?: string;
}

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
      className={`relative px-6 py-2 text-sm font-light tracking-wide transition-all duration-300 whitespace-nowrap ${
        isActive
          ? "text-primary"
          : "text-muted hover:text-primary"
      }`}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="activeCategory"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4A5A5]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

export function ProduitsClientEnhanced({
  products,
  activeCategory,
  searchQuery = '',
}: ProduitsClientEnhancedProps) {
  console.log('🎯 ProduitsClientEnhanced received searchQuery:', searchQuery);

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const router = useRouter();
  const searchParams = useSearchParams();
  const productsRef = useRef<HTMLDivElement>(null);

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
  const { sortOption, setSortOption } = useProductSort(filteredByFilters, initialSort);

  // Combine filters and sort
  const displayProducts = useMemo(() => {
    let result = products;

    // Apply search filter first if query exists
    if (searchQuery && searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      console.log('🔍 Filtering products with query:', query);
      console.log('📦 Total products before filter:', products.length);
      result = result.filter((product) => {
        const matches = (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.shortDescription.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
        if (matches) {
          console.log('✅ Match:', product.name);
        }
        return matches;
      });
      console.log('📦 Total products after filter:', result.length);
    }

    // Combine activeCategory with sidebar categories
    const allActiveCategories = new Set<ProductCategory>();
    if (activeCategory) allActiveCategories.add(activeCategory);
    filters.categories.forEach(cat => allActiveCategories.add(cat));

    // Apply filters
    result = result.filter((product) => {
      // Category filter - show if product matches ANY selected category
      if (allActiveCategories.size > 0 && !allActiveCategories.has(product.category)) {
        return false;
      }
      // Price filter
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
      default:
        return productsToSort.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }
  }, [products, filters, sortOption, activeCategory, searchQuery]);

  // Sync sort to URL without scrolling
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortOption !== "relevance") {
      params.set("sort", sortOption);
    } else {
      params.delete("sort");
    }
    const categoryParam = searchParams.get("categorie");
    const newUrl = categoryParam
      ? `?categorie=${categoryParam}${sortOption !== "relevance" ? `&sort=${sortOption}` : ""}`
      : (params.toString() ? `?${params.toString()}` : "/produits");
    router.replace(newUrl, { scroll: false });
  }, [sortOption, router, searchParams]);

  // Auto-scroll to products when search query is present
  useEffect(() => {
    if (searchQuery && searchQuery.trim().length > 0 && productsRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchQuery]);

  const validCategories: ProductCategory[] = [
    "chicha",
    "bol",
    "tuyau",
    "charbon",
    "accessoire",
  ];

  const activeFilterCount =
    filters.categories.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[0] !== priceRangeLimits.min || filters.priceRange[1] !== priceRangeLimits.max ? 1 : 0);

  const handleRefresh = async () => {
    router.refresh();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6">
      {/* Mobile Category Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="md:hidden border-y border-border"
      >
        <div className="flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
          <CategoryButton
            key="all"
            category={null}
            label="Tout"
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
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
      </motion.nav>

      {/* Desktop Only: Title + Fractured Categories */}
      <div className="hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-primary tracking-wide">
            Découvrez notre collection
          </h1>
        </motion.div>

        <div className="h-[25vh] overflow-hidden">
          <FracturedCategories textPosition="top" />
        </div>
      </div>

      {/* Filter Chips */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FilterChips
            activeCategories={filters.categories}
            priceRange={filters.priceRange}
            priceRangeLimits={priceRangeLimits}
            inStockOnly={filters.inStockOnly}
            onRemoveCategory={toggleCategory}
            onRemovePriceFilter={() => setPriceRange([priceRangeLimits.min, priceRangeLimits.max])}
            onRemoveStockFilter={toggleInStockOnly}
            onClearAll={resetFilters}
          />
        </motion.div>
      )}

      {/* Toolbar - Clean & Minimal */}
      <motion.div
        ref={productsRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex items-center justify-between py-3 border-b border-border px-4 md:px-0 -mx-4 md:mx-0"
      >
        <p className="text-xs md:text-sm text-muted font-light">
          <span className="text-primary font-medium">{displayProducts.length}</span> <span className="hidden sm:inline">{displayProducts.length !== 1 ? "produits" : "produit"}</span>
        </p>
        <div className="flex items-center gap-4 md:gap-6">
          {/* View toggle - desktop only */}
          <div className="hidden md:block">
            <ViewToggle view={view} onViewChange={setView} />
          </div>
          {/* Filter button */}
          <button
            onClick={() => setIsFilterSheetOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-light border border-border rounded-lg hover:bg-background-secondary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5"
              />
            </svg>
            Filtres
            {activeFilterCount > 0 && (
              <span className="min-w-5 h-5 flex items-center justify-center bg-[#D4A5A5] text-white text-xs font-bold rounded-full px-1.5">
                {activeFilterCount}
              </span>
            )}
          </button>
          <ProductSort sortOption={sortOption} onSortChange={setSortOption} />
        </div>
      </motion.div>

      {/* Desktop: Sidebar layout */}
      <div className="hidden md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] gap-8 lg:gap-10">
        <aside>
          <div className="sticky top-24">
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
          </div>
        </aside>

        <div className="min-h-[600px]">
          {displayProducts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ProductGrid
                products={displayProducts}
                total={displayProducts.length}
                currentPage={Number(searchParams.get("page")) || 1}
                columns={3}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-32"
              key="desktop-empty-state"
            >
              <div className="w-20 h-20 rounded-full bg-background-secondary flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-primary mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-sm text-muted mb-8 max-w-sm text-center">
                Aucun produit ne correspond à vos critères
              </p>
              <button
                onClick={() => {
                  resetFilters();
                }}
                className="px-8 py-3 text-sm font-light border-2 border-primary text-primary hover:bg-primary hover:text-background transition-all duration-300"
              >
                Effacer les filtres
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile: Products with filter button */}
      <div className="md:hidden">
        {displayProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGrid
              products={displayProducts}
              total={displayProducts.length}
              currentPage={Number(searchParams.get("page")) || 1}
              columns={2}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24"
            key="mobile-empty-state"
          >
            <div className="w-16 h-16 rounded-full bg-background-secondary flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-light text-primary mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-sm text-muted mb-6 text-center px-8">
              Aucun produit ne correspond à vos critères
            </p>
            <button
              onClick={() => {
                resetFilters();
              }}
              className="px-6 py-2.5 text-sm font-light border-2 border-primary text-primary active:bg-primary active:text-background transition-all"
            >
              Effacer les filtres
            </button>
          </motion.div>
        )}

        {/* Floating filter button - More prominent */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
          onClick={() => setIsFilterSheetOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-primary text-background rounded-full shadow-2xl active:scale-95 transition-transform z-40 flex items-center gap-2 border border-white/10"
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
          <span className="font-medium text-sm">Filtres</span>
          {activeFilterCount > 0 && (
            <span className="min-w-5 h-5 flex items-center justify-center bg-[#D4A5A5] text-white text-xs font-bold rounded-full px-1.5">
              {activeFilterCount}
            </span>
          )}
        </motion.button>

        {/* Filter bottom sheet */}
        <BottomSheet
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          title="Filtres"
          footer={
            <div className="flex gap-3">
              <button
                onClick={() => {
                  resetFilters();
                }}
                className="flex-1 px-6 py-3 text-sm font-medium border border-primary text-primary rounded-[--radius-button] hover:bg-primary hover:text-background transition-colors"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="flex-1 px-6 py-3 text-sm font-medium bg-primary text-background rounded-[--radius-button] hover:bg-accent hover:text-primary transition-colors"
              >
                Appliquer
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
      </div>
    </PullToRefresh>
  );
}

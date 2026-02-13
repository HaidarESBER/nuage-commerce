"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types/product";
import { getRecentlyViewedIds } from "@/lib/social-proof";

interface RelatedProductsSectionProps {
  productId: string;
  category: string;
  allProducts: Product[];
  limit?: number;
}

/**
 * Consolidated related products section
 * Replaces separate RecommendationsSection and RecentlyViewed components
 *
 * Strategy:
 * 1. Fetch API recommendations first
 * 2. Mix in recently viewed products for diversity
 * 3. Fallback to same-category products if API fails
 * 4. Single unified heading: "Produits similaires"
 */
export function RelatedProductsSection({
  productId,
  category,
  allProducts,
  limit = 6,
}: RelatedProductsSectionProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRelatedProducts();
  }, [productId, limit]);

  const fetchRelatedProducts = async () => {
    try {
      setIsLoading(true);

      // 1. Try to fetch API recommendations
      const params = new URLSearchParams();
      params.append('productId', productId);
      params.append('limit', (limit - 2).toString()); // Reserve 2 slots for recently viewed

      const response = await fetch(`/api/recommendations?${params.toString()}`);
      const data = await response.json();

      let products: Product[] = data.recommendations || [];

      // 2. Mix in recently viewed products (excluding current)
      const recentIds = getRecentlyViewedIds(productId);
      const recentProducts = recentIds
        .slice(0, 2) // Get up to 2 recent products
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined)
        .filter((p) => !products.find(rec => rec.id === p.id)); // Avoid duplicates

      // Insert recently viewed at positions 1 and 3
      if (recentProducts.length > 0) {
        products.splice(1, 0, recentProducts[0]);
      }
      if (recentProducts.length > 1 && products.length > 2) {
        products.splice(3, 0, recentProducts[1]);
      }

      // 3. Fallback to category-based if we don't have enough products
      if (products.length < limit) {
        const categoryProducts = allProducts
          .filter(p => p.category === category && p.id !== productId)
          .filter(p => !products.find(rec => rec.id === p.id))
          .slice(0, limit - products.length);

        products = [...products, ...categoryProducts];
      }

      // Limit to requested amount
      setRelatedProducts(products.slice(0, limit));
    } catch (error) {
      console.error('Failed to fetch related products:', error);

      // Fallback: show same-category products
      const fallbackProducts = allProducts
        .filter(p => p.category === category && p.id !== productId)
        .slice(0, limit);

      setRelatedProducts(fallbackProducts);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if no products to show
  if (!isLoading && relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 sm:mt-24 bg-background-secondary py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl sm:text-4xl text-primary mb-3 font-light tracking-wide">
            Produits similaires
          </h2>
          <p className="text-muted text-lg">
            D'autres produits qui pourraient vous intéresser
          </p>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="bg-background-card rounded-xl overflow-hidden border border-border/50 animate-pulse"
              >
                <div className="aspect-square bg-muted/20" />
                <div className="p-5">
                  <div className="h-6 bg-muted/20 rounded mb-3" />
                  <div className="h-4 bg-muted/20 rounded w-3/4 mb-4" />
                  <div className="h-10 bg-muted/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Product grid with stagger animation
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {relatedProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

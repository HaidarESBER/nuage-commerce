"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { getRecentlyViewedIds } from "@/lib/social-proof";
import { ProductCard } from "./ProductCard";
import { motion } from "framer-motion";

interface RecentlyViewedProps {
  allProducts: Product[];
  currentProductId?: string;
}

export function RecentlyViewed({ allProducts, currentProductId }: RecentlyViewedProps) {
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Get recently viewed IDs (excluding current product)
    const ids = getRecentlyViewedIds(currentProductId);

    // Find products by IDs, maintaining order
    const products = ids
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);

    setRecentlyViewedProducts(products);
  }, [allProducts, currentProductId]);

  if (recentlyViewedProducts.length === 0) {
    return null; // Don't show section if no recent products
  }

  return (
    <section className="py-8 bg-background-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-primary mb-6">
          Récemment consultés
        </h2>

        {/* Horizontal scrollable grid */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-4 min-w-max">
            {recentlyViewedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="w-64 flex-shrink-0"
              >
                <ProductCard product={product} priority={index < 2} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

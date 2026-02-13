"use client";

import { memo } from "react";
import { categoryLabels, ProductCategory } from "@/types/product";
import { ProductRatingStats } from "@/data/reviews";

interface ProductHeaderProps {
  name: string;
  category: ProductCategory;
  stats: ProductRatingStats | null;
}

/**
 * Product header with title, rating, and category badge
 * Memoized to prevent unnecessary re-renders
 */
export const ProductHeader = memo(function ProductHeader({ name, category, stats }: ProductHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Category Badge - Mobile only */}
      <div className="lg:hidden">
        <span className="inline-flex text-xs tracking-widest uppercase text-accent font-semibold bg-accent/10 px-3 py-1.5 rounded-full">
          {categoryLabels[category]}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl text-primary font-light tracking-wide leading-tight">
        {name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3">
        {stats && stats.averageRating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(stats.averageRating)
                      ? "text-amber-400 fill-current"
                      : "text-border"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              ))}
            </div>
            <span className="text-sm text-primary font-semibold">
              {stats.averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-muted">
              ({stats.totalReviews} avis)
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

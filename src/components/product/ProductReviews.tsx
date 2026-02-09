"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StarRating } from "./StarRating";
import {
  Review,
  ProductRatingStats,
  formatRelativeDate,
} from "@/data/reviews";

interface ProductReviewsProps {
  reviews: Review[];
  stats: ProductRatingStats | null;
}

const REVIEWS_PER_PAGE = 5;

/**
 * ProductReviews component displays customer reviews with ratings
 *
 * Features:
 * - Average rating with star display (4.3/5.0 from 127 reviews)
 * - Rating breakdown bars (5★: 65%, 4★: 20%, etc.)
 * - List of written reviews with name, rating, text, date, verified badge
 * - "Voir plus d'avis" button for pagination
 * - "Écrire un avis" button (placeholder for future feature)
 * - Stagger animation for review entrance
 */
export function ProductReviews({ reviews, stats }: ProductReviewsProps) {
  const [displayCount, setDisplayCount] = useState(REVIEWS_PER_PAGE);

  if (!stats || reviews.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl text-primary mb-4">Avis clients</h2>
        <p className="text-muted">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
        <button
          className="mt-4 px-6 py-3 bg-primary text-background rounded-[--radius-button] hover:bg-accent hover:text-primary transition-colors"
          disabled
        >
          Écrire un avis
        </button>
      </div>
    );
  }

  const displayedReviews = reviews.slice(0, displayCount);
  const hasMore = displayCount < reviews.length;

  const loadMore = () => {
    setDisplayCount((prev) => prev + REVIEWS_PER_PAGE);
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl text-primary mb-6">Avis clients</h2>

      {/* Rating summary */}
      <div className="grid md:grid-cols-2 gap-8 mb-8 p-6 bg-background-secondary rounded-[--radius-card]">
        {/* Average rating */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-5xl font-bold text-primary mb-2">
            {stats.averageRating.toFixed(1)}
          </div>
          <StarRating rating={stats.averageRating} size="lg" />
          <p className="text-sm text-muted mt-2">
            Basé sur {stats.totalReviews} avis
          </p>
        </div>

        {/* Rating breakdown */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.ratingBreakdown[star as keyof typeof stats.ratingBreakdown];
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-primary w-8">{star}★</span>
                <div className="flex-1 h-2 bg-mist rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-accent"
                  />
                </div>
                <span className="text-sm text-muted w-12 text-right">
                  {Math.round(percentage)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write review button */}
      <div className="mb-6">
        <button
          className="px-6 py-3 bg-primary text-background rounded-[--radius-button] hover:bg-accent hover:text-primary transition-colors"
          disabled
        >
          Écrire un avis
        </button>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        {displayedReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: index * 0.1, // Stagger effect
              ease: "easeOut",
            }}
            className="border-b border-background-secondary pb-6 last:border-b-0"
          >
            {/* Review header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium text-primary">
                    {review.authorName}
                  </span>
                  {review.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-xs text-success">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Achat vérifié
                    </span>
                  )}
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <span className="text-sm text-muted">
                {formatRelativeDate(review.date)}
              </span>
            </div>

            {/* Review text */}
            <p className="text-text leading-relaxed">{review.comment}</p>
          </motion.div>
        ))}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            className="px-6 py-3 border border-primary text-primary rounded-[--radius-button] hover:bg-primary hover:text-background transition-colors"
          >
            Voir plus d'avis
          </button>
        </div>
      )}
    </div>
  );
}

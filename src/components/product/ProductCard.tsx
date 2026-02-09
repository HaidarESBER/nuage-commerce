"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product, formatPrice } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { StarRatingDisplay } from "@/components/product/StarRating";
import { StockIndicator } from "@/components/product/StockIndicator";
import { getProductRatingStats } from "@/data/reviews";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
  /** Use priority loading for above-the-fold images */
  priority?: boolean;
}

/**
 * ProductCard component displays a single product in the catalog
 *
 * Features:
 * - 16:9 aspect ratio image with hover scale effect
 * - Product name in heading font
 * - Price display with sale price support
 * - "Ajouter au panier" button with cart integration
 * - Image links to product detail page
 *
 * @example
 * <ProductCard product={product} priority={true} />
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const ratingStats = getProductRatingStats(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      addItem(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group bg-background-card rounded-[--radius-card] overflow-hidden shadow-sm"
    >
      {/* Image container with 16:9 aspect ratio - links to product */}
      <Link href={`/produits/${product.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden bg-background-secondary">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              priority={priority}
            />
          </motion.div>

          {/* Quick View Button - appears on hover */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.05 }}
            className="absolute inset-x-0 bottom-4 mx-auto w-fit px-4 py-2 bg-background/95 backdrop-blur-sm text-primary rounded-[--radius-button] text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 z-10"
            onClick={handleQuickView}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Aperçu rapide
          </motion.button>

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
              <span className="text-background font-medium text-sm uppercase tracking-wide">
                Rupture de stock
              </span>
            </div>
          )}
          {/* Sale badge */}
          {hasDiscount && product.inStock && (
            <div className="absolute top-3 left-3 bg-error text-background text-xs font-medium px-2 py-1 rounded">
              Promo
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Product name - links to product */}
        <Link href={`/produits/${product.slug}`}>
          <h3 className="font-heading text-lg text-primary line-clamp-1 mb-2 hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price with hover effect */}
        <motion.div
          whileHover={{ color: "var(--color-accent)" }}
          transition={{ duration: 0.3 }}
          className="flex items-baseline gap-2 mb-3"
        >
          <span className="text-lg font-medium text-primary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </motion.div>

        {/* Star rating summary */}
        {ratingStats && (
          <div className="mb-3">
            <StarRatingDisplay
              rating={ratingStats.averageRating}
              totalReviews={ratingStats.totalReviews}
              size="sm"
            />
          </div>
        )}

        {/* Stock indicator */}
        <div className="mb-3">
          <StockIndicator
            inStock={product.inStock}
            stockLevel={product.stockLevel}
            size="sm"
            showDot={false}
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-background rounded-[--radius-button] hover:bg-accent hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ajouter au panier
          </button>
          <motion.a
            href={`/produits/${product.slug}`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-[--radius-button] hover:bg-primary hover:text-background transition-colors"
          >
            Voir
          </motion.a>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </motion.div>
  );
}

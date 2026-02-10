"use client";

import { useState } from "react";
import Link from "next/link";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { motion } from "framer-motion";
import { Product, formatPrice } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useComparison } from "@/contexts/ComparisonContext";
import { StarRatingDisplay } from "@/components/product/StarRating";
import { StockIndicator } from "@/components/product/StockIndicator";
import { WishlistButton } from "@/components/product/WishlistButton";
import { getProductRatingStats } from "@/data/reviews";
import { QuickViewModal } from "./QuickViewModal";
import { useState as useReactState } from "react";

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
  const { addToComparison, isInComparison } = useComparison();
  const [isQuickViewOpen, setIsQuickViewOpen] = useReactState(false);
  const [showCompareToast, setShowCompareToast] = useReactState(false);
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

  const handleAddToComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = addToComparison(product.id);
    if (!added) {
      // Show toast that max limit reached
      setShowCompareToast(true);
      setTimeout(() => setShowCompareToast(false), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group bg-background-card rounded-xl overflow-hidden border border-border/50 hover:border-[#D4A5A5]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4A5A5]/10"
    >
      {/* Image container - Premium display */}
      <Link href={`/produits/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F7F5F3] to-[#E8E4DF] p-6">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative w-full h-full"
          >
            <OptimizedImage
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              objectFit="contain"
              priority={priority}
            />
          </motion.div>

          {/* Wishlist button - top right */}
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <WishlistButton
              productId={product.id}
              size="sm"
              className="bg-white/95 backdrop-blur-sm rounded-full p-2.5 text-primary hover:bg-[#D4A5A5] hover:text-white transition-all shadow-lg"
            />
          </div>

          {/* Quick View Button - center on hover */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="absolute inset-0 m-auto w-fit h-fit px-6 py-3 bg-white/98 backdrop-blur-sm text-primary rounded-full text-sm font-medium shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 z-10 border border-[#D4A5A5]/30"
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
            <div className="absolute inset-0 bg-primary/70 backdrop-blur-sm flex items-center justify-center">
              <span className="text-background font-medium text-sm uppercase tracking-wider">
                Rupture de stock
              </span>
            </div>
          )}

          {/* Sale badge - elegant design */}
          {hasDiscount && product.inStock && (
            <div className="absolute top-3 left-3 bg-error text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              -{Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}%
            </div>
          )}
        </div>
      </Link>

      {/* Content - Premium Layout */}
      <div className="p-5">
        {/* Product name */}
        <Link href={`/produits/${product.slug}`}>
          <h3 className="font-heading text-lg text-primary line-clamp-2 mb-3 hover:text-[#D4A5A5] transition-colors duration-300 min-h-[3.5rem] leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Star rating */}
        {ratingStats && (
          <div className="mb-3">
            <StarRatingDisplay
              rating={ratingStats.averageRating}
              totalReviews={ratingStats.totalReviews}
              size="sm"
            />
          </div>
        )}

        {/* Price - Prominent display */}
        <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-border/50">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>

        {/* Stock indicator */}
        <div className="mb-4">
          <StockIndicator
            inStock={product.inStock}
            stockLevel={product.stockLevel}
            size="sm"
            showDot={true}
          />
        </div>

        {/* CTA Button - Single, prominent */}
        <motion.button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          whileHover={{ scale: product.inStock ? 1.02 : 1 }}
          whileTap={{ scale: product.inStock ? 0.98 : 1 }}
          className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium bg-primary text-background rounded-full hover:bg-[#D4A5A5] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {product.inStock ? "Ajouter au panier" : "Rupture de stock"}
        </motion.button>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />

      {/* Toast notification for max comparison limit */}
      {showCompareToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-primary text-background px-4 py-3 rounded-[--radius-card] shadow-lg z-50 max-w-sm"
        >
          Maximum 3 produits pour la comparaison
        </motion.div>
      )}
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Product, formatPrice } from "@/types/product";
import { Heart } from "lucide-react";

interface MobileStickyBarProps {
  product: Product;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isInWishlist: boolean;
}

const NUAGE_EASING = [0.21, 0.47, 0.32, 0.98] as const;
const NUAGE_DURATION = 0.4;
const SCROLL_THRESHOLD = 600; // Show after scrolling 600px

/**
 * Sticky buy bar for mobile devices
 * Slides up from bottom after scrolling past the main buy box
 * Provides quick access to Add to Cart and Wishlist actions
 */
export function MobileStickyBar({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}: MobileStickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsVisible(false);
      return;
    }

    const unsubscribe = scrollY.on("change", (latest) => {
      setIsVisible(latest > SCROLL_THRESHOLD);
    });

    return () => unsubscribe();
  }, [scrollY, isMobile]);

  if (!isMobile) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: NUAGE_DURATION, ease: NUAGE_EASING }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-2xl"
        >
          <div className="flex items-center gap-3 p-4 max-w-screen-xl mx-auto">
            {/* Add to Cart Button */}
            <button
              onClick={onAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-primary text-background hover:bg-accent hover:text-primary px-6 py-3 rounded-[--radius-button] transition-colors focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              style={{ minHeight: "48px" }} // Touch target size
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="hidden xs:inline">Ajouter</span>
              <span className="text-sm font-normal">
                {formatPrice(product.price)}
              </span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onToggleWishlist}
              className="w-12 h-12 flex items-center justify-center border border-border rounded-[--radius-button] hover:bg-background-secondary/50 transition-colors focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={
                isInWishlist
                  ? "Retirer des favoris"
                  : "Ajouter aux favoris"
              }
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isInWishlist
                    ? "fill-error text-error"
                    : "text-primary"
                }`}
              />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

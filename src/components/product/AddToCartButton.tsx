"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  product: Product;
}

/**
 * Client component for adding products to cart from detail page
 *
 * Features:
 * - Quantity selection (default 1)
 * - Add to cart functionality with celebratory animation
 * - Disabled state for out of stock
 * - Spring animation with checkmark on success
 * - Accessibility-friendly success feedback
 */
export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (product.inStock) {
      addItem(product, quantity);
      setIsAdded(true);
      // Reset feedback after brief delay
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      {product.inStock && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">Quantite:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center border border-primary rounded-[--radius-button] text-primary hover:bg-primary hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Diminuer la quantite"
            >
              <span className="text-lg leading-none">-</span>
            </button>
            <span className="w-12 text-center font-medium text-primary text-lg">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="w-10 h-10 flex items-center justify-center border border-primary rounded-[--radius-button] text-primary hover:bg-primary hover:text-background transition-colors"
              aria-label="Augmenter la quantite"
            >
              <span className="text-lg leading-none">+</span>
            </button>
          </div>
        </div>
      )}

      {/* Add to cart button with celebration */}
      <motion.div
        animate={
          isAdded
            ? { scale: [1, 1.05, 1] }
            : { scale: 1 }
        }
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
      >
        <Button
          variant="primary"
          size="lg"
          disabled={!product.inStock}
          onClick={handleAddToCart}
          className={`w-full sm:w-auto transition-colors duration-300 ${
            isAdded ? "!bg-green-50 !text-green-700 !border-green-200" : ""
          }`}
          aria-live="polite"
          aria-label={isAdded ? "Produit ajouté au panier" : "Ajouter au panier"}
        >
          <span className="flex items-center justify-center gap-2">
            {isAdded ? "Ajouté au panier !" : "Ajouter au panier"}
            <AnimatePresence>
              {isAdded && (
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </motion.svg>
              )}
            </AnimatePresence>
          </span>
        </Button>
      </motion.div>

      {/* Out of stock message */}
      {!product.inStock && (
        <p className="text-muted text-sm">
          Ce produit est actuellement indisponible.
        </p>
      )}
    </div>
  );
}

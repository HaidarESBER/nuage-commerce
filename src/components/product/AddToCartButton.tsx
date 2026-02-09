"use client";

import { useState } from "react";
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
 * - Add to cart functionality
 * - Disabled state for out of stock
 * - Visual feedback on add
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

      {/* Add to cart button */}
      <Button
        variant="primary"
        size="lg"
        disabled={!product.inStock}
        onClick={handleAddToCart}
        className="w-full sm:w-auto"
      >
        {isAdded ? "Ajoute au panier !" : "Ajouter au panier"}
      </Button>

      {/* Out of stock message */}
      {!product.inStock && (
        <p className="text-muted text-sm">
          Ce produit est actuellement indisponible.
        </p>
      )}
    </div>
  );
}
